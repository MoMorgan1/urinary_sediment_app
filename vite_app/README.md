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
- Cross-session progress saved in browser `localStorage`
- Daily streak counter
- Stats panel with mastery breakdown
- Keyboard shortcuts: `Space` reveal · `1` Again · `2` Good · `3` Easy · `S` Skip
- Respects `prefers-reduced-motion`

## Project structure

```
src/
├── App.jsx                       # top-level state + composition
├── cards.js                      # static card data, deck definitions
├── constants.js                  # shared style tokens & SM-2 grade values
├── srs.js                        # SM-2 algorithm + persistence + streak
├── index.css                     # Tailwind entry + reduced-motion overrides
├── main.jsx                      # ReactDOM bootstrap
├── components/
│   ├── DeckSwitcher.jsx
│   ├── Flashcard.jsx
│   ├── Header.jsx
│   └── StatsPanel.jsx
└── hooks/
    └── useKeyboardShortcuts.js
```

## Develop locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build
```

## Deploy to Vercel (drag-and-drop)

1. **Build locally first** (one-time, on any machine with Node ≥ 18):
   ```bash
   npm install
   npm run build
   ```
   This creates a `dist/` folder.

2. **Drag-and-drop on Vercel:**
   - Go to https://vercel.com/new
   - Drag the entire `vite_app` folder onto the page
   - Vercel auto-detects Vite and deploys

   **OR** drag just the `dist/` folder for a static-only deploy.

3. **Open the URL on your phone.** Add to home screen for an app-like experience.

## Switching from cram-mode to long-term SRS

In `src/srs.js`, change the unit constant:

```js
export const UNIT_MS = 60 * 1000;          // cram mode: 1 minute = 1 "day"
// to
export const UNIT_MS = 24 * 60 * 60 * 1000; // 1 real day (Anki-style)
```

This restores standard intervals (1d, 3d, ~6d, ~15d…).
