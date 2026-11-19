---
trigger: glob
globs: "*.tsx, *.jsx, *.html, *.css, *.ts"
description: "Design system tokens, anti-slop color disciplines (strict no-violet), typography, iconography, and UI component standards."
---

# Design System: Tokens, Palettes, Iconography, and UI Components

Enforce disciplined visual hierarchy and eliminate generic AI design artifacts. A design must feel custom-tailored to the brand identity, not assembled from generic UI templates.

---

## 1. Anti-Slop Visual Traps to Eliminate

Audit every screen to ensure these recognizable AI-generated cliches are rejected:

- **No Generic Blue-Purple Gradients:** Reject blue-to-purple, purple-to-pink, and ambient colored backdrops.
- **No Trend Stacking:** Do not combine glassmorphism + mesh gradient + glow + monospace labels + dot grid background on a single surface.
- **No Excessive Glassmorphism:** Restrict backdrop blur (`backdrop-blur`) to floating sticky navbars or elevated sheets. Do not apply glass blur to cards, sidebars, and modals simultaneously.
- **No Unmotivated Glow Effects:** Remove box-shadow glow from cards, icons, and badges unless indicating an active live connection.
- **No Unjustified Dark Mode:** Do not make a website dark simply to look "tech". Physical destinations, retail, and traditional services belong on crisp light grounds with high-contrast slate typography.
- **No Decorative Background Grids:** Avoid graph paper, blueprint lines, and dot grids unless the product is specifically a developer canvas or CAD tool.

---

## 2. Corner Radius & Token Hierarchy

- **`sharp` (0px – 4px):** Mandatory for fintech, developer tooling, terminal/IDE aesthetics, and high-density technical products.
- **`soft` (6px – 12px / `rounded-2xl`):** Standard for B2B SaaS, modern software, enterprise tools, and commercial products.
- **`round` (16px – 24px+ / pill):** Reserved for playful consumer apps and lifestyle products. Never make *every* element pill-shaped.
- **Square:** Standard for authentic photography frames and place cards.

---

## 3. Color Discipline & Palette Invariants

- **Strict Prohibition on Violet:** Never use violet, purple, or lavender in the website's own palette (as background, accent, gradient, border, or tinted shadow). If a client logo or third-party badge contains purple, preserve the logo as-is, but keep the website palette grounded in slate, cobalt, sky, emerald, amber, or warm earthen neutrals.
- **Contrast Standards (WCAG AA/AAA):** Text must achieve at least 4.5:1 contrast against its background (3:1 for large headings). Never place muted grey text on medium-grey or tinted pastel surfaces.
- **Lit Grounds (`data-ground`):** On technical pages, keep backdrops grounded in disciplined, subtle shades (`sand`, `sky`, `sage`). On non-tech pages, use clean flat tokens.

---

## 4. Iconography, Diagrams, and UI Components

- **Real Full-Colour Icons:** Use authentic, official brand SVGs in their original brand colors for tools, platforms, and services. Never use hand-drawn approximations or monotone look-alikes.
- **Diagram Cards:** Keep system diagrams clear, purposeful, and structured:
  - Central hub with outward branching lines.
  - Linear execution pipelines (single input -> processing core -> parallel output lanes).
  - Subtle running pulses along connecting traces.
- **Live HTML UI Fragments:** When demonstrating a software product, construct the preview with real semantic HTML, badges, diff lines, and monospace counters, rather than a generic screenshot or grey skeleton wireframe.

---

## 5. Asset Capability Matrix by Trade

| Asset / Component | Software & Gaming | Hardware | Product & Service | Place (Cafes / Stands) |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Style** | Interactive UI hero | Hardware photo hero | Product photo hero | Authentic photo hero |
| **Hover / Press Layer** | Lift 2px, press step | Lift 2px, press step | Lift 2px, press step | Lift 2px, press step |
| **Card Animation Loops** | 2.5–4 s cycle (with pause) | 2.5–4 s cycle | Prohibited | Prohibited |
| **Real Tool Icons** | Brand SVGs | Brand SVGs | Real tools used | Prohibited |
| **Diagram Cards** | 0–2 pulsing cards | 0–2 pulsing cards | 0–1 still diagram | Prohibited |
| **CSS Grounds** | 0–2 subtle styled grounds | 0–2 styled grounds | Flat clean tokens | Flat clean tokens |
| **Shader Grounds** | At most 1 shader ground | At most 1 shader ground | Prohibited | Prohibited |
| **Award-Site Moments** | 1–2 dealt moments | 1–2 dealt moments | 1–2 (photo or type) | 1–2 (photo or type) |
