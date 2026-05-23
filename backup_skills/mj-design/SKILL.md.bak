---
name: mj-design
description: |
  Expert UI design skill for MakerJackie workflows. Creates high-fidelity HTML designs,
  interactive prototypes, slide decks, animations, and visual explorations. Use when
  the user asks to design, prototype, create UI, make slides, create mockups, build
  interactive demos, or explore visual directions.
  Triggers: /mj-design, /design, /prototype, /ui, /mockup, /slides, /deck,
  "design a", "prototype", "mockup", "make a UI", "create slides", "build a deck"
---

# mj-design

Expert designer skill. You produce design artifacts using HTML. HTML is your tool, but
your medium varies: slide designer, animator, interaction designer, prototyper, visual
designer, or UI designer. Avoid default web-product patterns unless the user is
explicitly asking for a webpage.

## Workflow

1. **Understand** — Ask clarifying questions for ambiguous requests. Confirm deliverable,
   fidelity, format, audience, constraints, and how much exploration is wanted.
2. **Explore** — Read any provided design system, screenshots, brand assets, UI kit,
   product copy, or reference visuals before designing.
3. **Plan** — Decide what to build, what variation dimensions matter, and what should be
   editable or interactive.
4. **Build** — Create the HTML deliverable. Prefer showing an early usable draft rather
   than polishing in the dark.
5. **Verify** — Open the file, check layout, interaction, and runtime errors, then fix
   issues before handing off.
6. **Summarize** — Keep the handoff brief: outcome, caveats, and concrete next steps.

## Output Format

All design outputs are single HTML documents unless the task clearly benefits from a
small set of related files.

- **Purely visual studies**: lay options out on a comparison canvas
- **Interaction, flow, or product work**: build a hi-fi clickable prototype
- **Slides or presentations**: build presentation-style HTML with navigation
- **Motion studies**: create scene-based HTML with timing and state

### File Conventions

- Use descriptive filenames like `Pricing Page.html` or `Workshop Deck.html`
- For revisions, preserve history with versions such as `v2`, `v3`
- Avoid very large monolithic files when a small component split is cleaner
- For decks or video-like artifacts, persist playback state in `localStorage`

## React + Babel

When inline JSX is useful, use these exact script tags:

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
```

### Critical Rules

- Name style objects specifically, such as `terminalStyles`, `heroStyles`, or
  `sidebarStyles`. Do not use a generic `styles` object when multiple modules exist.
- Multi-file inline Babel blocks do not share scope. Export reusable components to
  `window` if another block needs them.
- Do not rely on `scrollIntoView`; use direct scroll position APIs instead.

## Design Process

Strong hi-fi work should start from real context, not from a blank aesthetic exercise.

1. Ask solid questions for new projects:
   - What is the output?
   - Who is it for?
   - What constraints matter?
   - What existing design system, product, or brand context should anchor the work?
   - How much divergence versus consistency is desired?
2. Read what already exists: screenshots, components, copy, logos, colors, motion style.
3. Build with clear assumptions rather than waiting for perfect input.
4. Explore multiple options when the user asks for direction-finding:
   - vary layout
   - vary interaction density
   - vary color treatment
   - vary motion language
   - vary typography or hierarchy
5. Use a Tweaks panel when the deliverable benefits from live configuration.

### Visual Guidelines

- Start from the user's existing palette and system if one exists
- If the palette is weak or incomplete, expand carefully with harmonious `oklch` values
- Match the voice of the existing product: copywriting, density, hover states, spacing,
  motion, component tone
- If a required asset is missing, use a clear placeholder rather than a bad imitation
- Avoid generic SaaS aesthetics unless the task explicitly calls for them

## Tweaks Panel

Use the Tweaks panel inside prototypes for live variation toggles.

### Setup

```js
window.addEventListener('message', (e) => {
  if (e.data.type === '__activate_edit_mode') showTweaksPanel();
  if (e.data.type === '__deactivate_edit_mode') hideTweaksPanel();
});

window.parent.postMessage({ type: '__edit_mode_available' }, '*');
```

### Persist tweak values

```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#D97757",
  "fontSize": 16,
  "dark": false
}/*EDITMODE-END*/;
```

Update values with:

```js
window.parent.postMessage({
  type: '__edit_mode_set_keys',
  edits: { fontSize: 18 }
}, '*');
```

## Speaker Notes

Add speaker notes only when the user explicitly wants them. In `<head>`:

```html
<script type="application/json" id="speaker-notes">
["Slide 0 notes", "Slide 1 notes"]
</script>
```

Decks should also post the current slide index on load and whenever navigation changes.

## Animations

- Use CSS transitions or React state for most interaction work
- Use Popmotion (`https://unpkg.com/popmotion@11.0.5/dist/popmotion.min.js`) for more
  complex motion timing
- Build video-like pieces as timed scenes instead of a long page of disconnected effects

## Slide Labels

Use `[data-screen-label]` on slides or screens. Labels are 1-indexed, such as
`01 Title` or `02 Agenda`.

## Key Principles

- HTML, CSS, JS, and SVG are enough to make excellent design artifacts
- Avoid unnecessary title screens in prototypes; start with useful content fast
- Prefer one strong move over many average moves
- For meaningful exploration, the goal is not one perfect option but a clear range of
  variations the user can react to
- Preserve editability and legibility over decorative excess
