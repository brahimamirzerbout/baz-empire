/**
 * BAZ Document Templates — HTML generation for:
 *   - Invoices (client-facing)
 *   - Proposals (client-facing)
 *   - Contracts (service agreements)
 *   - NDAs (non-disclosure agreements)
 *   - Business cards (front + back)
 *   - Letterhead (for any document)
 *   - Email signatures
 *   - Statement of Work
 *
 * All templates use the Æther Design System:
 *   - Accent: violet #b87adb (hsl(270,85%,72%))
 *   - Dark bg: #0a0a0d (for dark-mode docs)
 *   - Light bg: #ffffff (for print docs)
 *   - Fonts: Fraunces (display), Inter (body), JetBrains Mono (code)
 *   - Fibonacci radii: 3, 5, 8, 13, 21, 34
 *   - Fibonacci spacing: 3, 5, 8, 13, 21, 34
 *   - Golden-ratio line-height: 1.618
 *
 * Each function returns a complete HTML string that can be:
 *   1. Rendered in a browser
 *   2. Printed to PDF via Puppeteer/wkhtmltopdf
 *   3. Sent as an email attachment
 *   4. Embedded in the Marketing Hub UI
 */

import { brand, formatCurrency, formatDocDate, generateInvoiceNumber } from '@/lib/brand';

/* ──────────────────────────────────────────────────────────────────
   SHARED COMPONENTS
   ────────────────────────────────────────────────────────────────── */

function documentHead(title: string, extraCSS = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — ${brand.company.shortName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: '${brand.fontBody}', -apple-system, BlinkMacSystemFont, sans-serif;
      color: ${brand.void};
      background: white;
      line-height: 1.618;
      -webkit-font-smoothing: antialiased;
      font-size: 10.5pt;
    }
    h1, h2, h3, h4 { font-family: '${brand.fontDisplay}', Georgia, serif; }
    code, .mono { font-family: '${brand.fontMono}', monospace; }
    .accent { color: ${brand.accent}; }
    .accent-bg { background: ${brand.accent}; color: white; }
    .accent-soft { background: ${brand.accentSoft}; color: ${brand.accent}; }
    .muted { color: ${brand.muted}; }
    .ink { color: ${brand.ink}; }
    .border-line { border-color: ${brand.accent}3d; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px 13px; text-align: left; border-bottom: 1px solid ${brand.raised}; }
    th { font-family: '${brand.fontMono}', monospace; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.08em; color: ${brand.muted}; }
    td.mono { font-family: '${brand.fontMono}', monospace; font-variant-numeric: tabular-nums; }
    .page { max-width: 210mm; margin: 0 auto; padding: 21mm; }
    .signature-line { border-top: 1px solid ${brand.accent}; margin-top: 34px; padding-top: 8px; }
    .signature-block { display: flex; justify-content: space-between; margin-top: 55px; }
    .signature-box { width: 45%; }
    .signature-name { font-family: '${brand.fontDisplay}', serif; font-size: 11pt; color: ${brand.accent}; }
    .signature-title { font-size: 8.5pt; color: ${brand.muted}; margin-top: 2px; }
    .signature-date { font-family: '${brand.fontMono}', monospace; font-size: 8pt; color: ${brand.muted}; margin-top: 5px; }
    .watermark {
      position: fixed; top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-family: '${brand.fontDisplay}', serif;
      font-size: 120pt; color: ${brand.accent}; opacity: 0.03;
      pointer-events: none; z-index: -1;
    }
    /* ─── Live Smokescreen Animations ─── */
    @keyframes baz-sweep {
      0%   { transform: translateX(-110%); opacity: 0; }
      15%  { opacity: 1; }
      85%  { opacity: 1; }
      100% { transform: translateX(110%); opacity: 0; }
    }
    @keyframes baz-line-grow {
      0%   { width: 0; }
      100% { width: 100%; }
    }
    @keyframes baz-pulse {
      0%, 100% { opacity: 0.144; }
      50%      { opacity: 0.377; }
    }
    @keyframes baz-fade-in {
      0%   { opacity: 0; transform: translateY(3px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes baz-shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .baz-smokescreen-header {
      position: relative; overflow: hidden;
      border-bottom: 2px solid ${brand.accent};
    }
    .baz-smokescreen-header::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: repeating-linear-gradient(-15deg, transparent, transparent 7px, color-mix(in srgb, var(--accent), transparent 97.7%) 7px, color-mix(in srgb, var(--accent), transparent 97.7%) 8px);
      pointer-events: none;
    }
    .baz-sweep-beam {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--accent), transparent 94%) 40%, color-mix(in srgb, var(--accent), transparent 88%) 50%, color-mix(in srgb, var(--accent), transparent 94%) 60%, transparent 100%);
      animation: baz-sweep 8s cubic-bezier(0.618, 0, 0.618, 1) infinite;
      pointer-events: none;
    }
    .baz-smokescreen-footer {
      position: relative; overflow: hidden;
      border-top: 1px solid ${brand.raised};
    }
    .baz-smokescreen-footer .baz-sweep-beam {
      animation: baz-sweep 12s cubic-bezier(0.618, 0, 0.618, 1) infinite;
      animation-delay: 4s;
    }
    .baz-accent-line {
      height: 2px;
      background: linear-gradient(90deg, ${brand.accent}, ${brand.accent}80, ${brand.accent});
      animation: baz-line-grow 610ms cubic-bezier(0.618, 0, 0.618, 1) both;
      transform-origin: left;
    }
    .baz-brand-mark { animation: baz-fade-in 377ms cubic-bezier(0.618, 0, 0.618, 1) both; }
    .baz-ref-number {
      font-family: '${brand.fontMono}', monospace;
      font-variant-numeric: tabular-nums;
      animation: baz-fade-in 233ms cubic-bezier(0.618, 0, 0.618, 1) both;
      animation-delay: 377ms;
    }
    .baz-dot { animation: baz-pulse 3s cubic-bezier(0.618, 0, 0.618, 1) infinite; }
    @media print {
      .baz-sweep-beam, .baz-smokescreen-header::before { display: none !important; }
      .baz-dot { animation: none !important; opacity: 0.377 !important; }
      .baz-accent-line { animation: none !important; width: 100% !important; }
      .baz-brand-mark { animation: none !important; opacity: 1 !important; }
      .baz-ref-number { animation: none !important; opacity: 1 !important; }
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .page { padding: 0; max-width: none; }
    }
    ${extraCSS}
  </style>
