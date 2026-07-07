'use client';

/**
 * BAZ Live Signature Smokescreen
 *
 * Luxury animated document headers and footers that feel alive on screen
 * but render beautifully on paper via @media print.
 *
 * Æther Design System:
 *   - Violet accent hsl(270,85%,72%) = #b87adb
 *   - Dark void #0a0a0d through ink #faf9fa (8 layers)
 *   - Fibonacci spacing: 3, 5, 8, 13, 21, 34, 55, 89
 *   - Golden-ratio easing: cubic-bezier(0.618, 0, 0.618, 1)
 *   - Fibonacci durations: 89ms, 144ms, 233ms, 377ms, 610ms
 *
 * Animation layers:
 *   1. Accent line sweep — violet beam crosses the header/footer
 *   2. Dot grid pulse — Fibonacci-spaced dots breathe subtly
 *   3. Shimmer gradient — diagonal light sweep across the brand area
 *   4. Brand mark fade — BAZ wordmark appears with a cinematic hold
 *   5. Counter tick — subtle number animation on dates/references
 */

import { useEffect, useRef, useState } from 'react';

/* ─── Token Constants ─── */

const T = {
  accent: '#b87adb',
  accentRGB: '184, 122, 219',
  void: '#0a0a0d',
  shadow: '#16141c',
  surface: '#211e28',
  card: '#2d2a35',
  raised: '#3a3644',
  hover: '#4b4559',
  focus: '#524d64',
  muted: '#6e6879',
  ink: '#faf9fa',
  ink2: '#a4a0ab',
  success: '#4ade80',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#60a5fa',

  fontDisplay: "'Fraunces', Georgia, serif",
  fontBody: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontMono: "'JetBrains Mono', monospace",

  ease: 'cubic-bezier(0.618, 0, 0.618, 1)',
  easeOut: 'cubic-bezier(0, 0.618, 0.382, 1)',
  easeBounce: 'cubic-bezier(0.618, -0.618, 0.382, 1.618)',

  d89: '89ms',
  d144: '144ms',
  d233: '233ms',
  d377: '377ms',
  d610: '610ms',
} as const;

/* ─── CSS Keyframes (injected once) ─── */

