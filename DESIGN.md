---
name: PRJ1
description: A strictly monochrome, grain-lit editorial world where light is the only material.
colors:
  gallery-black: "oklch(0 0 0)"
  exposed-white: "oklch(1 0 0)"
  plinth-black: "oklch(0.05 0 0)"
  alcove-grey: "oklch(0.14 0 0)"
  stage-grey: "oklch(0.18 0 0)"
  hairline: "oklch(0.26 0 0)"
  developer-grey: "oklch(0.72 0 0)"
  paper-white: "oklch(0.98 0 0)"
  mount-white: "oklch(0.96 0 0)"
  mat-white: "oklch(0.94 0 0)"
  hairline-lit: "oklch(0.86 0 0)"
  graphite-grey: "oklch(0.38 0 0)"
  dim-grey: "oklch(0.5 0 0)"
typography:
  display:
    fontFamily: "Archivo Variable, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(3.4rem, 14vw, 11.5rem)"
    fontWeight: 740
    lineHeight: 0.94
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 115"
  headline:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 6.5vw, 5.5rem)"
    fontWeight: 740
    lineHeight: 0.94
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 115"
  title:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 740
    lineHeight: 0.94
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 115"
  accent:
    fontFamily: "Instrument Serif, Georgia, Times New Roman, serif"
    fontSize: "inherit"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono Variable, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.3em"
rounded:
  sm: "0.375rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  pill: "999px"
spacing:
  gutter: "1.5rem"
  gutter-lg: "2.5rem"
  block: "4rem"
  block-lg: "6rem"
  section: "7rem"
  section-lg: "10rem"
components:
  button-primary:
    backgroundColor: "{colors.exposed-white}"
    textColor: "{colors.gallery-black}"
    rounded: "{rounded.pill}"
    padding: "0 2rem"
    height: "3.25rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.exposed-white}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-outline-hover:
    backgroundColor: "{colors.exposed-white}"
    textColor: "{colors.gallery-black}"
  card-plinth:
    backgroundColor: "{colors.plinth-black}"
    textColor: "{colors.exposed-white}"
    rounded: "{rounded.xl}"
    padding: "2.5rem"
  card-featured:
    backgroundColor: "{colors.exposed-white}"
    textColor: "{colors.gallery-black}"
    rounded: "{rounded.xl}"
    padding: "2.5rem"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.exposed-white}"
    rounded: "0"
    padding: "0.75rem 0"
  nav-link:
    textColor: "{colors.exposed-white}"
    typography: "{typography.label}"
  kicker:
    textColor: "{colors.developer-grey}"
    typography: "{typography.label}"
---

# Design System: PRJ1

## Overview

**Creative North Star: "The Darkroom Gallery"**

A black room, hung after hours, where every piece on the wall is a silver print. There is no daylight and no color — only exposure. Light is the material the whole system is built from: it draws the threads behind the hero, it lifts type out of the dark, it follows the pointer as a single moving dot, and it lands on the page as film grain over everything paintable. When a section turns white, it is not a theme change; it is the same image printed instead of projected.

The mood is cinematic and atmospheric. Pages do not present themselves all at once — they arrive. A curtain counts to 100 and lifts. Headlines rise out of masks, one line at a time. Body copy fades up from below. Scroll-scrubbed sentences resolve word by word. The visitor is inside the work before they have read a word of it, which is the whole argument the studio is making: that black and white is not a limitation but a position, and that convincing without color requires typography, space, and motion to actually work.

Against that atmosphere, the structure is severe. Editorial hairlines separate everything. Series are indexed in mono, `(01)`, `(02)`, like plate numbers under a print. Display type is set wide, heavy, and tight enough to nearly touch. Nothing is decorated; the aliveness lives entirely in motion and state, never in ornament.

**Key Characteristics:**

- Zero chroma. Every value in the system is greyscale, permanently.
- Two grounds — projected (black) and printed (white) — that swap the same token set.
- Film grain over the entire dark page as a unifying surface texture.
- Editorial hairlines and mono plate numbers instead of boxes and badges.
- Wide, heavy, tightly-tracked display type with exactly one serif italic word per headline.
- Motion as a primary material: masked reveals, scroll scrubbing, magnetic pull, a cursor that stretches with velocity.