</head>`;
}

function letterheadHeader(docType: string, refNumber?: string, refDate?: string): string {
  const refLine = refNumber ? `
          <div class="baz-ref-number" style="font-family: '${brand.fontMono}', monospace; font-size: 10pt; font-weight: 600; color: ${brand.ink}; margin-bottom: 5px;">${refNumber}</div>` : '';
  const dateLine = refDate ? `
          <div style="font-family: '${brand.fontMono}', monospace; font-size: 7.5pt; color: ${brand.muted}; font-variant-numeric: tabular-nums;">${refDate}</div>` : '';
  return `
  <!-- Live Smokescreen Header -->
  <header class="baz-smokescreen-header" style="margin-bottom: 34px; padding-bottom: 13px;">
    <!-- Sweep beam animation -->
    <div class="baz-sweep-beam"></div>
    <!-- Content -->
    <div style="position: relative; z-index: 1;">
      <table style="width: 100%; border: none;">
        <tr style="border: none;">
          <td style="border: none; padding: 0; vertical-align: bottom;">
            <div class="baz-brand-mark">
              <div style="font-family: '${brand.fontDisplay}', serif; font-size: 24pt; font-weight: 700; color: ${brand.accent}; line-height: 1;">
                BAZ
              </div>
              <div style="font-family: '${brand.fontMono}', monospace; font-size: 7.5pt; color: ${brand.muted}; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 3px;">
                Growth Partner · Strategy · Creative · Media · Revenue
              </div>
            </div>
          </td>
          <td style="border: none; padding: 0; text-align: right; vertical-align: bottom;">
            <!-- Doc type badge -->
            <div style="display: inline-flex; align-items: center; gap: 8px; background: ${brand.accentSoft}; border: 1px solid ${brand.accentGlow}; border-radius: 5px; padding: 3px 13px; margin-bottom: 8px;">
              <span style="font-family: '${brand.fontMono}', monospace; font-size: 7.5pt; letter-spacing: 0.12em; text-transform: uppercase; color: ${brand.accent};">${docType}</span>
              <span style="display: inline-flex; gap: 5px; align-items: center;">
                <span class="baz-dot" style="width: 3px; height: 3px; border-radius: 50%; background: ${brand.accent}; animation-delay: 0s;"></span>
                <span class="baz-dot" style="width: 3px; height: 3px; border-radius: 50%; background: ${brand.accent}; animation-delay: 0.377s;"></span>
                <span class="baz-dot" style="width: 3px; height: 3px; border-radius: 50%; background: ${brand.accent}; animation-delay: 0.618s;"></span>
              </span>
            </div>
            ${refLine}
            ${dateLine}
            <div style="font-size: 8pt; color: ${brand.muted}; line-height: 1.618; margin-top: 5px;">
              ${brand.company.email}<br>
              ${brand.company.website}<br>
              ${brand.company.address}
            </div>
          </td>
        </tr>
      </table>
    </div>
    <!-- Animated accent line -->
    <div class="baz-accent-line" style="margin-top: 13px;"></div>
  </header>`;
}

function letterheadFooter(): string {
  return `
  <!-- Live Smokescreen Footer -->
  <footer class="baz-smokescreen-footer" style="margin-top: 55px; padding-top: 13px;">
    <!-- Sweep beam animation (slower for footer) -->
    <div class="baz-sweep-beam" style="animation-duration: 12s; animation-delay: 4s;"></div>
    <div style="position: relative; z-index: 1;">
      <table style="width: 100%; border: none;">
        <tr style="border: none;">
          <td style="border: none; padding: 0; font-family: '${brand.fontMono}', monospace; font-variant-numeric: tabular-nums; font-size: 7pt; color: ${brand.muted};">
            ${brand.company.name} · ${brand.company.address}
          </td>
          <td style="border: none; padding: 0; text-align: right;">
            <span style="display: inline-flex; gap: 5px; align-items: center; margin-right: 13px;">
              <span class="baz-dot" style="width: 3px; height: 3px; border-radius: 50%; background: ${brand.accent}; animation-delay: 0s;"></span>
              <span class="baz-dot" style="width: 3px; height: 3px; border-radius: 50%; background: ${brand.accent}; animation-delay: 0.618s;"></span>
              <span class="baz-dot" style="width: 3px; height: 3px; border-radius: 50%; background: ${brand.accent}; animation-delay: 1.236s;"></span>
              <span class="baz-dot" style="width: 3px; height: 3px; border-radius: 50%; background: ${brand.accent}; animation-delay: 1.618s;"></span>
              <span class="baz-dot" style="width: 3px; height: 3px; border-radius: 50%; background: ${brand.accent}; animation-delay: 2s;"></span>
            </span>
            <span style="font-family: '${brand.fontMono}', monospace; font-variant-numeric: tabular-nums; font-size: 7pt; color: ${brand.muted};">
              ${brand.company.linkedin} · ${brand.company.twitter}
            </span>
          </td>
        </tr>
      </table>
    </div>
    <!-- Bottom accent line -->
    <div class="baz-accent-line" style="margin-top: 8px;"></div>
  </footer>`;
}

/* ──────────────────────────────────────────────────────────────────
   INVOICE
   ────────────────────────────────────────────────────────────────── */

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  currency?: string;
}

export interface InvoiceData {
  invoice_number: string;
  issue_date: number;
  due_date: number;
  client_name: string;
  client_address?: string;
  client_email?: string;
  project_name?: string;
  currency: string;
  line_items: InvoiceLineItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_rate: number;
  discount_amount: number;
  total: number;
  paid_amount: number;
  notes?: string;
  terms?: string;
}

export function generateInvoiceHTML(data: InvoiceData): string {
  const status = data.paid_amount >= data.total ? 'PAID' : data.paid_amount > 0 ? 'PARTIALLY PAID' : 'DUE';
  const statusColor = status === 'PAID' ? brand.success : status === 'DUE' ? brand.danger : brand.warning;

  const rows = data.line_items.map(item => `
    <tr>
      <td>${item.description}</td>
      <td class="mono" style="text-align: right;">${item.quantity}</td>
      <td class="mono" style="text-align: right;">${formatCurrency(item.unit_price, data.currency)}</td>
      <td class="mono" style="text-align: right; font-weight: 600;">${formatCurrency(item.amount, data.currency)}</td>
    </tr>
  `).join('');

  return `${documentHead(`Invoice ${data.invoice_number}`)}
