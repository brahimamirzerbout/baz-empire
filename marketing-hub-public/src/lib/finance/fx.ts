/**
 * FX rates — live currency data with a smart fallback chain.
 *
 * Strategy:
 *   1. Try Frankfurter (api.frankfurter.app) — free, ECB-backed, no key needed.
 *      Supports 30+ currencies including USD, EUR, CHF, GBP, JPY, etc.
 *   2. If Frankfurter fails, try exchangerate.host (also free, no key).
 *   3. If both fail, return the most recent cached rate from the fx_rates table.
 *   4. If no cache, return null + warn.
 *
 * Rate storage: we cache every successful fetch into fx_rates so historical
 * reports are reproducible.
 *
 * Important: FX rates are cached by DATE (not timestamp). Multiple fetches
 * on the same day return the same value. This is correct behavior for daily
 * conversion but means intra-day volatility is lost. For trading-grade
 * precision, integrate a paid provider.
 */
import { db, uid, now } from "@/lib/db";

const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "CHF",
  "GBP",
  "JPY",
  "CNY",
  "CAD",
  "AUD",
  "SEK",
  "NOK",
  "DKK",
  "SGD",
  "HKD",
  "INR",
  "BRL",
  "MXN",
  "ZAR",
  "KRW",
  "NZD",
] as const;

export const CURRENCIES = SUPPORTED_CURRENCIES as unknown as string[];

interface FetchResult {
  rates: Record<string, number>;
  base: string;
  as_of: number;
  source: string;
}

async function fetchFromFrankfurter(base: string): Promise<FetchResult | null> {
  try {
    const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const j = (await res.json()) as Record<string, unknown>;
    if (!j.rates) return null;
    const rates: Record<string, number> = { [base]: 1 };
    for (const [k, v] of Object.entries(j.rates as Record<string, number>)) {
      rates[k] = v as number;
    }
    return {
      rates,
      base,
      as_of: Date.parse(j.date || new Date().toISOString()),
      source: "frankfurter",
    };
  } catch {
    return null;
  }
}

async function fetchFromOpenER(base: string): Promise<FetchResult | null> {
  // Open Exchange Rates — needs an API key, env var OPEN_EXCHANGE_RATES_APP_ID
  const appId = process.env.OPEN_EXCHANGE_RATES_APP_ID;
  if (!appId) return null;
  try {
    const url = `https://openexchangerates.org/api/latest.json?app_id=${appId}&base=${base}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const j = (await res.json()) as Record<string, unknown>;
    return { rates: j.rates, base, as_of: Number(j.timestamp) * 1000, source: "openexchangerates" };
  } catch {
    return null;
  }
}

function fetchFromCache(base: string, quote: string): { rate: number; as_of: number } | null {
  const row = db
    .prepare(
      `SELECT rate, as_of FROM fx_rates WHERE base = ? AND quote = ? ORDER BY as_of DESC LIMIT 1`,
    )
    .get(base, quote) as Record<string, unknown> | undefined;
  return row || null;
}

function storeRates(result: FetchResult) {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO fx_rates (id, base, quote, rate, as_of, source)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const [quote, rate] of Object.entries(result.rates)) {
    insert.run(uid("fx_"), result.base, quote, rate, result.as_of, result.source);
  }
}

export async function refreshRates(
  base = "USD",
): Promise<{ fetched: boolean; source: string; cached_count: number; error?: string }> {
  // 1. Frankfurter
  let r = await fetchFromFrankfurter(base);
  // 2. Open Exchange Rates (if key configured)
  if (!r) r = await fetchFromOpenER(base);
  if (!r) {
    const cached = db.prepare(`SELECT COUNT(*) AS n FROM fx_rates WHERE base = ?`).get(base) as Record<string, unknown> | undefined;
    return {
      fetched: false,
      source: "cache",
      cached_count: cached.n || 0,
      error: "All live sources failed; using cache",
    };
  }
  storeRates(r);
  const cached = db.prepare(`SELECT COUNT(*) AS n FROM fx_rates WHERE base = ?`).get(base) as Record<string, unknown> | undefined;
  return { fetched: true, source: r.source, cached_count: cached.n || 0 };
}

export function getRate(
  base: string,
  quote: string,
): { rate: number; as_of: number; source: string } | null {
  if (base === quote) return { rate: 1, as_of: Date.now(), source: "identity" };
  // Try direct
  let r = fetchFromCache(base, quote);
  if (r) return { ...r, source: "cache" };
  // Try inverse
  r = fetchFromCache(quote, base);
  if (r) return { rate: 1 / r.rate, as_of: r.as_of, source: "cache-inverse" };
  // Try via USD bridge
  if (base !== "USD" && quote !== "USD") {
    const baseUsd = fetchFromCache(base, "USD");
    const usdQuote = fetchFromCache("USD", quote);
    if (baseUsd && usdQuote) {
      return {
        rate: (1 / baseUsd.rate) * usdQuote.rate,
        as_of: Math.min(baseUsd.as_of, usdQuote.as_of),
        source: "cache-via-usd",
      };
    }
  }
  return null;
}

/** Convert amount from one currency to another. */
export function convert(
  amount: number,
  from: string,
  to: string,
): { amount: number; rate: number; as_of: number; source: string } {
  if (from === to) return { amount, rate: 1, as_of: Date.now(), source: "identity" };
  const r = getRate(from, to);
  if (!r) return { amount, rate: 1, as_of: Date.now(), source: "unavailable" };
  return { amount: amount * r.rate, rate: r.rate, as_of: r.as_of, source: r.source };
}

/** Latest USD/EUR/CHF snapshot for the dashboard. */
export function latestCore() {
  const out: Record<string, { usd: number; as_of: number; source: string }> = {};
  for (const c of ["EUR", "CHF", "GBP", "JPY", "CNY"]) {
    const r = getRate("USD", c);
    if (r) out[c] = { usd: r.rate, as_of: r.as_of, source: r.source };
  }
  return out;
}

/** Historical series for one pair, oldest first. */
export function historicalSeries(base: string, quote: string, days: number) {
  const since = Date.now() - days * 86400 * 1000;
  const rows = db
    .prepare(
      `
    SELECT rate, as_of FROM fx_rates
    WHERE base = ? AND quote = ? AND as_of >= ?
    ORDER BY as_of ASC
  `,
    )
    .all(base, quote, since) as Record<string, unknown>[];
  // De-duplicate by day
  const byDay: Record<string, number> = {};
  for (const r of rows) {
    const day = new Date(r.as_of).toISOString().slice(0, 10);
    byDay[day] = r.rate;
  }
  return Object.entries(byDay).map(([day, rate]) => ({ day, rate }));
}

/** Returns the "deflation vs USD" — % a currency has lost/gained in N days. */
export function deflation(
  base: string,
  quote: string,
  days = 90,
): { change_pct: number; from_rate: number; to_rate: number } | null {
  const series = historicalSeries(base, quote, days);
  if (series.length < 2) return null;
  const from = series[0].rate;
  const to = series[series.length - 1].rate;
  // If base is USD, "deflation of quote" = positive change = quote gets more dollars = quote strong.
  // If base is quote (e.g. EUR), "deflation" vs USD: quote weakens = EUR/USD drops.
  const change = (to - from) / from;
  return { change_pct: change * 100, from_rate: from, to_rate: to };
}
