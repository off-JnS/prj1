# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are owner-operated small businesses in and around Hamburg — restaurants, cafés, shops, trades, local service providers. They have no in-house designer, marketer, or developer. The owner evaluates and decides alone, usually between other work, and often first encounters the studio on a phone.

Their job: get a credible, distinctive web presence that makes their business look as good as it actually is, without having to learn how websites are made or manage a multi-party project.

## Product Purpose

PRJ1 is an independent web design studio in Hamburg, founded and run by João Nogueira e Silva. It designs and builds custom websites for local businesses — fixed price for the build, optional monthly plan for hosting and upkeep afterward.

The website at prj1.de is the studio's sales surface: it has to win the enquiry. Success is a qualified project enquiry from a local business owner, by contact form, email, or phone.

## Positioning

- **No templates, no page builders.** Every site is written for exactly one project. This is the studio's stated central claim.
- **Designer and developer are the same person.** What is decided in design arrives unchanged in the browser — no handoff loss, no "that's not technically possible" round trip.
- **One point of contact, deliberately few projects at a time.** The studio takes on fewer clients rather than more.
- **Strictly black and white**, argued as position rather than preference: convincing without color requires typography, space, and motion to actually work. The studio treats its own site as the proof.

## Operating Context

- All client-facing work is German. The site's routes and copy are German (`/portfolio`, `/studio`, `/preise`, `/kontakt`, `/impressum`, `/datenschutz`).
- Buying flow: visitor reads the package tiers, picks one, and either pays via a Stripe Payment Link or sends an enquiry. Stripe links are not configured yet, so every package button currently opens a pre-filled email instead.
- Contact flow: contact form (Web3Forms) or direct email/phone. The Web3Forms key is not set yet, so the form currently falls back to opening the visitor's mail client with the form data.
- German legal pages (Impressum, Datenschutz) are mandatory and already exist.
- The site ships as a static build deployed to Hostinger by GitHub Actions over FTP on every push to `main`.

## Capabilities and Constraints

- Static single-page app: Vite 6, React 18, TypeScript, Tailwind CSS v4, React Router. Motion via Framer Motion, GSAP, and Lenis smooth scroll. There is no backend and no CMS — all content lives in typed source files (`src/config/site.ts`, `src/data/plans.ts`, `src/data/projects.ts`).
- Hosting is plain static file serving on Hostinger; `public/.htaccess` handles SPA routing, caching, and security headers. No server-side rendering, no API routes.
- Google Analytics (`G-XSV6Q5784J`) loads only after explicit consent through the consent banner.
- **Pricing, as published:** one-time builds — Starter €1000, Professional €1750, Premium €2750. Monthly care plans — Basic €59, Standard €99, Premium €149. Stated timelines: Starter 2–3 weeks, Professional 4–6 weeks, Premium scheduled individually.
- The client owns design, code, and content outright after payment. A care plan is recommended but never required; without one the site is handed over for self-hosting.
- **Undecided / not yet configured:** Stripe Payment Links for every package, and the Web3Forms access key. Both have working fallbacks and must not be described as live.

## Brand Commitments

- Name: PRJ1. Claim: "Design ist alles." Founder credited by name: João Nogueira e Silva, working from Hamburg.
- The studio is one person. The German copy uses "wir" throughout — this is a deliberate voice choice, not a headcount claim. Do not add copy that implies employees, a team, or departments.
- Voice: German, direct, short sentences, confident without hype. It states what it will not do as readily as what it will.
- Black and white is a stated identity commitment, not a passing style choice.

## Evidence on Hand

- **Real:** the studio's own website, its packages and prices, the founder's name and Hamburg address, and the live contact channels.
- **Nine example projects (shipped).** The portfolio is nine of the studio's own demonstration builds for fictional Hamburg businesses, grouped by package tier — three Starter, three Professional, three Premium. They live at `public/beispiele/<slug>/` and are served from the same domain; source of record is the separate `Example/` repository. Every page carries a fixed "Beispielprojekt — fiktives Unternehmen" note linking back to prj1.de. They are never to be presented as clients, case studies, or references, and no testimonial may be attached to one. The individual demo sites contain invented figures (certifications, on-time rates, review scores) as part of their fiction; none of it may be repeated as PRJ1's own results.
- **Removed:** the three former portfolio testimonials (Ehso's Burger, Café Literarität, and the unrecorded Elena Costa video) were not confirmed real content. They and the testimonial components were deleted, along with the missing `public/testimonials/prj1.mp4` reference.
- **Not available — do not invent:** client testimonials, client logos, project counts, revenue or traffic results, awards, press mentions, and years-in-business claims. There is no proof for any of them. The portfolio shows work only until genuine quotes exist.

## Product Principles

1. **Proof stays honest.** Self-made examples are labeled as the studio's own work. No invented clients, quotes, numbers, or credentials — the studio's argument is craft, and faked proof destroys it.
2. **The site is the portfolio piece.** For a studio selling design, the sales surface is the strongest evidence it has. It is held to the standard being sold.
3. **One person, one promise.** Scope, response times, and commitments stay inside what a solo studio can actually deliver.
4. **Hamburg and German first.** Copy, legal pages, currency, tone, and buying flow serve a local German-speaking business owner deciding alone.
5. **Price and scope stated up front.** Fixed prices, named inclusions, and clear ownership beat "request a quote" for this audience.

## Accessibility & Inclusion

No formal standard has been confirmed by the studio. The existing implementation includes a skip link, focus management on route change, and consent-gated analytics; future work should not regress these. Whether a specific legal accessibility obligation applies is undecided and must not be claimed either way.
