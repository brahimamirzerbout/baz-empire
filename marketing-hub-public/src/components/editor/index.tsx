import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PHI, DURATION, RADIUS, MOTION } from '../../styles/aether-design-system';

// ═══════════════════════════════════════════════════════════════════
// DIFF VIEWER — Fibonacci-aligned side-by-side or unified diff
// ═══════════════════════════════════════════════════════════════════

export interface DiffLine {
  type: 'added' | 'removed' | 'context' | 'hunk';
  oldLineNo?: number;
  newLineNo?: number;
  content: string;
}

interface DiffViewerProps {
  lines: DiffLine[];
  filename?: string;
}

export function DiffViewer({ lines, filename }: DiffViewerProps) {
  const lineColors = {
    added:    { bg: 'hsla(145, 70%, 55%, 0.021)', text: 'var(--aether-success)', prefix: '+' },
    removed:  { bg: 'hsla(8, 80%, 58%, 0.021)',   text: 'var(--aether-danger)',  prefix: '-' },
    context:  { bg: 'transparent',                   text: 'var(--aether-text-secondary)', prefix: ' ' },
    hunk:     { bg: 'hsla(210, 75%, 60%, 0.021)',  text: 'var(--aether-info)',    prefix: '@' },
  };

  return (
    <div className="flex flex-col h-full overflow-auto aether-mono text-[10px]" style={{ background: 'var(--aether-l0)' }}>
      {filename && (
        <div className="px-[13px] py-[5px] sticky top-0 z-[8]" style={{ background: 'var(--aether-l2)', borderBottom: '1px solid var(--aether-border-subtle)' }}>
          <span className="aether-gradient-text font-bold">{filename}</span>
        </div>
      )}
      {lines.map((line, i) => {
        const c = lineColors[line.type];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: line.type === 'added' ? 5 : line.type === 'removed' ? -5 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.008, duration: DURATION.swift / 1000 }}
            className="flex items-start px-[8px] py-[0px] leading-[16px]"
            style={{ background: c.bg }}
          >
            <span className="w-[21px] flex-shrink-0 text-right pr-[5px]" style={{ color: 'var(--aether-text-ghost)', opacity: 0.377 }}>
              {line.oldLineNo ?? ''}
            </span>
            <span className="w-[21px] flex-shrink-0 text-right pr-[5px]" style={{ color: 'var(--aether-text-ghost)', opacity: 0.377 }}>
              {line.newLineNo ?? ''}
            </span>
            <span className="w-[8px] flex-shrink-0 text-center" style={{ color: c.text }}>{c.prefix}</span>
            <span className="flex-1" style={{ color: c.text }}>{line.content}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CODE BLOCK — Syntax-highlighted code with Fibonacci line numbers
// ═══════════════════════════════════════════════════════════════════

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language, showLineNumbers = true }: CodeBlockProps) {
  const lines = code.split('\n');

  const highlightLine = (line: string): string => {
    return line
      // Keywords
      .replace(/\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|new|this|async|await|try|catch|throw|typeof|interface|type|enum)\b/g,
        '<span style="color: var(--aether-accent, #888)">$1</span>')
      // Types
      .replace(/\b(string|number|boolean|void|null|undefined|any|never|unknown|object)\b/g,
        '<span style="color: var(--aether-info)">$1</span>')
      // Strings
      .replace(/(['"`])(.*?)\1/g,
        '<span style="color: var(--aether-success)">$1$2$1</span>')
      // Comments
      .replace(/(\/\/.*$)/g,
        '<span style="color: var(--aether-text-ghost)">$1</span>')
      // Numbers
      .replace(/\b(\d+)\b/g,
        '<span style="color: var(--aether-warning)">$1</span>');
  };

  return (
    <div className="flex h-full overflow-auto aether-mono text-[10px] leading-[16px]" style={{ background: 'var(--aether-l0)' }}>
      {showLineNumbers && (
        <div className="flex-shrink-0 px-[8px] text-right select-none" style={{ color: 'var(--aether-text-ghost)', opacity: 0.377, borderRight: '1px solid var(--aether-border-subtle)' }}>
          {lines.map((_, i) => (
            <div key={i} style={{ height: '16px' }}>{i + 1}</div>
          ))}
        </div>
      )}
      <pre className="flex-1 p-[8px] whitespace-pre" style={{ color: 'var(--aether-text-secondary)' }}>
        {lines.map((line, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: highlightLine(line) || ' ' }} />
        ))}
      </pre>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MINIMAP — Fibonacci-scaled code overview
// ═══════════════════════════════════════════════════════════════════

interface MinimapProps {
  lines: string[];
  viewport?: { start: number; end: number };
  height?: number;
}

export function Minimap({ lines, viewport, height = 377 }: MinimapProps) {
  const scale = Math.max(1, lines.length / (height / 2));

  return (
    <div
      className="flex-shrink-0 overflow-hidden aether-mono"
      style={{ width: '34px', height: `${height}px`, background: 'var(--aether-l1)', borderLeft: '1px solid var(--aether-border-subtle)' }}
    >
      {lines.filter((_, i) => i % Math.ceil(scale) === 0).map((line, i) => {
        const inViewport = viewport && i >= viewport.start && i <= viewport.end;
        return (
          <div
            key={i}
            className="px-[1px] truncate"
            style={{
              height: '2px',
              fontSize: '2px',
              lineHeight: '2px',
              color: inViewport ? 'var(--aether-accent, var(--aether-text-secondary))' : 'var(--aether-text-ghost)',
              opacity: inViewport ? 0.610 : 0.233,
              background: line.trim() ? 'var(--aether-text-ghost)' : 'transparent',
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MERMAID RENDERER — Placeholder for diagram rendering
// ═══════════════════════════════════════════════════════════════════

interface MermaidRendererProps {
  diagram: string;
}

export function MermaidRenderer({ diagram }: MermaidRendererProps) {
  return (
    <div className="flex items-center justify-center h-full" style={{ background: 'var(--aether-l0)' }}>
      <motion.div
        animate={{ scale: [1, 1.02, 1], opacity: [0.377, 0.610, 0.377] }}
        transition={{ duration: DURATION.smooth / 1000, repeat: Infinity }}
        className="text-center"
      >
        <div className="text-[13px] mb-[5px]" style={{ color: 'var(--aether-text-ghost)' }}> diagram</div>
        <pre className="aether-mono text-[8px]" style={{ color: 'var(--aether-text-ghost)' }}>{diagram.slice(0, 144)}…</pre>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DATASET BROWSER — Fibonacci-paginated dataset list
// ═══════════════════════════════════════════════════════════════════

interface DatasetEntry {
  id: string;
  name: string;
  description: string;
  size: string;
  downloads: number;
  status: 'available' | 'downloading' | 'indexing' | 'ready' | 'error';
}

interface DatasetBrowserProps {
  datasets: DatasetEntry[];
  onSelect: (dataset: DatasetEntry) => void;
}

export function DatasetBrowser({ datasets, onSelect }: DatasetBrowserProps) {
  const statusColor = {
    available:   'var(--aether-text-ghost)',
    downloading:  'var(--aether-info)',
    indexing:     'var(--aether-accent, var(--aether-text-primary))',
    ready:        'var(--aether-success)',
    error:        'var(--aether-danger)',
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--aether-l1)' }}>
      <div className="px-[13px] py-[8px] flex-shrink-0" style={{ borderBottom: '1px solid var(--aether-border-subtle)' }}>
        <span className="text-[8px] font-bold uppercase tracking-[0.15em] aether-gradient-text">Datasets</span>
      </div>
      <div className="flex-1 overflow-y-auto p-[8px] flex flex-col gap-[5px]">
        {datasets.map((ds, i) => (
          <motion.div
            key={ds.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.013 }}
            onClick={() => onSelect(ds)}
            className="p-[8px] rounded-[8px] cursor-pointer aether-transition-colors"
            style={{ background: 'var(--aether-l3)', border: '1px solid var(--aether-border-subtle)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--aether-border-accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--aether-border-subtle)'; }}
          >
            <div className="flex items-center gap-[5px] mb-[3px]">
              <span className="text-[10px] font-medium truncate" style={{ color: 'var(--aether-text-primary)' }}>{ds.name}</span>
              <motion.span
                animate={ds.status === 'downloading' || ds.status === 'indexing' ? { opacity: [0.377, 1, 0.377] } : {}}
                transition={{ duration: DURATION.smooth / 1000, repeat: Infinity }}
                className="w-[3px] h-[3px] rounded-full flex-shrink-0"
                style={{ background: statusColor[ds.status] }}
              />
              <span className="ml-auto text-[8px] aether-mono" style={{ color: 'var(--aether-text-ghost)' }}>{ds.size}</span>
            </div>
            <div className="text-[8px] truncate" style={{ color: 'var(--aether-text-ghost)' }}>{ds.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FILE UPLOAD ZONE — Drag-and-drop with Fibonacci pulse
// ═══════════════════════════════════════════════════════════════════

interface FileUploadZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  label?: string;
}

export function FileUploadZone({ onFiles, accept = '*', label = 'Drop files or click to upload' }: FileUploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length > 0) onFiles(Array.from(e.dataTransfer.files));
      }}
      onClick={() => inputRef.current?.click()}
      className="flex flex-col items-center justify-center cursor-pointer aether-transition-colors"
      style={{
        minHeight: '144px',
        border: `2px dashed ${dragging ? 'var(--aether-accent, var(--aether-text-primary))' : 'var(--aether-border-default)'}`,
        background: dragging ? 'var(--aether-accent-bg, var(--aether-l4))' : 'var(--aether-l2)',
        borderRadius: `${RADIUS.xl}px`,
      }}
    >
      <input ref={inputRef} type="file" accept={accept} multiple className="hidden" onChange={(e) => { if (e.target.files) onFiles(Array.from(e.target.files)); }} />
      <motion.div
        animate={dragging ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: DURATION.normal / 1000, repeat: Infinity }}
        className="text-[21px] mb-[8px]"
        style={{ color: dragging ? 'var(--aether-accent, var(--aether-text-primary))' : 'var(--aether-text-ghost)' }}
      >
        ↑
      </motion.div>
      <span className="text-[11px]" style={{ color: 'var(--aether-text-secondary)' }}>{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATION CENTER — Fibonacci-stacked notification history
// ═══════════════════════════════════════════════════════════════════

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'danger';
  read: boolean;
}

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
  onClear: () => void;
}

export function NotificationCenter({ notifications, onDismiss, onClear }: NotificationCenterProps) {
  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--aether-gradient-surface)' }}>
      <div className="flex items-center justify-between px-[13px] py-[8px] flex-shrink-0" style={{ borderBottom: '1px solid var(--aether-border-subtle)' }}>
        <span className="text-[8px] font-bold uppercase tracking-[0.15em] aether-gradient-text">Notifications</span>
        {notifications.length > 0 && (
          <button onClick={onClear} className="text-[8px] aether-transition-colors" style={{ color: 'var(--aether-text-ghost)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--aether-text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--aether-text-ghost)'; }}
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--aether-text-ghost)' }}>
            <span className="text-[13px] mb-[3px]">∅</span>
            <span className="text-[8px] uppercase tracking-[0.15em]">No notifications</span>
          </div>
        ) : (
          notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 21 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 21 }}
              transition={{ delay: i * 0.013 }}
              className="px-[13px] py-[8px] aether-transition-colors"
              style={{
                borderBottom: '1px solid var(--aether-border-subtle)',
                background: n.read ? 'transparent' : 'rgba(100, 100, 100, 0.008)',
              }}
            >
              <div className="flex items-start gap-[8px]">
                {!n.read && (
                  <motion.span
                    animate={{ scale: [1, 1.236, 1] }}
                    transition={{ duration: DURATION.smooth / 1000, repeat: Infinity }}
                    className="w-[3px] h-[3px] rounded-full mt-[5px] flex-shrink-0"
                    style={{ background: 'var(--aether-accent, var(--aether-text-primary))' }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium" style={{ color: 'var(--aether-text-primary)' }}>{n.title}</div>
                  <div className="text-[8px] mt-[1px]" style={{ color: 'var(--aether-text-tertiary)' }}>{n.message}</div>
                  <div className="text-[8px] mt-[2px] aether-mono" style={{ color: 'var(--aether-text-ghost)' }}>
                    {n.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <button onClick={() => onDismiss(n.id)} className="flex-shrink-0 text-[10px]" style={{ color: 'var(--aether-text-ghost)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--aether-text-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--aether-text-ghost)'; }}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}