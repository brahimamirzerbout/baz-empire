import type { OutreachSequence, OutreachForecast } from "../types";

/**
 * Dialog/Outbound — reply-rate + meeting-show forecast model.
 *
 * Extracted from the dominator methodology of ORRJO (90% meeting attendance via
 * demand-gen-before-outbound) and GrowthSpree (signal-based 32% win rate vs
 * list-based 13%). Reply rates fell from ~8.5% (2019) to ~3.4% (2026); signal /
 * hyper-personalized outreach runs 8–25%.
 *
 * Model: base reply rate by personalization, lifted by warm-market demand-gen
 * (ORRJO's 30–40% lift), gated by deliverability score, scaled by multi-channel
 * coverage. Reply→meeting and meeting→attended conversion follow dominator
 * benchmarks.
 *
 * Pure function — no I/O, deterministic. Unit-tested.
 */
export class OutreachService {
  static forecast(seq: OutreachSequence): OutreachForecast {
    if (seq.prospectCount < 0) throw new Error("prospectCount must be >= 0");
    if (seq.steps <= 0) throw new Error("steps must be > 0");
    if (seq.deliverabilityScore < 0 || seq.deliverabilityScore > 100)
      throw new Error("deliverabilityScore must be 0–100");

    // Base reply rate by personalization level (2026 dominator benchmarks).
    const baseRate: Record<OutreachSequence["personalizationLevel"], number> = {
      template: 0.034,        // industry average cold email 2026
      signal: 0.10,           // signal-based (GrowthSpree)
      "hyper-personal": 0.18, // top of signal outreach band
    };

    let replyRate = baseRate[seq.personalizationLevel] ?? 0.034;

    // Warm-market lift: demand-gen before outbound → +35% (mid of ORRJO's 30–40%).
    if (seq.warmMarket) replyRate *= 1.35;

    // Deliverability gating: score < 60 cuts reach sharply.
    const deliverabilityMultiplier =
      seq.deliverabilityScore >= 80 ? 1.0 :
      seq.deliverabilityScore >= 60 ? 0.75 :
      seq.deliverabilityScore >= 40 ? 0.45 : 0.20;
    replyRate *= deliverabilityMultiplier;

    // Multi-channel coverage: each extra channel beyond email adds ~8% lift (cap 1.4×).
    const channelLift = Math.min(1 + (seq.channels.length - 1) * 0.08, 1.4);
    replyRate *= channelLift;

    // Step diminishing returns: 2-4 steps optimal; >5 adds little.
    const stepFactor = seq.steps <= 4 ? 1 + (seq.steps - 1) * 0.12 : 1.36;
    replyRate *= stepFactor;

    // Cap at a sane ceiling.
    replyRate = Math.min(replyRate, 0.35);

    const estimatedReplies = Math.round(seq.prospectCount * replyRate);

    // Reply → meeting: ~40% of replies convert to a booked call.
    const meetingRate = 0.40;
    const estimatedMeetings = Math.round(estimatedReplies * meetingRate);

    // Meeting → attended: 90% with warm market (ORRJO), 75% cold (Bridge Group bench).
    const showRate = seq.warmMarket ? 0.90 : 0.75;
    const estimatedAttended = Math.round(estimatedMeetings * showRate);

    let signal: string;
    if (replyRate >= 0.12) signal = "Strong — signal-driven, warm, multi-channel. Scale.";
    else if (replyRate >= 0.06) signal = "Workable — add demand-gen warming or more personalization.";
    else signal = "Weak — fix deliverability, add demand-gen before outbound, or move to signal-based targeting.";

    return {
      estimatedReplyRate: Math.round(replyRate * 10000) / 100, // as %
      estimatedReplies,
      estimatedMeetingRate: Math.round(meetingRate * 100),
      estimatedMeetings,
      estimatedShowRate: Math.round(showRate * 100),
      estimatedAttended,
      signal,
    };
  }
}