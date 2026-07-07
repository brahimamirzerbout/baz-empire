/**
 * Minimal zero-dependency SMTP client supporting:
 *   - implicit TLS (port 465) and STARTTLS (port 587 / 25)
 *   - AUTH LOGIN and AUTH PLAIN
 *   - MAIL FROM / RCPT TO / DATA
 *
 * Deliberately tiny — no retries, no pipelining, no queue. The orchestrator
 * handles retries and queueing. We just need "send this one message."
 *
 * Usage:
 *   const client = new SmtpClient({ host, port, user, pass, secure });
 *   await client.send({ from, to, subject, html, text });
 */
import * as net from "node:net";
import * as tls from "node:tls";
import type { EmailProvider, ProviderConfig, SendInput, SendResult, TestResult } from "./types";

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  /** "tls" = implicit TLS (typically 465). "starttls" = upgrade (587). "none" = plaintext (25). */
  security: "tls" | "starttls" | "none";
  /** Optional EHLO domain (defaults to host). */
  helo?: string;
};

class SmtpConnection {
  private socket: net.Socket | tls.TLSSocket;
  private buffer = "";
  private closed = false;

  constructor(socket: net.Socket | tls.TLSSocket) {
    this.socket = socket;
    this.socket.setEncoding("utf8");
    this.socket.on("data", (chunk) => (this.buffer += chunk));
    this.socket.on("error", () => {});
    this.socket.on("close", () => (this.closed = true));
  }

  private async readReply(): Promise<{ code: number; text: string }> {
    // SMTP replies: "250 OK\r\n" or multi-line "250-...\r\n250 ...\r\n"
    while (true) {
      const idx = this.buffer.indexOf("\n");
      if (idx === -1) {
        await new Promise<void>((resolve, reject) => {
          const onClose = () => reject(new Error("Connection closed while reading reply"));
          this.socket.once("close", onClose);
          const onData = () => {
            this.socket.off("close", onClose);
            resolve();
          };
          this.socket.on("data", onData);
        });
        continue;
      }
      const line = this.buffer.slice(0, idx).replace(/\r$/, "");
      this.buffer = this.buffer.slice(idx + 1);
      const code = parseInt(line.slice(0, 3), 10);
      // Multi-line if 4th char is "-"
      if (line[3] === "-") continue;
      return { code, text: line.slice(4) };
    }
  }

  async cmd(command: string, expect = 2): Promise<{ code: number; text: string }> {
    if (this.closed) throw new Error("SMTP connection closed");
    this.socket.write(command + "\r\n");
    const reply = await this.readReply();
    if (Math.floor(reply.code / 100) !== expect) {
      throw new Error(`SMTP "${command}" failed: ${reply.code} ${reply.text}`);
    }
    return reply;
  }

  async data(payload: string): Promise<{ code: number; text: string }> {
    // Dot-stuffing: lines starting with "." get an extra "."
    const escaped = payload.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
    this.socket.write("DATA\r\n");
    const ready = await this.readReply();
    if (ready.code !== 354) throw new Error(`SMTP DATA rejected: ${ready.code} ${ready.text}`);
    this.socket.write(escaped + "\r\n.\r\n");
    const reply = await this.readReply();
    if (reply.code !== 250) throw new Error(`SMTP DATA final: ${reply.code} ${reply.text}`);
    return reply;
  }

  async quit() {
    try {
      await this.cmd("QUIT", 2);
    } catch {
      // ignore
    }
    try {
      this.socket.end();
    } catch {}
  }

  upgradeTls(opts: tls.ConnectionOptions) {
    // Replace the underlying socket with a TLS one
    const tlsSocket = tls.connect({
      ...opts,
      socket: this.socket as net.Socket,
      servername: opts.servername || opts.host,
    });
    tlsSocket.setEncoding("utf8");
    this.socket = tlsSocket;
  }

  isClosed() {
    return this.closed;
  }
}

async function connect(cfg: SmtpConfig): Promise<SmtpConnection> {
  return new Promise((resolve, reject) => {
    const onConnect = (socket: net.Socket) => {
      const conn = new SmtpConnection(socket);
      // Read greeting
      conn.cmd("NOOP", 2).catch(() => {}); // warm up
      conn["readReply"]()
        .then((g) => {
          if (Math.floor(g.code / 100) !== 2) {
            reject(new Error(`SMTP greeting failed: ${g.code} ${g.text}`));
            return;
          }
          resolve(conn);
        })
        .catch(reject);
    };

    if (cfg.security === "tls") {
      const sock = tls.connect({ host: cfg.host, port: cfg.port, servername: cfg.host }, () =>
        onConnect(sock),
      );
      sock.on("error", reject);
    } else {
      const sock = net.connect(cfg.port, cfg.host, () => onConnect(sock));
      sock.on("error", reject);
    }
  });
}

