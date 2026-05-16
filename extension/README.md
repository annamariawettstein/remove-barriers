# Expose — Context Utility MVP

Browser extension scaffold for the "works while you browse" experience: highlight a public figure, company, media outlet, or think tank in page text, then surface source-linked context inline and in a pinned sidebar dossier.

## What changed from the Hong Kong MVP

- Kept the no-friction content-script architecture from `../hong-kong/extension`.
- Upgraded the data model from flat facts to structured `summaryMetrics`, `sections`, and `relationships`.
- Added **confidence scoring** and **source transparency** to every surfaced claim.
- Added a **sidebar dossier** on click, so the extension can carry richer relationship and contradiction context without forcing new tabs.
- Added **dynamic rescanning** via `MutationObserver`, which is the minimum needed for social feeds, SPAs, and transcript-heavy pages.
- Added local **follow-state** (`trackedEntityIds`) so users can save entities they want to keep an eye on.

## Current demo scope

- Demo entities only: 5 rich examples across politicians, a company, a media outlet, and a think tank.
- Facts are illustrative, but the UI and storage model are designed around real source-linked evidence.
- No backend yet. There is no live ingestion from Electoral Commission, TheyWorkForYou, Companies House, lobbying registers, or transcript pipelines.

## Files

```text
extension/
├── manifest.json
├── entities.js
├── content.js
├── content.css
├── popup.html
├── popup.css
└── popup.js
```

## Next build slices

1. Replace `entities.js` with a fetch layer and cache keyed by canonical entity ID.
2. Add per-jurisdiction entity resolvers instead of relying on exact alias matching.
3. Move relationship scoring into a backend service so "direct donor" and "two degrees away" are computed consistently.
4. Add export, alerts, and comparison mode once the evidence model is live.