const SMOKESCREEN_CSS = `
@keyframes baz-sweep {
  0%   { transform: translateX(-110%); opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { transform: translateX(110%); opacity: 0; }
}

@keyframes baz-pulse {
  0%, 100% { opacity: 0.144; }
  50%      { opacity: 0.377; }
}

@keyframes baz-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes baz-fade-in {
  0%   { opacity: 0; transform: translateY(3px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes baz-counter {
  0%   { opacity: 0; transform: translateY(5px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes baz-line-grow {
  0%   { width: 0; }
  100% { width: 100%; }
}

@keyframes baz-dot-appear {
  0%   { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes baz-glow-breathe {
  0%, 100% { box-shadow: 0 0 0 0 rgba(${T.accentRGB}, 0); }
  50%      { box-shadow: 0 0 21px 3px rgba(${T.accentRGB}, 0.15); }
}

.baz-smokescreen-header {
  position: relative;
  overflow: hidden;
  border-bottom: 2px solid ${T.accent};
}

.baz-smokescreen-header::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background:
    repeating-linear-gradient(
      -15deg,
      transparent,
      transparent 7px,
      rgba(${T.accentRGB}, 0.023) 7px,
      rgba(${T.accentRGB}, 0.023) 8px
    );
  pointer-events: none;
}

.baz-smokescreen-footer {
  position: relative;
  overflow: hidden;
  border-top: 1px solid ${T.raised};
}

.baz-smokescreen-footer::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background:
    repeating-linear-gradient(
      15deg,
      transparent,
      transparent 13px,
      rgba(${T.accentRGB}, 0.015) 13px,
      rgba(${T.accentRGB}, 0.015) 14px
    );
  pointer-events: none;
}

.baz-sweep-beam {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(${T.accentRGB}, 0.06) 40%,
    rgba(${T.accentRGB}, 0.12) 50%,
    rgba(${T.accentRGB}, 0.06) 60%,
    transparent 100%
  );
  animation: baz-sweep 8s ${T.ease} infinite;
  pointer-events: none;
}

.baz-sweep-beam-footer {
  animation: baz-sweep 12s ${T.ease} infinite;
  animation-delay: 4s;
}

.baz-shimmer-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(
    105deg,
    transparent 0%,
    transparent 35%,
    rgba(${T.accentRGB}, 0.04) 45%,
    rgba(${T.accentRGB}, 0.08) 50%,
    rgba(${T.accentRGB}, 0.04) 55%,
    transparent 65%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: baz-shimmer 6s ${T.ease} infinite;
  pointer-events: none;
}

.baz-brand-mark {
  animation: baz-fade-in ${T.d377} ${T.ease} both;
}

.baz-dot-grid {
  display: flex;
  gap: 5px;
  align-items: center;
}

.baz-dot-grid .dot {
  width: 3px; height: 3px;
  border-radius: 50%;
  background: ${T.accent};
  animation: baz-pulse 3s ${T.ease} infinite;
}
.baz-dot-grid .dot:nth-child(1) { animation-delay: 0s; }
.baz-dot-grid .dot:nth-child(2) { animation-delay: 0.377s; }
.baz-dot-grid .dot:nth-child(3) { animation-delay: 0.618s; }
.baz-dot-grid .dot:nth-child(4) { animation-delay: 1s; }
.baz-dot-grid .dot:nth-child(5) { animation-delay: 1.618s; }

.baz-accent-line {
  height: 2px;
  background: linear-gradient(90deg, ${T.accent}, ${T.accent}80, ${T.accent});
  animation: baz-line-grow ${T.d610} ${T.ease} both;
  transform-origin: left;
}

.baz-glow-ring {
  animation: baz-glow-breathe 4s ${T.ease} infinite;
}

.baz-ref-number {
  font-family: ${T.fontMono};
  font-variant-numeric: tabular-nums;
  animation: baz-counter ${T.d233} ${T.ease} both;
  animation-delay: ${T.d377};
}

@media print {
  .baz-sweep-beam,
  .baz-shimmer-overlay,
  .baz-smokescreen-header::before,
  .baz-smokescreen-footer::before {
    display: none !important;
  }
  .baz-dot-grid .dot {
    animation: none !important;
    opacity: 0.377 !important;
  }
  .baz-glow-ring {
    animation: none !important;
    box-shadow: none !important;
  }
  .baz-brand-mark {
    animation: none !important;
    opacity: 1 !important;
  }
  .baz-accent-line {
    animation: none !important;
    width: 100% !important;
  }
  .baz-ref-number {
    animation: none !important;
    opacity: 1 !important;
  }
}
`;

let cssInjected = false;

function injectSmokescreenCSS() {
  if (typeof document === 'undefined' || cssInjected) return;
  const style = document.createElement('style');
  style.id = 'baz-smokescreen-css';
  style.textContent = SMOKESCREEN_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

/* ─── Dot Grid ─── */

function DotGrid({ count = 5 }: { count?: number }) {
  return (
    <div className="baz-dot-grid">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="dot" />
      ))}
    </div>
  );
}

/* ─── Live Header ─── */

export interface LiveHeaderProps {
  docType?: string;
  referenceNumber?: string;
  referenceDate?: string;
  clientName?: string;
  status?: string;
  statusColor?: string;
  compact?: boolean;
}

