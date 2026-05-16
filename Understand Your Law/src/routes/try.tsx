import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Briefcase,
  Building2,
  Calendar,
  Check,
  Coins,
  Copy,
  HeartHandshake,
  Home,
  Shield,
  Share2,
  Vote,
} from "lucide-react";
import {
  getPersonalImpact,
  getPowerTrace,
  analyzePastedInput,
} from "@/lib/pestel.functions";
import {
  ASTROTURF_STYLE,
  FILTER_OPTIONS,
  PERSONA_TAGS,
  SEVERITY_STYLE,
  TOPIC_ACCENT,
  WEEKLY_CARDS,
  type FilterKey,
  type PersonaTag,
  type Topic,
  type WeeklyCard,
} from "@/lib/weekly-cards";
import { matchScore, matchingCardCount, tagMatches } from "@/lib/role-mapping";

export const Route = createFileRoute("/try")({
  head: () => ({
    meta: [
      {
        title:
          "What landed this week — UK policy in plain English",
      },
      {
        name: "description",
        content:
          "Plain English. Sources cited. Built with women's policy organisations. Six UK changes shaping this week.",
      },
    ],
  }),
  component: TryPage,
});

type View = "grid" | "card" | "paste";

const PAGE_BG = "#F7F4EE";
const INK = "#0B0E14";
const INK_SOFT = "#3A3F47";
const HAIRLINE = "#D6D2C7";

const PASTE_ROLES = [
  "Renter",
  "Homeowner",
  "Parent",
  "Self-employed",
  "Pensioner",
];

const DISCLAIMER =
  "AI-generated for illustration. Verify anything important against the primary source.";

const TOPIC_ICON: Record<Topic, typeof Briefcase> = {
  "work-rights": Briefcase,
  civic: Vote,
  money: Coins,
  "family-care": HeartHandshake,
  housing: Home,
  infrastructure: Building2,
};

function TryPage() {
  const [view, setView] = useState<View>("grid");
  const [selectedCard, setSelectedCard] = useState<WeeklyCard | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  const openCard = (card: WeeklyCard) => {
    setSelectedCard(card);
    setView("card");
  };
  const backToGrid = () => {
    setSelectedCard(null);
    setView("grid");
  };

  return (
    <main
      className="min-h-screen font-sans-plex"
      style={{ background: PAGE_BG, color: INK }}
    >
      <div className="mx-auto w-full max-w-[1120px] px-6 py-16">
        {view === "grid" && (
          <GridView onSelect={openCard} onPaste={() => setView("paste")} />
        )}
        {view === "card" && selectedCard && (
          <CardView card={selectedCard} onBack={backToGrid} />
        )}
        {view === "paste" && <PasteView onBack={backToGrid} />}
      </div>
    </main>
  );
}

/* ---------------- GRID ---------------- */

