---
name: 01mvp-design
description: Apply the official 01MVP visual system to any branded material. Use when the user wants 01MVP posters, business cards, social cards, tutorial slides, UI, dashboards, landing pages, websites, or other external visuals in a unified style. Includes logo assets, templates, tokens, usage rules, and medium-specific playbooks based on the official 01MVP logo kit and UI design sources.
---

# 01MVP Design

Use this skill whenever the output should look unmistakably like `01MVP`.

## Quick workflow

### Step 1: Identify the artifact

Classify the request as one of:

- poster / event visual
- business card / contact card
- social card / quote card / short answer
- tutorial slide / workshop material
- UI / dashboard / component system
- landing page / docs page / website section

If the user does not specify a size, choose a sensible default from `references/applications.md`.

### Step 2: Load the right references

- Always read `references/design-system.md`
- For medium-specific direction, read `references/applications.md`
- For implementation, start from `assets/tokens/01mvp-tokens.css`
- For logo usage, use files under `assets/logo/`
- For quick starts, begin from the closest file in `assets/templates/`

### Step 3: Lock the art direction

Before designing, align the output to this baseline:

- monochrome first
- sharp edges
- strong borders
- technical editorial feeling
- big confident hierarchy
- generous whitespace
- engineering clarity over decoration
- remove before adding
- one dominant message per screen
- one primary action per viewport

If the request conflicts with this system, keep the 01MVP language dominant and only relax rules when the user explicitly asks.

## Non-negotiable rules

- Use black, white, and neutral gray as the core palette
- Default to `Inter` / `Noto Sans SC` for primary copy and `JetBrains Mono` for labels, metadata, code, and small UI accents
- Keep corners square; avoid rounded UI unless the user explicitly asks to depart from the system
- Prefer `2px` borders for UI and `3px` borders for editorial cards / posters
- Maintain high contrast and clear structural separation between sections
- Keep English display text uppercase when it improves the brutal, technical tone
- Use the official logo assets without recoloring, stretching, skewing, shadows, or decorative effects
- Avoid gradients, glassmorphism, soft blurs, cute illustration styles, or pastel-heavy palettes
- Do not add vanity metrics, filler copy, or decorative sections that do not help the user decide or act
- Prefer a single visual center; avoid layouts that make the eye choose between two competing focal points
- Use grid only when content blocks are balanced; otherwise switch to stacked list or editorial flow
- Treat text as the primary visual material; only use the logo when it adds real brand recognition

## Allowed exception

The bundled short-card templates use a single hard offset shadow to create a print-card feel. Treat that as the only shadow pattern that belongs to this system:

- one-direction offset
- crisp edge
- low-opacity black
- never soft ambient blur

For websites and UI, prefer no shadow at all.

## Quality bar

When designing branded output, optimize for both usefulness and taste:

- every screen should answer: what is this, why care, what do I do next
- compress value propositions into one sharp sentence before expanding
- keep one loud move per section: big title, black action bar, or key data block
- alternate dense information blocks with open whitespace to create rhythm
- prefer fewer, stronger modules over many small cards
- if an element can be deleted without hurting understanding or action, delete it

## Copywriting & Tone

Good design must be paired with good copy. When generating text content (headlines, descriptions, CTAs) for 01MVP designs, strictly follow these copywriting principles:

- **Speak Human (说人话):** Avoid corporate jargon, internal technical terms, or abstract concepts. Use the exact words the user uses to describe their problems (e.g., replace "infrastructure assets" with "configurations").
- **Address Pain Points (直击痛点):** Start with the user's struggle. What annoying repetitive task or frustrating problem are they trying to avoid?
- **Focus on Outcomes (给结果):** Don't just list features. Clearly state what the user will achieve, save, or gain (e.g., instead of "Executes standard workflows", use "One-click to generate standard outputs").
- **Clear & Direct (极简直接):** Write short, punchy, and confident sentences. Remove filler words. Clarity always beats cleverness.
- **Action-Oriented CTAs (行动导向):** Buttons should describe the exact value the user gets, not a generic action (e.g., "Copy to your AI Agent" instead of "Submit").
- **Hardcore Minimalist Tone (硬核极简风):** Match the 01MVP visual identity. The tone should be professional, decisive, no-nonsense, and highly efficient.

## Deliverable rules

When generating branded output:

- State the medium and chosen layout
- Name the logo variant you used
- Keep the final file or component close to the nearest bundled template
- If you intentionally break a brand rule, say so explicitly

## Asset map

### Logo assets

- `assets/logo/01mvp-wordmark-primary.svg`
- `assets/logo/01mvp-wordmark-inverse.svg`
- `assets/logo/01mvp-icon-black.svg`
- `assets/logo/01mvp-icon-white.svg`
- `assets/logo/01mvp-lockup-horizontal.svg`

### Tokens

- `assets/tokens/01mvp-tokens.css`

### Templates

- `assets/templates/poster-vertical.html`
- `assets/templates/business-card.html`
- `assets/templates/short-answer-card.html`
- `assets/templates/short-action-card.html`
- `assets/templates/tutorial-slide.html`
- `assets/templates/style-guide.html`

## Self-check before handing off

- Does it read as 01MVP within 2 seconds?
- Is the palette still mostly black / white / gray?
- Are the corners, borders, and spacing crisp enough?
- Is the hierarchy decisive instead of decorative?
- Does each screen have one clear focal point and one clear next action?
- Did you remove filler metrics, redundant logos, and over-explaining copy?
- Is the logo variant correct for the background?
- Did you avoid gradients, glows, rounded softness, and random accent colors?
- Is the copy direct, outcome-focused, and free of corporate jargon?
- Do the CTAs clearly describe the value the user will get?
