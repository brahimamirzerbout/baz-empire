import type { SeoAuditResult } from "../types";

/**
 * SEO & Content — on-page analyzer.
 *
 * Scores a page (raw HTML string) against a target keyword: keyword density,
 * presence of H1/title, and image alt-text coverage. Returns a 0–100 score
 * with issues + actionable recommendations.
 *
 * Pure function — no I/O, deterministic. Unit-tested.
 */
export class SeoService {
  static analyzePage(htmlContent: string, targetKeyword: string): SeoAuditResult {
    if (!htmlContent || typeof htmlContent !== "string") {
      throw new Error("htmlContent must be a non-empty string");
    }
    if (!targetKeyword || typeof targetKeyword !== "string") {
      throw new Error("targetKeyword must be a non-empty string");
    }

    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    const lowerHtml = htmlContent.toLowerCase();
    const cleanText = htmlContent.replace(/<[^>]*>/g, " ").toLowerCase();
    const words = cleanText.split(/\s+/).filter((w) => w.length > 0);
    const kw = targetKeyword.toLowerCase();

    // 1. Keyword density — phrase-level match (handles multi-word keywords
    //    like "fashion agency", which the original word-split approach missed).
    const phraseCount = cleanText.split(kw).length - 1;
    const keywordDensity = words.length > 0 ? (phraseCount / words.length) * 100 : 0;

    if (keywordDensity < 0.5) {
      score -= 20;
      issues.push("Keyword density is too low.");
      recommendations.push(`Increase instances of "${targetKeyword}". Target between 1% and 2.5%.`);
    } else if (keywordDensity > 4.0) {
      score -= 25;
      issues.push("Keyword stuffing detected.");
      recommendations.push("Reduce keyword frequency to avoid being flagged for keyword stuffing.");
    }

    // 2. Semantic tags
    if (!lowerHtml.includes("<h1")) {
      score -= 15;
      issues.push("Missing H1 header tag.");
      recommendations.push("Ensure the page contains exactly one <h1> summarising the main topic.");
    }
    if (!lowerHtml.includes("<title")) {
      score -= 20;
      issues.push("Missing title tag in metadata.");
      recommendations.push("Add a descriptive <title> tag within the <head> element.");
    }

    // 3. Image alt attributes (relevant for creative/model imagery)
    const totalImages = (htmlContent.match(/<img/gi) || []).length;
    const missingAlt = (htmlContent.match(/<img(?![^>]*\balt=)[^>]*>/gi) || []).length;

    if (totalImages > 0 && missingAlt > 0) {
      const penalty = Math.min(missingAlt * 5, 15);
      score -= penalty;
      issues.push(`${missingAlt} of ${totalImages} image(s) missing alt descriptions.`);
      recommendations.push("Add alt attributes to all <img> tags for crawlers and accessibility.");
    }

    return {
      score: Math.max(score, 0),
      keywordDensity: Math.round(keywordDensity * 100) / 100,
      issues,
      recommendations,
    };
  }
}