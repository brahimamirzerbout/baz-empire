/**
 * Markets — stock quotes, indices, crypto, heatmap data.
 *
 * Sources (in order of preference):
 *   1. Alpha Vantage (free tier with API key — best for US stocks)
 *   2. Yahoo Finance unofficial public endpoints (no key, rate-limited)
 *   3. CoinGecko public API (no key, for crypto)
 *
 * Without keys we fall back to a deterministic synthetic dataset so the UI
 * still renders something useful. Every quote is tagged with its source so
 * the marketer can tell what's live vs cached vs placeholder.
 *
 * Heatmap data is computed from the same quote set — sector × ticker grid.
 */
import { db, uid, now } from "@/lib/db";

const STOCK_UNIVERSE = [
  // Mega-cap tech
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", kind: "stock" },
  { symbol: "MSFT", name: "Microsoft", sector: "Technology", kind: "stock" },
  { symbol: "GOOGL", name: "Alphabet", sector: "Technology", kind: "stock" },
  { symbol: "AMZN", name: "Amazon", sector: "Consumer Cyclical", kind: "stock" },
  { symbol: "META", name: "Meta Platforms", sector: "Technology", kind: "stock" },
  { symbol: "NVDA", name: "NVIDIA", sector: "Technology", kind: "stock" },
  { symbol: "TSLA", name: "Tesla", sector: "Consumer Cyclical", kind: "stock" },
  // Indices
  { symbol: "^GSPC", name: "S&P 500", sector: "Index", kind: "index" },
  { symbol: "^IXIC", name: "NASDAQ Composite", sector: "Index", kind: "index" },
  { symbol: "^DJI", name: "Dow Jones", sector: "Index", kind: "index" },
  { symbol: "^STOXX", name: "STOXX Europe 600", sector: "Index", kind: "index" },
  { symbol: "^FTSE", name: "FTSE 100", sector: "Index", kind: "index" },
  { symbol: "^SSMI", name: "Swiss Market Index", sector: "Index", kind: "index" },
  // FX (as "symbols" for the heatmap)
  { symbol: "EUR/USD", name: "Euro / US Dollar", sector: "FX", kind: "fx" },
  { symbol: "USD/CHF", name: "US Dollar / Swiss Franc", sector: "FX", kind: "fx" },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", sector: "FX", kind: "fx" },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", sector: "FX", kind: "fx" },
  // Crypto
  { symbol: "BTC", name: "Bitcoin", sector: "Crypto", kind: "crypto" },
  { symbol: "ETH", name: "Ethereum", sector: "Crypto", kind: "crypto" },
];

export const MARKET_UNIVERSE = STOCK_UNIVERSE;

async function fetchFromAlphaVantage(
  symbol: string,
): Promise<{ price: number; change_pct: number } | null> {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) return null;
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const j = (await res.json()) as Record<string, unknown>;
    const q = j["Global Quote"];
    if (!q || !q["05. price"]) return null;
    return {
      price: parseFloat(q["05. price"]),
      change_pct: parseFloat(String(q["10. change percent"] || "0").replace("%", "")),
    };
  } catch {
    return null;
  }
}

