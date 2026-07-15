import { ingestConfig } from "./integrationConfig";
import { UpstreamError } from "../types/integration";

interface FetchJsonOptions {
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  maxRetries?: number;
  retryBaseMs?: number;
  /** Provider label for error attribution. */
  provider: string;
}

/**
 * fetchJson — resilient HTTP helper for external ad-platform calls.
 * - AbortController timeout
 * - exponential backoff retry on 5xx / network errors (never on 4xx)
 * - typed errors → UpstreamError (maps to HTTP 502 upstream)
 * Uses the global fetch (Node 18+). No extra dependencies.
 */
export async function fetchJson<T>(url: string, opts: FetchJsonOptions): Promise<T> {
  const maxRetries = opts.maxRetries ?? ingestConfig.maxRetries;
  const baseMs = opts.retryBaseMs ?? ingestConfig.retryBaseMs;
  const timeoutMs = opts.timeoutMs ?? ingestConfig.timeoutMs;

  let lastErr: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: opts.method ?? "GET",
        headers: opts.headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);

      // 5xx → retry with backoff
      if (res.status >= 500 && attempt < maxRetries) {
        await sleep(baseMs * 2 ** attempt);
        continue;
      }

      const text = await res.text();
      let payload: unknown;
      try {
        payload = text ? JSON.parse(text) : null;
      } catch {
        payload = text;
      }

      if (!res.ok) {
        throw new UpstreamError(
          opts.provider,
          `HTTP ${res.status}: ${typeof payload === "string" ? payload : JSON.stringify(payload).slice(0, 300)}`,
          res.status
        );
      }
      return payload as T;
    } catch (err) {
      clearTimeout(timer);
      // 4xx UpstreamError → don't retry (client error, won't fix itself)
      if (err instanceof UpstreamError && err.status && err.status < 500) throw err;
      lastErr = err;
      if (attempt < maxRetries) {
        await sleep(baseMs * 2 ** attempt);
        continue;
      }
    }
  }
  throw new UpstreamError(
    opts.provider,
    lastErr instanceof Error ? lastErr.message : "network failure after retries"
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}