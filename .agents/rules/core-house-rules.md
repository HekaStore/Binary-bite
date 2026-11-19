---
trigger: always_on
description: "Core anti-slop frontend house rules, visual constraints, and fundamental quality bar (figma.com & x.ai level)."
---

# Frontend Quality Standards: Core House Rules

Build the website a good company would ship: it says plainly what is sold, shows the real thing on every screen, and looks made for this client—not from a template and not like an art piece. The bar is figma.com and x.ai.

## The 9 House Rules

These nine rules win over everything else:

1. **No caption or description under any image, render or visual.** License credits go in one footer line.
2. **Every visual renders, never an empty ground,** across all responsive widths: 1440, 1024, 768, and 390px.
3. **One section per screen:**
   - The hero stands alone on the first screen.
   - Every section is exactly one or two screens tall at 1440x900.
   - No second section heading peeking into the viewport.
   - (The one exception is a live `photo-chapters` section, 3 or 4 screens, set by the moment).
4. **Equal left and right content edges:** Alignment must be strictly symmetrical along the content container bounds.
5. **Hover micro-animations & motion layer:**
   - A linked card lifts 2px.
   - A photo zooms 1.02–1.03 inside its frame.
   - Buttons step on hover and press on click; underlines draw smoothly.
   - Card loops cycle in 2.5–4 s, repeating and restarting on hover.
   - Never strip or override the motion layer.
   - **No tilt, carousels, or timed tabs.**
   - Every hero enters once on load (`data-enter`).
   - Every page carries one dealt moment (two on a long page).
6. **More and better real photographs where they fit:** Nicer backgrounds, better heroes, crisp layouts, and purposeful typography.
7. **Real full-colour icons:** Use a known product's real icon, never a hand-drawn or generic knock-off. Small diagram visuals in cards (e.g. hub with branches, input with processor, parallel lanes with running pulses).
8. **Scenes and shader effects are restricted by trade:**
   - Shader effects, 3D scenes, and WebGL loops belong ONLY on businesses with technical subjects (tech, AI, developer tools, gaming, fintech, hardware).
   - Never use shaders/3D on a local cafe, bakery, guesthouse, or retail shop: those must be led by authentic photographs and flat color.
9. **Addresses & Contact Privacy:**
   - Street and district only (if no street is provided: district only).
   - No house numbers, postcodes, or raw coordinates.
   - No register or VAT numbers.
   - No real phone numbers in public demos; demo contacts use `.example`.
