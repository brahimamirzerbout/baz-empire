/**
 * Backup — server-side tar.gz of the entire Marketing Hub state.
 *
 * We use Node's built-in child_process + tar (no extra deps) to stream a
 * gzipped tarball of the project root, excluding node_modules / .next /
 * *.log. Returns the bytes; the API route streams them back to the browser.
 *
 * Reseed = restore + npm run seed (we just re-run scripts/seed.ts).
 */
import { spawn } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";

const SRC = process.cwd();

export function buildBackupTarball(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // We pipe tar's stdout into a buffer. -C lets us specify the parent
    // directory so the archive contains a single top-level "marketing-hub/"
    // folder — easier to restore anywhere.
    const parent = path.dirname(SRC);
    const name = path.basename(SRC);
    const tar = spawn("tar", [
      "-czf",
      "-",
      "--exclude=node_modules",
      "--exclude=.next",
      "--exclude=*.log",
      "-C",
      parent,
      name,
    ]);
    const chunks: Buffer[] = [];
    tar.stdout.on("data", (c) => chunks.push(Buffer.from(c)));
    tar.stderr.on("data", (c) => process.stderr.write(`[backup] ${c}`));
    tar.on("error", reject);
    tar.on("close", (code) => {
      if (code !== 0) return reject(new Error(`tar exited with code ${code}`));
      resolve(Buffer.concat(chunks));
    });
  });
}

/**
 * Reseed the database by invoking scripts/seed.ts via tsx (already a devDep).
 * Captures stdout/stderr and returns them. Throws if exit code != 0.
 */
export function reseedDatabase(): Promise<string> {
  return new Promise((resolve, reject) => {
    const script = path.join(SRC, "scripts", "seed.ts");
    if (!fs.existsSync(script)) return reject(new Error(`seed.ts not found at ${script}`));
    const p = spawn("npx", ["tsx", script], { cwd: SRC, env: process.env });
    const chunks: Buffer[] = [];
    p.stdout.on("data", (c) => chunks.push(Buffer.from(c)));
    p.stderr.on("data", (c) => chunks.push(Buffer.from(c)));
    p.on("error", reject);
    p.on("close", (code) => {
      if (code !== 0)
        return reject(
          new Error(`seed exited with code ${code}\n${Buffer.concat(chunks).toString()}`),
        );
      resolve(Buffer.concat(chunks).toString());
    });
  });
}
