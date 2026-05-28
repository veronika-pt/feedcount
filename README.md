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
  - feeding mode
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

These values are used as a reference for estimating daily energy needs by age, sex, and weight. The app then converts the estimated energy need into formula volume using the formula’s kcal per 100 ml value.

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

The app is deployed on Netlify with a custom subdomain:

https://feedcount.veronika.pt

## Project status

FeedCount is currently an MVP.

The core calculation flow, setup flow, local storage, validation, and mobile-first interface are implemented. Larger UX hierarchy improvements are planned post-MVP.