function GridView({
  onSelect,
  onPaste,
}: {
  onSelect: (c: WeeklyCard) => void;
  onPaste: () => void;
}) {
  const [filter, setFilter] = useState<FilterKey>("for-me");
  const [personas, setPersonas] = useState<PersonaTag[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [draftTag, setDraftTag] = useState("");

  const togglePersona = (p: PersonaTag) =>
    setPersonas((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );

  const addCustomTag = () => {
    const t = draftTag.trim();
    if (!t) return;
    if (t.length > 40) return;
    setCustomTags((prev) => (prev.includes(t) ? prev : [...prev, t]));
    setDraftTag("");
  };
  const removeCustomTag = (t: string) =>
    setCustomTags((prev) => prev.filter((x) => x !== t));

  const filtered = useMemo(() => {
    if (filter === "for-me") {
      if (personas.length === 0) return WEEKLY_CARDS;
      // sort by match score desc, stable on ties
      return WEEKLY_CARDS.map((c, i) => ({ c, i, s: matchScore(c, personas) }))
        .sort((a, b) => (b.s - a.s) || (a.i - b.i))
        .map((x) => x.c);
    }
    return WEEKLY_CARDS.filter((c) => c.filters.includes(filter));
  }, [filter, personas]);

  const matchCount = matchingCardCount(personas, WEEKLY_CARDS);
  const sortStatus =
    filter === "for-me" && personas.length > 0
      ? `Feed prioritised for you. ${matchCount} card${matchCount === 1 ? "" : "s"} match your situation.`
      : "";

  return (
    <>
      <p className="text-[13px]">
        <Link
          to="/"
          className="underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: INK, outlineColor: INK }}
        >
          ← Back
        </Link>
      </p>

      <h1
        className="font-serif-source mt-8 text-[40px] md:text-[44px] font-semibold leading-[1.1] tracking-tight"
        style={{ color: INK }}
      >
        What landed this week — and what it means for you.
      </h1>
      <p
        className="mt-4 max-w-[640px] text-[17px] leading-[1.6]"
        style={{ color: INK_SOFT }}
      >
        Plain English. Sources cited. Built with women's policy organisations.
      </p>

      {/* Filter chips */}
      <div
        className="mt-10 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter feed"
      >
        {FILTER_OPTIONS.map((f) => {
          const pressed = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={pressed}
              onClick={() => setFilter(f.key)}
              className="rounded-full border px-4 py-2 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={
                pressed
                  ? {
                      background: INK,
                      color: PAGE_BG,
                      borderColor: INK,
                      outlineColor: INK,
                    }
                  : {
                      background: "transparent",
                      color: INK,
                      borderColor: HAIRLINE,
                      outlineColor: INK,
                    }
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Personalisation */}
      <div
        className="mt-6 rounded-[2px] border p-5"
        style={{ borderColor: HAIRLINE, background: "rgba(255,255,255,0.5)" }}
      >
        <p className="text-[13px]" style={{ color: INK_SOFT }}>
          Tell us about you and we'll prioritise the feed and tailor each answer →
        </p>

        {/* Preset persona chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {PERSONA_TAGS.map((p) => {
            const pressed = personas.includes(p);
            return (
              <button
                key={p}
                type="button"
                aria-pressed={pressed}
                onClick={() => togglePersona(p)}
                className="rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={
                  pressed
                    ? { background: INK, color: PAGE_BG, borderColor: INK, outlineColor: INK }
                    : { background: "transparent", color: INK, borderColor: HAIRLINE, outlineColor: INK }
                }
              >
                {p}
              </button>
            );
          })}

          {/* Custom tags */}
          {customTags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium"
              style={{ background: INK, color: PAGE_BG, borderColor: INK }}
            >
              {t}
              <button
                type="button"
                onClick={() => removeCustomTag(t)}
                aria-label={`Remove ${t}`}
                className="rounded-full text-[14px] leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ color: PAGE_BG, outlineColor: PAGE_BG }}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Add custom tag */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={draftTag}
            onChange={(e) => setDraftTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomTag();
              }
            }}
            maxLength={40}
            placeholder="Add your own — e.g. 'single mum', 'NHS nurse', 'disabled'"
            className="h-[36px] flex-1 min-w-[220px] rounded-full border px-4 text-[13px] placeholder:text-[#999] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: "white", color: INK, borderColor: HAIRLINE, outlineColor: INK }}
          />
          <button
            type="button"
            onClick={addCustomTag}
            disabled={!draftTag.trim()}
            className="rounded-full border px-4 h-[36px] text-[13px] font-medium disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: "transparent", color: INK, borderColor: INK, outlineColor: INK }}
          >
            + Add
          </button>
        </div>

        {/* Free-text "anything else" */}
        <label
          htmlFor="aboutYou"
          className="mt-4 block text-[12px] italic"
          style={{ color: INK_SOFT }}
        >
          Anything else you want the AI to know about your situation?
        </label>
        <input
          id="aboutYou"
          type="text"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          maxLength={160}
          placeholder="e.g. 'renting in Manchester with a 2-year-old, partner self-employed'"
          className="mt-2 block h-[40px] w-full rounded-[2px] border px-3 text-[14px] placeholder:text-[#999] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ background: "white", color: INK, borderColor: HAIRLINE, outlineColor: INK }}
        />
      </div>

      {/* Visually hidden live region announcing sort changes */}
      <div
        aria-live="polite"
        role="status"
        className="sr-only"
      >
        {sortStatus}
      </div>

      {/* Cards grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
        {filtered.map((card) => (
          <CardTile
            key={card.id}
            card={card}
            personas={personas}
            customTags={customTags}
            freeText={freeText}
            togglePersona={togglePersona}
            onOpenDetail={() => onSelect(card)}
          />
        ))}
        {filtered.length === 0 && (
          <p
            className="col-span-full py-8 text-[14px] italic"
            style={{ color: INK_SOFT }}
          >
            No items match that filter yet. Try another chip.
          </p>
        )}
      </div>

      {/* Paste link */}
      <div
        className="mt-16 border-t pt-10 text-center"
        style={{ borderColor: HAIRLINE }}
      >
        <button
          type="button"
          onClick={onPaste}
          className="text-[15px] font-medium underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: INK, outlineColor: INK }}
        >
          Or paste your own bill or letter →
        </button>
        <p
          className="mt-6 text-[12px] italic"
          style={{ color: "#6B6B6B" }}
        >
          Open data from parliament.uk, legislation.gov.uk, mySociety, ONS and Hansard. AI-assisted — sources cited on every card.
        </p>
      </div>
    </>
  );
}

function CardTile({
  card,
  personas,
  customTags,
  freeText,
  togglePersona,
  onOpenDetail,
}: {
  card: WeeklyCard;
  personas: PersonaTag[];
  customTags: string[];
  freeText: string;
  togglePersona: (p: PersonaTag) => void;
  onOpenDetail: () => void;
}) {
  const Icon = TOPIC_ICON[card.topic];
  const accent = TOPIC_ACCENT[card.topic];
  const isHigh = card.variant === "high";

  const oneLiner = useMemo(
    () =>
      buildOneLiner({
        headline: card.headline,
        meaning: card.meaning,
        sourceHref: card.source.href,
      }),
    [card],
  );

  const personaStr = personas.join(",");
  const tagStr = customTags.join(",");
  const ctxStr = freeText.trim();
  const impactSearch = {
    personas: personaStr || undefined,
    tags: tagStr || undefined,
    ctx: ctxStr || undefined,
  };

  // Silence unused-prop lint (kept for future inline picker if needed).
  void togglePersona;

  return (
    <article
      className="relative flex flex-col rounded-[2px] border bg-white p-4"
      style={{
        borderColor: HAIRLINE,
        boxShadow: isHigh ? "0 1px 0 0 rgba(0,0,0,0.02)" : undefined,
      }}
    >
      {isHigh && (
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 h-[2px]"
          style={{ background: accent }}
        />
      )}

      {/* Row 1: topic + severity */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon size={16} strokeWidth={1.75} style={{ color: accent }} />
          <span
            className="text-[12px] font-semibold uppercase tracking-[0.06em]"
            style={{ color: accent }}
          >
            {card.topicLabel}
          </span>
        </div>
        <SeverityBadge
          severity={card.severity}
          personalized={
            personas.length > 0 || customTags.length > 0 || freeText.trim().length > 0
          }
        />
      </div>

      {/* Headline */}
      <h3
        className={
          "font-serif-source mt-3 font-semibold leading-[1.2] " +
          (isHigh ? "text-[22px]" : "text-[19px]")
        }
        style={{ color: INK }}
      >
        {card.headline}
      </h3>

      {/* Plain English meaning */}
      <p
        className="mt-3 text-[15px] leading-[1.55]"
        style={{ color: INK }}
      >
        {card.meaning}
      </p>

      {/* Affects you if */}
      <div className="mt-4">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: INK_SOFT }}
        >
          Affects you if
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {card.affectsYouIf.map((t) => {
            const matched = tagMatches(t, personas);
            return (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px]"
                style={{
                  borderColor: matched ? INK : HAIRLINE,
                  color: INK,
                  background: PAGE_BG,
                  fontWeight: matched ? 500 : 400,
                }}
                aria-label={matched ? `${t} — matches your selection` : undefined}
              >
                {matched && (
                  <span
                    aria-hidden="true"
                    className="inline-block h-[6px] w-[6px] rounded-full"
                    style={{ background: accent }}
                  />
                )}
                {t}
              </span>
            );
          })}
        </div>
      </div>

      {/* Commencement */}
      <p
        className="mt-4 flex items-center gap-1.5 font-mono-plex text-[12px]"
        style={{ color: INK_SOFT }}
      >
        <Calendar size={14} strokeWidth={1.75} />
        <span>{card.commencement}</span>
      </p>

      {/* Spin vs reality */}
      {card.spinReality && (
        <div
          className="mt-4 rounded-[2px] border p-3"
          style={{ borderColor: HAIRLINE, background: PAGE_BG }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: INK_SOFT }}
          >
            Spin vs reality
          </p>
          <p className="mt-1.5 text-[13px] leading-[1.5]" style={{ color: INK }}>
            <span className="font-semibold">What's being said: </span>
            <span style={{ color: INK_SOFT }}>{card.spinReality.spin}</span>
          </p>
          <p className="mt-1 text-[13px] leading-[1.5]" style={{ color: INK }}>
            <span className="font-semibold">
              What the bill/data actually says:{" "}
            </span>
            {card.spinReality.reality}
          </p>
        </div>
      )}

      {/* Astroturf strip */}
      {card.astroturf && (
        <div
          className="mt-3 flex items-center gap-2 rounded-[2px] px-3 py-2 text-[12px]"
          style={{
            background: ASTROTURF_STYLE[card.astroturf.level].bg,
            color: ASTROTURF_STYLE[card.astroturf.level].fg,
          }}
        >
          <Shield size={14} strokeWidth={1.75} />
          <span>
            <span className="font-semibold">
              Coordination signal: {card.astroturf.level}
            </span>{" "}
            — {card.astroturf.matched} of {card.astroturf.total} viral posts
            match coordinated patterns.{" "}
            <a href="#" className="underline">
              See analysis →
            </a>
          </span>
        </div>
      )}

      {/* Source */}
      <p
        className="mt-4 text-[12px] leading-[1.5]"
        style={{ color: INK_SOFT }}
      >
        Source:{" "}
        <a
          href={card.source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: INK }}
        >
          {card.source.label}
        </a>
      </p>

      {/* Primary CTA */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          to="/try/impact/$cardId"
          params={{ cardId: card.id }}
          search={impactSearch}
          className="rounded-[2px] border px-4 py-2.5 text-[14px] font-semibold no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: INK,
            color: PAGE_BG,
            borderColor: INK,
            outlineColor: INK,
          }}
        >
          How does this affect me? →
        </Link>
        <ShareOneLinerButton oneLiner={oneLiner} />
        <ShareIconButton oneLiner={oneLiner} headline={card.headline} />
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={onOpenDetail}
          className="text-[13px] hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: INK_SOFT, outlineColor: INK }}
        >
          What you can do →
        </button>
      </div>

      {card.womenImpact && (
        <span className="sr-only">Women-affecting policy change</span>
      )}
    </article>
  );
}

