# `/try` — Daily PESTEL dashboard

Replace the `/try` stub with a 6-card dashboard, one card per PESTEL letter, AI-generated on load. Click a card → pick your role (chips + free text) → see what it means for you. Same monochrome editorial system as the landing section. Cards on frontend shouldn't contain these letters. It's just an underlying principle

## Important caveat (please read)

You picked **AI-generated on load**. The model does **not** have grounded, real-time news for 16 May 2026 — it will produce *plausible, realistic-feeling* UK events for that date, not verified ones. Each card will be clearly labelled with its source mode and a "Verify against primary source" line. If accurate real-world events ever matter, we'd swap to a curated feed or a search-grounded model later. Cards regenerate on each page load (no caching in v1) — easy to swap to daily caching later.

## Backend prerequisite

Enable **Lovable Cloud** so `LOVABLE_API_KEY` is provisioned for the AI Gateway. Done as the first build step.

## Files

- `**src/lib/ai-gateway.ts**` — new. `createLovableAiGatewayProvider` helper exactly as specified in the gateway knowledge (OpenAI-compatible adapter, both required headers).
- `**src/lib/pestel.functions.ts**` — new. Three `createServerFn` endpoints, all using AI SDK `generateText` + `Output.object` for structured output via the gateway. Model: `google/gemini-3-flash-preview`.
  - `getPestelCards()` → returns `{ generatedFor: "2026-05-16", cards: Card[] }` where each `Card = { letter: "P"|"E"|"S"|"T"|"E2"|"L", category: string, headline: string, summary: string, suggested_roles: string[] }` (6 entries, one per letter; the two E's distinguished as Economic vs Environmental).
  - `getPersonalImpact({ card, role })` → returns `{ paragraphs: string[3], caveats: string }`. Role is one string (chip label OR free text).
  - `analyzePastedInput({ text, role })` → same return shape; system prompt instructs plain-English UK explainer tone, sourced to the input, with disclaimers.
  - All validated with Zod (`min`/`max` length on every string, max 2000 chars on pasted text, max 80 on role).
- `**src/routes/try.tsx**` — replace stub. UI described below. Uses `useServerFn` + TanStack Query (`useQuery` for cards on mount, `useMutation` for role-pick and paste-submit).
- `**src/components/PestelCard.tsx**` — new. Single card with letter glyph, category label, headline, summary, "Make it personal →" action.
- `**src/components/PersonalImpactPanel.tsx**` — new. The expanded state once a card is selected: role chips + "Or describe your situation" text input + result area + "Power-trace this (coming soon)" disabled button (the deferred "who caused / who benefits" seam).

## Dependencies to install

```
bun add ai @ai-sdk/openai-compatible
```

(`zod` is already present; `@tanstack/react-query` and the QueryClient are already wired in `__root.tsx`/`router.tsx`.)

## UI structure (`/try`)

```text
<main> (max-w-[960px], mx-auto, py-20, px-6)
  ├─ Crumb: Link "← Back" to /
  ├─ <h1> "What just landed"  (32px bold)
  ├─ Sub-line: "Six changes shaping the UK today — Friday 16 May 2026."  (#555)
  ├─ <hr/>
  ├─ Cards grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, 1px #DDD dividers between cells (no card borders — hairlines only, per the design language)
  │    └─ 6 × <PestelCard>  (skeleton state while loading)
  ├─ Selected-card panel (renders inline below grid when a card is picked):
  │    <PersonalImpactPanel card={selected}>
  │      ├─ Echo of card headline
  │      ├─ Label "WHO ARE YOU?"
  │      ├─ Row of chips from card.suggested_roles (same button style as landing)
  │      ├─ "Or describe your situation" — single-line text input, monospace placeholder
  │      ├─ Submit button "See what it means for me"
  │      ├─ Result: <PersonalImpact> with 3 paragraphs + caveat line in italic #777
  │      └─ Disabled link "Who pushed this through? — coming soon"
  ├─ <hr/>
  └─ "OR BRING YOUR OWN" section:
       ├─ Textarea (full-width, min-h 160px, 1px #000 border, no radius)
       ├─ Role chip row + free-text fallback (reuses the same role picker pattern, but with a generic default chip set: "Renter", "Homeowner", "Parent", "Self-employed", "Pensioner")
       └─ Submit → renders same <PersonalImpact> result shape below
```

Loading states: shimmer-free skeleton (just 6 grey blocks at the right height) matching the editorial tone — no spinners.

Errors: a single-line italic `#777` message above the affected block. Special handling for 429 ("Too many requests — try again in a minute") and 402 ("AI credits exhausted — add credits in Settings → Workspace → Usage").

## Server function shape (example)

```ts
export const getPestelCards = createServerFn({ method: "GET" })
  .handler(async () => {
    const gateway = createLovableAiGatewayProvider(process.env.LOVABLE_API_KEY!);
    const model = gateway("google/gemini-3-flash-preview");
    const { output } = await generateText({
      model,
      output: Output.object({ schema: CardsSchema }),
      system: "You are a UK civic explainer...",
      prompt: "Produce 6 plausible PESTEL items dated around 16 May 2026...",
    });
    return output;
  });
```

`getPersonalImpact` and `analyzePastedInput` follow the same `Output.object` pattern with their own Zod schemas. All three wrap the gateway call in try/catch and return a typed `{ data, error }` shape per the server-fn knowledge so the UI can render errors cleanly instead of crashing the route.

## Accessibility / responsiveness

- Cards are `<button>` elements (keyboard-activatable), `aria-expanded` reflects whether that card's panel is open.
- Role chips are `<button aria-pressed>` like on the landing section.
- The personal-impact result block is `aria-live="polite"`.
- Grid collapses to one column under 640px; chips wrap; textarea is full-width.
- Body min 17px mobile / 18px desktop.

## What's intentionally NOT in this turn (explicit seams left)

- **Power-trace** ("who caused / who benefits") — visible as a disabled button per card; logic deferred to next turn.
- **Caching of cards** — every page load regenerates. Easy to add (KV / Cloud table) when the cost matters.
- **URL paste / file upload** — paste-text only for v1, as you said "anything" but text is the safest single input. URL/file can land in a follow-up.
- **Auth / accounts** — none.

## Verification after build

1. Hit `/try` in preview; confirm 6 cards render and aren't lorem ipsum.
2. Click each card → role chips appear, free-text works, submit returns 3 paragraphs.
3. Submit the paste box with a 1-paragraph fake letter → result renders.
4. Force an error (temporarily break the key) → confirm friendly error string, not a route crash.
5. Mobile viewport (375px) — grid collapses, chips wrap, textarea full-width.