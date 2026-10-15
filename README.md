# FeedCount

FeedCount is a lightweight mobile-first SvelteKit app that helps parents estimate how much formula may remain for the day.

Live app: https://feedcount.veronika.pt

The MVP is intentionally narrow. It focuses on one practical question: based on the baby’s setup, estimated daily formula target, and today’s consumed formula, how much formula is left today?

FeedCount is not medical advice.

## Core problem

Parents who use formula often need a simple way to understand whether they are roughly on track for the day.

FeedCount turns a few setup values into a calm daily estimate. It is not designed to replace medical guidance, detailed baby tracking, or professional feeding advice.

## MVP features

The current MVP includes:

- Baby setup values:
  - birth date
  - sex
  - current weight
  - formula kcal per 100 ml
  - usual bottle sizes
- Local setup storage using `localStorage`
- Daily formula intake input
- Daily formula target estimate
- Remaining formula estimate for today
- Bottle distribution suggestions based on saved bottle sizes
- Basic validation for missing or invalid values
- Friendly empty states when required data is not ready
- Mobile-first interface

## Estimates and limitations

All calculations in FeedCount are estimates.

The app uses simplified inputs to provide a practical daily reference, not a precise feeding plan. Babies’ needs vary, and feeding decisions should always consider the child’s behaviour, medical context, and advice from qualified healthcare professionals.

FeedCount is not medical advice.

## Reference data

FeedCount uses reference energy requirement values from the Food and Agriculture Organization of the United Nations (FAO) report:

**Human energy requirements: Report of a Joint FAO/WHO/UNU Expert Consultation**

Only the **Formula-fed** column of [Table 3.3](https://www.fao.org/4/y5686e/y5686e05.htm) is used. Legacy `mixed` profiles are interpreted as `formulaOnly` on load, preserving other settings. Rows 1–12 map to age intervals 0–1 through 11–12 months; the final row is retained at 12 completed months.

These values are used as a reference for estimating daily energy needs by age, sex, and weight. The app then converts the estimated energy need into formula volume using the formula’s kcal per 100 ml value.

The estimate converts the full daily energy requirement into formula volume. It does not subtract energy from complementary foods or breast milk, and therefore is not a required milk intake for a baby eating solids.

## Data storage

The MVP stores data locally in the browser using `localStorage`.

There is no backend, no account system, and no data sync between devices. Clearing browser data may remove saved setup and daily input values.

## What is intentionally out of scope

FeedCount is not a full baby tracker.

The MVP does not include:

- accounts
- backend storage
- cloud sync
- charts
- feeding history
- breastfeeding tracking
- sleep tracking
- diaper tracking
- notes
- reminders
- notifications
- medical recommendations
- growth tracking
- multi-child support

These are intentionally excluded to keep the MVP focused, understandable, and easy to test.

## Tech stack

FeedCount is built with:

- SvelteKit
- JavaScript with JSDoc
- localStorage
- mobile-first CSS
- Netlify deployment

## Deployment

### Home Screen icons

The browser favicon remains `src/lib/assets/favicon.svg`. Home Screen PNGs reuse
its bottle artwork, centred on an opaque square `#f7f1e8` background, without
the favicon's rounded tile corners:

- `static/apple-touch-icon.png` — 180×180, linked as the Apple Touch Icon.
- `static/icons/icon-192.png` — 192×192, manifest icon.
- `static/icons/icon-512.png` — 512×512, manifest icon for both ordinary and maskable use.

The artwork fits within the maskable icon's central 80% safe circle. The shared
layout links `static/manifest.webmanifest`, which uses FeedCount's name and light
background/theme color. The HTML theme color also follows the app's dark theme.

To regenerate the PNGs after editing the favicon, install ImageMagick and run
`node scripts/generate-icons.mjs`. ImageMagick is only needed for regeneration.

The app is deployed on Netlify with a custom subdomain:

https://feedcount.veronika.pt

## Project status

FeedCount is currently an MVP.

The core calculation flow, setup flow, local storage, validation, and mobile-first interface are implemented. Larger UX hierarchy improvements are planned post-MVP.
