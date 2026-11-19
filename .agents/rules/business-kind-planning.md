---
trigger: model_decision
description: "Business classification (software, gaming, tech, product, service, place) and page architecture planning rules."
---

# Business Classification and Page Planning

The business type dictates the entire design language, visual media, section structure, and aesthetic treatment. Declare the kind upfront on the plan's first line and in HTML markup:
- `<html data-type="<page-type>">`
- `<meta name="page-type" content="<page-type>">`
- `<meta name="site-kind" content="<site-kind>">`
- Places add `<meta name="page-kind" content="place">`.

## 1. Classification Matrix

| Brief / Industry | page type | site-kind | kind | Visual Lead |
| :--- | :--- | :--- | :--- | :--- |
| App, SaaS, AI, developer tool, fintech, banking, software studio | `software` | `software` | `software` | Live UI in `app-frame`, diffs, real tool icons |
| Game, studio launching a game | `software` | `gaming` | `gaming` | Full-bleed key art, world setting, crew |
| Hardware or tech device (drone, robot arm, keyboard) | `product` | `tech` | `tech` | Hardware photos, bench use, close-up parts |
| Other physical product or brand (chair, bike, coffee beans) | `product` | `other` | `product` | High-res real product photos, swatch views |
| Professional service (clinic, law firm, agency, creative studio) | `service` | `other` | `service` | People at work, rooms, real client case studies |
| Physical destination (cafe, bakery, restaurant, hotel, gym, shop) | `place` | `other` | `place` | Authentic interior/exterior photos (12–20 frames) |

*Rule:* A maker that also opens its door or teaches (e.g. ceramics studio, bakery with web shop) is classified as a **place**; its web shop becomes the goods section.

"Tech" (`software`, `gaming`, `tech`) allows effects, loops, counts, dark themes, and shader grounds. "Other" (`place`, `service`, `product`) uses real photographs, flat color, solid typography, real icons, hero entrance, and hover layers.

---

## 2. Page Architecture Plans by Kind

### Place (Cafe, Bakery, Guesthouse, Retail Shop)
- **Photographs lead:** 12 to 20 photographs on full page (8 to 12 on compact, under 8 on 3-screen short page).
- **Hero:** Real photography whenever a frame fits (or regional landscape for remote places).
- **Structure:** Screen 2 holds the visit block, followed by the offer/menu, the story/place, and booking or order mechanism.
- **Variety without effects:** Different compositions for offer vs place, never two sections revolving around one picture. One type moment (large name or address), flat grounds, square photos, one button style, phone bar. No shader loops, fragments, diagrams, or tabs.

### Product and Service (`site-kind: other`)
- **Photographs lead:** Show the product, the people, the spaces, and the craft. At least 2 pictures per screen on a product page.
- **Tools & diagrams:** Real brand icons for tools used; at most 1 still diagram. Flat grounds and 1 brand accent band.
- **No shaders or 3D loops:** Never use shader effects, print textures, grain, or WebGL scenes unless the brief explicitly requests 3D rendering.
- **Physical product without photos:** Must use authentic stand-in photographs of the exact product type; never generic vector drawings, mood stock, or arbitrary props.

### Rules for Every Product Page
- **Scale:** The product must appear **big** where shown whole (filling most of its frame or at anchor scale on ground), never mid-sized inside a grey rounded panel.
- **Different pictures per section:** Never reuse the same view twice.
- **Headline promises pictured:** Every feature headline must have a corresponding photo proving it (e.g., family bike shows child bench).
- **Interactive swatches:** Selecting a swatch must change the displayed product picture; each colorway shown at least once.
- **Zero redundancy:** No fact or specification repeated across sections.

### Tech (Software, Gaming, Hardware)
- **Subject at true size:**
  - *Software:* Display the product's own UI as live interactive HTML in one `app-frame` showing actual work (e.g., diff tool shows green/red lines with Accept action), never generic dashboards or empty panels.
  - *Hardware:* Show genuine device photography, bench usage, and internal close-ups.
  - *Gaming:* Title in `<h1>`, launch line, world as full-bleed key art.
- **Text density:** 60 to 80 words per screen outside UI mocks.
- **Restraint:** At most 1 shader effect or big scene, 1 or 2 dealt moments, and a maximum of 4 active WebGL contexts. No cards moving with scroll.

### Critical Visual Invariants
- **One object never carries the whole page:** The main product/hero object can lead the hero and at most 2 additional sections. The remaining sections must be carried by context: world, crew, parts close-up, bench work, diagram card, or typography moments.
- **Client asset slots:** Always provide dedicated, production-ready slots for client assets (trailer, key art, screenshots, CAD renders, or motion video) with real posters/fallbacks—never left empty or blank.
