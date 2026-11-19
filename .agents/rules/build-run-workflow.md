---
trigger: model_decision
description: "Standard build workflow, copy guidelines, automated checking, and gate verification procedures."
---

# Build Workflow, Copywriting, and Verification Process

Follow a rigorous, step-by-step assembly process that prioritizes authentic copy, disciplined layout budgeting, automated headless browser checks, and gate verification.

## 1. Execution Steps

### Step 0: The Stack
- **Static Site:** Copy component assets into the project and build cleanly from the base template.
- **Frameworks (Next.js / React / Astro):** Build within the framework's native conventions. For Next.js, support static output (`output: 'export'`) where applicable, using semantic HTML markup, Tailwind utility tokens, and structured client components.

### Step 1: Deconstruct the Brief
Identify and document:
1. **The Kind:** (`software`, `gaming`, `tech`, `product`, `service`, `place`).
2. **The Offering:** Exactly what product or service is sold.
3. **The Buyer:** Who the customer is.
4. **The Primary Action:** Exactly one primary transaction verb (e.g. *Book a table*, *Order a box*, *Start 14-day trial*, *Get directions*).
5. **Real Assets:** Genuine logos, product photography, pricing tiers, physical address, and hours.

### Step 2: Write Copy Before Layout
- **H1 Formula:** Name the exact category and the target buyer or location (for games: title and genre).
- **First Screen Fact:** Every hero must state at least one verifiable, hard fact (price, size, capacity, schedule, or core specification).
- **Headings & Buttons:**
  - Every heading must include a concrete noun (no buzzword slogans).
  - Buttons must be structured as **[Active Verb] + [Specific Object]** (e.g., "Pesan Sekarang", "Beli Es Gabin", "Unduh Struk").
- **Zero Fabrication:** Never invent reviews, testimonials, company numbers, or fake statistics. If hours or prices must be assumed for a demo, mark them with `data-assumed`.

### Step 3: Screen Budgeting and Planning
Plan the page strictly as a sequence of full screens:
1. First screen is dedicated entirely to the hero.
2. Every subsequent section is budgeted for **exactly 1 or 2 screens** at 1440x900 viewport height.
3. Assign each section:
   - A unique ID.
   - Exactly one core thesis or idea.
   - Its primary visual type (`object`, `bench-use`, `exploded-parts`, `world-art`, `diagram`, or `type-moment`).
   - Defined moments and interaction models.

### Step 4: Component Variant Selection
Select design pairings systematically based on business type:
- **Navigation:** `nav-mega` (SaaS/large catalog), `nav-cards` (hardware/products), `nav-centre` (boutique/creative).
- **Footers:** `footer-columns` (multi-tier links), `footer-visit` (maps and hours for places), `footer-dark` (tech/gaming).
- **Buttons:** Clean pair (`solid` primary + `tonal` or `pill` secondary).
- **Typography:** Distinctive, readable typeface pairing appropriate to the trade.

### Step 5: Construction Standards
- Semantic hierarchy: `<main>` wrapping individual `<section>` elements, each with an `h2` heading at top alignment.
- Use CSS variables and tokens for layout dimensions (`--h: 1` or `2`).
- Real interactive slots for client media with proper poster images.

### Step 6: Automated Verification & Gate Checks
Run rigorous headless checks across screen resolutions:
1. **Copy Lint:** Check for buzzwords, ambiguous slogans, or missing nouns in headings.
2. **Consistency & Layout Check:** Verify layout integrity across 5 critical viewports:
   - `1440x900` (Desktop Standard)
   - `1024x768` (Small Desktop / Tablet Landscape)
   - `820x1180` (Tablet Portrait)
   - `768x1024` (Small Tablet Portrait)
   - `390x844` (Mobile Phone Standard)
   - `320px` (Minimum Viewport Boundary - test for overflow and collision)
3. **Performance Gate:** Zero layout shift, optimized image assets, and fast initial paint.
4. **Final Gate Pass:** Confirm all layout constraints pass before shipping code.