const GENERIC_SEVERITY_LABEL: Record<WeeklyCard["severity"], string> = {
  high: "High impact",
  watch: "Watch",
  fyi: "FYI",
};

function SeverityBadge({
  severity,
  personalized,
}: {
  severity: WeeklyCard["severity"];
  personalized: boolean;
}) {
  const s = SEVERITY_STYLE[severity];
  const label = personalized ? s.label : GENERIC_SEVERITY_LABEL[severity];
  return (
    <span
      className="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: s.bg, color: s.fg, borderColor: s.border }}
    >
      {label}
    </span>
  );
}

function buildOneLiner({
  headline,
  meaning,
  sourceHref,
}: {
  headline: string;
  meaning: string;
  sourceHref: string;
}) {
  // ≤ 220 chars including the link
  const tail = ` ${sourceHref} via Plain Politics`;
  const budget = 220 - tail.length;
  const base = `${headline}. ${meaning}`;
  const trimmed =
    base.length > budget ? base.slice(0, Math.max(0, budget - 1)) + "…" : base;
  return trimmed + tail;
}

function ShareOneLinerButton({ oneLiner }: { oneLiner: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(oneLiner);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-1.5 rounded-[2px] border px-4 py-2.5 text-[13px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        background: "transparent",
        color: INK,
        borderColor: INK,
        outlineColor: INK,
      }}
    >
      {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={1.75} />}
      <span>{copied ? "Copied" : "Share as a one-liner"}</span>
    </button>
  );
}

