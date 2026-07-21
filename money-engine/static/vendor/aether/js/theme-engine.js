// theme-engine.js — ÆTHER Adaptive: applies a config to the live document.
// Owns the mode -> seed mapping (monochrome | brand | bright) while preserving
// each app's brand HUE (read once from the computed --seed-hue baseline).
// Persists the chosen config to localStorage so it survives reloads.

import { analyzeBusiness } from './analyzer.js';

const STORAGE_KEY = 'aether-theme';
const FX_KEYS = ['blur', 'glass', 'fade', 'shimmer', 'glow', 'parallax'];

let baseline = null;

export function readBaseline() {
  const cs = getComputedStyle(document.documentElement);
  const num = (v, d) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : d;
  };
  return {
    hue: num(cs.getPropertyValue('--seed-hue'), 0),
    sat: num(cs.getPropertyValue('--seed-sat'), 0),
    lum: num(cs.getPropertyValue('--seed-lum'), 50),
    satDark: num(cs.getPropertyValue('--seed-sat-dark'), 0),
  };
}

// Map a high-level mode to concrete seed saturations/lightness.
// `brand` reuses the app's own baseline (so each app keeps its identity).
export function modeToSeed(mode, base) {
  if (mode === 'monochrome') return { sat: 0, lum: 50, satDark: 0 };
  if (mode === 'bright') return { sat: 100, lum: 62, satDark: 88 };
  // brand
  return { sat: base.sat || 80, lum: base.lum || 55, satDark: base.satDark || 60 };
}

export function applyConfig(cfg = {}) {
  baseline = baseline || readBaseline();
  const root = document.documentElement;

  const mode = cfg.mode || 'monochrome';
  const ms = modeToSeed(mode, baseline);

  const hue = cfg.hue != null ? cfg.hue : baseline.hue;
  const sat = cfg.sat != null ? cfg.sat : ms.sat;
  const lum = cfg.lum != null ? cfg.lum : ms.lum;
  const satDark = cfg.satDark != null ? cfg.satDark : ms.satDark;

  root.style.setProperty('--seed-hue', hue);
  root.style.setProperty('--seed-sat', sat + '%');
  root.style.setProperty('--seed-lum', lum + '%');
  root.style.setProperty('--seed-sat-dark', satDark + '%');

  root.dataset.aetherMode = mode;

  const fx = [];
  for (const k of FX_KEYS) if (cfg.fx && cfg.fx[k]) fx.push(k);
  root.dataset.aetherFx = fx.join(' ');

  const full = {
    mode,
    hue, sat, lum, satDark,
    fx: Object.fromEntries(FX_KEYS.map((k) => [k, fx.includes(k)])),
  };

  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(full)); } catch (e) { /* ignore */ }
  window.dispatchEvent(new CustomEvent('aether:change', { detail: full }));
  return full;
}

export function getConfig() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch (e) { /* ignore */ }
  baseline = baseline || readBaseline();
  return {
    mode: 'monochrome',
    hue: baseline.hue, sat: baseline.sat, lum: baseline.lum, satDark: baseline.satDark,
    fx: {},
  };
}

export function autoDetect(signals = {}) {
  const preset = analyzeBusiness(signals);
  return applyConfig(preset);
}

export function resetConfig() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  baseline = null;
  return applyConfig({ mode: 'monochrome', fx: {} });
}

export function hasSaved() {
  try { return !!localStorage.getItem(STORAGE_KEY); } catch (e) { return false; }
}

export { FX_KEYS };
