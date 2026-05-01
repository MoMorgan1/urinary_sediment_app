# Urinary Sediment Flashcards

Adaptive flashcard app for veterinary clinical pathology — urinary sediment microscopy.
Uses **time-compressed SM-2 spaced repetition** (built for cramming, not long-term).

## Decks

- **All** (32 cards) — crystals + organized sediment combined
- **Crystals** (16) — image → name + pH + interpretation
- **Organized** (16) — image → name + interpretation

## Features

- SM-2 spaced repetition with 3-button grading (Again / Good / Easy)
- Mastery tracking per card (New → Learning → Young → Mature)
- Cross-session progress saved in browser localStorage
- Daily streak counter
- Stats panel with mastery breakdown

## Deploy to Vercel (drag-and-drop)

1. **Install dependencies & build locally first** (one-time, on any machine with Node ≥ 18):
   ```bash
   npm install
   npm run build
   ```
   This creates a `dist/` folder.

2. **Drag-and-drop on Vercel:**
   - Go to https://vercel.com/new
   - Drag the entire `vite_app` folder onto the page
   - Vercel auto-detects Vite and deploys
   - You get a URL like `https://urinary-sediment-flashcards.vercel.app`

   **OR** drag just the `dist/` folder for a static-only deploy (skip step 1's build setup on Vercel side).

3. **Open the URL on your phone.** Add to home screen for an app-like experience.

## Run locally (optional)

```bash
npm install
npm run dev
```
Opens at http://localhost:5173

## Switching from cram-mode to long-term SRS

In `src/srs.js`, change:
```js
const UNIT_MS = 60 * 1000; // 1 minute = 1 "day"
```
to:
```js
const UNIT_MS = 24 * 60 * 60 * 1000; // 1 real day
```
This restores standard Anki-style intervals (1d, 3d, ~6d, ~15d...).
