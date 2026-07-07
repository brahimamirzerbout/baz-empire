/**
 * Page scanner — fetches each public page and feeds its HTML to the Sabri audit.
 */
export async function scanPages(
  urls: string[],
): Promise<Array<{ name: string; url: string; html: string }>> {
  const out: Array<{ name: string; url: string; html: string }> = [];
  for (const u of urls) {
    try {
      const r = await fetch(u, { cache: "no-store" });
      const html = await r.text();
      const name = u.split("/").pop() || u;
      out.push({ name, url: u, html });
    } catch {}
  }
  return out;
}

export const PUBLIC_PAGES_TO_AUDIT = [
  { name: "Public site", url: "http://localhost:3000/site" },
  { name: "Lead magnet", url: "http://localhost:3000/leads" },
  { name: "Onboarding", url: "http://localhost:3000/onboarding" },
  { name: "Case studies", url: "http://localhost:3000/case-studies" },
  { name: "Demo video", url: "http://localhost:3000/site/demo" },
  { name: "Pricing", url: "http://localhost:3000/pricing" },
];
