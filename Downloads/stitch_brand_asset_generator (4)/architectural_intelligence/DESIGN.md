---
name: Architectural Intelligence
colors:
  surface: '#0c141a'
  surface-dim: '#0c141a'
  surface-bright: '#323a41'
  surface-container-lowest: '#070f15'
  surface-container-low: '#151c23'
  surface-container: '#192127'
  surface-container-high: '#232b31'
  surface-container-highest: '#2e363c'
  on-surface: '#dbe3ec'
  on-surface-variant: '#d0c5b3'
  inverse-surface: '#dbe3ec'
  inverse-on-surface: '#293138'
  outline: '#998f7f'
  outline-variant: '#4d4638'
  surface-tint: '#e7c274'
  primary: '#e7c274'
  on-primary: '#402d00'
  primary-container: '#c8a55a'
  on-primary-container: '#513b00'
  inverse-primary: '#765a16'
  secondary: '#bdc7d5'
  on-secondary: '#27313c'
  secondary-container: '#3e4853'
  on-secondary-container: '#acb6c3'
  tertiary: '#c4c7ca'
  on-tertiary: '#2d3133'
  tertiary-container: '#a7aaad'
  on-tertiary-container: '#3b3f41'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf9f'
  primary-fixed-dim: '#e7c274'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5b4300'
  secondary-fixed: '#d9e3f1'
  secondary-fixed-dim: '#bdc7d5'
  on-secondary-fixed: '#121d26'
  on-secondary-fixed-variant: '#3e4853'
  tertiary-fixed: '#e0e3e6'
  tertiary-fixed-dim: '#c4c7ca'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#44474a'
  background: '#0c141a'
  on-background: '#dbe3ec'
  surface-variant: '#2e363c'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1'
  data-small:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1'
spacing:
  sidebar_width: 260px
  gutter: 24px
  margin_edge: 40px
  container_gap: 16px
  section_padding: 64px
---

## Brand & Style

This design system establishes a high-authority environment for data-driven decision-making. It targets executive leadership and performance marketers who demand both aesthetic refinement and dense information utility. The visual narrative is defined as **Premium Minimalism meets Technical Brutalism**.

The UI evokes the feeling of an "architectural monograph"—intentional, structured, and permanent. We balance the warmth of a luxury identity with the cold precision of a developer tool. Key attributes include:
- **Authority:** Bold, high-contrast typography and a rigid structural grid.
- **Precision:** Sharp square corners and monospaced accents for data points.
- **Depth:** A sophisticated use of dark-mode layering, utilizing glass-morphism and subtle background blurs to separate the command navigation from the analytical canvas.

## Colors

The palette is rooted in a deep, "Charcoal" foundation to provide maximum contrast for data visualization and premium gold accents.

- **Primary (Gold):** Reserved for high-value calls to action, brand markers, and critical focus states.
- **Secondary (Charcoal):** The core surface color, used for sidebars and container backgrounds.
- **Neutral (Ink):** The absolute background color, providing the "infinite" canvas feel.
- **Accents:** Vibrant Red is used for "Live" indicators and destructive actions; Green is used for positive growth metrics and active system statuses.
- **Data Layers:** Use semi-transparent variants of the Secondary color for glass-morphism effects, allowing the deep background to peak through.

## Typography

The typography strategy uses **Outfit** for its geometric clarity and modern professional tone. For specialized data contexts and technical labels, **JetBrains Mono** (or similar monospaced font) is introduced to provide a "system-level" feel to metrics and logs.

- **Editorial Impact:** Use `display-lg` for hero marketing statements, often paired with the Gold primary color.
- **Hierarchy:** Maintain a strict "Top-Down" hierarchy. Labels should almost always be in `label-caps` to distinguish them from interactive content.
- **Data Fidelity:** All numeric values in dashboard tiles should utilize the monospaced `data-display` style to ensure tabular alignment and legibility.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. A fixed vertical "Command Navigation" sits on the left, while the main dashboard area utilizes a fluid grid that maximizes data density.

- **Grid System:** A 12-column grid is used for the main content area. Dashboard tiles should span 3, 4, or 6 columns depending on the metric complexity.
- **Density:** Information density is high. Use `container_gap` (16px) for internal tile spacing to keep elements tightly coupled but distinct.
- **Command Sidebar:** This navigation remains persistent. It uses a glass-morphic blur (`backdrop-filter: blur(20px)`) to indicate its "overlay" status on top of the content canvas.
- **Breakpoints:**
  - **Mobile (<768px):** Sidebar collapses to a bottom navigation bar or a hamburger menu. Margins reduce to 16px.
  - **Desktop (>1440px):** Content area is capped at 1600px width with auto-margins to maintain readability.

## Elevation & Depth

This design system avoids traditional drop shadows in favor of **Tonal Elevation** and **Glass-morphism**.

- **Level 0 (Base):** The #0F171D "Ink" background.
- **Level 1 (Cards/Tiles):** #1F2933 "Charcoal" with a 1px solid stroke of #2D3748 (subtle gray) to define edges. No shadow.
- **Level 2 (Interactive/Floating):** Use glass-morphism (background: rgba(31, 41, 51, 0.7)) with a backdrop-blur. This is reserved for the Sidebar, Tooltips, and Modals.
- **Visual Nodes:** In diagrammatic views, use glow effects (outer blurs) in the Primary Gold or Accent colors to indicate active "nodes" or "pulses" in the marketing loop.

## Shapes

To reinforce the "architectural" and "premium" narrative, the design system utilizes **hard, square corners (0px radius)** for all primary UI elements including buttons, input fields, cards, and the sidebar.

- **Exceptions:** Status dots (Live/Offline) and specific icon containers within node diagrams may use circular geometry to provide a visual break from the rigid grid.
- **Strokes:** Use ultra-thin (1px) borders for all containers. Avoid heavy borders unless used for a specific "high-contrast" focus state.

## Components

### Buttons
- **Primary:** Solid Gold (#C8A55A) background, Black text, square corners.
- **Secondary:** Transparent background, 1px Gold border, Gold text.
- **Ghost:** Transparent background, White text, square corners.

### Dashboard Tiles (Metric Cards)
- **Structure:** Label (top-left, uppercase), Primary Metric (center-left, monospaced), Trend Indicator (bottom-right).
- **Style:** Charcoal background, 1px stroke. Use "Glass" variant for high-priority global metrics.

### Command Navigation
- **Active State:** A solid red or gold left-border (4px) with a subtle background highlight.
- **Grouping:** Use monospaced labels for categories (e.g., CREATE, INTEL, OPERATE) to separate nav sections.

### Node Diagrams
- **Nodes:** Large circular containers for entities (e.g., Sales, Marketing). Use "Glow" states to indicate data flow.
- **Paths:** Thin 1px lines. Use dashed lines for "pending" data and solid lines for "active" loops.

### Input Fields
- **Style:** Underline-only or 1px border. Background should be slightly darker than the card level to create an inset feel.
- **Focus:** Border transitions to Primary Gold.