<body>
  <div class="page">
    ${letterheadHeader('INVOICE', data.invoice_number, formatDocDate(data.issue_date, 'short'))}
    
    <!-- Watermark for draft invoices -->
    ${data.paid_amount === 0 ? `<div class="watermark">DRAFT</div>` : ''}
    
    <!-- Invoice details -->
    <table style="width: 100%; border: none; margin-bottom: 21px;">
      <tr style="border: none;">
        <td style="border: none; padding: 0; width: 55%;">
          <div style="font-size: 8pt; color: ${brand.muted}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px;">Bill to</div>
          <div style="font-family: '${brand.fontDisplay}', serif; font-size: 13pt; font-weight: 600;">${data.client_name}</div>
          ${data.client_address ? `<div style="color: ${brand.muted}; font-size: 9pt; margin-top: 3px; line-height: 1.5;">${data.client_address.replace(/\n/g, '<br>')}</div>` : ''}
          ${data.client_email ? `<div style="color: ${brand.muted}; font-size: 8pt; margin-top: 2px;">${data.client_email}</div>` : ''}
        </td>
        <td style="border: none; padding: 0; text-align: right;">
          <div style="font-family: '${brand.fontDisplay}', serif; font-size: 13pt; font-weight: 700; color: ${brand.accent}; margin-bottom: 8px;">
            ${data.invoice_number}
          </div>
          <table style="width: auto; margin-left: auto; border: none; font-size: 8.5pt;">
            <tr style="border: none;">
              <td style="border: none; padding: 2px 13px 2px 0; color: ${brand.muted}; text-transform: uppercase; letter-spacing: 0.08em; font-family: '${brand.fontMono}', monospace; font-size: 7.5pt;">Issue date</td>
              <td class="mono" style="border: none; padding: 2px 0; text-align: right;">${formatDocDate(data.issue_date)}</td>
            </tr>
            <tr style="border: none;">
              <td style="border: none; padding: 2px 13px 2px 0; color: ${brand.muted}; text-transform: uppercase; letter-spacing: 0.08em; font-family: '${brand.fontMono}', monospace; font-size: 7.5pt;">Due date</td>
              <td class="mono" style="border: none; padding: 2px 0; text-align: right; font-weight: 600;">${formatDocDate(data.due_date)}</td>
            </tr>
            <tr style="border: none;">
              <td style="border: none; padding: 2px 13px 2px 0; color: ${brand.muted}; text-transform: uppercase; letter-spacing: 0.08em; font-family: '${brand.fontMono}', monospace; font-size: 7.5pt;">Status</td>
              <td style="border: none; padding: 2px 0; text-align: right; font-weight: 600; color: ${statusColor};">${status}</td>
            </tr>
            ${data.project_name ? `
            <tr style="border: none;">
              <td style="border: none; padding: 2px 13px 2px 0; color: ${brand.muted}; text-transform: uppercase; letter-spacing: 0.08em; font-family: '${brand.fontMono}', monospace; font-size: 7.5pt;">Project</td>
              <td style="border: none; padding: 2px 0; text-align: right;">${data.project_name}</td>
            </tr>` : ''}
          </table>
        </td>
      </tr>
    </table>

    <!-- Line items -->
    <table style="margin-bottom: 21px;">
      <thead>
        <tr>
          <th style="border-bottom: 2px solid ${brand.accent}; text-align: left; padding: 8px 13px;">Description</th>
          <th style="border-bottom: 2px solid ${brand.accent}; text-align: right; padding: 8px 13px; width: 60px;">Qty</th>
          <th style="border-bottom: 2px solid ${brand.accent}; text-align: right; padding: 8px 13px; width: 100px;">Rate</th>
          <th style="border-bottom: 2px solid ${brand.accent}; text-align: right; padding: 8px 13px; width: 110px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <!-- Totals -->
    <table style="width: 300px; margin-left: auto; margin-bottom: 21px; border: none;">
      <tr style="border: none;">
        <td style="border: none; padding: 5px 0; color: ${brand.muted};">Subtotal</td>
        <td class="mono" style="border: none; padding: 5px 0; text-align: right;">${formatCurrency(data.subtotal, data.currency)}</td>
      </tr>
      ${data.tax_rate > 0 ? `
      <tr style="border: none;">
        <td style="border: none; padding: 5px 0; color: ${brand.muted};">Tax (${(data.tax_rate * 100).toFixed(1)}%)</td>
        <td class="mono" style="border: none; padding: 5px 0; text-align: right;">${formatCurrency(data.tax_amount, data.currency)}</td>
      </tr>` : ''}
      ${data.discount_amount > 0 ? `
      <tr style="border: none;">
        <td style="border: none; padding: 5px 0; color: ${brand.success};">Discount</td>
        <td class="mono" style="border: none; padding: 5px 0; text-align: right; color: ${brand.success};">−${formatCurrency(data.discount_amount, data.currency)}</td>
      </tr>` : ''}
      <tr style="border: none; border-top: 2px solid ${brand.accent};">
        <td style="border: none; border-top: 2px solid ${brand.accent}; padding: 8px 0; font-family: '${brand.fontDisplay}', serif; font-size: 13pt; font-weight: 700; color: ${brand.accent};">Total</td>
        <td class="mono" style="border: none; border-top: 2px solid ${brand.accent}); padding: 8px 0; text-align: right; font-family: '${brand.fontDisplay}', serif; font-size: 13pt; font-weight: 700; color: ${brand.accent};">${formatCurrency(data.total, data.currency)}</td>
      </tr>
      ${data.paid_amount > 0 ? `
      <tr style="border: none;">
        <td style="border: none; padding: 5px 0; color: ${brand.success};">Paid</td>
        <td class="mono" style="border: none; padding: 5px 0; text-align: right; color: ${brand.success};">-${formatCurrency(data.paid_amount, data.currency)}</td>
      </tr>
      <tr style="border: none; border-top: 1px solid ${brand.raised};">
        <td style="border: none; border-top: 1px solid ${brand.raised}; padding: 8px 0; font-weight: 700;">Balance due</td>
        <td class="mono" style="border: none; border-top: 1px solid ${brand.raised}; padding: 8px 0; text-align: right; font-weight: 700;">${formatCurrency(data.total - data.paid_amount, data.currency)}</td>
      </tr>` : ''}
    </table>

    <!-- Notes & Terms -->
    ${data.notes ? `
    <div style="margin-top: 34px; padding: 13px; background: ${brand.accentSoft}; border-radius: 8px; border-left: 3px solid ${brand.accent};">
      <div style="font-family: '${brand.fontMono}', monospace; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.1em; color: ${brand.accent}; margin-bottom: 5px;">Notes</div>
      <div style="font-size: 9pt; color: ${brand.raised}; line-height: 1.618;">${data.notes}</div>
    </div>` : ''}

    ${data.terms ? `
    <div style="margin-top: 13px; font-size: 7.5pt; color: ${brand.muted}; line-height: 1.618;">
      <span style="font-family: '${brand.fontMono}', monospace; text-transform: uppercase; letter-spacing: 0.08em;">Terms</span> · ${data.terms}
    </div>` : ''}

    <!-- Guarantee -->
    <div style="margin-top: 21px; padding: 8px 13px; border: 1px solid ${brand.accent}3d; border-radius: 8px; font-size: 8pt; color: ${brand.muted};">
      <span style="color: ${brand.accent}; font-weight: 600;">Speed guarantee:</span> First measurable artifact in 14 days — or month 1 is free. We've never paid out.
    </div>

    ${letterheadFooter()}
  </div>