function ShareIconButton({
  oneLiner,
  headline,
}: {
  oneLiner: string;
  headline: string;
}) {
  const share = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: headline, text: oneLiner });
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(oneLiner);
    } catch {
      /* noop */
    }
  };
  return (
    <button
      type="button"
      onClick={share}
      aria-label="Share to messaging or social"
      className="flex h-[38px] w-[38px] items-center justify-center rounded-[2px] border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        background: "transparent",
        color: INK,
        borderColor: HAIRLINE,
        outlineColor: INK,
      }}
    >
      <Share2 size={15} strokeWidth={1.75} />
    </button>
  );
}

/* ---------------- CARD DETAIL ---------------- */

function CardView({
  card,
  onBack,
}: {
  card: WeeklyCard;
  onBack: () => void;
}) {
  const impactFn = useServerFn(getPersonalImpact);
  const powerFn = useServerFn(getPowerTrace);

  const [chips, setChips] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");

  const impact = useMutation({
    mutationFn: async (role: string) =>
      impactFn({
        data: {
          headline: card.headline,
          summary: card.meaning,
          role,
        },
      }),
  });

  const power = useMutation({
    mutationFn: async () =>
      powerFn({
        data: { cardHeadline: card.headline, cardSummary: card.meaning },
      }),
  });

  const composedRole = [chips.join(", "), freeText.trim()]
    .filter(Boolean)
    .join(" — ");
  const canSubmit =
    !impact.isPending && (chips.length > 0 || freeText.trim().length > 0);

  const result = impact.data?.data;
  const impactError = impact.data?.error;
  const powerResult = power.data?.data;
  const powerError = power.data?.error;

  const submit = () => {
    impact.mutate(composedRole, {
      onSuccess: (res) => {
        if (res.data) power.mutate();
      },
    });
  };

  const accent = TOPIC_ACCENT[card.topic];

  return (
    <>
      <BackLink onClick={onBack} />

      <div className="mt-6 flex items-center gap-2">
        <span
          className="text-[12px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: accent }}
        >
          {card.topicLabel}
        </span>
        <SeverityBadge severity={card.severity} personalized={false} />
      </div>

      <h2
        className="font-serif-source mt-3 text-[30px] font-semibold leading-[1.15]"
        style={{ color: INK }}
      >
        {card.headline}
      </h2>
      <p
        className="mt-3 text-[17px] leading-[1.6]"
        style={{ color: INK }}
      >
        {card.meaning}
      </p>
      <p
        className="mt-3 font-mono-plex text-[12px]"
        style={{ color: INK_SOFT }}
      >
        {card.commencement}
      </p>

      <Rule className="mt-8" />

      <div className="mt-8 max-w-[640px]">
        <SectionLabel>Who are you?</SectionLabel>
        <div className="mt-3 flex flex-wrap gap-2">
          {card.affectsYouIf.map((g) => (
            <Chip
              key={g}
              label={g}
              pressed={chips.includes(g)}
              onClick={() =>
                setChips((prev) =>
                  prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
                )
              }
            />
          ))}
        </div>

        <label
          htmlFor="cardFreeText"
          className="mt-4 block text-[12px] font-medium italic"
          style={{ color: INK_SOFT }}
        >
          Anything else about your situation
        </label>
        <input
          id="cardFreeText"
          type="text"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          maxLength={120}
          placeholder="e.g. single parent renting in Manchester"
          className="mt-2 block h-[44px] w-full rounded-[2px] border px-4 text-[16px] placeholder:text-[#999] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: "white",
            color: INK,
            borderColor: INK,
            outlineColor: INK,
          }}
        />

        <PrimaryButton
          disabled={!canSubmit}
          onClick={submit}
          className="mt-4"
        >
          {impact.isPending ? "Thinking…" : "See how it affects me"}
        </PrimaryButton>

        {impactError && (
          <p className="mt-4 text-[14px] italic" style={{ color: INK_SOFT }}>
            {impactError}
          </p>
        )}
      </div>

      {result && (
        <section aria-live="polite">
          <Rule className="mt-8" />
          <p className="mt-8 text-[13px] italic" style={{ color: INK_SOFT }}>
            {DISCLAIMER}
          </p>
          <div className="mt-4 flex max-w-[720px] flex-col gap-4">
            {result.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[17px] leading-[1.65]"
                style={{ color: INK }}
              >
                {p}
              </p>
            ))}
          </div>
          <p className="mt-6 text-[13px]" style={{ color: INK_SOFT }}>
            Source:{" "}
            <a
              href={card.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-plex underline"
              style={{ color: INK }}
            >
              {card.source.label}
            </a>
          </p>

          <Rule className="mt-8" />
          <div className="mt-8 max-w-[720px]">
            <SectionLabel>Who pushed this through</SectionLabel>
            {power.isPending && (
              <p className="mt-4 text-[14px] italic" style={{ color: INK_SOFT }}>
                Tracing…
              </p>
            )}
            {powerError && (
              <p className="mt-4 text-[14px] italic" style={{ color: INK_SOFT }}>
                {powerError}{" "}
                <button
                  type="button"
                  onClick={() => power.mutate()}
                  className="underline"
                >
                  Try again
                </button>
              </p>
            )}
            {powerResult && (
              <>
                <div className="mt-4 flex flex-col gap-4">
                  {powerResult.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-[17px] leading-[1.65]"
                      style={{ color: INK }}
                    >
                      {p}
                    </p>
                  ))}
                </div>
                <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: INK }}>
                  Who benefits, who loses
                </p>
                <p className="mt-3 text-[17px] leading-[1.65]" style={{ color: INK }}>
                  {powerResult.beneficiaries}
                </p>
                <p className="mt-6 text-[13px]" style={{ color: INK_SOFT }}>
                  Source:{" "}
                  <span className="font-mono-plex" style={{ color: INK }}>
                    Hansard, Electoral Commission, Lobbying Register
                  </span>
                </p>
              </>
            )}
          </div>

          <Rule className="mt-8" />
          <div className="mt-8">
            <BackLink onClick={onBack} />
          </div>
        </section>
      )}
    </>
  );
}

