// settings-panel.js — ÆTHER Adaptive: the creator/manager control surface.
// A floating gear button opens a panel with every adaptive control:
// mode, density, each effect toggle, accent hue, saturation, lightness.
// All changes apply live and persist via the Theme Engine.

import { applyConfig, getConfig, autoDetect, resetConfig, hasSaved, modeToSeed, readBaseline, FX_KEYS } from './theme-engine.js';
import { analyzeBusiness } from './analyzer.js';

const EFFECT_LABELS = {
  blur: 'Blur', glass: 'Glass', fade: 'Fade-in',
  shimmer: 'Shimmer', glow: 'Glow', parallax: 'Parallax',
};

export function mountSettingsPanel(opts = {}) {
  if (document.getElementById('aether-settings-root')) return;

  const root = document.createElement('div');
  root.id = 'aether-settings-root';
  root.className = 'aether-settings';
  const base = readBaseline();

  const state = getConfig();

  root.innerHTML = `
    <button class="aether-settings__toggle" title="ÆTHER Adaptive settings" aria-label="Open ÆTHER settings">⚙</button>
    <div class="aether-settings__panel" role="dialog" aria-label="ÆTHER Adaptive settings">
      <div class="aether-settings__head">
        <div>ÆTHER Adaptive<small>UI tuned to the build & business</small></div>
        <button class="aether-settings__close" aria-label="Close">×</button>
      </div>

      <div class="aether-settings__group">
        <div class="aether-settings__label">Mode</div>
        <div class="aether-settings__modes" data-group="mode">
          <button class="aether-settings__seg" data-val="monochrome">Mono</button>
          <button class="aether-settings__seg" data-val="brand">Brand</button>
          <button class="aether-settings__seg" data-val="bright">Bright</button>
        </div>
      </div>

      <div class="aether-settings__group">
        <div class="aether-settings__label">Effects</div>
        <div class="aether-settings__toggles" data-group="fx">
          ${FX_KEYS.map((k) => `
            <label class="aether-settings__switch">
              <span>${EFFECT_LABELS[k]}</span>
              <input type="checkbox" data-fx="${k}">
            </label>`).join('')}
        </div>
      </div>

      <div class="aether-settings__group">
        <div class="aether-settings__label">Accent hue</div>
        <div class="aether-settings__range">
          <input type="range" min="0" max="360" step="1" data-range="hue">
          <span data-out="hue"></span>
        </div>
      </div>

      <div class="aether-settings__group">
        <div class="aether-settings__label">Saturation</div>
        <div class="aether-settings__range">
          <input type="range" min="0" max="100" step="1" data-range="sat">
          <span data-out="sat"></span>
        </div>
      </div>

      <div class="aether-settings__group">
        <div class="aether-settings__label">Lightness</div>
        <div class="aether-settings__range">
          <input type="range" min="35" max="75" step="1" data-range="lum">
          <span data-out="lum"></span>
        </div>
      </div>

      <div class="aether-settings__detected" data-detected></div>

      <div class="aether-settings__actions">
        <button class="aether-settings__btn aether-settings__btn--primary" data-act="auto">Auto-detect</button>
        <button class="aether-settings__btn" data-act="reset">Reset</button>
        <button class="aether-settings__btn" data-act="export">Export</button>
      </div>
      <pre class="aether-settings__export" data-export></pre>
    </div>
  `;
  document.body.appendChild(root);

  const panel = root.querySelector('.aether-settings__panel');
  const toggle = root.querySelector('.aether-settings__toggle');
  const closeBtn = root.querySelector('.aether-settings__close');

  function syncUI() {
    panel.querySelectorAll('[data-group="mode"] .aether-settings__seg').forEach((b) =>
      b.classList.toggle('is-active', b.dataset.val === state.mode));
    FX_KEYS.forEach((k) => {
      const cb = panel.querySelector(`input[data-fx="${k}"]`);
      if (cb) cb.checked = !!(state.fx && state.fx[k]);
    });
    const setRange = (key, val) => {
      const r = panel.querySelector(`input[data-range="${key}"]`);
      const o = panel.querySelector(`[data-out="${key}"]`);
      if (r) r.value = val;
      if (o) o.textContent = (key === 'hue' ? val + '°' : val + '%');
    };
    setRange('hue', Math.round(state.hue != null ? state.hue : base.hue));
    setRange('sat', Math.round(state.sat != null ? state.sat : modeToSeed(state.mode, base).sat));
    setRange('lum', Math.round(state.lum != null ? state.lum : modeToSeed(state.mode, base).lum));
  }

  function commit() { applyConfig(state); }

  toggle.addEventListener('click', () => panel.classList.toggle('is-open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('is-open'));

  panel.querySelectorAll('[data-group="mode"] .aether-settings__seg').forEach((b) =>
    b.addEventListener('click', () => {
      state.mode = b.dataset.val;
      const ms = modeToSeed(state.mode, base);
      state.sat = ms.sat; state.lum = ms.lum; state.satDark = ms.satDark;
      syncUI(); commit();
    }));

  FX_KEYS.forEach((k) => {
    const cb = panel.querySelector(`input[data-fx="${k}"]`);
    if (cb) cb.addEventListener('change', () => {
      state.fx = state.fx || {};
      state.fx[k] = cb.checked;
      commit();
    });
  });

  ['hue', 'sat', 'lum'].forEach((key) => {
    const r = panel.querySelector(`input[data-range="${key}"]`);
    if (r) r.addEventListener('input', () => {
      state[key] = parseFloat(r.value);
      const o = panel.querySelector(`[data-out="${key}"]`);
      if (o) o.textContent = (key === 'hue' ? r.value + '°' : r.value + '%');
      commit();
    });
  });

  panel.querySelector('[data-act="auto"]').addEventListener('click', () => {
    const detected = autoDetect(collectSignals());
    Object.assign(state, detected);
    const d = panel.querySelector('[data-detected]');
    if (d) d.textContent = `Auto-detected: ${detected.detected} (score ${detected.score})`;
    syncUI();
  });

  panel.querySelector('[data-act="reset"]').addEventListener('click', () => {
    const r = resetConfig();
    Object.assign(state, r);
    syncUI();
  });

  const exportBox = panel.querySelector('[data-export]');
  panel.querySelector('[data-act="export"]').addEventListener('click', () => {
    exportBox.classList.toggle('is-open');
    exportBox.textContent = JSON.stringify(getConfig(), null, 2);
  });

  window.addEventListener('aether:change', syncUI);

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

  syncUI();
  return root;
}