</body>
</html>`;
}

/* ──────────────────────────────────────────────────────────────────
   PROPOSAL
   ────────────────────────────────────────────────────────────────── */

export interface ProposalData {
  proposal_number: string;
  date: number;
  client_name: string;
  client_title?: string;
  client_company?: string;
  client_email?: string;
  project_name: string;
  project_summary: string;
  objectives: string[];
  scope: Array<{ title: string; description: string; deliverables: string[] }>;
  timeline: Array<{ phase: string; duration: string; milestones: string[] }>;
  investment: {
    total: number;
    currency: string;
    breakdown: Array<{ item: string; amount: number }>;
    payment_schedule: Array<{ milestone: string; percentage: number; amount: number }>;
  };
  terms?: string;
  valid_until: number;
}

export function generateProposalHTML(data: ProposalData): string {
  const objectiveItems = data.objectives.map(o => `<li style="margin-bottom: 5px;">${o}</li>`).join('');
  const scopeItems = data.scope.map(s => `
    <div style="margin-bottom: 21px;">
      <h3 style="font-size: 11pt; color: ${brand.accent}; margin-bottom: 5px;">${s.title}</h3>
      <p style="color: ${brand.raised}; font-size: 9.5pt; margin-bottom: 8px;">${s.description}</p>
      <ul style="padding-left: 21px; font-size: 9pt; color: ${brand.muted};">
        ${s.deliverables.map(d => `<li>${d}</li>`).join('')}
      </ul>
    </div>
  `).join('');
  const timelineItems = data.timeline.map(t => `
    <tr>
      <td style="font-weight: 600;">${t.phase}</td>
      <td class="mono">${t.duration}</td>
      <td style="font-size: 9pt; color: ${brand.muted};">${t.milestones.join(', ')}</td>
    </tr>
  `).join('');
  const breakdownItems = data.investment.breakdown.map(b => `
    <tr>
      <td>${b.item}</td>
      <td class="mono" style="text-align: right;">${formatCurrency(b.amount, data.investment.currency)}</td>
    </tr>
  `).join('');
  const paymentItems = data.investment.payment_schedule.map(p => `
    <tr>
      <td>${p.milestone}</td>
      <td class="mono" style="text-align: right;">${p.percentage}%</td>
      <td class="mono" style="text-align: right;">${formatCurrency(p.amount, data.investment.currency)}</td>
    </tr>
  `).join('');

  return `${documentHead(`Proposal ${data.proposal_number}`)}
