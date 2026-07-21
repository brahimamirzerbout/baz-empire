// aether-engine.js — ÆTHER Adaptive entry point.
// Loaded as a module (static sites) it auto-boots on DOMContentLoaded.
// In bundled apps, import { initAetherEngine } and call it yourself;
// set window.AETHER_ENGINE_AUTO = false to disable auto-boot.

import { applyConfig, getConfig, autoDetect, hasSaved, FX_KEYS } from './theme-engine.js';
import { mountSettingsPanel } from './settings-panel.js';

export function initAetherEngine(opts = {}) {
  const root = document.documentElement;
  const signals = collectSignals();

  if (hasSaved()) {
    applyConfig(getConfig());
  } else {
    autoDetect(signals);
  }

  if (opts.panel !== false) mountSettingsPanel(opts.panelOptions || {});

  if (FX_KEYS.includes('parallax')) setupParallax(root);
  window.addEventListener('aether:change', (e) => {
    if (e.detail && e.detail.fx && e.detail.fx.parallax) setupParallax(root);
    else teardownParallax();
  });

  return window.AetherEngine || (window.AetherEngine = { applyConfig, getConfig, autoDetect, mountSettingsPanel });
}

function collectSignals() {
  const m = document.querySelector('meta[name="description"]');
  const hints = (window.AETHER_HINTS || []).join(' ');
  return {
    title: document.title || '',
    description: m ? m.content : '',
    hints,
    text: document.body ? document.body.innerText.slice(0, 2000) : '',
  };
}

let parallaxHandler = null;
function setupParallax(root) {
  if (parallaxHandler) return;
  parallaxHandler = () => {
    const y = Math.min(window.scrollY * 0.04, 60);
    root.style.setProperty('--aether-parallax-y', y + 'px');
  };
  window.addEventListener('scroll', parallaxHandler, { passive: true });
  parallaxHandler();
}
function teardownParallax() {
  if (!parallaxHandler) return;
  window.removeEventListener('scroll', parallaxHandler);
  parallaxHandler = null;
  document.documentElement.style.removeProperty('--aether-parallax-y');
}

function boot() {
  if (window.AETHER_ENGINE_AUTO === false) return;
  if (document.getElementById('aether-settings-root')) return;
  initAetherEngine();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}

window.AetherEngine = { initAetherEngine, applyConfig, getConfig, autoDetect, mountSettingsPanel };