## Colors

A pure greyscale system with no hue anywhere — every token sits at chroma 0, and the palette's entire expressive range is lightness.

### Primary

- **Exposed White** (`oklch(1 0 0)`): the light in the room. Body text, headlines, and hairline highlights on the dark ground; the fill of the primary button and the availability dot. On the printed (white) ground it becomes the surface itself.
- **Gallery Black** (`oklch(0 0 0)`): the room. The default page ground, the hero section, the mobile menu overlay, the intro curtain, and the text color on any printed section.

### Neutral

- **Plinth Black** (`oklch(0.05 0 0)`): cards and popovers on the dark ground — a surface that is legibly *not* the page without becoming grey.
- **Alcove Grey** (`oklch(0.14 0 0)`): muted fills — hover beds under ghost buttons and quiet blocks.
- **Stage Grey** (`oklch(0.18 0 0)`): secondary surfaces on the dark ground.
- **Hairline** (`oklch(0.26 0 0)`): every rule, divider, card edge, and input underline on the dark ground. The most-used non-text token in the system.
- **Developer Grey** (`oklch(0.72 0 0)`): secondary text on the dark ground — body copy under headlines, kickers, feature lists, captions.
- **Paper White** (`oklch(0.98 0 0)`) / **Mount White** (`oklch(0.96 0 0)`) / **Mat White** (`oklch(0.94 0 0)`): the printed ground's card, muted, and secondary surfaces.
- **Hairline Lit** (`oklch(0.86 0 0)`): rules and borders on the printed ground.
- **Graphite Grey** (`oklch(0.38 0 0)`): secondary text on the printed ground.
- **Dim Grey** (`oklch(0.5 0 0)`): the destructive/error role. It is grey, not red — errors speak through copy and a bordered box, never through hue.

### Named Rules

**The No-Hue Rule.** Every color in this system has chroma 0. A token with a hue is a bug, not a variant. This includes error, success, and warning states: they are communicated by copy, position, and iconography, never by color.

**The Two-Ground Rule.** A section declares its ground by owning `.section-invert` (printed) or inheriting the page default (projected). Components never hardcode `black` or `white` — they read `var(--color-foreground)` and `var(--color-background)` so a single component works correctly on both grounds. The one deliberate exception is the site header, which uses `mix-blend-difference` to invert itself against whatever it happens to be over.

**The Rare-Solid Rule.** A fully white surface on the dark ground is the loudest move available. It is reserved for genuine emphasis — the featured pricing card, the primary submit button, the success state — and never used for ordinary containers.

## Typography

**Display Font:** Archivo Variable (with `system-ui`, `-apple-system`, `Segoe UI`, `Roboto`, sans-serif) — the width axis is used, not just weight.
**Body Font:** Archivo Variable, same family at normal width and weight.
**Accent Font:** Instrument Serif italic (with Georgia, Times New Roman, serif).
**Label/Mono Font:** JetBrains Mono Variable (with `ui-monospace`, `SFMono-Regular`, Menlo, monospace).

**Character:** One grotesque doing two jobs — stretched to 115% width and 740 weight it becomes a poster face; left alone it is quiet, readable body copy. Against it, a single italic serif word per headline acts like a handwritten annotation on a printed sheet, and mono labels behave like the technical marginalia around a plate. Self-hosted via Fontsource, with no CDN request — a DSGVO constraint the system treats as fixed.

### Hierarchy

- **Display** (740, `clamp(3.4rem, 14vw, 11.5rem)`, 0.94 line-height, -0.035em, width 115%): the hero headline only. One per page, set to nearly touch its own lines.
- **Headline** (740, `clamp(2.4rem, 6.5vw, 5.5rem)`, 0.94, -0.035em): section headings. Composed as one `Reveal` per line so lines rise in sequence.
- **Title** (740, `clamp(1.5rem, 3vw, 2.25rem)`, 0.94, -0.035em): item titles inside indexed rows, card names, plan names.
- **Accent** (Instrument Serif, 400 italic, inherits size, -0.01em): exactly one emphasized word inside a headline.
- **Body** (400, 1rem / 1.125rem at `sm`, 1.625 line-height): paragraphs, held to roughly 28–36rem (`max-w-md` to `max-w-2xl`) so lines land near 65–75 characters. Secondary body copy sits on Developer Grey, not full white.
- **Label** (JetBrains Mono, 400, 0.6875rem, 0.3em tracking, uppercase): kickers, plate numbers, nav links, meta rows, price units, badges. Nav links run slightly tighter at 0.18em.

