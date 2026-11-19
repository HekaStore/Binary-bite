---
trigger: glob
globs: "*.tsx, *.jsx, *.html, *.css, *.ts"
description: "Design system tokens, asset matrix, layout grids, typography, color palettes, icons, and component usage."
---

# Design System, Assets Matrix, and Component Standards

Maintain strict visual cohesion through a disciplined token system, shared layout bounds, authentic iconography, and controlled component behavior.

## 1. Asset Service Matrix by Page Kind

A dash (`-`) indicates the asset is prohibited for that category:

| Asset / Capability | Software & Gaming | Hardware | Product & Service | Place | Rule Reference |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Style** | Dealt interactive/UI hero | Dealt hardware hero | Dealt product hero | Printed place photo hero | Single screen, no overlap |
| **Grid & Tokens** | Standard system tokens | Standard system tokens | Standard system tokens | Place-specific tokens | Equal container edges |
| **Forms & Keyboard** | Required | Required | Required | Required | Accessible, visible focus |
| **Hover / Press Layer** | Full motion layer | Full motion layer | Full motion layer | Full motion layer | Lift 2px, zoom 1.02–1.03 |
| **Card Loops / Counts** | Allowed (2.5–4 s cycle) | Allowed | — | — | Must have pause if > 5s |
| **Photographs** | People, customers, world | Lead visual | Lead visual (2+/screen) | Lead (12–20 frames) | Real photos only, no stock |
| **Real Tool Icons** | Full-colour real icons | Real brand icons | Real tools actually used | — | Never drawn look-alikes |
| **UI Fragments** | Live HTML mocks in card | Companion app UI | Client companion app | — | Authentic data, no lorem |
| **Diagram Cards** | 0–2 pulsing diagram cards | 0–2 pulsing diagram cards | 0–1 still diagram | — | Hub/lanes/pulses |
| **CSS Grounds** | 0–2 subtle styled grounds | 0–2 styled grounds | Flat clean tokens | Flat clean tokens | High contrast, no murk |
| **Shader Grounds** | At most 1 shader ground | At most 1 shader ground | — | — | WebGL on CPU fallback |
| **Creative Parts (`fx-*`)** | Active creative modules | Active creative modules | Plain photo / still map | Still map only | Purposeful motion |
| **Award Moments** | 1–2 dealt moments | 1–2 dealt moments | 1–2 (photo or type led) | 1–2 (photo or type led) | In dedicated sections |
| **Big 3D Scenes** | 0–1 scene maximum | 0–1 scene maximum | — | — | Max 4 WebGL contexts |

---

## 2. Design Tokens and Styling Principles

### Corner Radius
- **`sharp` (0px – 4px):** Mandatory for fintech, developer tooling, terminal/IDE aesthetics, and high-density technical products.
- **`soft` (6px – 12px):** Default standard for modern B2B SaaS, enterprise, hardware, and commercial offerings.
- **`round` (16px – 24px+ / full pill):** Reserved for casual consumer apps, lifestyle, and playful products.
- **Square:** Standard for authentic physical place cards and photo galleries.

### Color & Palette Disciplines
- **Strict Prohibition on Violet:** Never use violet, purple, or lavender as an accent, ground, gradient, tinted shadow, or effect color in the site's own palette. If a third-party brand or client logo uses purple, keep the logo untouched, but keep the site palette grounded in neutral, slate, cobalt, sky, emerald, amber, or warm earthen tones.
- **High Contrast:** Ensure text meets WCAG AA/AAA standards against backgrounds. Never place muted grey text on medium-grey surfaces.
- **Lit Grounds (`data-ground`):** When using subtle tinted backdrops on tech pages, restrict to disciplined shades (`sand`, `sky`, `sage`) with proper contrast.

### UI & Diagram Cards
- **Live HTML UI:** Construct UI examples using actual markup, semantic badges, and crisp monospace details rather than static screenshots or generic vector art.
- **Real Icons:** Always source official SVGs for recognized technologies, apps, and platforms. Never use improvised or hand-traced vector copies.
- **Diagrams:** Keep card diagrams concise:
  - Hub with outward branches.
  - Linear pipelines (1 input -> processor -> 3 parallel lanes).
  - Subtle running pulses along connection lines.