/* ---------------- PASTE ---------------- */

function PasteView({ onBack }: { onBack: () => void }) {
  const fn = useServerFn(analyzePastedInput);
  const [text, setText] = useState("");
  const [chips, setChips] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");

  const mutation = useMutation({
    mutationFn: async (vars: { text: string; role: string }) =>
      fn({ data: vars }),
  });

  const composedRole = [chips.join(", "), freeText.trim()]
    .filter(Boolean)
    .join(" — ");
  const canSubmit =
    !mutation.isPending &&
    text.trim().length >= 20 &&
    composedRole.length > 0;

  const result = mutation.data?.data;
  const error = mutation.data?.error;

  return (
    <>
      <BackLink onClick={onBack} />

      <h1
        className="font-serif-source mt-8 text-[34px] font-semibold leading-[1.15]"
        style={{ color: INK }}
      >
        Bring your own
      </h1>
      <p className="mt-3 text-[17px]" style={{ color: INK_SOFT }}>
        Paste a bill, official letter, or document excerpt. We'll explain it for
        your situation.
      </p>

      <Rule className="mt-8" />

      <div className="mt-8 max-w-[720px]">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={4000}
          placeholder="Paste here — up to about 4,000 characters."
          className="font-sans-plex block w-full min-h-[160px] rounded-[2px] border p-4 text-[17px] leading-[1.55] placeholder:font-mono-plex placeholder:text-[#999] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: "white",
            color: INK,
            borderColor: INK,
            outlineColor: INK,
          }}
        />
        <p className="mt-1 text-right text-[11px]" style={{ color: INK_SOFT }}>
          {text.length} / 4000
        </p>

        <div className="mt-6">
          <SectionLabel>Who are you?</SectionLabel>
          <div className="mt-3 flex flex-wrap gap-2">
            {PASTE_ROLES.map((r) => (
              <Chip
                key={r}
                label={r}
                pressed={chips.includes(r)}
                onClick={() =>
                  setChips((prev) =>
                    prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
                  )
                }
              />
            ))}
          </div>

          <label
            htmlFor="pasteFreeText"
            className="mt-3 block text-[12px] font-medium italic"
            style={{ color: INK_SOFT }}
          >
            Or describe your situation
          </label>
          <input
            id="pasteFreeText"
            type="text"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            maxLength={120}
            className="mt-2 block h-[44px] w-full rounded-[2px] border px-4 text-[16px] placeholder:text-[#999] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: "white",
              color: INK,
              borderColor: INK,
              outlineColor: INK,
            }}
          />
        </div>

        <PrimaryButton
          disabled={!canSubmit}
          onClick={() =>
            mutation.mutate({ text: text.trim(), role: composedRole })
          }
          className="mt-4"
        >
          {mutation.isPending ? "Thinking…" : "Explain it for me"}
        </PrimaryButton>

        {error && (
          <p className="mt-4 text-[14px] italic" style={{ color: INK_SOFT }}>
            {error}
          </p>
        )}
      </div>

      {result && (
        <section aria-live="polite">
          <Rule className="mt-8" />
          <p className="mt-8 text-[13px] italic" style={{ color: INK_SOFT }}>
            {DISCLAIMER}
          </p>
          <div className="mt-4 flex max-w-[720px] flex-col gap-4">
            {result.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[17px] leading-[1.65]"
                style={{ color: INK }}
              >
                {p}
              </p>
            ))}
          </div>
          <p className="mt-6 text-[13px] italic" style={{ color: INK_SOFT }}>
            {result.caveat}
          </p>
        </section>
      )}
    </>
  );
}

/* ---------------- Shared primitives ---------------- */

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[13px] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ color: INK, outlineColor: INK }}
    >
      ← Back to all
    </button>
  );
}

function Rule({ className = "" }: { className?: string }) {
  return (
    <hr className={"border-0 border-t " + className} style={{ borderColor: HAIRLINE }} />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-[12px] font-semibold uppercase tracking-[0.08em]"
      style={{ color: INK }}
    >
      {children}
    </span>
  );
}

function Chip({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="min-h-[40px] rounded-full border px-4 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={
        pressed
          ? { background: INK, color: PAGE_BG, borderColor: INK, outlineColor: INK }
          : {
              background: "transparent",
              color: INK,
              borderColor: HAIRLINE,
              outlineColor: INK,
            }
      }
    >
      {label}
    </button>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={
        "rounded-[2px] border px-8 py-[14px] text-[14px] font-semibold transition-colors disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
        className
      }
      style={{
        background: INK,
        color: PAGE_BG,
        borderColor: INK,
        outlineColor: INK,
      }}
    >
      {children}
    </button>
  );
}