### Named Rules

**The One Serif Word Rule.** Instrument Serif italic appears at most once per headline, on a single word. It is the system's only typographic accent and it stops working the moment there are two. Note that the markup pairs `.u-serif` with `not-italic` in most headlines: the face's own italic drawing carries the voice without the additional slant.

**The Mono Label Rule.** Any text below 0.75rem is JetBrains Mono, uppercase, and tracked at least 0.18em. Small text is never just small sans — if it needs to shrink, it changes voice.

**The Plate Number Rule.** Any repeating series — services, principles, process steps, projects, nav items — carries a mono index in parentheses, `(01)`, zero-padded to two digits.

## Layout

A single centered column system with two container widths: `max-w-7xl` (80rem) for ordinary content and `max-w-5xl` (64rem) for scroll-scrubbed manifesto text, which reads better narrow. The site header alone runs to `max-w-[120rem]`.

Horizontal gutters are `1.5rem`, opening to `2.5rem` from the `sm` breakpoint. Vertical section rhythm is `7rem` / `10rem` (`py-28 sm:py-40`), with the manifesto sections stretching to `8rem` / `12rem` for extra breathing room. Page tops clear the fixed header at `9rem` / `11rem`. Inside a section, the heading-to-content gap is `4rem` / `6rem`.

Content is organized as **indexed hairline rows** far more often than as cards: a `1fr`-based grid collapsing to a single column on mobile, with each row separated by a 1px top border and the last row closing with a bottom border. Desktop rows expand to a `5rem`/`6rem` index column plus title and body columns, with an arrow affordance in a trailing `3rem` column. Cards appear only where discrete comparison is the point — pricing, and the contact success state.

Breakpoints follow Tailwind defaults; `sm` (640px) carries most of the density change, `md` (768px) switches navigation from overlay menu to inline links, and `lg` (1024px) introduces multi-column splits (`1fr 1.4fr`, `1fr 1.3fr`, three-column pricing). Interactive targets hold a `2.75rem` minimum height throughout.

### Named Rules

**The Hairline Rule.** Lists of comparable things are separated by 1px rules, not wrapped in cards. Reach for a card only when items must be compared as discrete offers.

**The Full-Bleed Ground Rule.** Sections own their ground edge-to-edge and the inner container handles the max width. A section never sits inside a padded shell of a different ground.

## Elevation & Depth

The system is flat by construction on the dark ground and lightly lifted on the printed one. Depth on black comes from **tonal layering** (a Plinth Black card at `0.05 L` on a Gallery Black page) plus 1px hairlines plus the grain layer, and from **emitted light** — the radial scrim behind the hero copy, the glow on the availability dot, the interference threads in the WebGL backdrop. A cast shadow on a black ground is invisible, so it is not used there.

A shadow vocabulary is defined for the printed ground and for genuinely lifted surfaces. Two of these tokens are observed in the existing implementation (`glow-point`, `glass-edge`); the two `lift-*` tokens are newly established here and have no incumbent usage yet.

### Shadow Vocabulary

- **glow-point** (`box-shadow: 0 0 12px rgba(255,255,255,0.85)`): a small element that is itself a light source — the availability dot. Observed in the hero.
- **glow-soft** (`box-shadow: 0 0 32px rgba(255,255,255,0.12)`): a soft halo for an active or focused element on the dark ground. Newly established; use sparingly.
- **lift-low** (`box-shadow: 0 2px 8px rgba(0,0,0,0.18)`): a card resting on the printed ground. Newly established.
- **lift-high** (`box-shadow: 0 16px 40px rgba(0,0,0,0.24)`): a surface that has genuinely left the page on the printed ground — dialog, popover, dropdown. Newly established.
- **glass-edge**: the liquid-glass button's layered inset stack, which fakes a refractive rim rather than casting a shadow. It is a single documented recipe, carried verbatim in `.impeccable/design.json`, not a scale step.