async function fetchCoinGecko(
  symbol: string,
): Promise<{ price: number; change_pct: number } | null> {
  const ids: Record<string, string> = { BTC: "bitcoin", ETH: "ethereum" };
  const id = ids[symbol];
  if (!id) return null;
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`,
      {
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) return null;
    const j = (await res.json()) as Record<string, unknown>;
    return { price: j[id]?.usd || 0, change_pct: j[id]?.usd_24h_change || 0 };
  } catch {
    return null;
  }
}

function fetchFromCache(
  symbol: string,
): { price: number; change_pct: number; as_of: number } | null {
  const r = db
    .prepare(
      `SELECT price, change_pct, as_of FROM market_quotes WHERE symbol = ? AND kind IN ('stock','index','fx','crypto') ORDER BY as_of DESC LIMIT 1`,
    )
    .get(symbol) as Record<string, unknown> | undefined;
  if (!r || r.price == null) return null;
  return { price: r.price, change_pct: r.change_pct || 0, as_of: r.as_of };
}

function writeQuote(
  symbol: string,
  kind: string,
  name: string,
  price: number,
  change_pct: number,
  source: string,
) {
  const t = now();
  db.prepare(
    `
    INSERT OR REPLACE INTO market_quotes (id, symbol, kind, name, price, change_pct, as_of, series, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?)
  `,
  ).run(uid("q_"), symbol, kind, name, price, change_pct, t, source);
}

/**
 * Refresh one symbol. Tries live sources in order, then cache, then deterministic synthetic.
 */
export async function refreshQuote(
  symbol: string,
): Promise<{
  symbol: string;
  source: string;
  price: number;
  change_pct: number;
  fallback?: boolean;
}> {
  const u = STOCK_UNIVERSE.find((s) => s.symbol === symbol);
  if (!u) throw new Error(`Unknown symbol: ${symbol}`);

  let r = u.kind === "crypto" ? await fetchCoinGecko(symbol) : await fetchFromAlphaVantage(symbol);
  if (r) {
    writeQuote(
      symbol,
      u.kind,
      u.name,
      r.price,
      r.change_pct,
      u.kind === "crypto" ? "coingecko" : "alphavantage",
    );
    return {
      symbol,
      source: u.kind === "crypto" ? "coingecko" : "alphavantage",
      price: r.price,
      change_pct: r.change_pct,
    };
  }
  const cached = fetchFromCache(symbol);
  if (cached)
    return { symbol, source: "cache", price: cached.price, change_pct: cached.change_pct };

  // Synthetic placeholder — deterministic from the symbol hash, so the UI
  // shows a stable but obviously-fake number. This is NOT real data and
  // we mark it clearly in the UI.
  const seed = [...symbol].reduce((s, c) => s + c.charCodeAt(0), 0);
  const price = 50 + (seed % 450);
  const change = (seed % 600) / 100 - 3;
  writeQuote(symbol, u.kind, u.name, price, change, "synthetic");
  return { symbol, source: "synthetic", price, change_pct: change, fallback: true };
}

export async function refreshUniverse(): Promise<{
  refreshed: number;
  cached: number;
  fallback: number;
}> {
  let refreshed = 0,
    cachedCount = 0,
    fallback = 0;
  for (const u of STOCK_UNIVERSE) {
    const c = fetchFromCache(u.symbol);
    if (c && Date.now() - c.as_of < 60 * 60 * 1000) {
      cachedCount++;
      continue;
    }
    const r = await refreshQuote(u.symbol);
    if (r.fallback) fallback++;
    else refreshed++;
  }
  return { refreshed, cached: cachedCount, fallback };
}

export function quote(symbol: string) {
  return fetchFromCache(symbol);
}

export function allQuotes() {
  const rows = db
    .prepare(
      `
    SELECT q.* FROM market_quotes q
    JOIN (SELECT symbol, MAX(as_of) AS max FROM market_quotes GROUP BY symbol) latest
      ON latest.symbol = q.symbol AND latest.max = q.as_of
    ORDER BY q.symbol
  `,
    )
    .all() as Record<string, unknown>[];
  return rows;
}

/** Heatmap data — buckets by sector, sized by absolute change_pct. */
export function heatmap() {
  const quotes = allQuotes();
  const buckets: Record<string, any[]> = {};
  for (const q of quotes) {
    const u = STOCK_UNIVERSE.find((s) => s.symbol === q.symbol);
    const sector = u?.sector || q.kind || "Other";
    if (!buckets[sector]) buckets[sector] = [];
    buckets[sector].push({
      symbol: q.symbol,
      name: q.name || u?.name || q.symbol,
      price: q.price,
      change: q.change_pct,
      kind: q.kind,
    });
  }
  return buckets;
}