<body>
  <div class="page">
    ${letterheadHeader('PROPOSAL', data.proposal_number, formatDocDate(data.date, 'short'))}
    
    <div class="watermark">${data.client_company || data.client_name}</div>

    <!-- Client info -->
    <div style="margin-bottom: 34px;">
      <div style="font-size: 8pt; color: ${brand.muted}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px;">Prepared for</div>
      <div style="font-family: '${brand.fontDisplay}', serif; font-size: 15pt; font-weight: 700;">${data.client_name}</div>
      ${data.client_title ? `<div style="font-size: 9pt; color: ${brand.muted};">${data.client_title}${data.client_company ? ` at ${data.client_company}` : ''}</div>` : ''}
      ${data.client_email ? `<div style="font-size: 8pt; color: ${brand.muted}; margin-top: 2px;">${data.client_email}</div>` : ''}
    </div>

    <!-- Hero -->
    <div style="margin-bottom: 34px; padding: 34px; background: linear-gradient(135deg, ${brand.accent}08, ${brand.accent}15); border-radius: 13px; border-left: 3px solid ${brand.accent};">
      <h1 style="font-size: 21pt; font-weight: 700; color: ${brand.void}; line-height: 1.3; margin-bottom: 8px;">
        ${data.project_name}
      </h1>
      <p style="font-size: 10.5pt; color: ${brand.raised}; line-height: 1.618; max-width: 480px;">${data.project_summary}</p>
      <div style="margin-top: 13px; font-family: '${brand.fontMono}', monospace; font-size: 8pt; color: ${brand.muted};">
        Proposal ${data.proposal_number} · Valid until ${formatDocDate(data.valid_until, 'short')}
      </div>
    </div>

    <!-- Objectives -->
    <div style="margin-bottom: 34px;">
      <h2 style="font-size: 13pt; color: ${brand.accent}; margin-bottom: 13px; border-bottom: 1px solid ${brand.accent}3d; padding-bottom: 5px;">
        Objectives
      </h2>
      <ul style="padding-left: 21px; font-size: 10pt; line-height: 1.618;">
        ${objectiveItems}
      </ul>
    </div>

    <!-- Scope -->
    <div style="margin-bottom: 34px;">
      <h2 style="font-size: 13pt; color: ${brand.accent}; margin-bottom: 13px; border-bottom: 1px solid ${brand.accent}3d; padding-bottom: 5px;">
        Scope of work
      </h2>
      ${scopeItems}
    </div>

    <!-- Timeline -->
    <div style="margin-bottom: 34px;">
      <h2 style="font-size: 13pt; color: ${brand.accent}; margin-bottom: 13px; border-bottom: 1px solid ${brand.accent}3d; padding-bottom: 5px;">
        Timeline
      </h2>
      <table>
        <thead>
          <tr><th>Phase</th><th>Duration</th><th>Milestones</th></tr>
        </thead>
        <tbody>${timelineItems}</tbody>
      </table>
    </div>

    <!-- Investment -->
    <div style="margin-bottom: 34px;">
      <h2 style="font-size: 13pt; color: ${brand.accent}; margin-bottom: 13px; border-bottom: 1px solid ${brand.accent}3d; padding-bottom: 5px;">
        Investment
      </h2>
      <table style="margin-bottom: 13px;">
        <thead>
          <tr><th>Item</th><th style="text-align: right;">Amount</th></tr>
        </thead>
        <tbody>${breakdownItems}</tbody>
      </table>
      <div style="text-align: right; font-family: '${brand.fontDisplay}', serif; font-size: 18pt; font-weight: 700; color: ${brand.accent}; margin-top: 13px;">
        Total: ${formatCurrency(data.investment.total, data.investment.currency)}
      </div>
    </div>

    <!-- Payment Schedule -->
    <div style="margin-bottom: 34px;">
      <h2 style="font-size: 13pt; color: ${brand.accent}; margin-bottom: 13px; border-bottom: 1px solid ${brand.accent}3d; padding-bottom: 5px;">
        Payment schedule
      </h2>
      <table>
        <thead>
          <tr><th>Milestone</th><th style="text-align: right;">%</th><th style="text-align: right;">Amount</th></tr>
        </thead>
        <tbody>${paymentItems}</tbody>
      </table>
    </div>

    <!-- Terms -->
    ${data.terms ? `
    <div style="margin-top: 34px; padding: 13px; background: ${brand.accentSoft}; border-radius: 8px; border-left: 3px solid ${brand.accent}; font-size: 8.5pt; color: ${brand.raised}; line-height: 1.618;">
      <div style="font-family: '${brand.fontMono}', monospace; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.1em; color: ${brand.accent}; margin-bottom: 5px;">Terms</div>
      ${data.terms}
    </div>` : ''}

    <!-- Signature -->
    <div class="signature-block">
      <div class="signature-box">
        <div style="font-family: '${brand.fontDisplay}', serif; font-size: 10pt; font-weight: 600; margin-bottom: 55px;">${brand.company.founder}</div>
        <div class="signature-line"></div>
        <div class="signature-name">${brand.company.founder}</div>
        <div class="signature-title">Founder, ${brand.company.shortName}</div>
        <div class="signature-date">Date: _______________</div>
      </div>
      <div class="signature-box">
        <div style="margin-bottom: 55px;">&nbsp;</div>
        <div class="signature-line"></div>
        <div class="signature-name">${data.client_name}</div>
        <div class="signature-title">${data.client_title || 'Client'}</div>
        <div class="signature-date">Date: _______________</div>
      </div>
    </div>

    ${letterheadFooter()}
  </div>
</body>
</html>`;
}

/* ──────────────────────────────────────────────────────────────────
   CONTRACT / SERVICE AGREEMENT
   ────────────────────────────────────────────────────────────────── */

export interface ContractData {
  contract_number: string;
  date: number;
  client_name: string;
  client_company?: string;
  client_address?: string;
  client_email?: string;
  project_name: string;
  start_date: number;
  end_date: number;
  total_value: number;
  currency: string;
  payment_terms: string;
  scope: string;
  deliverables: string[];
  confidentiality: boolean;
  ip_assignment: boolean;
  termination_notice_days: number;
  governing_law: string;
}

export function generateContractHTML(data: ContractData): string {
  const deliverablesList = data.deliverables.map(d => `<li style="margin-bottom: 5px;">${d}</li>`).join('');

  return `${documentHead(`Service Agreement ${data.contract_number}`, `
  .clause { margin-bottom: 21px; }
  .clause-title { font-family: '${brand.fontMono}', monospace; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.1em; color: ${brand.accent}; margin-bottom: 8px; }
  .clause-body { font-size: 9.5pt; line-height: 1.7; }
  .clause-body p { margin-bottom: 8px; }
  .highlight { background: ${brand.accentSoft}; padding: 2px 5px; border-radius: 3px; font-family: '${brand.fontMono}', monospace; font-size: 8.5pt; }`)}