### Named Rules

**The Emitted-Light Rule.** On the projected (black) ground, depth is made of light: glows, scrims, and tonal steps. Cast shadows belong to the printed (white) ground only. A drop shadow on black is either invisible or muddy, and both are failures.

**The Flat-At-Rest Rule.** Surfaces are flat at rest. Lift appears in response to state, never as decoration on a resting element.

## Shapes

Two silhouettes, and nothing in between. **Interactive things are pills** — every button, tag, badge, toggle, and inline call-to-action runs at `999px`, including the icon-shaped ones. **Surfaces are sheets** — cards use `1.5rem` (`rounded-3xl`) for primary offers and `1rem` (`rounded-2xl`) for secondary ones, and inline alerts use `0.75rem`.

Inputs break both patterns deliberately: they have **no box at all**, only a 1px underline that brightens from Hairline to full foreground on focus. A boxed input would read as a form; an underline reads as a line on a sheet of paper.

Borders are always exactly 1px and always the ground's hairline token, with one exception: process steps use a 2px top border to read as a heavier printed rule. Focus rings are a 2px solid ring at 3px offset, using the ground's ring token.

### Named Rules

**The Pill-or-Sheet Rule.** If it can be pressed, it is a pill. If it holds content, it is a sheet. Nothing in this system has a slightly-rounded rectangle.

**The Naked Input Rule.** Text inputs, selects, and textareas carry an underline and nothing else — no fill, no border box, no radius.

## Components

### Buttons

- **Shape:** Full pill (`999px`) across every variant and size.
- **Primary:** Solid foreground fill with inverted text (Exposed White on Gallery Black ground, and the reverse on printed sections), `3.25rem` tall, `2rem` horizontal padding, semibold.
- **Outline:** Transparent with a 1px border at 40% foreground opacity, `2.75rem` tall, `1.5rem` padding. Hover fills solid and inverts the text — the state change is a color inversion, not an effect.
- **Hover / Active:** Primary and card buttons scale to `1.02` on hover and `0.98` on press over 200ms. Outline and nav variants transition color only.
- **Focus:** 2px ring in the ground's ring token, 2px offset against the ground's background token.
- **Ghost / Link:** Ghost fills with the muted token on hover; link relies on an underline at 4px offset.
- **Liquid Glass:** the signature hero button — transparent body, a layered inset shadow rim, and an SVG `feTurbulence` + `feDisplacementMap` backdrop filter that refracts the WebGL threads behind it. Scales to `1.05` on hover. Reserved for the single most important action on a dark, moving ground.

### Cards / Containers

- **Corner Style:** `1.5rem` for primary offer cards, `1rem` for secondary ones.
- **Background:** Plinth Black on the dark ground; solid Exposed White for the one featured card, which also lifts `1rem` above its row on large screens.
- **Border:** 1px hairline. The featured card borders in solid white.
- **Internal Padding:** `2rem`, opening to `2.5rem` from `sm`.
- **Badge:** the "most popular" marker is a mono uppercase pill overlapping the card's top edge in inverted colors.

### Inputs / Fields

- **Style:** Transparent, no radius, 1px bottom border in the input token, `0.75rem` vertical padding. Labels sit above as mono kickers; the optional marker is a lowercase, untracked annotation beside the label.
- **Focus:** The underline brightens to full foreground over 300ms; the default outline is suppressed in favor of that shift.
- **Placeholder:** Muted foreground at 50% opacity, written as a real question rather than a repeat of the label.
- **Checkbox:** Native input tinted with `accent-color` set to the foreground token.
- **Error:** A bordered card on the muted surface with `role="alert"`, greyscale only, always offering the direct email as an escape hatch.

### Navigation

- **Bar:** Fixed, transparent, and rendered in `mix-blend-difference` so it inverts itself against whatever ground scrolls under it — no scroll-state bookkeeping. It slides away on scroll-down past 160px and returns on scroll-up.
- **Links:** Mono uppercase at 0.18em tracking. Hover draws a 1px underline that wipes in from the left (origin flips from right to left on hover). The active route is marked by a small filled dot that scales in, and its underline is suppressed.
- **Mobile menu:** A full-screen Gallery Black overlay that drops from the top. Links are giant masked reveals staggered at 70ms, each with a plate number, and the active route switches from display face to serif accent. A meta row of email, city, and legal links fades in last.

