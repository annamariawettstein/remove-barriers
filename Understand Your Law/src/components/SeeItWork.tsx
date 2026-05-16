import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";

type SituationId = "private-renter" | "homeowner" | "landlord";

const ITEM = {
  id: "renters-rights-act-2025",
  title: "RENTERS' RIGHTS ACT 2025",
  commencement_date: "2026-05-17",
  stake: "Affects 4.6M private renters in England.",
  situations: {
    "private-renter": {
      label: "Private renter",
      lamp_paragraphs: [
        "Section 21 no-fault evictions are abolished. Your landlord now needs a legal reason — a Section 8 ground — to end your tenancy.",
        "Rent can rise once every 12 months, no more. Above-market rises can be challenged free at the First-tier Tribunal.",
        "Your tenancy becomes rolling. You can leave with two months' notice. Fixed-term ASTs no longer exist.",
      ],
      lamp_citation: {
        label: "Renters' Rights Act 2025, sections 1, 4, 7",
        url: "https://bills.parliament.uk/bills/3764",
      },
    },
    homeowner: {
      label: "Homeowner",
      lamp_paragraphs: [
        "You're not directly affected. The Act covers rented housing — your home is unchanged.",
        "If you're considering buy-to-let, switch to 'Landlord' to see what changes for that situation. Local rental supply may shift as landlords adjust to the new rules.",
      ],
      lamp_citation: {
        label: "Renters' Rights Act 2025, scope provisions",
        url: "https://bills.parliament.uk/bills/3764",
      },
    },
    landlord: {
      label: "Landlord",
      lamp_paragraphs: [
        "You can no longer use Section 21 to regain possession. You need a Section 8 ground. The Act adds new grounds for selling, moving in family, and persistent rent arrears.",
        "Rent rises are capped to one per 12 months and must be challengeable. The Act creates a Property Portal — all private landlords must register on it.",
        "Pet requests must be answered in writing within 28 days and your refusal must be defensible. You can require pet insurance.",
      ],
      lamp_citation: {
        label: "Renters' Rights Act 2025, sections 2, 4, 15, 18",
        url: "https://bills.parliament.uk/bills/3764",
      },
    },
  },
  daylight_paragraphs: [
    "Tenant unions led the campaign — Generation Rent, ACORN, and the Renters' Reform Coalition — with cross-party political support after a decade of mounting pressure following high-profile no-fault eviction cases.",
    "The National Residential Landlords Association lodged formal objections to clauses 1 and 4. Property-sector lobbying activity totalled 47 meetings logged in the Government Lobbying Register between Q1 and Q3 2025.",
    "Resistance in the Lords focused on landlord-protection amendments around possession grounds; most were withdrawn before Royal Assent. Cross-party Conservative and Labour Lords ultimately backed the final text.",
  ],
  daylight_citation: {
    label: "Hansard, Electoral Commission, Lobbying Register",
    url: "https://hansard.parliament.uk/",
  },
} as const;

const SITUATION_ORDER: SituationId[] = ["private-renter", "homeowner", "landlord"];

// Hardcoded "today" per spec.
const TODAY_ISO = "2026-05-16T12:00:00Z";

function computeCountdown(now: Date, commencementISO: string) {
  const target = new Date(commencementISO + "T00:00:00Z").getTime();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return { text: `IN ${diffDays} DAYS`, past: false };
  if (diffDays === 1) return { text: "IN 1 DAY", past: false };
  if (diffDays === 0) return { text: "TODAY", past: false };
  return { text: `${Math.abs(diffDays)} DAYS AGO`, past: true };
}