<body>
  <div class="page">
    ${letterheadHeader('SERVICE AGREEMENT', data.contract_number, formatDocDate(data.date, 'short'))}
    
    <div class="watermark">CONFIDENTIAL</div>

    <!-- Parties -->
    <div style="margin-bottom: 34px; display: flex; justify-content: space-between;">
      <div style="width: 45%;">
        <div class="clause-title">Between</div>
        <div style="font-family: '${brand.fontDisplay}', serif; font-weight: 600;">${brand.company.name}</div>
        <div style="font-size: 9pt; color: ${brand.muted}; margin-top: 3px;">
          ${brand.company.email}<br>${brand.company.address}
        </div>
        <div style="font-size: 8pt; color: ${brand.muted}; margin-top: 2px;">("Agency")</div>
      </div>
      <div style="width: 45%;">
        <div class="clause-title">And</div>
        <div style="font-family: '${brand.fontDisplay}', serif; font-weight: 600;">${data.client_name}</div>
        ${data.client_company ? `<div style="font-size: 9pt; color: ${brand.muted}; margin-top: 3px;">${data.client_company}</div>` : ''}
        ${data.client_address ? `<div style="font-size: 8pt; color: ${brand.muted}; margin-top: 2px;">${data.client_address.replace(/\n/g, '<br>')}</div>` : ''}
        ${data.client_email ? `<div style="font-size: 8pt; color: ${brand.muted}; margin-top: 2px;">${data.client_email}</div>` : ''}
        <div style="font-size: 8pt; color: ${brand.muted}; margin-top: 2px;">("Client")</div>
      </div>
    </div>

    <!-- Agreement Details -->
    <div style="margin-bottom: 34px; padding: 13px; background: ${brand.accentSoft}; border-radius: 8px; border-left: 3px solid ${brand.accent};">
      <table style="border: none; font-size: 9pt;">
        <tr style="border: none;"><td style="border: none; padding: 2px 13px 2px 0; color: ${brand.muted}; width: 130px; font-family: '${brand.fontMono}', monospace; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em;">Agreement</td><td style="border: none; padding: 2px 0; font-weight: 600;">${data.contract_number}</td></tr>
        <tr style="border: none;"><td style="border: none; padding: 2px 13px 2px 0; color: ${brand.muted}; font-family: '${brand.fontMono}', monospace; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em;">Date</td><td style="border: none; padding: 2px 0;">${formatDocDate(data.date)}</td></tr>
        <tr style="border: none;"><td style="border: none; padding: 2px 13px 2px 0; color: ${brand.muted}; font-family: '${brand.fontMono}', monospace; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em;">Project</td><td style="border: none; padding: 2px 0; font-weight: 600; color: ${brand.accent};">${data.project_name}</td></tr>
        <tr style="border: none;"><td style="border: none; padding: 2px 13px 2px 0; color: ${brand.muted}; font-family: '${brand.fontMono}', monospace; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em;">Period</td><td style="border: none; padding: 2px 0;">${formatDocDate(data.start_date, 'short')} — ${formatDocDate(data.end_date, 'short')}</td></tr>
        <tr style="border: none;"><td style="border: none; padding: 2px 13px 2px 0; color: ${brand.muted}; font-family: '${brand.fontMono}', monospace; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em;">Value</td><td style="border: none; padding: 2px 0; font-weight: 600; font-family: '${brand.fontMono}', monospace;">${formatCurrency(data.total_value, data.currency)}</td></tr>
      </table>
    </div>

    <!-- Clauses -->
    <div class="clause">
      <div class="clause-title">1. Scope of services</div>
      <div class="clause-body">
        <p>The Agency shall provide the following services for the Project named <span class="highlight">${data.project_name}</span>:</p>
        <p>${data.scope}</p>
      </div>
    </div>

    <div class="clause">
      <div class="clause-title">2. Deliverables</div>
      <div class="clause-body">
        <ul style="padding-left: 21px;">${deliverablesList}</ul>
      </div>
    </div>

    <div class="clause">
      <div class="clause-title">3. Payment terms</div>
      <div class="clause-body">
        <p>${data.payment_terms}</p>
        <p>The total contract value is <span class="highlight">${formatCurrency(data.total_value, data.currency)}</span>, payable according to the schedule outlined in the associated proposal or statement of work.</p>
      </div>
    </div>

    <div class="clause">
      <div class="clause-title">4. Term & termination</div>
      <div class="clause-body">
        <p>This agreement is effective from ${formatDocDate(data.start_date)} through ${formatDocDate(data.end_date)}. Either party may terminate with <span class="highlight">${data.termination_notice_days} days</span> written notice. Upon termination, the Client shall pay for all work completed through the termination date.</p>
      </div>
    </div>

    ${data.confidentiality ? `
    <div class="clause">
      <div class="clause-title">5. Confidentiality</div>
      <div class="clause-body">
        <p>Both parties agree to keep confidential all proprietary information disclosed during the engagement. This obligation survives termination by two (2) years.</p>
      </div>
    </div>` : ''}

    ${data.ip_assignment ? `
    <div class="clause">
      <div class="clause-title">6. Intellectual property</div>
      <div class="clause-body">
        <p>All work product, deliverables, and intellectual property created under this agreement are the property of the Client upon full payment. The Agency retains the right to use the work in its portfolio after launch, unless otherwise agreed.</p>
      </div>
    </div>` : ''}

    <div class="clause">
      <div class="clause-title">${data.confidentiality ? '7' : '5'}. Guarantee</div>
      <div class="clause-body">
        <p style="padding: 8px 13px; background: ${brand.accentSoft}; border-radius: 8px; border-left: 3px solid ${brand.accent};">
          <strong style="color: ${brand.accent};">Speed guarantee:</strong> The Agency will deliver the first measurable artifact within 14 days of kickoff. If we fail, month 1 is free. We've never paid out.
        </p>
      </div>
    </div>

    <div class="clause">
      <div class="clause-title">${data.confidentiality ? '8' : '6'}. Governing law</div>
      <div class="clause-body">
        <p>This agreement is governed by the laws of <span class="highlight">${data.governing_law}</span>.</p>
      </div>
    </div>

    <!-- Signature -->
    <div class="signature-block">
      <div class="signature-box">
        <div style="margin-bottom: 55px;">&nbsp;</div>
        <div class="signature-line"></div>
        <div class="signature-name">${brand.company.founder}</div>
        <div class="signature-title">Founder, ${brand.company.shortName}</div>
        <div class="signature-date">Date: _______________</div>
      </div>
      <div class="signature-box">
        <div style="margin-bottom: 55px;">&nbsp;</div>
        <div class="signature-line"></div>
        <div class="signature-name">${data.client_name}</div>
        <div class="signature-title">${data.client_title || 'Client'}</div>
        <div class="signature-date">Date: _______________</div>
      </div>
    </div>

    ${letterheadFooter()}
  </div>
</body>
</html>`;
}

/* ──────────────────────────────────────────────────────────────────
   NDA (NON-DISCLOSURE AGREEMENT)
   ────────────────────────────────────────────────────────────────── */

export interface NdaData {
  nda_number: string;
  date: number;
  disclosing_party: string;
  disclosing_party_role: string;
  receiving_party: string;
  receiving_party_role: string;
  purpose: string;
  duration_years: number;
  governing_law: string;
}

export function generateNdaHTML(data: NdaData): string {
  return `${documentHead(`NDA ${data.nda_number}`)}
