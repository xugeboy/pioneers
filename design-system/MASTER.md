# Pioneers UI Design System (MASTER)

This document is the single source of truth for the Pioneers B2B website UI. It defines the global visual language, typography, colors, spacing, components, motion, and accessibility rules. Page-specific overrides live in `design-system/pages/`.

## 1) Visual Direction
- **Tone:** modern, industrial, rugged, professional, outdoor, minimal, high-contrast.
- **Audience:** global B2B buyers (automotive accessories, cargo control, outdoor gear).
- **Core principles:**
  - Clarity over decoration.
  - Material honesty: flat surfaces, clean edges, and functional layout.
  - High contrast and legibility across devices.

## 2) Brand Typography
**Heading / Display:** Syncopate  
**Body / UI:** Space Mono

### Usage Rules
- Use Syncopate for H1–H3, section titles, and key numeric metrics.
- Use Space Mono for body, buttons, labels, tables, and metadata.
- Avoid italics or decorative alternates.
- Line-height targets:
  - H1: 1.05–1.15
  - H2/H3: 1.15–1.3
  - Body: 1.6–1.75

### Recommended Scale
- H1: 48–64px (desktop), 36–44px (mobile)
- H2: 32–40px (desktop), 26–32px (mobile)
- H3: 22–28px (desktop), 20–24px (mobile)
- Body: 16–18px
- Small: 12–14px

### Tailwind Utility Suggestions
- Headings: `font-display uppercase tracking-[0.06em]`
- Body: `font-body text-base leading-7`
- Subtle labels: `text-xs uppercase tracking-[0.2em] text-muted-foreground`

## 3) Color System
### Core Palette
- **Primary (navy):** `#0F172A`
- **Secondary (steel):** `#334155`
- **CTA (industrial blue):** `#0369A1`
- **Background:** `#F8FAFC`
- **Text:** `#020617`

### Semantic Colors
- **Success:** `#16A34A`
- **Warning:** `#D97706`
- **Error:** `#DC2626`
- **Border:** `#E2E8F0`
- **Muted text:** `#64748B`

### Usage Rules
- Primary on light background for headings and key metrics.
- CTA blue reserved for primary buttons, critical highlights.
- Use muted text for metadata only, never for body copy.
- Use solid borders in light mode to avoid washed-out UI.

## 4) Layout & Spacing
### Grid
- **Max width:** 1200–1280px
- **Gutter:** 24–32px (desktop), 16–20px (mobile)
- **Section padding:** 80–96px (desktop), 56–72px (mobile)

### Spacing System
Use 4px scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.

## 5) Core Components
### Buttons
- **Primary CTA:** solid `#0369A1`, white text, rounded-full, 16–18px font.
- **Secondary:** border + transparent background.
- **Hover:** color or shadow change only; avoid scale.

### Cards
- Flat, high-contrast borders.
- Rounded 12–16px.
- No glassmorphism; keep clarity.

### Badges / Tags
- Use for certifications, standards, load ratings.
- Small caps with high contrast.

### Form Inputs
- Clear borders, 44–48px height, visible focus ring.

## 6) Motion & Interaction
- **Transitions:** 150–250ms.
- **Hover:** opacity, shadow, border.
- **Avoid:** large scale transforms that move layout.
- **Reduced motion:** disable parallax and scroll-snap animations.

## 7) Accessibility
- Contrast ratio at least 4.5:1.
- All interactive elements have visible focus state.
- Provide alt text for every image.
- Text is not the only carrier of meaning.

## 8) Anti-patterns
- Playful or whimsical styling.
- Low-contrast gray text for main copy.
- Hidden credentials or certification details.
- Purple or neon gradients.
