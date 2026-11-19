---
trigger: glob
globs: "*.tsx, *.jsx, *.html, *.css"
description: "Mobile responsiveness standards (390px, 320px boundary), touch targets (>= 44px), accessibility, state resilience, and the Never List."
---

# Mobile Responsiveness, Accessibility, and Strict Anti-Patterns

A comprehensive verification checklist and absolute list of prohibitions to guarantee production-grade, human-centered frontend craftsmanship.

---

## 1. Mobile & Responsive Layout Standards

Mobile layout is part of core architecture, never a post-launch afterthought.

- **Viewport Range Verification:** Test layouts across 6 standard viewports:
  - `1440x900` (Standard Desktop)
  - `1024x768` (Small Desktop / Landscape Tablet)
  - `820x1180` (Tablet Portrait)
  - `768x1024` (Small Tablet Portrait)
  - `390x844` (Mobile Phone Standard)
  - `320px` (Minimum Boundary Viewport)
- **Zero Horizontal Overflow:** Content must never overflow horizontally. Prevent unwanted side-scrolling at 320px boundary. Text must not collide with fixed floating bars.
- **Minimum Touch Target Size (44px):** Every interactive button, filter pill, counter stepper, and icon trigger outside inline prose must have a clickable area of at least **44x44px**, with a minimum **8px** gap between adjacent targets.
- **Single-Column Mobile Stacking:** At 390px, multi-column card grids collapse cleanly to a single column; primary action buttons span full width; navigation collapses into a dedicated accessible drawer.

---

## 2. Accessibility & Human Factors (`antislop-human`)

- **Keyboard Navigability:** Every interactive element must be focusable via `Tab` and activatable via `Enter` or `Space`. No interactive control may be mouse-only.
- **Visible Focus Rings:** Every focused element must display a crisp, visible focus outline (`focus-visible:ring-2 focus-visible:ring-offset-2`). Never suppress focus rings with `outline: none` without providing an accessible alternative.
- **Skip Link:** A visible skip link (`Skip to main content`) must be the very first tab stop on the page, jumping immediately to `<main>`.
- **Informative Alt Text:** All informational imagery must provide concise, descriptive `alt` text. Purely decorative elements must have `aria-hidden="true"` or empty `alt=""`.
- **Sequential Headings:** Heading tags descend logically without skipping levels (`h1` -> `h2` -> `h3`).
- **Reduced Motion Support:** Wrap animations and loops with `@media (prefers-reduced-motion: reduce)`: all elements rest in their final legible states with zero hidden content.

---

## 3. State Resilience & Functional Completeness (Anti-Slop C-2, C-4)

- **Interactive Completeness:** Every button, tab, and link must perform a real action (open modal, scroll to section, update cart, copy text, or submit form). Dead placeholder buttons are defects.
- **Resilient UI States:** Every dynamic data section must handle 4 states cleanly:
  1. *Empty State:* Clear, helpful guidance when no data or search matches exist.
  2. *Loading State:* Accessible feedback while requests process.
  3. *Error State:* Clear, field-specific error messages directly under the problematic input.
  4. *Success State:* Confirmation dialogs or receipts only after real actions succeed.

---

## 4. The Combined "Never" List (Strict Prohibitions)

1. **Never use scroll-triggered fade-ins:** Do not make cards, rows, or tiles fade in as the user scrolls. Never apply uniform fade-in animations across all sections.
2. **Never hijack scrolling:** No scroll-jacking, smooth-scroll overrides, or parallax effects on typography.
3. **Never use tilt cards or random blinking effects:** Keep elements stable and comfortable to read.
4. **Never use stock photos disguised as real client assets:** If stand-ins are necessary, state them honestly; never fake a product or team member.
5. **Never draw look-alike copies of real logos or create fake brand vectors.**
6. **Never fabricate testimonials, user reviews, or security compliance badges.**
7. **Never use violet, purple, or lavender in the website's own palette.**
8. **Never create dead navbar links or buttons that do nothing.**
9. **Never leave empty visual grounds or broken image placeholders at any screen size.**
10. **Never use em dashes (`—`) in agent-written UI copy.**