export function LiveHeader({
  docType = 'DOCUMENT',
  referenceNumber,
  referenceDate,
  clientName,
  status,
  statusColor = T.accent,
  compact = false,
}: LiveHeaderProps) {
  useEffect(() => { injectSmokescreenCSS(); }, []);

  return (
    <header className="baz-smokescreen-header" style={{ padding: compact ? '13px 21px' : '21px 34px' }}>
      {/* Animated sweep beam */}
      <div className="baz-sweep-beam" />

      {/* Shimmer overlay */}
      <div className="baz-shimmer-overlay" />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {/* Left: Brand mark */}
        <div className="baz-brand-mark">
          <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
            {/* BAZ wordmark */}
            <div>
              <div style={{
                fontFamily: T.fontDisplay,
                fontSize: compact ? '18pt' : '24pt',
                fontWeight: 700,
                color: T.accent,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                BAZ
              </div>
              <div style={{
                fontFamily: T.fontMono,
                fontSize: compact ? '5.5pt' : '7pt',
                color: T.muted,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginTop: compact ? '1px' : '3px',
              }}>
                Growth Partner
              </div>
            </div>

            {/* Separator */}
            <div style={{
              width: '1px',
              height: compact ? '21px' : '34px',
              background: `linear-gradient(180deg, ${T.accent}55, ${T.accent}15)`,
            }} />

            {/* Doc type badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: `${T.accent}14`,
              border: `1px solid ${T.accent}3d`,
              borderRadius: '5px',
              padding: compact ? '3px 8px' : '3px 13px',
            }}>
              <div style={{
                fontFamily: T.fontMono,
                fontSize: compact ? '6pt' : '7.5pt',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: T.accent,
              }}>
                {docType}
              </div>
              <DotGrid count={3} />
            </div>
          </div>
        </div>

        {/* Right: Reference info */}
        <div style={{ textAlign: 'right' }}>
          {referenceNumber && (
            <div className="baz-ref-number" style={{
              fontFamily: T.fontMono,
              fontSize: compact ? '8pt' : '10pt',
              fontWeight: 600,
              color: T.ink,
            }}>
              {referenceNumber}
            </div>
          )}
          {referenceDate && (
            <div style={{
              fontFamily: T.fontMono,
              fontSize: compact ? '6.5pt' : '7.5pt',
              color: T.muted,
              marginTop: '2px',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {referenceDate}
            </div>
          )}
          {clientName && (
            <div style={{
              fontFamily: T.fontBody,
              fontSize: compact ? '7.5pt' : '9pt',
              color: T.ink2,
              marginTop: '3px',
            }}>
              {clientName}
            </div>
          )}
          {status && (
            <div style={{
              display: 'inline-block',
              marginTop: '5px',
              fontFamily: T.fontMono,
              fontSize: compact ? '5.5pt' : '6.5pt',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: statusColor,
              background: `${statusColor}14`,
              border: `1px solid ${statusColor}3d`,
              borderRadius: '3px',
              padding: '2px 8px',
            }}>
              {status}
            </div>
          )}
        </div>
      </div>

      {/* Accent line */}
      <div className="baz-accent-line" style={{ marginTop: compact ? '8px' : '13px' }} />
    </header>
  );
}

/* ─── Live Footer ─── */

export interface LiveFooterProps {
  showDots?: boolean;
  compact?: boolean;
  customLine?: string;
}

export function LiveFooter({
  showDots = true,
  compact = false,
  customLine,
}: LiveFooterProps) {
  useEffect(() => { injectSmokescreenCSS(); }, []);

  return (
    <footer className="baz-smokescreen-footer" style={{ padding: compact ? '8px 21px' : '13px 34px' }}>
      {/* Animated sweep beam (slower for footer) */}
      <div className="baz-sweep-beam baz-sweep-beam-footer" />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: Company info */}
        <div style={{
          fontFamily: T.fontMono,
          fontSize: compact ? '5.5pt' : '6.5pt',
          color: T.muted,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.02em',
        }}>
          BAZ Marketing Agency · Remote-first · MENA · EU · US
        </div>

        {/* Center: Dots */}
        {showDots && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DotGrid count={5} />
          </div>
        )}

        {/* Right: Contact */}
        <div style={{
          fontFamily: T.fontMono,
          fontSize: compact ? '5.5pt' : '6.5pt',
          color: T.muted,
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {customLine || 'zerboutbrahimamir@gmail.com · baz.agency'}
        </div>
      </div>
    </footer>
  );
}

/* ─── Full Document Frame ─── */

export interface LiveDocumentFrameProps {
  docType: string;
  referenceNumber?: string;
  referenceDate?: string;
  clientName?: string;
  status?: string;
  statusColor?: string;
  footerLine?: string;
  children: React.ReactNode;
}

export function LiveDocumentFrame({
  docType,
  referenceNumber,
  referenceDate,
  clientName,
  status,
  statusColor,
  footerLine,
  children,
}: LiveDocumentFrameProps) {
  useEffect(() => { injectSmokescreenCSS(); }, []);

  return (
    <div style={{
      maxWidth: '210mm',
      margin: '0 auto',
      background: '#ffffff',
      borderRadius: '13px',
      overflow: 'hidden',
      boxShadow: '0 8px 55px rgba(0,0,0,0.15), 0 1px 8px rgba(0,0,0,0.08)',
    }}>
      <LiveHeader
        docType={docType}
        referenceNumber={referenceNumber}
        referenceDate={referenceDate}
        clientName={clientName}
        status={status}
        statusColor={statusColor}
      />
      <div style={{ padding: '34px' }}>
        {children}
      </div>
      <LiveFooter customLine={footerLine} />
    </div>
  );
}

/* ─── Animated Brand Divider ─── */

export function BrandDivider({ style }: { style?: React.CSSProperties }) {
  useEffect(() => { injectSmokescreenCSS(); }, []);

  return (
    <div style={{ position: 'relative', height: '2px', margin: '21px 0', ...style }}>
      <div className="baz-accent-line" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
      {/* Center diamond */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(45deg)',
        width: '5px',
        height: '5px',
        background: T.accent,
        borderRadius: '1px',
      }} />
    </div>
  );
}

/* ─── Section Label (anti-AI pattern: numbered indices + argument headlines) ─── */

export interface SectionLabelProps {
  index: number;
  title: string;
  subtitle?: string;
}

export function SectionLabel({ index, title, subtitle }: SectionLabelProps) {
  useEffect(() => { injectSmokescreenCSS(); }, []);

  return (
    <div style={{ marginBottom: '13px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
        <span style={{
          fontFamily: T.fontMono,
          fontSize: '7pt',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: T.accent,
        }}>
          [{String(index).padStart(2, '0')}]
        </span>
        <span style={{
          fontFamily: T.fontDisplay,
          fontSize: '12pt',
          fontWeight: 600,
          color: T.ink,
        }}>
          {title}
        </span>
      </div>
      {subtitle && (
        <div style={{
          fontFamily: T.fontBody,
          fontSize: '8.5pt',
          color: T.muted,
          marginLeft: '34px',
          lineHeight: 1.618,
        }}>
          {subtitle}
        </div>
      )}
      <div style={{
        marginTop: '5px',
        height: '1px',
        background: `linear-gradient(90deg, ${T.accent}3d, transparent)`,
      }} />
    </div>
  );
}

/* ─── Signature Block (dual signatures with animated underline) ─── */

export interface SignatureBlockProps {
  leftName: string;
  leftTitle: string;
  rightName: string;
  rightTitle: string;
  leftOrg?: string;
  rightOrg?: string;
}

export function SignatureBlock({ leftName, leftTitle, rightName, rightTitle, leftOrg, rightOrg }: SignatureBlockProps) {
  useEffect(() => { injectSmokescreenCSS(); }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '55px' }}>
      <div style={{ width: '45%' }}>
        <div style={{ height: '55px' }} />
        <div style={{ borderTop: `1px solid ${T.accent}`, paddingTop: '8px' }}>
          <div style={{ fontFamily: T.fontDisplay, fontSize: '11pt', fontWeight: 600, color: T.accent }}>
            {leftName}
          </div>
          <div style={{ fontFamily: T.fontMono, fontSize: '7.5pt', color: T.muted, marginTop: '2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {leftTitle}
          </div>
          {leftOrg && (
            <div style={{ fontFamily: T.fontMono, fontSize: '6.5pt', color: T.muted, marginTop: '1px' }}>
              {leftOrg}
            </div>
          )}
          <div style={{ fontFamily: T.fontMono, fontSize: '7pt', color: T.muted, marginTop: '5px', fontVariantNumeric: 'tabular-nums' }}>
            Date: _______________
          </div>
        </div>
      </div>
      <div style={{ width: '45%' }}>
        <div style={{ height: '55px' }} />
        <div style={{ borderTop: `1px solid ${T.accent}`, paddingTop: '8px' }}>
          <div style={{ fontFamily: T.fontDisplay, fontSize: '11pt', fontWeight: 600, color: T.ink }}>
            {rightName}
          </div>
          <div style={{ fontFamily: T.fontMono, fontSize: '7.5pt', color: T.muted, marginTop: '2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {rightTitle}
          </div>
          {rightOrg && (
            <div style={{ fontFamily: T.fontMono, fontSize: '6.5pt', color: T.muted, marginTop: '1px' }}>
              {rightOrg}
            </div>
          )}
          <div style={{ fontFamily: T.fontMono, fontSize: '7pt', color: T.muted, marginTop: '5px', fontVariantNumeric: 'tabular-nums' }}>
            Date: _______________
          </div>
        </div>
      </div>
    </div>
  );
}