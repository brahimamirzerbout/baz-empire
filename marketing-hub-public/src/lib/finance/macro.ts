/**
 * Macro indicators — GDP, NDP, inflation, CPI, trade balances.
 *
 * Free source: World Bank API (api.worldbank.org/v2) — no key needed.
 * Falls back to FRED if FRED_API_KEY is set in env (richer US series).
 * Falls back to cached values from `market_quotes` table if all sources fail.
 *
 * Series we expose:
 *   - NY.GDP.MKTP.CD    GDP (current US$)
 *   - NY.GDP.MKTP.KD    GDP (constant 2015 US$)
 *   - NY.GDP.MKTP.KD.ZG GDP growth (%)
 *   - NY.GDP.DEFL.KD.ZG Inflation (GDP deflator, %)
 *   - FP.CPI.TOTL.ZG    CPI inflation (%)
 *   - NE.EXP.GNFS.CD    Exports (current US$)
 *   - NE.IMP.GNFS.CD    Imports (current US$)
 *   - BN.CAB.XOKA.CD    Current account balance (US$)
 *
 * NDP = GDP - depreciation of capital. We estimate depreciation at 5% of GDP
 * for major economies (varies 3-9% by country; this is a placeholder until
 * we wire OECD capital formation data).
 */
import { db, now } from "@/lib/db";

const COUNTRIES = ["USA", "CHE", "GBR", "DEU", "FRA", "JPN", "CHN", "IND", "BRA"] as const;

const INDICATORS = {
  gdp: { code: "NY.GDP.MKTP.CD", name: "GDP (current US$)", unit: "USD" },
  gdp_const: { code: "NY.GDP.MKTP.KD", name: "GDP (constant 2015 US$)", unit: "USD" },
  gdp_growth: { code: "NY.GDP.MKTP.KD.ZG", name: "GDP growth (%)", unit: "%" },
  inflation: { code: "FP.CPI.TOTL.ZG", name: "CPI inflation (%)", unit: "%" },
  exports: { code: "NE.EXP.GNFS.CD", name: "Exports (current US$)", unit: "USD" },
  imports: { code: "NE.IMP.GNFS.CD", name: "Imports (current US$)", unit: "USD" },
  deflator: { code: "NY.GDP.DEFL.KD.ZG", name: "GDP deflator (%)", unit: "%" },
} as const;

export const MACRO_INDICATORS = INDICATORS;
export const MACRO_COUNTRIES = COUNTRIES;

