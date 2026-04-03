# Design System — TheMarketer

## Product Context
- **What this is:** AI marketing platform. Paste a URL, get ad recommendations, track performance, manage multiple brands.
- **Who it's for:** Solo marketer/founder running campaigns for multiple businesses.
- **Space:** Marketing tools, ad creative generation.
- **Project type:** Web app (Next.js).

## Aesthetic Direction
- **Direction:** Editorial Monochrome
- **Decoration level:** Minimal. Type and whitespace only. No icons in colored circles, no card shadows, no gradients.
- **Mood:** A Bloomberg terminal crossed with a Monocle magazine spread. Severe, professional, lets the marketing content be the most colorful thing on screen.

## Typography
- **Display/Hero:** Instrument Serif (italic for heroes, regular for section headings)
- **Body:** Geist
- **UI/Labels:** Geist
- **Data/Tables:** Geist (tabular-nums)
- **Code:** Geist Mono
- **Loading:** Google Fonts for Instrument Serif, Vercel CDN for Geist
- **Scale:** 14px base, 1.25 ratio
  - Hero: 72px
  - H1: 48px
  - H2: 32px
  - H3: 24px
  - Body: 14px
  - Small: 12px
  - Micro: 11px

## Color
- **Approach:** Restrained. No accent color. Black IS the brand.
- **Background:** #FFFFFF (light), #0A0A0A (dark)
- **Surface:** #F5F5F5 (light), #141414 (dark)
- **Text:** #0A0A0A (light), #FAFAFA (dark)
- **Muted:** #737373
- **Border:** #E5E5E5 (light), #262626 (dark)
- **Accent:** None. Buttons are text-color on bg-color. No separate brand color.
- **Semantic:** success #16A34A, warning #CA8A04, error #DC2626
- **Dark mode:** Invert surfaces. Reduce saturation on semantic colors by 10%.

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)

## Layout
- **Approach:** Grid-disciplined
- **Max content width:** 800px (content), 1200px (data tables)
- **Border radius:** 8px default. Subtle, consistent. Buttons 6px, cards 10px, inputs 6px, modals 12px.

## Motion
- **Approach:** Minimal-functional
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** hover(150ms) transition(200ms)
- **No entrance animations, no scroll effects.**

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-03 | Initial design system | Editorial monochrome. Anti-AI-aesthetic. Zero radius. No accent color. Instrument Serif + Geist. |
