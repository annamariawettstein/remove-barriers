import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPersonalImpact } from "@/lib/pestel.functions";
import {
  PERSONA_TAGS,
  SEVERITY_STYLE,
  TOPIC_ACCENT,
  WEEKLY_CARDS,
  type PersonaTag,
} from "@/lib/weekly-cards";

const GENERIC_SEVERITY_LABEL = {
  high: "High impact",
  watch: "Watch",
  fyi: "FYI",
} as const;

type Search = {
  personas?: string;
  tags?: string;
  ctx?: string;
};

export const Route = createFileRoute("/try/impact/$cardId")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    personas: typeof s.personas === "string" ? s.personas : undefined,
    tags: typeof s.tags === "string" ? s.tags : undefined,
    ctx: typeof s.ctx === "string" ? s.ctx : undefined,
  }),
  head: () => ({
    meta: [
      { title: "How does this affect me? — Plain Politics" },
      {
        name: "description",
        content:
          "A personalised plain-English explanation of how this week's policy change affects your situation.",
      },
    ],
  }),
  component: ImpactPage,
});

const PAGE_BG = "#F7F4EE";
const INK = "#0B0E14";
const INK_SOFT = "#3A3F47";
const HAIRLINE = "#D6D2C7";

function ImpactPage() {
  const { cardId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const card = WEEKLY_CARDS.find((c) => c.id === cardId);

  const initialPersonas = useMemo<PersonaTag[]>(() => {
    if (!search.personas) return [];
    return search.personas
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string): s is PersonaTag =>
        (PERSONA_TAGS as readonly string[]).includes(s),
      );
  }, [search.personas]);

  const initialCustom = useMemo(
    () =>
      (search.tags ?? "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
    [search.tags],
  );

  const [personas, setPersonas] = useState<PersonaTag[]>(initialPersonas);
  const [customTags, setCustomTags] = useState<string[]>(initialCustom);
  const [freeText, setFreeText] = useState(search.ctx ?? "");
  const [draftTag, setDraftTag] = useState("");

  const togglePersona = (p: PersonaTag) =>
    setPersonas((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  const addCustomTag = () => {
    const t = draftTag.trim();
    if (!t || t.length > 40) return;
    setCustomTags((prev) => (prev.includes(t) ? prev : [...prev, t]));
    setDraftTag("");
  };
  const removeCustomTag = (t: string) =>
    setCustomTags((prev) => prev.filter((x) => x !== t));

  const role = useMemo(() => {
    const tags = [...personas, ...customTags].join(", ");
    const extra = freeText.trim();
    if (tags && extra) return `${tags} — ${extra}`;
    return tags || extra;
  }, [personas, customTags, freeText]);

  const hasAnyProfile = role.length > 0;

  // Keep URL in sync (replace, no history spam)
  useEffect(() => {
    navigate({
      to: "/try/impact/$cardId",
      params: { cardId },
      search: {
        personas: personas.join(",") || undefined,
        tags: customTags.join(",") || undefined,
        ctx: freeText.trim() || undefined,
      },
      replace: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personas, customTags, freeText]);

  const impactFn = useServerFn(getPersonalImpact);
  const impact = useMutation({
    mutationFn: async (r: string) =>
      impactFn({
        data: {
          headline: card?.headline ?? "",
          summary: card?.meaning ?? "",
          role: r,
        },
      }),
  });

  // Auto-fetch on load if we have a profile.
  useEffect(() => {
    if (card && hasAnyProfile && !impact.data && !impact.isPending) {
      impact.mutate(role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id]);

  // Refetch when role changes meaningfully (after an existing result).
  useEffect(() => {
    if (card && hasAnyProfile && impact.data) {
      impact.mutate(role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  if (!card) {
    return (
      <main
        className="min-h-screen font-sans-plex"
        style={{ background: PAGE_BG, color: INK }}
      >
        <div className="mx-auto w-full max-w-[760px] px-6 py-16">
          <p className="text-[13px]">
            <Link to="/try" className="underline" style={{ color: INK }}>
              ← Back to this week
            </Link>
          </p>
          <h1 className="font-serif-source mt-8 text-[32px] font-semibold">
            Card not found
          </h1>
          <p className="mt-4 text-[15px]" style={{ color: INK_SOFT }}>
            That item may have rolled off this week's feed.
          </p>
        </div>
      </main>
    );
  }

  const accent = TOPIC_ACCENT[card.topic];
  const result = impact.data?.data;
  const impactError = impact.data?.error;

  return (
    <main
      className="min-h-screen font-sans-plex"
      style={{ background: PAGE_BG, color: INK }}
    >
      <div className="mx-auto w-full max-w-[760px] px-6 py-12">
        <p className="text-[13px]">
          <Link
            to="/try"
            className="underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: INK, outlineColor: INK }}
          >
            ← Back to this week
          </Link>
        </p>

        {/* Card context */}
        <div className="mt-8">
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="text-[12px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: accent }}
            >
              {card.topicLabel}
            </span>
            <span
              aria-live="polite"
              className="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors"
              style={{
                background: SEVERITY_STYLE[card.severity].bg,
                color: SEVERITY_STYLE[card.severity].fg,
                borderColor: SEVERITY_STYLE[card.severity].border,
              }}
            >
              {hasAnyProfile
                ? SEVERITY_STYLE[card.severity].label
                : GENERIC_SEVERITY_LABEL[card.severity]}
            </span>
          </div>
          <h1
            className="font-serif-source mt-2 text-[34px] md:text-[40px] font-semibold leading-[1.15] tracking-tight"
            style={{ color: INK }}
          >
            How does this affect me?
          </h1>
          <h2
            className="font-serif-source mt-4 text-[20px] leading-[1.3] font-medium"
            style={{ color: INK_SOFT }}
          >
            {card.headline}
          </h2>
          <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: INK }}>
            {card.meaning}
          </p>
        </div>

        <hr className="my-8 border-0 border-t" style={{ borderColor: HAIRLINE }} />

        {/* Personalisation */}
        <section>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: INK_SOFT }}
          >
            About you
          </p>
          <p className="mt-2 text-[13px]" style={{ color: INK_SOFT }}>
            Adjust anything below and the answer updates.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {PERSONA_TAGS.map((p) => {
              const pressed = personas.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => togglePersona(p)}
                  className="rounded-full border px-3 py-1.5 text-[13px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
                  className="rounded-full text-[14px] leading-none"
                  style={{ color: PAGE_BG }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

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
              placeholder="Add your own — e.g. 'single mum', 'NHS nurse'"
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

          <label
            htmlFor="aboutYou"
            className="mt-4 block text-[12px] italic"
            style={{ color: INK_SOFT }}
          >
            Anything else you want the AI to know?
          </label>
          <input
            id="aboutYou"
            type="text"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            maxLength={160}
            placeholder="e.g. 'renting in Manchester with a 2-year-old'"
            className="mt-2 block h-[40px] w-full rounded-[2px] border px-3 text-[14px] placeholder:text-[#999] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: "white", color: INK, borderColor: HAIRLINE, outlineColor: INK }}
          />

          {!hasAnyProfile && (
            <p className="mt-4 text-[13px]" style={{ color: INK_SOFT }}>
              Pick at least one tag or add a note to get a tailored answer.
            </p>
          )}
          {hasAnyProfile && !impact.data && !impact.isPending && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => impact.mutate(role)}
                className="rounded-[2px] border px-4 py-2.5 text-[14px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ background: INK, color: PAGE_BG, borderColor: INK, outlineColor: INK }}
              >
                Get my answer →
              </button>
            </div>
          )}
        </section>

        <hr className="my-8 border-0 border-t" style={{ borderColor: HAIRLINE }} />

        {/* Answer */}
        <section aria-live="polite">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: INK }}
          >
            What this means for you
          </p>

          {impact.isPending && (
            <p className="mt-4 text-[15px] italic" style={{ color: INK_SOFT }}>
              Thinking…
            </p>
          )}
          {impactError && (
            <p className="mt-4 text-[15px] italic" style={{ color: INK_SOFT }}>
              {impactError}{" "}
              <button
                type="button"
                onClick={() => impact.mutate(role)}
                className="underline"
              >
                Try again
              </button>
            </p>
          )}
          {!impact.isPending && !impactError && !result && !hasAnyProfile && (
            <p className="mt-4 text-[15px] italic" style={{ color: INK_SOFT }}>
              Your tailored answer will appear here.
            </p>
          )}
          {result && (
            <>
              <div className="mt-4 flex flex-col gap-4">
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
              <p className="mt-4 text-[12px] italic" style={{ color: "#6B6B6B" }}>
                AI-assisted for illustration. Verify anything important against the source.
              </p>
            </>
          )}
        </section>

        <hr className="my-8 border-0 border-t" style={{ borderColor: HAIRLINE }} />

        <p className="text-[13px]" style={{ color: INK_SOFT }}>
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
      </div>
    </main>
  );
}
