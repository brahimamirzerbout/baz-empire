import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PHI, DURATION, MOTION } from '../../styles/aether-design-system';

// ═══════════════════════════════════════════════════════════════════
// FUNCTIONAL COLORS TOGGLE
// ═══════════════════════════════════════════════════════════════════
//
// The UI is pure darkness by default — monochrome, no accent hues.
// This button reveals the functional color system: violet, emerald,
// amber, red, blue. They appear only when the user chooses to see them.
//
// When OFF: everything is zinc/neutral. The eye rests in darkness.
// When ON:  golden-angle hues emerge, perceptible only when needed.
// ═══════════════════════════════════════════════════════════════════

interface FunctionalColorsToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function FunctionalColorsToggle({ enabled, onToggle }: FunctionalColorsToggleProps) {
  // Apply/remove the class on document root
  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add('aether-functional-on');
    } else {
      root.classList.remove('aether-functional-on');
    }
  }, [enabled]);

  return (
    <motion.button
      whileHover={{ scale: 1 + 1 / (PHI * 10) }}
      whileTap={{ scale: 1 - 1 / (PHI * 10) }}
      onClick={() => onToggle(!enabled)}
      className="relative flex items-center gap-[5px] px-[8px] py-[3px] rounded-[13px] aether-transition-colors"
      style={{
        background: enabled ? 'hsla(270, 85%, 72%, 0.055)' : 'var(--aether-l3)',
        border: `1px solid ${enabled ? 'hsla(270, 85%, 72%, 0.233)' : 'var(--aether-border-default)'}`,
        color: enabled ? 'var(--aether-accent)' : 'var(--aether-text-ghost)',
      }}
      title={enabled ? 'Functional colors ON — Click to return to pure darkness' : 'Enable functional colors'}
    >
      {/* Color spectrum indicator */}
      <div className="relative w-[13px] h-[13px] flex-shrink-0">
        <AnimatePresence mode="wait">
          {enabled ? (
            <motion.svg
              key="on"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: DURATION.fast / 1000 }}
              width="13"
              height="13"
              viewBox="0 0 13 13"
            >
              {/* Golden angle hue wheel */}
              {[0, 1, 2, 3, 4, 5].map(i => {
                const hue = (i * 137.508) % 360;
                const angle = (i / 6) * 360;
                return (
                  <circle
                    key={i}
                    cx="6.5"
                    cy="6.5"
                    r={2 + i * 0.5}
                    fill="none"
                    stroke={`hsl(${hue}, 70%, 60%)`}
                    strokeWidth="1"
                    strokeDasharray={`${1.618} ${1.618}`}
                    strokeDashoffset={angle / 360 * 13}
                    opacity={0.855}
                  />
                );
              })}
            </motion.svg>
          ) : (
            <motion.div
              key="off"
              initial={{ opacity: 0, scale: 1 / PHI }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 / PHI }}
              transition={{ duration: DURATION.fast / 1000 }}
              className="w-[13px] h-[13px] rounded-full"
              style={{
                background: 'var(--aether-l5)',
                border: '1px solid var(--aether-border-default)',
              }}
            >
              <div className="w-full h-full rounded-full" style={{ background: 'var(--aether-text-ghost)', opacity: 0.377 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-[8px] font-bold uppercase tracking-[0.1em]">
        {enabled ? 'Colors On' : 'Pure Dark'}
      </span>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SEARCH PANEL — Fibonacci-grid file/content search
// ═══════════════════════════════════════════════════════════════════

interface SearchResult {
  id: string;
  label: string;
  path: string;
  preview?: string;
  line?: number;
}

interface SearchPanelProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
}

export function SearchPanel({ results, onSelect }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(0);

  const filtered = results.filter(r =>
    r.label.toLowerCase().includes(query.toLowerCase()) ||
    r.path.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--aether-l1)' }}>
      {/* Search input */}
      <div className="p-[8px]" style={{ borderBottom: '1px solid var(--aether-border-subtle)' }}>
        <input
          autoFocus
          value={query}
          onChange={(e) => { setQuery(e.target.value); setFocused(0); }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(f + 1, filtered.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
            if (e.key === 'Enter' && filtered[focused]) { onSelect(filtered[focused]); }
          }}
          placeholder="Search files, symbols, content…"
          className="w-full px-[8px] py-[5px] text-[11px] rounded-[8px] outline-none aether-transition-colors aether-mono"
          style={{
            background: 'var(--aether-l3)',
            color: 'var(--aether-text-primary)',
            border: '1px solid var(--aether-border-default)',
          }}
        />
      </div>
      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--aether-text-ghost)' }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.377, 0.610, 0.377] }}
              transition={{ duration: DURATION.smooth / 1000, repeat: Infinity }}
              className="text-[13px] mb-[3px]"
            >
              ⊘
            </motion.div>
            <span className="text-[8px] uppercase tracking-[0.15em]">No results</span>
          </div>
        ) : (
          filtered.map((result, i) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.013 }}
              onClick={() => onSelect(result)}
              onMouseEnter={() => setFocused(i)}
              className="flex items-center gap-[8px] px-[13px] py-[3px] cursor-pointer aether-transition-colors"
              style={{
                background: i === focused ? 'var(--aether-l4)' : 'transparent',
                borderLeft: i === focused ? '2px solid var(--aether-accent, var(--aether-text-primary))' : '2px solid transparent',
              }}
            >
              <span className="text-[10px]" style={{ color: 'var(--aether-text-ghost)' }}>⌕</span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] truncate" style={{ color: 'var(--aether-text-primary)' }}>{result.label}</div>
                <div className="text-[8px] truncate aether-mono" style={{ color: 'var(--aether-text-ghost)' }}>{result.path}</div>
              </div>
              {result.line !== undefined && (
                <span className="text-[8px] aether-mono" style={{ color: 'var(--aether-text-ghost)' }}>:{result.line}</span>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DIAGNOSTICS PANEL — Fibonacci-listed problems
// ═══════════════════════════════════════════════════════════════════

interface DiagnosticItem {
  id: string;
  file: string;
  line: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface DiagnosticsPanelProps {
  diagnostics: DiagnosticItem[];
  onSelect: (d: DiagnosticItem) => void;
}

export function DiagnosticsPanel({ diagnostics, onSelect }: DiagnosticsPanelProps) {
  const errors = diagnostics.filter(d => d.severity === 'error');
  const warnings = diagnostics.filter(d => d.severity === 'warning');
  const infos = diagnostics.filter(d => d.severity === 'info');

  const severityIcon = { error: '✕', warning: '⚠', info: 'ℹ' };
  const severityColor = {
    error: 'var(--aether-danger)',
    warning: 'var(--aether-warning)',
    info: 'var(--aether-info)',
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--aether-l1)' }}>
      {/* Summary */}
      <div className="flex items-center gap-[13px] px-[13px] py-[8px] flex-shrink-0" style={{ borderBottom: '1px solid var(--aether-border-subtle)' }}>
        <span className="text-[8px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--aether-text-ghost)' }}>Problems</span>
        <div className="flex items-center gap-[8px] ml-auto">
          {errors.length > 0 && (
            <span className="flex items-center gap-[3px] text-[8px]" style={{ color: severityColor.error }}>
              <span className="w-[3px] h-[3px] rounded-full" style={{ background: severityColor.error }} />
              {errors.length}
            </span>
          )}
          {warnings.length > 0 && (
            <span className="flex items-center gap-[3px] text-[8px]" style={{ color: severityColor.warning }}>
              <span className="w-[3px] h-[3px] rounded-full" style={{ background: severityColor.warning }} />
              {warnings.length}
            </span>
          )}
          {infos.length > 0 && (
            <span className="flex items-center gap-[3px] text-[8px]" style={{ color: severityColor.info }}>
              <span className="w-[3px] h-[3px] rounded-full" style={{ background: severityColor.info }} />
              {infos.length}
            </span>
          )}
        </div>
      </div>
      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {diagnostics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--aether-text-ghost)' }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: DURATION.smooth / 1000, repeat: Infinity }}
              className="text-[13px] mb-[3px]"
            >
              ✓
            </motion.div>
            <span className="text-[8px] uppercase tracking-[0.15em]">No problems</span>
          </div>
        ) : (
          diagnostics.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.013 }}
              onClick={() => onSelect(d)}
              className="flex items-start gap-[8px] px-[13px] py-[3px] cursor-pointer aether-transition-colors"
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--aether-l4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span className="text-[10px] flex-shrink-0 mt-[1px]" style={{ color: severityColor[d.severity] }}>
                {severityIcon[d.severity]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] truncate" style={{ color: 'var(--aether-text-secondary)' }}>{d.message}</div>
                <div className="text-[8px] truncate aether-mono" style={{ color: 'var(--aether-text-ghost)' }}>{d.file}:{d.line}</div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GIT PANEL — Branch visualization with Fibonacci tree
// ═══════════════════════════════════════════════════════════════════

interface GitChange {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed';
}

interface GitPanelProps {
  branch: string;
  changes: GitChange[];
  onSelect: (change: GitChange) => void;
}

export function GitPanel({ branch, changes, onSelect }: GitPanelProps) {
  const statusIcon = { modified: 'M', added: 'A', deleted: 'D', renamed: 'R' };
  const statusColor = {
    modified: 'var(--aether-warning)',
    added: 'var(--aether-success)',
    deleted: 'var(--aether-danger)',
    renamed: 'var(--aether-info)',
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--aether-l1)' }}>
      {/* Branch header */}
      <div className="px-[13px] py-[8px] flex-shrink-0" style={{ borderBottom: '1px solid var(--aether-border-subtle)' }}>
        <div className="flex items-center gap-[5px]">
          <motion.span
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: DURATION.smooth / 1000, repeat: Infinity }}
            className="text-[10px]"
            style={{ color: 'var(--aether-success)' }}
          >
            ⎇
          </motion.span>
          <span className="text-[10px] aether-mono" style={{ color: 'var(--aether-text-secondary)' }}>{branch}</span>
          <span className="ml-auto text-[8px] px-[3px] py-[1px] rounded-[3px]" style={{ background: 'var(--aether-l4)', color: 'var(--aether-text-ghost)' }}>
            {changes.length}
          </span>
        </div>
      </div>
      {/* Changes */}
      <div className="flex-1 overflow-y-auto">
        {changes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--aether-text-ghost)' }}>
            <span className="text-[13px] mb-[3px]">✓</span>
            <span className="text-[8px] uppercase tracking-[0.15em]">Clean tree</span>
          </div>
        ) : (
          changes.map((change, i) => (
            <motion.div
              key={change.path}
              initial={{ opacity: 0, x: -3 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.013 }}
              onClick={() => onSelect(change)}
              className="flex items-center gap-[5px] px-[13px] py-[2px] cursor-pointer aether-transition-colors group"
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--aether-l4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span className="text-[9px] font-bold aether-mono w-[8px] flex-shrink-0" style={{ color: statusColor[change.status] }}>
                {statusIcon[change.status]}
              </span>
              <span className="text-[10px] truncate flex-1" style={{ color: 'var(--aether-text-secondary)' }}>
                {change.path}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DEBUG PANEL — Fibonacci-stacked call frames
// ═══════════════════════════════════════════════════════════════════

interface StackFrame {
  id: string;
  function: string;
  file: string;
  line: number;
}

interface DebugPanelProps {
  frames: StackFrame[];
  variables?: { name: string; value: string; type: string }[];
  onSelect: (frame: StackFrame) => void;
}

export function DebugPanel({ frames, variables = [], onSelect }: DebugPanelProps) {
  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--aether-l1)' }}>
      <div className="px-[13px] py-[8px] flex-shrink-0" style={{ borderBottom: '1px solid var(--aether-border-subtle)' }}>
        <span className="text-[8px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--aether-text-ghost)' }}>Call Stack</span>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: '50%' }}>
        {frames.map((frame, i) => (
          <motion.div
            key={frame.id}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.013 }}
            onClick={() => onSelect(frame)}
            className="px-[13px] py-[3px] cursor-pointer aether-transition-colors"
            style={{
              borderLeft: i === 0 ? '2px solid var(--aether-warning)' : '2px solid transparent',
              background: i === 0 ? 'hsla(38, 85%, 58%, 0.021)' : 'transparent',
            }}
            onMouseEnter={(e) => { if (i !== 0) e.currentTarget.style.background = 'var(--aether-l4)'; }}
            onMouseLeave={(e) => { if (i !== 0) e.currentTarget.style.background = 'transparent'; }}
          >
            <div className="text-[10px] aether-mono" style={{ color: 'var(--aether-text-secondary)' }}>{frame.function}</div>
            <div className="text-[8px] aether-mono" style={{ color: 'var(--aether-text-ghost)' }}>{frame.file}:{frame.line}</div>
          </motion.div>
        ))}
      </div>
      {variables.length > 0 && (
        <>
          <div className="px-[13px] py-[5px] flex-shrink-0" style={{ borderTop: '1px solid var(--aether-border-subtle)', borderBottom: '1px solid var(--aether-border-subtle)' }}>
            <span className="text-[8px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--aether-text-ghost)' }}>Variables</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {variables.map((v, i) => (
              <div key={i} className="flex items-center gap-[5px] px-[13px] py-[2px]">
                <span className="text-[10px] aether-mono" style={{ color: 'var(--aether-info)' }}>{v.name}</span>
                <span className="text-[8px]" style={{ color: 'var(--aether-text-ghost)' }}>=</span>
                <span className="text-[10px] aether-mono truncate flex-1" style={{ color: 'var(--aether-text-secondary)' }}>{v.value}</span>
                <span className="text-[8px] aether-mono" style={{ color: 'var(--aether-text-ghost)' }}>{v.type}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PLUGIN PANEL — Fibonacci-grid extension marketplace
// ═══════════════════════════════════════════════════════════════════

interface PluginItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon?: string;
}

interface PluginPanelProps {
  plugins: PluginItem[];
  onToggle: (id: string) => void;
}

export function PluginPanel({ plugins, onToggle }: PluginPanelProps) {
  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--aether-l1)' }}>
      <div className="px-[13px] py-[8px] flex-shrink-0" style={{ borderBottom: '1px solid var(--aether-border-subtle)' }}>
        <span className="text-[8px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--aether-text-ghost)' }}>Extensions</span>
      </div>
      <div className="flex-1 overflow-y-auto p-[8px] flex flex-col gap-[5px]">
        {plugins.map((plugin, i) => (
          <motion.div
            key={plugin.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.013 }}
            className="flex items-center gap-[8px] p-[8px] rounded-[8px] aether-transition-colors group"
            style={{ background: 'var(--aether-l3)', border: '1px solid var(--aether-border-subtle)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--aether-border-accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--aether-border-subtle)'; }}
          >
            <div className="w-[21px] h-[21px] rounded-[8px] flex items-center justify-center text-[10px] flex-shrink-0" style={{ background: 'var(--aether-l4)', color: 'var(--aether-text-ghost)' }}>
              {plugin.icon || '⬡'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium truncate" style={{ color: 'var(--aether-text-primary)' }}>{plugin.name}</div>
              <div className="text-[8px] truncate" style={{ color: 'var(--aether-text-ghost)' }}>{plugin.description}</div>
            </div>
            {/* Toggle switch */}
            <button
              onClick={() => onToggle(plugin.id)}
              className="relative w-[21px] h-[8px] rounded-[13px] aether-transition-colors flex-shrink-0"
              style={{ background: plugin.enabled ? 'var(--aether-accent, var(--aether-text-primary))' : 'var(--aether-l5)' }}
            >
              <motion.span
                layout
                className="absolute top-[1px] w-[5px] h-[5px] rounded-full"
                style={{
                  background: plugin.enabled ? 'var(--aether-l0)' : 'var(--aether-text-ghost)',
                  left: plugin.enabled ? '14px' : '2px',
                }}
              />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS OVERLAY
// ═══════════════════════════════════════════════════════════════════

interface ShortcutItem {
  keys: string[];
  description: string;
  category: string;
}

interface KeyboardShortcutsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutItem[];
}

export function KeyboardShortcutsOverlay({ isOpen, onClose, shortcuts }: KeyboardShortcutsOverlayProps) {
  const categories = [...new Set(shortcuts.map(s => s.category))];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[34] flex items-center justify-center"
          style={{ background: 'hsla(260, 50%, 0%, 0.610)', backdropFilter: 'blur(8px) saturate(1.618)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 1 / PHI, y: 13 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1 / PHI, y: 13 }}
            transition={{ duration: DURATION.normal / 1000, ease: [0.618, 0, 0.618, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="aether-glass rounded-[21px] p-[21px] grid grid-cols-2 gap-[21px]"
            style={{ width: '610px', maxWidth: '90vw', maxHeight: '80vh', overflow: 'auto', background: 'var(--aether-gradient-surface)' }}
          >
            {categories.map(cat => (
              <div key={cat}>
                <h3 className="text-[8px] font-bold uppercase tracking-[0.15em] mb-[8px] aether-gradient-text">{cat}</h3>
                <div className="flex flex-col gap-[5px]">
                  {shortcuts.filter(s => s.category === cat).map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-[13px]">
                      <span className="text-[10px]" style={{ color: 'var(--aether-text-secondary)' }}>{s.description}</span>
                      <div className="flex gap-[2px]">
                        {s.keys.map((key, ki) => (
                          <kbd
                            key={ki}
                            className="px-[5px] py-[1px] text-[8px] aether-mono rounded-[3px]"
                            style={{
                              background: 'var(--aether-l4)',
                              border: '1px solid var(--aether-border-default)',
                              color: 'var(--aether-text-secondary)',
                            }}
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}