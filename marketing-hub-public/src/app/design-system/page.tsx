"use client";
import { Palette, Type, Square, Button as BtnIcon, Droplet, Sparkles, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { Modal } from "@/components/Modal";
import { useState } from "react";
import { Stat } from "@/components/Stat";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/Badge";
import { Skeleton } from "@/components/Skeleton";
import clsx from "clsx";

const TOKENS = [
  { name: "--bg", desc: "Page background", light: "248 250 252", dark: "9 9 10" },
  { name: "--surface", desc: "Card / panel background", light: "255 255 255", dark: "16 16 18" },
  {
    name: "--surface-2",
    desc: "Recessed surface (inputs, code)",
    light: "248 250 252",
    dark: "12 12 14",
  },
  {
    name: "--surface-3",
    desc: "Most recessed (code blocks, wells)",
    light: "241 245 249",
    dark: "24 24 27",
  },
  { name: "--border", desc: "Default border color", light: "226 232 240", dark: "36 36 40" },
  {
    name: "--border-strong",
    desc: "Stronger border (focus, emphasis)",
    light: "203 213 225",
    dark: "55 55 60",
  },
  { name: "--text", desc: "Primary text color", light: "15 23 42", dark: "250 250 250" },
  { name: "--text-secondary", desc: "Secondary text", light: "51 65 85", dark: "210 210 215" },
  { name: "--muted", desc: "Muted / placeholder text", light: "100 116 139", dark: "140 140 150" },
  { name: "--hover", desc: "Hover background", light: "241 245 249", dark: "28 28 32" },
  {
    name: "--hover-strong",
    desc: "Strong hover (active states)",
    light: "226 232 240",
    dark: "40 40 46",
  },
  {
    name: "--glass-bg",
    desc: "Glassmorphism background",
    light: "rgba(255,255,255,0.72)",
    dark: "rgba(16,16,18,0.75)",
  },
];

const SHADOWS = [
  { name: "--shadow-sm", value: "0 1px 2px 0 rgba(0,0,0,0.04)", desc: "Subtle elevation" },
  { name: "--shadow-md", value: "0 4px 12px -2px rgba(0,0,0,0.08)", desc: "Cards, popovers" },
  { name: "--shadow-lg", value: "0 12px 32px -8px rgba(0,0,0,0.12)", desc: "Modals, dropdowns" },
  { name: "--shadow-xl", value: "0 24px 56px -12px rgba(0,0,0,0.16)", desc: "Overlays, dialogs" },
];

const THEMES = [
  { id: "hub", label: "Hub Default", brand: "var(--accent)", mode: "light", desc: "Purple · Inter" },
  { id: "noira-dark", label: "Violet Dark", brand: "var(--accent)", mode: "dark", desc: "Orange · dark" },
  { id: "noira-amoled", label: "Violet AMOLED", brand: "var(--accent)", mode: "dark", desc: "Pure black" },
  {
    id: "noira-light",
    label: "Violet Light",
    brand: "var(--accent)",
    mode: "light",
    desc: "Orange · light",
  },
  {
    id: "agency-light",
    label: "Marketing Agency",
    brand: "#1A2C6A",
    mode: "light",
    desc: "Navy · Roboto",
  },
];

const ANIMATIONS = [
  { name: "animate-fade-in-up", desc: "Page transitions (0.4s)", css: "fadeInUp" },
  { name: "animate-scale-in", desc: "Modal open (0.3s)", css: "scaleIn" },
  { name: "animate-slide-in-right", desc: "Toast slide (0.3s)", css: "slideInRight" },
  { name: "animate-float", desc: "Floating orbs (4s loop)", css: "float" },
  { name: "animate-glow", desc: "Pulsing glow (2.5s loop)", css: "glowPulse" },
  { name: "animate-gradient", desc: "Gradient shift (4s loop)", css: "gradientShift" },
];

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{ background: "rgb(var(--bg))", color: "rgb(var(--text))" }}
    >
      {/* HERO */}
      <section
        className="relative overflow-hidden border-b"
        style={{ borderColor: "rgb(var(--border))" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "var(--gradient-mesh)" }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-bold uppercase tracking-wider"
            style={{
              background: "var(--theme-brand-soft, rgba(var(--theme-brand-rgb),0.08))",
              color: "var(--theme-brand, var(--accent))",
            }}
          >
            <Palette className="w-3.5 h-3.5" /> Design System · v3.0
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            The <span className="text-gradient">grammar</span> of the interface.
          </h1>
          <p className="text-lg muted mt-5 max-w-2xl mx-auto">
            21 CSS variables. 5 themes. 6 animation primitives. One source of truth. Every component
            on every page inherits from this system.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* THEMES */}
        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5" /> Themes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {THEMES.map((t) => (
              <div key={t.id} className="card card-pad card-lift text-center">
                <div
                  className="w-full h-16 rounded-lg mb-3"
                  style={{
                    background: t.mode === "dark" ? "#0a0a0a" : "#f8fafc",
                    borderBottom: `3px solid ${t.brand}`,
                  }}
                />
                <div className="font-bold text-sm">{t.label}</div>
                <div className="text-xs muted mt-0.5">{t.desc}</div>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: t.brand }} />
                  <span className="text-[10px] font-mono muted">{t.brand}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COLOR TOKENS */}
        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Droplet className="w-5 h-5" /> Color tokens
          </h2>
          <p className="text-sm muted mb-4">
            21 CSS variables. Space-separated RGB triplets for alpha compositing. Theme-aware — flip
            automatically in dark mode.
          </p>
          <div className="card overflow-hidden">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Light</th>
                  <th>Dark</th>
                  <th>Usage</th>
                </tr>
              </thead>
              <tbody>
                {TOKENS.map((t) => (
                  <tr key={t.name}>
                    <td>
                      <code className="font-mono text-xs">{t.name}</code>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded border"
                          style={{
                            background: `rgb(${t.light})`,
                            borderColor: "rgb(var(--border))",
                          }}
                        />
                        <span className="text-xs font-mono muted">{t.light}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded border"
                          style={{
                            background: `rgb(${t.dark})`,
                            borderColor: "rgb(var(--border))",
                          }}
                        />
                        <span className="text-xs font-mono muted">{t.dark}</span>
                      </div>
                    </td>
                    <td className="text-xs text-slate-600 dark:text-zinc-300 dark:text-zinc-400">{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SHADOWS */}
        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Square className="w-5 h-5" /> Elevation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {SHADOWS.map((s) => (
              <div
                key={s.name}
                className="card card-pad card-lift text-center"
                style={{ boxShadow: s.value }}
              >
                <div className="font-mono text-xs font-bold mb-1">{s.name}</div>
                <div className="text-xs muted">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPONENTS */}
        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Components
          </h2>

          {/* Buttons */}
          <div className="card card-pad card-lift mb-4">
            <h3 className="text-sm font-bold mb-3">Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-primary">Primary</button>
              <button className="btn btn-secondary">Secondary</button>
              <button className="btn btn-danger">Danger</button>
              <button className="btn btn-ghost">Ghost</button>
              <button className="btn btn-gradient">Gradient</button>
            </div>
          </div>

          {/* Cards */}
          <div className="card card-pad card-lift mb-4">
            <h3 className="text-sm font-bold mb-3">Cards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card card-pad card-lift card-lift">
                <div className="text-xs muted">Default</div>
              </div>
              <div className="card card-pad card-lift card-glass">
                <div className="text-xs muted">Glass</div>
              </div>
              <div className="card card-pad card-lift card-hover">
                <div className="text-xs muted">Hoverable</div>
              </div>
            </div>
          </div>

          {/* Stat */}
          <div className="card card-pad card-lift mb-4">
            <h3 className="text-sm font-bold mb-3">Stat cards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Revenue" value="$284K" delta={12.4} sub="vs last week" />
              <Stat label="Leads" value={412} delta={8.1} color="emerald" />
              <Stat label="CVR" value="3.2%" delta={-0.3} color="amber" />
              <Stat label="Pipeline" value="$1.2M" delta={15.2} color="violet" />
            </div>
          </div>

          {/* Badges */}
          <div className="card card-pad card-lift mb-4">
            <h3 className="text-sm font-bold mb-3">Status badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge status="draft">Draft</Badge>
              <Badge status="scheduled">Scheduled</Badge>
              <Badge status="live">Live</Badge>
              <Badge status="paused">Paused</Badge>
              <Badge status="completed">Completed</Badge>
              <Badge status="won">Won</Badge>
            </div>
          </div>

          {/* Input */}
          <div className="card card-pad card-lift mb-4">
            <h3 className="text-sm font-bold mb-3">Inputs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Text input</label>
                <input className="input" placeholder="Type here..." />
              </div>
              <div>
                <label className="label">Textarea</label>
                <textarea className="textarea" placeholder="Long form..." />
              </div>
            </div>
          </div>

          {/* Modal trigger */}
          <div className="card card-pad card-lift mb-4">
            <h3 className="text-sm font-bold mb-3">Modal</h3>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              Open modal
            </button>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Example modal">
              <p className="text-sm muted">
                This is a modal. It has a backdrop blur, escape-to-close, and scroll lock.
              </p>
            </Modal>
          </div>

          {/* Empty state */}
          <div className="card card-pad card-lift mb-4">
            <h3 className="text-sm font-bold mb-3">Empty state</h3>
            <EmptyState
              icon={Sparkles}
              title="Nothing here yet"
              description="This is what users see when there's no data."
            />
          </div>

          {/* Skeleton */}
          <div className="card card-pad card-lift card-lift">
            <h3 className="text-sm font-bold mb-3">Loading skeletons</h3>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </section>

        {/* ANIMATIONS */}
        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Type className="w-5 h-5" /> Animation primitives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ANIMATIONS.map((a) => (
              <div key={a.name} className="card card-pad-sm">
                <code className="font-mono text-xs font-bold">{a.name}</code>
                <div className="text-xs muted mt-0.5">{a.desc}</div>
                <div className="text-[10px] font-mono muted mt-1">@keyframes {a.css}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PRINCIPLES */}
        <section
          className="card card-pad card-lift card-lift"
          style={{
            background:
              "linear-gradient(135deg, var(--theme-brand-soft, rgba(var(--theme-brand-rgb),0.06)), transparent)",
          }}
        >
          <h2 className="text-xl font-black mb-3">Design principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Theme-aware by default</strong>
              <p className="muted mt-0.5">
                No hardcoded colors. Every element inherits from CSS variables.
              </p>
            </div>
            <div>
              <strong>Dark mode is a first-class citizen</strong>
              <p className="muted mt-0.5">284 dark: variants across 91 files. 5 complete themes.</p>
            </div>
            <div>
              <strong>SSR-safe</strong>
              <p className="muted mt-0.5">
                No framer-motion in server components. CSS animations only for critical paths.
              </p>
            </div>
            <div>
              <strong>Accessibility built in</strong>
              <p className="muted mt-0.5">
                Skip-to-content, ARIA labels, sr-only, focus-visible rings, reduced-motion.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