<body>
  <div class="page">
    ${letterheadHeader('NON-DISCLOSURE AGREEMENT', data.nda_number, formatDocDate(data.date, 'short'))}
    
    <div class="watermark">CONFIDENTIAL</div>

    <div style="margin-bottom: 34px; padding: 13px; background: ${brand.accentSoft}; border-radius: 8px; border-left: 3px solid ${brand.accent}; font-size: 9pt;">
      <span style="font-family: '${brand.fontMono}', monospace; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.1em; color: ${brand.accent};">Agreement</span>
      <span style="font-family: '${brand.fontMono}', monospace; font-size: 8.5pt; color: ${brand.muted}; margin-left: 13px;">${data.nda_number}</span>
      <span style="font-family: '${brand.fontMono}', monospace; font-size: 8.5pt; color: ${brand.muted}; margin-left: 13px;">${formatDocDate(data.date)}</span>
    </div>

    <div style="margin-bottom: 34px;">
      <p style="margin-bottom: 13px; line-height: 1.7; font-size: 10pt;">
        This Non-Disclosure Agreement (the "<strong>Agreement</strong>") is entered into as of ${formatDocDate(data.date)} by and between:
      </p>
      <div style="padding: 13px; background: ${brand.accentSoft}; border-radius: 8px; margin-bottom: 13px;">
        <strong style="color: ${brand.accent};">${data.disclosing_party}</strong> (the "<strong>Disclosing Party</strong>") — ${data.disclosing_party_role}<br>
        <strong style="color: ${brand.accent};">${data.receiving_party}</strong> (the "<strong>Receiving Party</strong>") — ${data.receiving_party_role}
      </div>
    </div>

    <div style="margin-bottom: 21px;">
      <div style="font-family: '${brand.fontMono}', monospace; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.1em; color: ${brand.accent}; margin-bottom: 8px;">1. Definition</div>
      <p style="line-height: 1.7; font-size: 9.5pt;">"Confidential Information" means any information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.</p>
    </div>

    <div style="margin-bottom: 21px;">
      <div style="font-family: '${brand.fontMono}', monospace; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.1em; color: ${brand.accent}; margin-bottom: 8px;">2. Purpose</div>
      <p style="line-height: 1.7; font-size: 9.5pt;">The Receiving Party may use the Confidential Information solely for the purpose of: <span style="background: ${brand.accentSoft}; padding: 2px 5px; border-radius: 3px; font-family: '${brand.fontMono}', monospace; font-size: 8.5pt;">${data.purpose}</span></p>
    </div>

    <div style="margin-bottom: 21px;">
      <div style="font-family: '${brand.fontMono}', monospace; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.1em; color: ${brand.accent}; margin-bottom: 8px;">3. Obligations</div>
      <p style="line-height: 1.7; font-size: 9.5pt;">The Receiving Party agrees to:</p>
      <ul style="padding-left: 21px; font-size: 9.5pt; line-height: 1.7;">
        <li>Hold the Confidential Information in strict confidence</li>
        <li>Not disclose the Confidential Information to any third party without prior written consent</li>
        <li>Use the same degree of care to protect the Confidential Information as it uses to protect its own confidential information, but in no event less than reasonable care</li>
        <li>Limit access to the Confidential Information to those employees and contractors who need to know</li>
      </ul>
    </div>

    <div style="margin-bottom: 21px;">
      <div style="font-family: '${brand.fontMono}', monospace; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.1em; color: ${brand.accent}; margin-bottom: 8px;">4. Exclusions</div>
      <p style="line-height: 1.7; font-size: 9.5pt;">Confidential Information does not include information that: (a) was publicly known prior to disclosure; (b) becomes publicly known through no fault of the Receiving Party; (c) was already in the Receiving Party's possession prior to disclosure; (d) is independently developed by the Receiving Party without use of the Confidential Information.</p>
    </div>

    <div style="margin-bottom: 21px;">
      <div style="font-family: '${brand.fontMono}', monospace; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.1em; color: ${brand.accent}; margin-bottom: 8px;">5. Duration</div>
      <p style="line-height: 1.7; font-size: 9.5pt;">This Agreement shall remain in effect for a period of <span style="background: ${brand.accentSoft}; padding: 2px 5px; border-radius: 3px; font-family: '${brand.fontMono}', monospace; font-size: 8.5pt;">${data.duration_years} year${data.duration_years > 1 ? 's' : ''}</span> from the date of execution. The confidentiality obligations shall survive termination.</p>
    </div>

    <div style="margin-bottom: 21px;">
      <div style="font-family: '${brand.fontMono}', monospace; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.1em; color: ${brand.accent}; margin-bottom: 8px;">6. Return of materials</div>
      <p style="line-height: 1.7; font-size: 9.5pt;">Upon termination or upon request, the Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof.</p>
    </div>

    <div style="margin-bottom: 21px;">
      <div style="font-family: '${brand.fontMono}', monospace; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.1em; color: ${brand.accent}; margin-bottom: 8px;">7. Governing law</div>
      <p style="line-height: 1.7; font-size: 9.5pt;">This Agreement is governed by the laws of <span style="background: ${brand.accentSoft}; padding: 2px 5px; border-radius: 3px; font-family: '${brand.fontMono}', monospace; font-size: 8.5pt;">${data.governing_law}</span>.</p>
    </div>

    <!-- Signature -->
    <div class="signature-block">
      <div class="signature-box">
        <div style="margin-bottom: 55px;">&nbsp;</div>
        <div class="signature-line"></div>
        <div class="signature-name">${data.disclosing_party}</div>
        <div class="signature-title">${data.disclosing_party_role}</div>
        <div class="signature-date">Date: _______________</div>
      </div>
      <div class="signature-box">
        <div style="margin-bottom: 55px;">&nbsp;</div>
        <div class="signature-line"></div>
        <div class="signature-name">${data.receiving_party}</div>
        <div class="signature-title">${data.receiving_party_role}</div>
        <div class="signature-date">Date: _______________</div>
      </div>
    </div>

    ${letterheadFooter()}
  </div>
