---
trigger: glob
globs: "*.tsx, *.jsx, *.html, *.ts, *.js, *.py, *.md"
description: "Copywriting standards (active CTAs, hard facts, ban on em dashes and AI buzzwords) and clean code comment hygiene."
---

# Copywriting Standards and Code Hygiene

Deliver clear, human, fact-grounded communication in the user interface and maintain clean, noise-free code comments.

---

## 1. Copywriting Rules & Tone

### Strict Prohibition on Em Dashes (Anti-Slop R-02)
- **FORBIDDEN:** The em dash character (`—`) in any agent-written UI text, headlines, descriptions, or button labels.
- Replace with natural human punctuation: a comma (`,`), period (`.`), colon (`:`), or parentheses `()`.
- *(Carve-out: Technical documentation and rule definition identifiers like R-02 are exempt).*

### Hard Facts Above the Fold
- Every first screen / hero must present at least one verifiable, hard fact (exact price range, capacity, event dates, operating hours, or core specification).
- Avoid vague emotional claims without supporting numbers.

### Button & CTA Formulas
- **Active Verb + Concrete Object:** All action buttons must be written as an active verb followed by a specific object (e.g., `"Pesan Menu Lezat"`, `"Unduh Struk PDF"`, `"Buka Poster Stand"`).
- **Reject Generic AI CTAs:** Never use generic filler like *"Get Started"*, *"Learn More"*, *"Explore"*, *"Discover"*, or *"Try Now"*.

### Headline & Content Formulas
- **Headline Formula:** State the exact product category and the target user or place (for games: title and genre).
- **Concrete Nouns:** Every section heading must contain a concrete noun (no abstract buzzword slogans).
- **Grey Subtitles:** If a secondary subtitle is attached, it must be a complete, grammatically sound sentence, not an unfinished sentence fragment.

### Banned AI Buzzwords & Superlatives
Eliminate recognizable AI marketing jargon from all interface text:
- *AI-Powered, Next Generation, Revolutionary, Seamless, Cutting-Edge, Supercharge, Elevate, Game Changer, Unleash, Unlock.*

### Zero Fabrication (Anti-Slop C-5)
- Never invent customer avatars, fake reviews, fictitious testimonials, or fabricated performance metrics (e.g., *"10,000+ Happy Customers"*, *"99.9% Uptime"*).
- When operating in public demos, use honest real data or explicitly mark demo placeholders with `data-assumed`.

---

## 2. Code Comment Hygiene (`antislop-code`)

Comments in source code must provide genuine insight or be omitted entirely. Do not let AI agents clutter the codebase with decorative or redundant text.

### Prohibited Comment Patterns
1. **No Decorative Banners:** Eliminate repeated character borders or all-caps divider boxes:
   ```typescript
   // BAD: // ==============================================
   // BAD: // ----------------- CONTROLLER -----------------
   ```
2. **No Restating the Obvious:** Do not explain what readable syntax already shows:
   ```typescript
   // BAD: // User class definition
   class User {}
   // BAD: // Set quantity to 1
   const quantity = 1;
   ```
3. **No Step-by-Step Workflow Narration:**
   ```typescript
   // BAD: // Step 1: Validate input
   // BAD: // Step 2: Fetch data from server
   // BAD: // Step 3: Render response
   ```
4. **No Empty Labels:** Remove generic tags like `// Main logic`, `// Helper function`, or `// Important: please read`.
5. **No Vague Placeholders:** Never leave un-actionable TODO comments like `// TODO: Refactor later` or `// TODO: Improve this`.

### When Comments Are Permitted
Write comments ONLY when documenting:
- Complex domain-specific algorithms or math equations.
- Non-obvious browser workarounds (e.g., Safari iOS viewport height bugs).
- Critical invariants, race condition protections, or security requirements.