export function SeeItWork() {
  const [situationId, setSituationId] = useState<SituationId>("private-renter");
  const [visible, setVisible] = useState(true);
  const [now, setNow] = useState(() => new Date(TODAY_ISO));

  useEffect(() => {
    const t = setInterval(() => setNow(new Date(TODAY_ISO)), 60_000);
    return () => clearInterval(t);
  }, []);

  const countdown = useMemo(
    () => computeCountdown(now, ITEM.commencement_date),
    [now],
  );

  const handleSelect = (next: SituationId) => {
    if (next === situationId) return;
    setVisible(false);
    window.setTimeout(() => {
      setSituationId(next);
      setVisible(true);
    }, 200);
  };

  const current = ITEM.situations[situationId];

  const labelCls =
    "block text-[12px] font-semibold tracking-[0.08em] uppercase";
  const sectionLabelCls = labelCls + " text-black font-bold";
  const bodyCls =
    "text-[17px] md:text-[18px] font-normal leading-[1.65]";
  const ruleCls = "border-0 border-t";
  const linkFocus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

  return (
    <section
      className="mx-auto w-full max-w-[640px] px-6 py-20 bg-white font-sans-plex"
      style={{ color: "#000" }}
    >
      {/* SECTION HEAD */}
      <h2 className="text-[32px] font-bold leading-tight" style={{ color: "#000" }}>
        See it work
      </h2>
      <p
        className="mt-2 text-[18px] font-normal"
        style={{ color: "#555" }}
      >
        Real bill, real people, real money.
      </p>
      <hr className={ruleCls} style={{ borderColor: "#DDD", marginTop: 40 }} />

      {/* BILL TITLE ROW */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-black">
          {ITEM.title}
        </span>
        <span
          aria-live="polite"
          className={
            "text-[13px] font-bold uppercase tracking-[0.08em] text-right" +
            (countdown.past ? " italic" : "")
          }
          style={{ color: countdown.past ? "#777" : "#000" }}
        >
          {countdown.text}
        </span>
      </div>

      {/* STAKE */}
      <p className="mt-4 text-[18px] font-medium text-black">{ITEM.stake}</p>

      {/* SITUATION SELECTOR */}
      <div className="mt-10">
        <span className={labelCls} style={{ color: "#777" }}>
          Who are you?
        </span>
        <div className="mt-3 flex flex-wrap gap-3">
          {SITUATION_ORDER.map((id) => {
            const pressed = id === situationId;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={pressed}
                onClick={() => handleSelect(id)}
                className={
                  "min-h-[44px] rounded-none border border-black px-5 text-[14px] font-medium transition-colors " +
                  (pressed
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black hover:text-white") +
                  " " +
                  linkFocus
                }
              >
                {ITEM.situations[id].label}
              </button>
            );
          })}
        </div>
      </div>

      <hr className={ruleCls} style={{ borderColor: "#DDD", marginTop: 40 }} />

      {/* PERSONAL-IMPACT */}
      <section
        aria-live="polite"
        aria-atomic="false"
        className="mt-10"
      >
        <span className={sectionLabelCls}>What it means for you</span>
        <div
          className="mt-4 transition-opacity duration-200 ease-out"
          style={{ opacity: visible ? 1 : 0 }}
          key={situationId}
        >
          <div className="flex flex-col gap-4">
            {current.lamp_paragraphs.map((p, i) => (
              <p key={i} className={bodyCls} style={{ color: "#1A1A1A" }}>
                {p}
              </p>
            ))}
          </div>
          <p className="mt-6 text-[12px]">
            <span className="italic font-medium" style={{ color: "#777" }}>
              Source:{" "}
            </span>
            <a
              href={current.lamp_citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                "font-mono-plex text-[12px] text-black underline " + linkFocus
              }
            >
              {current.lamp_citation.label}
            </a>
          </p>
        </div>
      </section>

      <hr className={ruleCls} style={{ borderColor: "#DDD", marginTop: 40 }} />

      {/* POWER-TRACE */}
      <section className="mt-10">
        <span className={sectionLabelCls}>Who pushed it through</span>
        <div className="mt-4 flex flex-col gap-4">
          {ITEM.daylight_paragraphs.map((p, i) => (
            <p key={i} className={bodyCls} style={{ color: "#1A1A1A" }}>
              {p}
            </p>
          ))}
        </div>
        <p className="mt-6 text-[12px]">
          <span className="italic font-medium" style={{ color: "#777" }}>
            Source:{" "}
          </span>
          <a
            href={ITEM.daylight_citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              "font-mono-plex text-[12px] text-black underline " + linkFocus
            }
          >
            {ITEM.daylight_citation.label}
          </a>
        </p>
      </section>

      <hr className={ruleCls} style={{ borderColor: "#DDD", marginTop: 40 }} />

      {/* CTA */}
      <div className="mt-10">
        <Link
          to="/try"
          className={
            "text-[18px] font-medium text-black no-underline hover:underline " +
            linkFocus
          }
        >
          Try it with your own bill, post, or letter →
        </Link>
      </div>
    </section>
  );
}