</body>
</html>`;
}

/* ──────────────────────────────────────────────────────────────────
   BUSINESS CARD (print-ready, both sides)
   ────────────────────────────────────────────────────────────────── */

export interface BusinessCardData {
  name: string;
  title: string;
  email: string;
  phone?: string;
  website?: string;
  linkedin?: string;
}

export function generateBusinessCardHTML(data: BusinessCardData): string {
  // ISO 7810: 85.6mm × 53.98mm, with 3mm bleed = 91.6mm × 59.98mm
  // Using px at 96dpi: 3.5mm ≈ 13.2px (F(7))
  const cardWidth = '85.6mm';
  const cardHeight = '53.98mm';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.name} — Business Card — ${brand.company.shortName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f5f5f5; display: flex; flex-direction: column; align-items: center; gap: 21mm; padding: 13mm; }
    .card {
      width: ${cardWidth}; height: ${cardHeight};
      border-radius: 5px; overflow: hidden; position: relative;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06);
    }
    @media print {
      body { background: none; padding: 0; gap: 0; }
      .card { box-shadow: none; page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- FRONT -->
  <div class="card" style="background: ${brand.void}; color: ${brand.ink}; display: flex; flex-direction: column; justify-content: space-between; padding: 5mm;">
    <!-- Accent stripe -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 2.5px; background: ${brand.accent};"></div>
    
    <!-- Logo + Name -->
    <div>
      <div style="font-family: '${brand.fontDisplay}', serif; font-size: 18pt; font-weight: 700; color: ${brand.accent}; line-height: 1;">BAZ</div>
      <div style="font-family: '${brand.fontMono}', monospace; font-size: 5.5pt; color: ${brand.muted}; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 1px;">Growth Partner</div>
    </div>
    
    <!-- Name + Title -->
    <div>
      <div style="font-family: '${brand.fontDisplay}', serif; font-size: 11pt; font-weight: 600; color: ${brand.ink}; line-height: 1.2;">${data.name}</div>
      <div style="font-family: '${brand.fontMono}', monospace; font-size: 6.5pt; color: ${brand.accent}; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 1px;">${data.title}</div>
    </div>
    
    <!-- Contact -->
    <div style="font-family: '${brand.fontMono}', monospace; font-size: 6pt; color: ${brand.muted}; line-height: 1.618;">
      ${data.email}${data.phone ? ` · ${data.phone}` : ''}${data.website ? ` · ${data.website}` : ''}
    </div>
    
    <!-- Bottom accent line -->
    <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 2.5px; background: ${brand.accent};"></div>
  </div>

  <!-- BACK -->
  <div class="card" style="background: ${brand.accent}; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
    <!-- Large BAZ mark -->
    <div style="font-family: '${brand.fontDisplay}', serif; font-size: 28pt; font-weight: 700; line-height: 1;">BAZ</div>
    <div style="font-family: '${brand.fontMono}', monospace; font-size: 6pt; letter-spacing: 0.35em; text-transform: uppercase; margin-top: 2px; opacity: 0.8;">Growth Partner</div>
    
    <!-- Horizontal rule -->
    <div style="width: 21mm; height: 1px; background: rgba(255,255,255,0.3); margin: 4mm 0;"></div>
    
    <!-- Contact info -->
    <div style="font-family: '${brand.fontMono}', monospace; font-size: 5.5pt; letter-spacing: 0.08em; opacity: 0.85; line-height: 1.8;">
      ${brand.company.email}<br>
      ${brand.company.website}<br>
      ${data.linkedin ? data.linkedin : brand.company.linkedin}
    </div>
  </div>
</body>
</html>`;
}

/* ──────────────────────────────────────────────────────────────────
   EMAIL SIGNATURE (HTML for email clients)
   ────────────────────────────────────────────────────────────────── */

export interface EmailSignatureData {
  name: string;
  title: string;
  email: string;
  phone?: string;
  website?: string;
  linkedin?: string;
}

export function generateEmailSignatureHTML(data: EmailSignatureData): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #0a0a0d; font-size: 12px; line-height: 1.618;">
  <tr>
      <td style="vertical-align: top; padding-right: 13px; border-right: 2px solid var(--accent);">
      <div style="font-family: 'Fraunces', Georgia, serif; font-size: 16px; font-weight: 700; color: var(--accent); line-height: 1;">BAZ</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 8px; color: #6e6879; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 1px;">Growth Partner</div>
    </td>
    <td style="padding-left: 13px; vertical-align: top;">
      <div style="font-family: 'Fraunces', Georgia, serif; font-size: 14px; font-weight: 600; color: #0a0a0d;">${data.name}</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase; margin-top: 1px;">${data.title}</div>
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #6e6879; margin-top: 5px; line-height: 1.5;">
        <a href="mailto:${data.email}" style="color: var(--accent); text-decoration: none;">${data.email}</a>${data.phone ? ` · ${data.phone}` : ''}<br>
        <a href="https://${data.website || brand.company.website}" style="color: var(--accent); text-decoration: none;">${data.website || brand.company.website}</a>${data.linkedin ? ` · <a href="https://${data.linkedin}" style="color: var(--accent); text-decoration: none;">LinkedIn</a>` : ''}
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top: 8px; font-family: 'JetBrains Mono', monospace; font-size: 8px; color: #6e6879; letter-spacing: 0.05em; border-top: 1px solid #4b455925;">
      ${brand.company.name} · Remote-first · MENA · EU · US
    </td>
  </tr>
</table>`;
}

/* ──────────────────────────────────────────────────────────────────
   LETTERHEAD (blank, for any document)
   ────────────────────────────────────────────────────────────────── */

export function generateLetterheadHTML(title: string = 'Letter'): string {
  const head = documentHead(brand.company.shortName + ' \u2014 ' + title);
  const header = letterheadHeader(title.toUpperCase());
  const footer = letterheadFooter();
  return head + `
<body>
  <div class="page">
    ` + header + `
    
    <div style="min-height: 500px;">
      <!-- Content goes here -->
    </div>
    
    ` + footer + `
  </div>
</body>
</html>`;
}
