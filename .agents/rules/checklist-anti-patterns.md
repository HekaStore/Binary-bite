---
trigger: glob
globs: "*.tsx, *.jsx, *.html, *.css"
description: "Comprehensive frontend quality checklist across breakpoints (1440 to 320), a11y, motion, and strict anti-patterns (Never rules)."
---

# Frontend Quality Checklist and Anti-Patterns

A comprehensive verification rubric and list of strict prohibitions to guarantee production-grade frontend output that matches the quality bar of figma.com and x.ai.

## 1. Quality Checklist

### First Screen & Hero
- [ ] First screen states plainly what is sold, for whom, and where.
- [ ] At least one concrete, hard fact is displayed above the fold.
- [ ] The hero fills the first viewport alone across all viewport widths.
- [ ] The primary call-to-action button is fully visible inside the first screen without requiring a scroll.

### Section Geometry & Spacing
- [ ] **One section per screen:** Every section is budgeted to 1 or 2 screens tall at 1440x900.
- [ ] The section's `h2` heading is positioned first and top-aligned.
- [ ] No subsequent section's heading or content peeks into the active viewport.
- [ ] No empty, sparse, or unbalanced half-screens.
- [ ] **Equal edges:** Left and right margins of the content container are strictly symmetrical. No horizontal overflow or sideways scrolling.

### Visuals & Iconography
- [ ] Every image, diagram, and visual renders cleanly without empty placeholder boxes at 1440, 1024, 768, and 390px.
- [ ] **No captions:** Do not place explanatory captions, disclaimers, or labels directly under photos or renders. Photo credits reside in a single consolidated footer line.
- [ ] Real brand icons in their authentic colors; never hand-drawn approximations.
- [ ] On product sites, the physical product is shown large and whole in at most 3 sections, with distinct photo angles across sections.

### Motion & Interactions
- [ ] **Micro-animations:** Interactive cards lift 2px; photos scale 1.02–1.03 within their clipping frame on hover; buttons step on hover and depress on click.
- [ ] The hero executes a single entrance animation on initial load (`data-enter`).
- [ ] Card animation loops cycle between 2.5 and 4 seconds, pausing or restarting smoothly on hover.
- [ ] Any animation or loop running longer than 5 seconds provides a visible pause toggle.
- [ ] **No scroll-jacking:** Elements do not move arbitrarily with page scroll, except for defined sticky moments in dedicated sections.
- [ ] Full support for `prefers-reduced-motion`: all motions rest and no content is hidden.
- [ ] Maximum 4 active WebGL contexts simultaneously on any page.

### Accessibility, Navigation & Keyboard Support
- [ ] Every interactive control, icon button, and link has a descriptive accessible label (`aria-label` or visible text).
- [ ] Meaningful `alt` text provided on all informative images.
- [ ] Headings descend strictly in sequential order (`h1` -> `h2` -> `h3`).
- [ ] Skip link present and functional as the first tab stop with an immediate visible focus ring.
- [ ] Form error messages render immediately adjacent to their respective fields.

### Responsive Breakpoint Disciplines (820, 768, 390, 320px)
- [ ] **Mobile (390px):** Layout collapses cleanly to a single column; primary action buttons span full width; navigation collapses into a dedicated mobile drawer/menu.
- [ ] **Minimum Viewport (320px):** Zero horizontal overflow (`off-viewport`); no overlapping elements or text collisions under sticky headers.
- [ ] **Touch Target Size:** Every interactive target outside running prose is at least 44x44px, with at least 8px spacing between adjacent touch targets.

---

## 2. The "Never" List (Strict Anti-Patterns)

1. **Never use scroll-triggered fade-ins:** Do not make cards, rows, or tiles fade in as the user scrolls down. Never apply blanket fade-in animations to every section.
2. **Never use parallax on typography or scroll-jacking:** Content must remain stable, predictable, and easy to read.
3. **Never use random blinking, pulsating text, or tilt card effects.**
4. **Never pass off generic stock photos as the client's actual team, facility, or product.** If stand-in imagery is necessary, document it clearly and use authentic photos of the actual subject matter.
5. **Never display a product landing page that fails to showcase the actual product clearly and prominently.**
6. **Never draw look-alike copies of real logos or create fake SVG brand icons.**
7. **Never invent fake testimonials, fake client quotes, or fabricated user statistics.**
8. **Never use violet, purple, or lavender in the website's own palette** (as background, accent, gradient, or tinted shadow).
9. **Never clone or copy another website's code, copy, or signature visual effects.**
10. **Never compromise responsive layout constraints to game automated checks.**
