/**
 * Sabri Suby lens — the god of conversion rate optimisation.
 *
 * His core ideas (from $100M Offers, Sell Like Crazy, The Client Letter):
 *   - The Offer is the #1 lever of business. Everything else is noise.
 *   - Every page must have ONE clear call-to-action. The eye doesn't scroll.
 *   - Headlines = the entire ad. If they don't stop you, nothing else matters.
 *   - The Three F's: Features, Fears, Feelings. The page must address all three.
 *   - Social proof: specificity beats quantity ("2,847 users" beats "thousands").
 *   - Risk reversal: money-back, free trial, no questions asked. Removes the objection.
 *   - Urgency + scarcity: only if TRUE. False urgency destroys trust.
 *   - The page must be readable in 5 seconds. If not, it's over.
 *   - One page, one offer, one CTA. Decision fatigue kills conversion.
 *   - The Hero: name + tagline + sub-tagline + CTA. That's the formula.
 */
import { db, now } from "@/lib/db";

export interface PageAudit {
  page: string;
  url: string;
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  has_hero: boolean;
  has_clear_cta: boolean;
  has_social_proof: boolean;
  has_risk_reversal: boolean;
  has_urgency: boolean;
  has_specificity: boolean;
  has_one_offer: boolean;
  issues: string[];
  sabri_take: string; // Sabri's voice critique
}

const TEMPLATE = (page: string, url: string): PageAudit => ({
  page,
  url,
  score: 0,
  grade: "F",
  has_hero: false,
  has_clear_cta: false,
  has_social_proof: false,
  has_risk_reversal: false,
  has_urgency: false,
  has_specificity: false,
  has_one_offer: false,
  issues: [],
  sabri_take: "",
});

/**
 * Run Sabri's audit on a set of pages.
 * For now this is a heuristic scan over each page's HTML.
 */
export function sabriAudit(
  pages: Array<{ name: string; url: string; html?: string }>,
): PageAudit[] {
  return pages.map((p) => {
    const a = TEMPLATE(p.name, p.url);
    const html = (p.html || "").toLowerCase();
    a.has_hero = /<h1[\s>]/.test(html);
    a.has_clear_cta = /(start free|get started|book|sign up|try|buy|join|subscribe)/i.test(html);
    a.has_social_proof = /(customer|testimonial|review|trusted by|users|companies|\d+,\d+)/i.test(
      html,
    );
    a.has_risk_reversal =
      /(money.back|free trial|cancel anytime|30.day|guarantee|ris.k.free)/i.test(html);
    a.has_urgency = /(today|now|limited|ends|deadline|expires|hurry)/i.test(html);
    a.has_specificity = /\d+%|\d+,\d+|\$\d+|\d+ (days|hours|min)/i.test(html);
    a.has_one_offer = (html.match(/<button|<a [^>]*cta/gi) || []).length <= 3;

    let score = 0;
    if (a.has_hero) score += 15;
    if (a.has_clear_cta) score += 25;
    if (a.has_social_proof) score += 20;
    if (a.has_risk_reversal) score += 15;
    if (a.has_urgency) score += 10;
    if (a.has_specificity) score += 10;
    if (a.has_one_offer) score += 5;
    a.score = score;
    a.grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";

    if (!a.has_hero) a.issues.push("No clear H1. The hero is the only thing most visitors read.");
    if (!a.has_clear_cta)
      a.issues.push("No CTA visible. Every page needs ONE clear call-to-action.");
    if (!a.has_social_proof)
      a.issues.push(
        "Missing social proof. Specificity beats quantity ('2,847 users' > 'thousands').",
      );
    if (!a.has_risk_reversal)
      a.issues.push(
        "No risk reversal. Money-back, free trial, or cancel-anytime removes the objection.",
      );
    if (!a.has_urgency) a.issues.push("No urgency. Only if true — false urgency destroys trust.");
    if (!a.has_specificity) a.issues.push("Vague copy. Numbers beat adjectives.");
    if (!a.has_one_offer) a.issues.push("Too many CTAs. One page, one offer, one action.");

    a.sabri_take = sabriVerdict(a);
    return a;
  });
}

function sabriVerdict(a: PageAudit): string {
  if (a.grade === "A")
    return "Ship it. The page is doing the work. Now drive traffic and split-test the headline.";
  if (a.grade === "B")
    return "Solid foundation. The biggest unlock is usually the headline — try 5 alternatives and ship the winner.";
  if (a.grade === "C")
    return "The offer is in the building but the page isn't selling it. You have a leak. Fix the CTA first, then the social proof, then everything else.";
  if (a.grade === "D")
    return "You're getting clicks and losing them. The page is a sieve. The #1 fix: one offer, one CTA, one promise, one page. Strip everything else.";
  return "I'd rather you send no traffic than send it to this page. Rebuild the hero, write a real offer, and prove it works. The page should sell in 5 seconds — this one is invisible.";
}