### Signature Components

- **Intro Curtain:** A full-screen black panel that counts to 100 with eased fake progress, then lifts upward over 900ms. Plays once per session and only on a full load of `/`; reduced-motion passes through instantly.
- **WebGL Hero Backdrop:** Three interfering sine threads drawn by a single fragment shader on a fullscreen triangle, with a vignette and blue-noise dither so the falloff does not band. Pauses off-screen and on hidden tabs; reduced-motion renders one static frame.
- **Grain Overlay:** A fixed 200%-sized SVG `feTurbulence` layer at 5% opacity in `overlay` blend mode above everything paintable. Hidden below 768px, where the full-viewport blend is expensive and barely visible.
- **Custom Cursor:** A `0.5rem` white dot in `mix-blend-difference` that replaces the native cursor on fine-pointer devices. It stretches into a vertical capsule proportional to scroll velocity, area-preserving so it never appears to grow, and eases back to a circle within ~150ms.
- **Click Spark:** Radial white spark lines fired from the pointer on every click, wrapping the entire app.
- **Scrub Text:** A manifesto paragraph whose words resolve individually as the section scrolls, with `*starred*` words rendered in the serif accent.
- **Marquee:** An infinite horizontal band of display-set words separated by a serif asterisk, running on a shared 26–28s linear keyframe.
- **Magnetic:** A wrapper that pulls its child toward the pointer within a proximity radius, used on the hero's primary action.

### Motion

One shared vocabulary across CSS, GSAP, and Framer Motion. `--ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`) drives every entrance — masked line reveals at 900ms, fades at 800ms. `--ease-inout-soft` (`cubic-bezier(0.65, 0, 0.35, 1)`) drives symmetric moves. A sharper `cubic-bezier(0.76, 0, 0.24, 1)` drives curtains and the nav bar's hide/reveal. State transitions run 200–300ms. Staggers are 50–80ms per item. Everything is guarded: `prefers-reduced-motion` collapses CSS animation and transition durations globally, and the heavy WebGL and Framer work checks the query directly.

## Do's and Don'ts

### Do:

- **Do** author every color at chroma 0. If a value needs a hue to work, the design is wrong, not the palette.
- **Do** read `var(--color-foreground)` and `var(--color-background)` instead of hardcoding black or white, so the component survives `.section-invert`.
- **Do** separate comparable items with 1px hairlines and index them with mono plate numbers, `(01)`.
- **Do** give each headline exactly one Instrument Serif italic word.
- **Do** set display type at 740 weight, 115% width, -0.035em tracking, 0.94 line-height. It is one setting, not a range to taste.
- **Do** compose headlines as one `Reveal` per line so lines rise in sequence.
- **Do** make depth from light on black grounds and from `lift-*` shadows on white ones.
- **Do** hold interactive targets at `2.75rem` minimum height.
- **Do** guard every new animation behind `prefers-reduced-motion`, and pause off-screen canvas work.
- **Do** keep fonts self-hosted through Fontsource. No CDN font request, ever — this is a DSGVO constraint, not a preference.

### Don't:

- **Don't** introduce a chromatic accent, a gradient with hue, or a colored state. Not for errors, not for success, not "just for the CTA."
- **Don't** drift toward the SaaS template look: soft purple-blue gradients, rounded feature cards in a three-up grid, illustrated blobs, badge rows.
- **Don't** use stock photography of people, generic trust badges, or safe centered corporate layouts.
- **Don't** cast a drop shadow on the black ground.
- **Don't** put a slightly-rounded rectangle anywhere — pills for controls, sheets for surfaces, nothing between.
- **Don't** box a text input. Underline only.
- **Don't** use a second serif word in a headline, or a serif that is not Instrument Serif.
- **Don't** shrink sans text below 0.75rem — change voice to mono uppercase instead.
- **Don't** wrap a list of comparable items in cards when hairline rows would do.
- **Don't** copy the liquid-glass button's shadow stack onto other components. It is one recipe for one button on one ground.
