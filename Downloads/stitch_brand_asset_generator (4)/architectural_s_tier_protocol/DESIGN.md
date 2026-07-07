---
name: Architectural S-Tier Protocol
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#d0c5b3'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#998f7f'
  outline-variant: '#4d4638'
  surface-tint: '#e7c274'
  primary: '#e7c274'
  on-primary: '#402d00'
  primary-container: '#c8a55a'
  on-primary-container: '#513b00'
  inverse-primary: '#765a16'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#eac07a'
  on-tertiary: '#422c00'
  tertiary-container: '#cba360'
  on-tertiary-container: '#543900'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf9f'
  primary-fixed-dim: '#e7c274'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5b4300'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#ffdeab'
  tertiary-fixed-dim: '#eac07a'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4105'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
  charcoal: '#1F2933'
  navy: '#24364A'
  sand: '#E8E4E0'
  stone: '#B0AAA5'
  gold-light: '#E5C97A'
  ink-black: '#0A0A0A'
typography:
  headline-lg:
    fontFamily: Outfit
    fontSize: 88px
    fontWeight: '400'
    lineHeight: '1.05'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Outfit
    fontSize: 56px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-sm:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Poppins
    fontSize: 20px
    fontWeight: '300'
    lineHeight: '1.6'
  body-md:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  technical-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0.05em
  label-eyebrow:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.3em
  label-micro:
    fontFamily: Outfit
    fontSize: 10px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.2em
spacing:
  container-max: 1280px
  section-py-desktop: 8rem
  section-py-mobile: 6rem
  gutter: 2rem
  stack-sm: 1rem
  stack-md: 4rem
---

## Brand & Style

This design system is engineered for **BAZventures**, embodying the persona of a technically elite, engineering-first operation. The brand personality is decisive, high-trust, and operationally sharp. 

The visual direction follows an **"Architectural Monograph"** aesthetic—a blend of high-end editorial design and rigorous technical protocol. It utilizes a **Minimalist** approach with a **Corporate/Modern** backbone, characterized by deep-space blacks, clinical white, and a singular, authoritative gold accent. The vibe is executive and secure, favoring structural integrity and "S-Tier" efficiency over decorative flourish.

**Key Stylistic Principles:**
- **Strict Functionalism:** Every element must serve a purpose; if it doesn't contribute to technical superiority, it is removed.
- **Elite Restraint:** Use white space and high-contrast typography to convey power.
- **Operational Precision:** Motion is slow, deliberate, and eased, reflecting a controlled and stable environment.

## Colors

The palette is **dark-first**, utilizing deepest night-mode blacks to create a void-like backdrop that emphasizes the technical content. Gold is the only saturated color allowed, serving as an authoritative marker of quality and "S-Tier" status.

**Color Application Rules:**
- **The Core:** Use `#000000` (Neutral) as the primary canvas. Transition to `#0A0A0A` (Ink-Black) or `#1F2933` (Charcoal) for section alternating.
- **The Accent:** Gold (`#C8A55A`) is used with extreme discipline. It is reserved for primary actions, iconography, and status indicators. 
- **The Gradient:** When depth is required, use a linear gradient from `Gold-dark` (#8D6B2E) to `Gold-light` (#E5C97A).
- **Hairlines:** Never use solid grays for borders. Use `White` at very low alpha (6%–18%) to create ghost-like structural dividers.
- **Typography Tinting:** Use `White` for headers, `Sand` for lead text, and `Stone` for technical data or muted body text.

## Typography

The typographic system is sharp and geometric. It relies on scale rather than weight to establish hierarchy.

**Font Roles:**
- **Display (Outfit):** Used for all headlines, big numerals, and buttons. Set to Weight 400 for a sophisticated, light-architectural feel.
- **Body (Poppins):** Used for standard UI and paragraph text. 
- **Technical (JetBrains Mono):** Used for data, labels, and specific engineering-focused metadata to reinforce the "Protocol" vibe.

**Stylistic Rules:**
- **Tracking:** Headlines should have tight tracking (`-0.02em`). Small labels and eyebrows must have wide tracking (`0.2em` to `0.35em`) to emphasize the monograph style.
- **Case:** Use `UPPERCASE` for all display elements (Headlines, Eyebrows, Buttons).
- **Hierarchy:** Eyebrows sit above every H2 in the Gold primary accent color.

## Layout & Spacing

The system follows a **Fixed Grid** philosophy with a centered container that prioritizes content focus and legibility.

**Grid & Alignment:**
- **Max Width:** Content is constrained to a 1280px container.
- **Section Rhythm:** Vertical spacing is generous (`8rem` on desktop) to allow the "Architectural" layout to breathe.
- **Columns:** Use a 12-column grid for complex layouts, typically split into 2, 3, or 4 equal modules for services and case studies.
- **Reflow:** On mobile devices, all grids collapse into a single-column stack with standardized `1.5rem` horizontal margins.

**Spacing Rhythm:**
- Use a consistent `4rem` (stack-md) bottom margin for section headers to separate them from the content grid.
- Use `1rem` (stack-sm) for spacing between eyebrows and their respective headings.

## Elevation & Depth

In this system, depth is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than traditional shadows. Shadows are strictly prohibited to maintain the "flat monograph" feel.

**Depth Indicators:**
- **Layering:** Backgrounds alternate between `#000000` (deepest) and `#0A0A0A` (raised) to create a subtle sense of stacking.
- **Glassmorphism (Navigation only):** The fixed header uses a "Dark Gloss" effect—`72%` opacity black with an `18px` backdrop blur. This is the only exception to the flat rule.
- **Hairline Borders:** Surfaces like cards or input fields are defined by 1px hairlines (`border-white/10`).
- **Watermarks:** Large, ghostly logo watermarks at `0.04 - 0.08` opacity are placed behind content in the Hero and Contact sections only.

## Shapes

The shape language is defined by **Strict Square Discipline**. 

**The Rule of 0:**
- All UI elements—including buttons, input fields, cards, and containers—have **0px roundedness**. 
- To maintain consistency with the CSS stack, a 4px "Soft" radius is allowed *only* if required for technical legibility in small icons, but the primary brand posture is 90-degree sharp corners.
- **Exceptions:** There are zero exceptions for brand components. Even buttons must remain sharp rectangles to convey "Technical Superiority."

## Components

Components are designed to be efficient, high-contrast, and strictly functional.

**Buttons:**
- **Primary:** Solid Gold gradient fill with white text. No shadows or glows.
- **Secondary:** Transparent background with a 1px Gold border.
- **Interactions:** Per user request, **no hover effects** are applied to buttons. They are static, reliable, and decisive.

**Cards & Surfaces:**
- **Service Blocks:** Use Charcoal (`#1F2933`) backgrounds with a 1px `white/10` border.
- **Status Indicators:** Technical data points should use `JetBrains Mono` and be framed in Gold hairlines.

**Input Fields:**
- **Styling:** Dark backgrounds (`#1A1A1A`), 1px `white/18` borders, and Gold borders on active focus. 
- **Placeholders:** Muted Stone (`#B0AAA5`).

**Logo Watermarks:**
- Implement as high-scale SVG silhouettes in the background of the Hero and Contact sections. Opacity must not exceed 8% to ensure they remain "ghostly."

**Dividers:**
- Vertical or horizontal lines must be `white/10`. In process steps, use vertical hairlines to separate the sequence, reinforcing the engineering flow.