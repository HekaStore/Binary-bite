---
trigger: model_decision
description: "Business classification matrix, page architecture by trade, content-driven section budgeting, and visual object distribution."
---

# Business Classification, Content Architecture, and Section Planning

Reject rigid AI landing page templates (such as the default *Hero -> 3 Feature Cards -> Bento Grid -> Fake Terminal -> 3 Pricing Tiers -> FAQ*). Let the genuine business category and actual content shape the page layout.

---

## 1. Classification Matrix & Metadata Declaration

Declare the page kind upfront on the plan's first line and in HTML markup:
- `<html data-type="<page-type>" data-radius="soft" data-motion="true">`
- `<meta name="page-type" content="<page-type>">`
- `<meta name="site-kind" content="<site-kind>">`
- Physical destinations add `<meta name="page-kind" content="place">`.

| Trade / Industry | page type | site-kind | kind | Visual Lead Material |
| :--- | :--- | :--- | :--- | :--- |
| **SaaS, Dev Tools, AI, Fintech, Banking** | `software` | `software` | `software` | Live interactive UI in `app-frame`, diffs, real tool icons |
| **Games, Gaming Studios** | `software` | `gaming` | `gaming` | Full-bleed key art, world setting, crew, game title in `<h1>` |
| **Hardware, Robotics, Gadgets** | `product` | `tech` | `tech` | Authentic device photos, bench usage, internal exploded views |
| **Physical Products (Retail, Goods)** | `product` | `other` | `product` | High-res product photography, interactive swatch views |
| **Professional Services (Clinics, Studios, Law)** | `service` | `other` | `service` | People at work, authentic rooms, real client case studies |
| **Physical Places (Cafes, Bakeries, Shops, Stands)** | `place` | `other` | `place` | Authentic interior/exterior photos (12–20 frames), menu dishes |

*Rule:* A maker that also opens its door or sells in person (e.g. bakery with web ordering, culinary stand) is classified as a **place**; its online ordering is the goods section.

---

## 2. Page Architecture by Trade

### Physical Places (Cafes, Bakeries, Food Stands, Retail)
- **Photographs lead:** 12 to 20 photographs across the full page (8 to 12 on compact pages).
- **Hero:** Real photography whenever a frame fits.
- **Section structure:** Screen 2 holds the Visit / Location Block, followed by the Offer / Menu, the Origin Story, and the Order / Booking flow.
- **Anti-slop variety:** Vary compositions across sections. Never repeat the same card structure twice. One type moment (large name or address), flat clean grounds, square photos, one consistent button style. No shader loops, bento grids, or fake terminals.

### Products and Services (`site-kind: other`)
- **Show the real thing:** The product, the team, the workshop. At least 2 authentic pictures per screen.
- **Scale:** The product must appear **big** where shown whole, never mid-sized inside a grey rounded card on a grey ground.
- **Different angle each section:** Never reuse the same product photo or angle.
- **Interactive swatches:** Selecting a colorway must change the displayed product picture.
- **Zero redundancy:** Never repeat the same specification or claim in multiple sections.

### Tech (Software, Gaming, Hardware)
- **Subject at true size:**
  - *Software:* Live interactive HTML inside an `app-frame` showing actual workflows (e.g., code diff with Accept/Reject actions), never a static grey dashboard screenshot or empty card.
  - *Hardware:* Bench usage, physical materials, and authentic component breakdowns.
  - *Gaming:* Title in `<h1>`, launch line, and world as full-bleed key art.
- **Text density:** 60 to 80 words per screen outside of UI mocks.
- **Restraint:** At most 1 shader effect or 3D scene, and a maximum of 4 active WebGL contexts across the page.

---

## 3. Structural Rules & Invariants

- **One object never carries the whole page:** The main hero product/object may lead the hero and at most 2 additional sections. The remaining sections must be carried by context: the creators, the setting, close-up parts, technical diagrams, or typography moments.
- **Content-Driven Sections (Anti-Slop C-3):** Do not create a "How It Works" 3-step section or a "Trusted By" logo banner unless the real product requires it and genuine client logos exist.
- **Dedicated Client Asset Slots:** Always provide production-ready slots for client media (video trailer, key art, screenshots, CAD renders) with genuine poster fallbacks—never left empty or unfinished.
