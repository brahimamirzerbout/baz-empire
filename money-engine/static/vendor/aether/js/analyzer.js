// analyzer.js — ÆTHER Adaptive: heuristic business-type detection.
// Given lightweight signals (title / meta description / body text / explicit hints),
// decide a sensible default UI treatment: mode (monochrome|brand|bright),
// density (simple|rich) and which effects to enable.
//
// Apps can steer this by setting window.AETHER_HINTS = ['marketing','agency']
// before the engine boots, or by tagging <html data-aether-business="agency">.

const PRESETS = {
  fintech: {
    mode: 'monochrome', density: 'simple',
    fx: { blur: false, glass: true, fade: true, shimmer: false, glow: false, parallax: false },
  },
  agency: {
    mode: 'brand', density: 'rich',
    fx: { blur: true, glass: true, fade: true, shimmer: true, glow: true, parallax: false },
  },
  creative: {
    mode: 'brand', density: 'rich',
    fx: { blur: true, glass: true, fade: true, shimmer: true, glow: true, parallax: true },
  },
  saas: {
    mode: 'brand', density: 'rich',
    fx: { blur: false, glass: true, fade: true, shimmer: false, glow: true, parallax: false },
  },
  game: {
    mode: 'bright', density: 'rich',
    fx: { blur: true, glass: true, fade: true, shimmer: true, glow: true, parallax: true },
  },
  docs: {
    mode: 'monochrome', density: 'simple',
    fx: { blur: false, glass: false, fade: false, shimmer: false, glow: false, parallax: false },
  },
  default: {
    mode: 'monochrome', density: 'rich',
    fx: { blur: false, glass: true, fade: true, shimmer: false, glow: false, parallax: false },
  },
};

const KEYWORDS = {
  fintech: ['finance', 'fintech', 'trading', 'crypto', 'invest', 'bank', 'money', 'payment', 'ledger', 'portfolio', 'dashboard', 'analytics', 'admin', 'billing', 'revenue'],
  agency: ['agency', 'marketing', 'brand', 'creative', 'studio', 'advertising', 'campaign', 'seo', 'social media', 'content', 'growth'],
  creative: ['design', 'portfolio', 'art', 'photography', 'video', 'motion', '3d', 'animation', 'illustration'],
  saas: ['saas', 'workspace', 'collaborat', 'crm', 'api', 'platform', 'product', 'tool', 'app'],
  game: ['game', 'gaming', 'play', 'arcade', 'rpg', 'multiplayer', 'unity', 'unreal', 'canvas', 'webgl', 'shader', 'engine'],
  docs: ['docs', 'documentation', 'wiki', 'blog', 'learn', 'course', 'tutorial', 'knowledge', 'handbook', 'guide'],
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }

export function analyzeBusiness(input = {}) {
  const text = [input.title, input.description, input.hints, input.text]
    .filter(Boolean).join(' ').toLowerCase();

  const scores = {};
  for (const cat in KEYWORDS) {
    scores[cat] = KEYWORDS[cat].reduce((s, k) => s + (text.includes(k) ? 1 : 0), 0);
  }

  let best = 'default';
  let bestScore = 0;
  for (const cat in scores) {
    if (scores[cat] > bestScore) { bestScore = scores[cat]; best = cat; }
  }

  const preset = clone(PRESETS[best]);
  preset.detected = best;
  preset.score = bestScore;
  return preset;
}
