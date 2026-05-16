# Lattice — Article Context (browser extension MVP)

Underlines mentions of UK politicians and companies on any web page, and shows a hover card with public-record context (donations, lobbying spend, government contracts, Companies House data).

## What's in v0.1

- **45 entities** hand-picked: 15 MPs, 15 companies, 15 UK news outlets — each with mock figures.
- Three entity types, each with a tailored hover card:
  - **Politician** — party, constituency, donations, register of interests, hospitality
  - **Company** — Companies House number, lobbying spend, government contracts
  - **News media** — ultimate owner, funding model, parent group, editorial endorsement
- Detection by name + common aliases ("Rt Hon ...", "...plc", "Sunday X"), case-insensitive, word-boundary matched.
- One-shot scan at `document_idle` — no MutationObserver yet, so SPA route changes won't re-scan until you reload.
- Global on/off toggle in the popup, persisted via `chrome.storage.sync`.

## Install (Chrome / Edge / Brave)

1. Open `chrome://extensions`.
2. Toggle **Developer mode** (top right).
3. Click **Load unpacked** and pick this `extension/` folder.
4. Pin the extension to your toolbar.
5. Visit any news site (Guardian, BBC, FT, Politico) and look for dotted-green underlines.

To turn it off: click the toolbar icon and flip the switch. Reload open tabs to apply.

## File layout

```
extension/
├── manifest.json     Manifest V3 declaration
├── entities.js       Mock dataset (window.LATTICE_ENTITIES)
├── content.js        Page scanner + hover card logic
├── content.css       Underline + card styling
├── popup.html/.css/.js   Toggle UI
└── icons/            (empty — Chrome uses default icon)
```

## Limitations to fix before this is real

- **Mock data only.** Figures are illustrative. Swap `entities.js` for live API responses (Electoral Commission, Companies House, Lobby Register, Contracts Finder) — likely via a Lattice backend that handles auth + caching + CORS.
- **No fuzzy matching.** "Sir Keir" alone won't match — needs to be a known alias. Entity resolution is the hard problem and lives server-side.
- **No SPA support.** Pages that update via client-side routing (e.g. Twitter, modern SPAs) won't re-scan. Add a `MutationObserver` when the data is real.
- **No per-site allowlist.** Currently global on/off. Consider per-domain toggles + an "exclude on this site" action.
- **No icons.** Chrome shows the default puzzle-piece. Drop PNGs in `icons/` and reference them from `manifest.json` when ready.
