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

## Allowed exception

The bundled short-card templates use a single hard offset shadow to create a print-card feel. Treat that as the only shadow pattern that belongs to this system:

- one-direction offset
- crisp edge
- low-opacity black
- never soft ambient blur

For websites and UI, prefer no shadow at all.

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
- Is the logo variant correct for the background?
- Did you avoid gradients, glows, rounded softness, and random accent colors?

