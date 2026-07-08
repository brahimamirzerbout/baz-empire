# AGENTS.md — BAZ Marketing Hub (Tauri Desktop Shell)

Thin **native desktop shell** over the Next.js Marketing Hub. This repo contains
**no frontend** — it loads the Hub (local dev server in dev, the deployed URL in
production builds) inside a Tauri v2 webview window.

The actual Hub codebase lives at `~/marketing-hub` (Next.js + Supabase). **This
repo is only the shell.** Edit Hub features in `~/marketing-hub`, not here.

## Stack
- Tauri v2 (Rust shell) — `src-tauri/`
- No bundled frontend; remote-frontend app (`devUrl` / `frontendDist` point at the Hub)
- pnpm, identifier `com.baz.marketinghub`, productName "BAZ Marketing Hub"

## Config (`src-tauri/tauri.conf.json`)
- `build.devUrl` → `http://localhost:3000` (the local Hub dev server)
- `build.frontendDist` → `https://marketing-hub-roan.vercel.app` (YOUR prod Hub;
  from repo homepageUrl + `~/marketing-hub/.vercel` linkage; `/cockpit`/`/crm`/`/login` all 200)
- `build.beforeDevCommand` → starts the Hub at `:3000` if not already running
- Window: 1440×900, min 1024×700, centered, resizable

## Prerequisites
- **Rust** — installed at `~/.cargo` (user-local, no sudo). Source: `. "$HOME/.cargo/env"`.
- **System libs (Debian 13, one-time, sudo)** — required before `tauri dev`/`build`:
  ```bash
  sudo apt install -y libwebkit2gtk-4.1-dev librsvg2-dev libgtk-3-dev \
    libayatana-appindicator3-dev libssl-dev build-essential pkg-config libxdo-dev
  ```
- **pnpm** — the shell project. Note: a stray `~/pnpm-workspace.yaml` hijacks pnpm
  workspace-root detection, so this project ships its own `pnpm-workspace.yaml`
  (`packages: []`) to be a self-contained root. Do not remove it.

## Commands
- `pnpm tauri dev` — launches the Hub (if down) and opens the native window over `localhost:3000`.
- `pnpm tauri build` — builds the desktop binary; loads the prod Hub URL at runtime.
- `pnpm tauri info` — print config/diagnostics (no webview/Rust build needed).

## "Do it properly" — next phase (unified cross-platform update pipeline)
Goal: one version source + signed update manifest pushing to **site/hub (Vercel)**,
**Tauri desktop (updater plugin)**, and **phone (Capacitor today → Tauri v2 mobile
candidate)**. Roadmap:
1. **Prod URL confirmed** — `https://marketing-hub-roan.vercel.app` is the real
   Hub (repo homepageUrl; Vercel project `marketing-hub` prj_8LMclxJVzf3IlQvU7ew3fPanjJev;
   `/cockpit`/`/crm`/`/login` all 200). The bare `marketing-hub.vercel.app` belongs
   to someone else. Keep prod synced by pushing `main` (Vercel auto-deploy).
   - **Update economics:** the shell loads the live URL, so Hub/site updates need
     **zero shell-side release** — only native-shell changes (window, plugins,
     Rust) need a Tauri updater push. Phone (Capacitor) needs store/OTA. One
     semver source; three delivery rails.
2. **Webview auth** — cookie/session scope for the prod origin inside Tauri's
   WebKit; the Hub's stateless HMAC sessions help. Likely need token-in-header
   auth for the desktop client (3rd-party-cookie limits). Scope a capability for
   the remote origin if we inject Tauri APIs into the Hub.
3. **Native affordances** (Tauri plugins) — app menu, system tray, global hotkey,
   notifications, **biometric unlock** (mirror the Capacitor cockpit), deep links,
   FS import/export of assets/reports.
4. **Unified updater** — Tauri `updater` plugin (signed keypair, JSON manifest on
   a static host) for desktop; wire the Hub's deploy to bump the manifest version.
   Phone: decide Capacitor-vs-Tauri-mobile live-update (Capacitor via store;
   Tauri mobile via same updater pipeline). One semver source for all three.
5. **Brand** — Midnight Terminal window chrome + icon set + splash; CSP hardening
   (currently `null`).
6. **CSP / security** — set a real CSP allowing the Hub origin; lock capabilities
   to the remote origin; drop `csp: null`.

## Risks / assumptions
- [fact] Prod Hub URL is `https://marketing-hub-roan.vercel.app` (yours; confirmed
  via repo homepageUrl + `.vercel` linkage + route probes). The bare
  `marketing-hub.vercel.app` is someone else's project. DEPLOY.md's
  `roi-marketing.vercel.app` serves "Pivot Studio" — stale/wrong, ignore it.
- [assumption] `marketing-hub.vercel.app` auto-deploys from `main`; verify before
  relying on it for production desktop builds.
- [risk] Remote-frontend shell depends on the Hub being reachable at runtime;
  no offline bundle today (service worker caches visited routes only).
- This shell does **not** duplicate the Hub — it is a viewport. Do not rebuild
  Hub features here.