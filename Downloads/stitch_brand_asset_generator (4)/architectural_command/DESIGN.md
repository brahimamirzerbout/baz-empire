---
name: Architectural Command
colors:
  surface: '#151310'
  surface-dim: '#151310'
  surface-bright: '#3c3935'
  surface-container-lowest: '#100e0b'
  surface-container-low: '#1e1b18'
  surface-container: '#221f1c'
  surface-container-high: '#2d2926'
  surface-container-highest: '#383431'
  on-surface: '#e8e1dc'
  on-surface-variant: '#d0c5b3'
  inverse-surface: '#e8e1dc'
  inverse-on-surface: '#33302c'
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
  tertiary: '#c9c6c2'
  on-tertiary: '#31302e'
  tertiary-container: '#aca9a5'
  on-tertiary-container: '#3f3e3b'
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
  tertiary-fixed: '#e6e2de'
  tertiary-fixed-dim: '#c9c6c2'
  on-tertiary-fixed: '#1c1b19'
  on-tertiary-fixed-variant: '#484744'
  background: '#151310'
  on-background: '#e8e1dc'
  surface-variant: '#383431'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 72px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Poppins
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.08em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The design system embodies the "Architectural Monograph" aesthetic—a blend of premium editorial layouts and high-density functional utility. It is designed for high-stakes marketing operators who require a "Command Center" feel without sacrificing the sophistication of a boutique agency.

The style is primarily **Minimalist** with **Corporate/Modern** systematic rigor. It leverages heavy whitespace in editorial sections and high-information density in dashboard views. The emotional response is one of absolute precision, authority, and quiet luxury. Visual interest is generated through strict grid alignment, stark tonal shifts between sections, and the use of gold as a surgical accent against deep charcoal backgrounds.

## Colors

The palette is rooted in a deep, professional atmosphere. The primary background is **Deep Charcoal (#1F2933)**, providing a softer alternative to pure black for long-form data consumption. 

- **Primary (Gold):** Used exclusively for high-value accents, active states, and critical call-to-actions.
- **Secondary (Charcoal):** The foundational surface color.
- **Text Hierarchy:** **Sand (#E8E4E0)** is reserved for primary headings and body text to ensure high legibility. **Stone (#B0AAA5)** is used for labels, captions, and secondary metadata.
- **Rhythm:** Layouts must alternate between Charcoal and **Black (#000000)** sections to create a sense of structural "chapters" within the user journey.

## Typography

The typography system creates a clear distinction between "The Narrative" (Outfit) and "The Tool" (Poppins).

**Outfit** is the display face. It should be used for all headlines and large numbers. It possesses a geometric clarity that feels architectural. Tighten letter-spacing for larger sizes to maintain a premium, "locked-in" look.

**Poppins** is the workhorse. Its high x-height and circular forms provide an approachable yet professional feel for dashboards, data tables, and dense UI labels. 

Always use **Stone (#B0AAA5)** for `label-sm` to maintain a clear hierarchy between content and metadata.

## Layout & Spacing

The system utilizes a strict **12-column fluid grid** constrained to a **1280px max-width**. 

- **Grid Logic:** Gutters are fixed at 24px to ensure a clean vertical line of sight, essential for complex service grids and dashboard cards.
- **Rhythm:** Vertical spacing between major sections should be generous (120px+) to reflect the architectural monograph inspiration.
- **Density:** Inside components like "Command Center Cards," use a tight 8px base grid to maximize information density while maintaining alignment.
- **Mobile:** Transition to a 4-column grid with 20px margins. Headlines scale down significantly to avoid awkward breaks.

## Elevation & Depth

This system avoids traditional shadows in favor of **Tonal Layers** and **Low-contrast outlines**. 

Hierarchy is established by surface color variance:
- **Level 0 (Floor):** Pure Black (#000000) or Charcoal (#1F2933).
- **Level 1 (Cards/Sidebar):** A 5% lighter tint of the background color or a 1px solid border in Stone (#B0AAA5) at 15% opacity.
- **Interactive:** Hover states on cards should utilize a subtle 1px Gold (#C8A55A) border rather than a drop shadow.

This creates a "flat-yet-layered" depth that feels like a physical blueprint or a high-end technical document.

## Shapes

The shape language is defined by a **strict 4px border-radius**. This "Square Posture" reinforces the architectural and technical narrative of the brand.

- **Standard Elements:** Buttons, Input fields, and Dashboard cards all use the 4px radius.
- **Exceptions:** Pills used for status indicators (e.g., "Live") can be fully rounded to provide a soft visual counterpoint to the otherwise rigid geometry.
- **Iconography:** Use "Self-drawing" SVG icons with a 1.5pt stroke width. Icons should be geometric and avoid fill, appearing as technical line drawings.

## Components

### Buttons
- **Primary:** Gold background, Charcoal text. 4px radius. No shadow.
- **Secondary:** Ghost style. Stone border (1px), Sand text. 
- **Motion:** On hover, primary buttons should have a slight "shimmer" or a slow fade to a brighter gold.

### Navigation (Sidebar)
- Fixed width (240px). Deep Charcoal background. 
- Active state indicated by a Gold vertical bar (2px width) on the left edge and a subtle tonal shift in the background.
- Icons should be Stone, shifting to Sand on hover.

### Command Center Cards
- Used for the dashboard. 4px border.
- Header uses `label-sm` in Stone. 
- Primary metric uses `headline-md` in Gold.
- Background is slightly lighter than the page floor.

### Service Grids
- 12-column layout. Each service block spans 4 columns on desktop.
- Large numerical indicators (01, 02) should be rendered in Gold using Outfit to guide the eye.

### Motion & Transitions
- **Transitions:** Use `cubic-bezier(0.4, 0, 0.2, 1)` with a duration of 400ms for all page transitions. This creates a "heavy," premium feel.
- **SVG Animation:** Icons and the "Triangle Loop" graphic should feature a self-drawing line animation (path-offset) when the section enters the viewport.