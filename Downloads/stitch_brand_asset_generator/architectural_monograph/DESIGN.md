---
name: Architectural Monograph
colors:
  surface: '#101416'
  surface-dim: '#101416'
  surface-bright: '#363a3c'
  surface-container-lowest: '#0b0f11'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2d'
  surface-container-highest: '#323538'
  on-surface: '#e0e3e6'
  on-surface-variant: '#d0c5b3'
  inverse-surface: '#e0e3e6'
  inverse-on-surface: '#2d3133'
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
  tertiary: '#bac8d7'
  on-tertiary: '#25323d'
  tertiary-container: '#9eabba'
  on-tertiary-container: '#33404c'
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
  tertiary-fixed: '#d6e4f3'
  tertiary-fixed-dim: '#bac8d7'
  on-tertiary-fixed: '#101d28'
  on-tertiary-fixed-variant: '#3b4854'
  background: '#101416'
  on-background: '#e0e3e6'
  surface-variant: '#323538'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Outfit
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  sidebar_width: 260px
  gutter: 24px
  margin_desktop: 40px
  margin_mobile: 16px
  unit: 4px
---

## Brand & Style

This design system is a sophisticated fusion of high-density functionalism and premium editorial aesthetics. It targets a discerning executive audience that values both the raw utility of a "command center" and the prestige of a luxury monograph. The personality is authoritative, precise, and uncompromisingly professional.

The visual style is **High-Contrast Modernism** mixed with **Glassmorphism**. It utilizes a "dark-first" philosophy where depth is not created through shadows, but through the layering of translucent materials over a deep charcoal canvas. Every element is governed by a strict architectural grid, prioritizing information density without sacrificing clarity. 

Key visual markers include:
- **Strict 4px Geometry:** No organic curves; all containers and buttons use a disciplined 4px radius.
- **Glass Layers:** Use of backdrop blurs to signify "floating" command modules.
- **Watermark Script:** The signature BAZ script is used as a low-opacity, large-scale background element (opacity 0.03 - 0.05) to provide a bespoke, curated feel to expansive data views.

## Colors

The palette is anchored by **Charcoal (#1F2933)**, serving as the foundational architectural slab. **Gold (#C8A55A)** is used with extreme restraint for primary actions, critical status indicators, and editorial highlights.

- **Base:** #1F2933 (The primary canvas)
- **Elevated Surface:** #323F4B (Used for non-translucent card backgrounds)
- **Glass:** Primary background with 60% opacity and 20px backdrop blur.
- **Text:** Primary text in #F5F7FA (90% opacity), Secondary in #9AA5B1.
- **Highlight:** #C8A55A is reserved for success states, primary buttons, and signature typography accents.
- **System:** #EF4444 is used sparingly for destructive actions or "Live" status indicators.

## Typography

The typographic system pairs the geometric precision of **Outfit** for structure and headings with the modern legibility of **Poppins** for data and body copy. 

**Display and Headlines** should utilize tighter letter spacing to maintain the "Architectural" feel. **Labels** are strictly uppercase with generous tracking (10%) to act as structural markers in the dense dashboard layout. Large numbers (KPIs) should always use Outfit Semi-Bold to emphasize the "Command Center" aesthetic.

## Layout & Spacing

This design system uses a **Fixed-Sidebar Fluid-Content** grid. The layout is optimized for high information density, allowing multiple modules to coexist without visual clutter.

- **Sidebar:** A 260px fixed-width column on the left. It uses a slightly darker shade than the main canvas or a glass effect to establish depth.
- **Grid:** A 12-column fluid grid for the main stage, with 24px gutters.
- **Rhythm:** All spacing must be multiples of 4px. Use 24px for component grouping and 48px for section separation.
- **Command Center Structure:** Layouts should prioritize a "Header -> KPI Ribbon -> Main Module -> Secondary Insights" vertical flow.

## Elevation & Depth

Depth is achieved through **Material Stacking** rather than traditional shadows. 

1. **Level 0 (Canvas):** Solid #1F2933.
2. **Level 1 (Modules):** Solid #323F4B with a 1px border of #475467.
3. **Level 2 (Overlays/Glass):** 60% opacity background with a 20px blur and a subtle 1px inner glow (white at 10% opacity) on the top and left edges.
4. **Interaction:** Hover states on interactive modules should slightly increase the border brightness or shift the background color to a lighter tint of Charcoal; never use shadows to indicate lift.

## Shapes

The shape language is disciplined and sharp. The system-wide radius is **4px** (Soft-0), reflecting architectural precision. 

- **Buttons & Inputs:** Strictly 4px.
- **Cards & Modules:** Strictly 4px.
- **Status Chips:** Small 2px radius or sharp square corners for a "technical tag" look.
- **Icons:** Use linear, 1.5px stroke icons with square terminals to match the font geometry.

## Components

### Buttons
- **Primary:** Solid Gold (#C8A55A) with Charcoal text (#1F2933). 4px radius.
- **Secondary:** Transparent with a 1px Gold border.
- **Tertiary:** Text-only in Outfit All-Caps, Gold, with a 1px Gold bottom-border on hover.

### Modules (Cards)
- Dashboard modules use the Level 1 elevation (Solid #323F4B) or Level 2 (Glass) if floating. 
- Headers within modules must use the `label-caps` style in Gold to act as a clear structural anchor.

### Sidebar Navigation
- Active state uses a vertical Gold bar (2px width) on the left edge of the menu item and a subtle #323F4B background tint.
- Navigation icons are 20px, stroke-based, and neutral gray unless active.

### Inputs & Search
- Form fields are dark-filled (#111827) with a 1px #475467 border. 
- The search command center (as seen in the reference) should be a floating glass module with a high backdrop blur.

### Chips & Status
- "Live" or "New" indicators are small, high-contrast rectangles with 2px roundedness. Use `accent_red` for urgency and `primary_color` for general highlights.