async function ehlo(conn: SmtpConnection, helo: string) {
  const reply = await conn.cmd(`EHLO ${helo}`, 2);
  // Parse capabilities from reply.text — but our parser collapsed multi-line.
  // Make an additional EHLO call just to confirm STARTTLS support if needed.
  return reply.text.toUpperCase();
}

function authLogin(conn: SmtpConnection, user: string, pass: string) {
  return (async () => {
    await conn.cmd("AUTH LOGIN", 3);
    await conn.cmd(Buffer.from(user, "utf8").toString("base64"), 3);
    await conn.cmd(Buffer.from(pass, "utf8").toString("base64"), 2);
  })();
}

function authPlain(conn: SmtpConnection, user: string, pass: string) {
  const token = Buffer.from(`\0${user}\0${pass}`, "utf8").toString("base64");
  return conn.cmd(`AUTH PLAIN ${token}`, 2);
}

function buildMime(opts: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): string {
  const boundary = "mh_" + Math.random().toString(36).slice(2, 10);
  const headers: string[] = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    `Subject: ${encodeHeader(opts.subject)}`,
    `MIME-Version: 1.0`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${Date.now()}.${Math.random().toString(36).slice(2)}@marketing-hub.local>`,
  ];
  if (opts.replyTo) headers.push(`Reply-To: ${opts.replyTo}`);

  if (opts.text) {
    headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    const textPart = `--${boundary}\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n${qp(opts.text)}\r\n`;
    const htmlPart = `--${boundary}\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n${qp(opts.html)}\r\n`;
    return headers.join("\r\n") + "\r\n\r\n" + textPart + htmlPart + `--${boundary}--\r\n`;
  }
  headers.push(`Content-Type: text/html; charset=utf-8`);
  headers.push(`Content-Transfer-Encoding: quoted-printable`);
  return headers.join("\r\n") + "\r\n\r\n" + qp(opts.html) + "\r\n";
}

/** RFC 2047 encoded-word for non-ASCII subject lines. */
function encodeHeader(s: string): string {
  // Plain ASCII short subject → no encoding needed
  if (/^[\x20-\x7e]*$/.test(s)) return s;
  return "=?UTF-8?B?" + Buffer.from(s, "utf8").toString("base64") + "?=";
}

/** Quoted-printable encoder (line-safe). */
function qp(s: string): string {
  return s
    .replace(
      /[^\x09\x20-\x7e]|=/g,
      (m) => "=" + m.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"),
    )
    .replace(/.{76}/g, (line) => line + "=\r\n");
}

export const smtpProvider: EmailProvider = {
  id: "smtp",
  displayName: "SMTP (generic)",
  async test(cfg: ProviderConfig): Promise<TestResult> {
    try {
      if (!cfg.host || !cfg.port) return { ok: false, error: "host and port required" };
      const conn = await connect(cfg as SmtpConfig);
      try {
        const caps = await ehlo(conn, cfg.helo || cfg.host);
        await conn.cmd("QUIT", 2);
        return {
          ok: true,
          detail: `Connected to ${cfg.host}:${cfg.port} (caps: ${caps.slice(0, 80)}…)`,
        };
      } finally {
        await conn.quit();
      }
    } catch (e: unknown) {
      return { ok: false, error: e.message };
    }
  },

  async send(cfg: ProviderConfig, msg: SendInput): Promise<SendResult> {
    const c = cfg as SmtpConfig;
    const from = msg.from || c.user;
    const conn = await connect(c);
    try {
      await ehlo(conn, c.helo || c.host);
      if (c.security === "starttls") {
        await conn.cmd("STARTTLS", 2);
        conn.upgradeTls({ host: c.host, servername: c.host });
        await ehlo(conn, c.helo || c.host);
      }
      // Try AUTH LOGIN first, fall back to PLAIN
      try {
        await authLogin(conn, c.user, c.pass);
      } catch {
        await authPlain(conn, c.user, c.pass);
      }
      await conn.cmd(`MAIL FROM:<${from}>`, 2);
      await conn.cmd(`RCPT TO:<${msg.to}>`, 2);
      const mime = buildMime({
        from,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        replyTo: msg.replyTo,
      });
      const reply = await conn.data(mime);
      return {
        ok: true,
        providerMessageId: reply.text.match(/[<].*[>]/)?.[0] || `${Date.now()}`,
        raw: reply.text,
      };
    } catch (e: unknown) {
      return { ok: false, error: e.message };
    } finally {
      await conn.quit();
    }
  },
};