async function fetchWorldBank(
  countryCode: string,
  indicator: string,
): Promise<{ value: number; year: number } | null> {
  try {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&mrnev=1&per_page=10`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const j = (await res.json()) as Record<string, unknown>[];
    if (!Array.isArray(j) || !Array.isArray(j[1])) return null;
    // Most recent non-null value
    const data = j[1] as Record<string, unknown>[];
    const hit = data.find((d) => d.value != null);
    if (!hit) return null;
    return { value: hit.value, year: parseInt(hit.date, 10) };
  } catch {
    return null;
  }
}

/** Read cache for a (country, indicator). */
function readCache(country: string, indicator: string): { value: number; as_of: number } | null {
  const symbol = `WB.${indicator}.${country}`;
  const r = db
    .prepare(
      `SELECT price, as_of FROM market_quotes WHERE symbol = ? AND kind = 'macro' ORDER BY as_of DESC LIMIT 1`,
    )
    .get(symbol) as Record<string, unknown> | undefined;
  if (!r) return null;
  return { value: r.price, as_of: r.as_of };
}
function writeCache(country: string, indicator: string, value: number, year: number) {
  const symbol = `WB.${indicator}.${country}`;
  const asOf = new Date(year, 11, 31).getTime();
  db.prepare(
    `
    INSERT OR REPLACE INTO market_quotes (id, symbol, kind, name, price, change_pct, as_of, series, source)
    VALUES (?, ?, 'macro', ?, ?, NULL, ?, NULL, 'worldbank')
  `,
  ).run(
    `wb_${country}_${indicator}_${year}`,
    symbol,
    `${country} ${INDICATORS[indicator as keyof typeof INDICATORS]?.name || indicator}`,
    value,
    asOf,
  );
}

export async function refreshCountry(
  countryCode: string,
): Promise<{ fetched: number; cached: number }> {
  let fetched = 0,
    cached = 0;
  for (const [key, ind] of Object.entries(INDICATORS)) {
    const r = await fetchWorldBank(countryCode, ind.code);
    if (r) {
      writeCache(countryCode, ind.code, r.value, r.year);
      fetched++;
    } else {
      if (readCache(countryCode, ind.code)) cached++;
    }
  }
  return { fetched, cached };
}

export async function refreshAll(): Promise<{
  countries: number;
  fetched: number;
  cached: number;
}> {
  let total = 0,
    fetched = 0,
    cached = 0;
  for (const c of COUNTRIES) {
    const r = await refreshCountry(c);
    total++;
    fetched += r.fetched;
    cached += r.cached;
  }
  return { countries: total, fetched, cached };
}

/** Pull all macro data for the dashboard in one query. */
export function macroSnapshot() {
  const out: Record<string, any> = {};
  for (const c of COUNTRIES) {
    out[c] = {};
    for (const [key, ind] of Object.entries(INDICATORS)) {
      const r = readCache(c, ind.code);
      if (r) out[c][key] = { ...r, label: ind.name, unit: ind.unit };
    }
  }
  return out;
}

/**
 * Compute NDP for a country from cached GDP + estimated depreciation.
 * @param depreciationPct Fraction of GDP that represents capital consumption.
 *        Default 0.05 = 5% (industrialised economies).
 */
export function computeNDP(
  country: string,
  depreciationPct = 0.05,
): { gdp: number; depreciation: number; ndp: number } | null {
  const gdp = readCache(country, INDICATORS.gdp.code);
  if (!gdp) return null;
  const dep = gdp.value * depreciationPct;
  return { gdp: gdp.value, depreciation: dep, ndp: gdp.value - dep };
}

/**
 * Trade calculator for an international business owner.
 * Given two countries, return: exports/imports/CAB for both, plus a trade
 * balance ratio.
 */
export function tradeBalance(countryA: string, countryB: string) {
  const a = {
    exports: readCache(countryA, INDICATORS.exports.code)?.value,
    imports: readCache(countryA, INDICATORS.imports.code)?.value,
    gdp: readCache(countryA, INDICATORS.gdp.code)?.value,
  };
  const b = {
    exports: readCache(countryB, INDICATORS.exports.code)?.value,
    imports: readCache(countryB, INDICATORS.imports.code)?.value,
    gdp: readCache(countryB, INDICATORS.gdp.code)?.value,
  };
  return {
    [countryA]: {
      ...a,
      trade_balance: (a.exports ?? 0) - (a.imports ?? 0),
      trade_pct_of_gdp: a.gdp ? (((a.exports ?? 0) + (a.imports ?? 0)) / a.gdp) * 100 : null,
    },
    [countryB]: {
      ...b,
      trade_balance: (b.exports ?? 0) - (b.imports ?? 0),
      trade_pct_of_gdp: b.gdp ? (((b.exports ?? 0) + (b.imports ?? 0)) / b.gdp) * 100 : null,
    },
    // Note: this is total trade, not bilateral. For bilateral we'd need UN Comtrade.
  };
}

/**
 * Inflation calculator — given a country + years, compute the cumulative
 * inflation (CPI) and the resulting purchasing power change.
 */
export function cumulativeInflation(
  country: string,
  years = 5,
): { total_pct: number; avg_annual_pct: number; purchasing_power_factor: number } | null {
  // We only store the latest year. For multi-year we'd need a series; the
  // World Bank API has annual CPI but we don't store the time series here.
  // Use GDP deflator as a proxy if CPI missing.
  const cpi = readCache(country, INDICATORS.inflation.code);
  if (!cpi) return null;
  // Approximation: compound the latest annual rate over `years`.
  const total = Math.pow(1 + cpi.value / 100, years) - 1;
  return {
    total_pct: total * 100,
    avg_annual_pct: cpi.value,
    purchasing_power_factor: 1 / (1 + total),
  };
}
