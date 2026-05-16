import { createFileRoute, Link, useRouter, ClientOnly } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SpiderGraph, type ResearchData } from "@/components/SpiderGraph";

function decodeRouteName(value: string) {
  let next = value;
  for (let i = 0; i < 2; i++) {
    try {
      const decoded = decodeURIComponent(next);
      if (decoded === next) break;
      next = decoded;
    } catch {
      break;
    }
  }
  return next;
}

export const Route = createFileRoute("/research/$name")({
  component: ResearchPage,
  head: ({ params }) => {
    const name = decodeRouteName(params.name);
    return {
      meta: [
        { title: `Exposé — ${name}` },
        {
          name: "description",
          content: `Hidden behaviour map for ${name}.`,
        },
      ],
    };
  },
});

function ResearchPage() {
  const { name } = Route.useParams();
  const decoded = decodeRouteName(name);
  const router = useRouter();

  const [data, setData] = useState<ResearchData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reverifying, setReverifying] = useState(false);
  const [lastVerified, setLastVerified] = useState<Date | null>(null);

  const reverify = async () => {
    if (!data || reverifying) return;
    setReverifying(true);
    try {
      const urls = data.articles.map((a) => a.url);
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      if (!res.ok) throw new Error(`Verify failed (${res.status})`);
      const j = (await res.json()) as { verified: boolean[] };
      setData({
        ...data,
        articles: data.articles.map((a, i) => ({
          ...a,
          verified: !!j.verified[i],
        })),
      });
      setLastVerified(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setReverifying(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);

    fetch("/api/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: decoded }),
    })
      .then(async (r) => {
        if (!r.ok) {
          const j = (await r.json().catch(() => null)) as { error?: string } | null;
          throw new Error(j?.error || `Request failed (${r.status})`);
        }
        return r.json() as Promise<ResearchData>;
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, [decoded]);

  return (
    <div className="relative min-h-screen w-full bg-[#f3f1e7] text-[#0f2a1f]">
      <section className="relative h-screen w-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#0f2a1f 1px, transparent 1px), linear-gradient(90deg, #0f2a1f 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0">
          {data && (
            <ClientOnly fallback={<div className="h-full w-full" />}>
              <SpiderGraph data={data} />
            </ClientOnly>
          )}
        </div>

        <header className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-start justify-between p-4 md:p-10">
          <div className="pointer-events-auto max-w-[70vw]">
            <Link
              to="/"
              className="text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55 transition-colors hover:text-[#0f4d33] md:tracking-[0.4em]"
            >
              ← Exposé
            </Link>
            <h1 className="mt-1.5 text-lg font-bold leading-tight tracking-tight md:mt-2 md:text-4xl">
              {data?.person.name ?? decoded}
              <span className="text-[#0f4d33]">.</span>
            </h1>
            <p className="mt-1 hidden max-w-md text-xs text-[#0f2a1f]/65 sm:block md:mt-2 md:text-sm">
              {data
                ? `${data.person.role} · ${data.person.country} · ${data.person.leaning}`
                : "Mapping reported contradictions…"}
            </p>
          </div>
          <div className="pointer-events-auto flex flex-col items-end gap-1 text-[9px] uppercase tracking-[0.25em] text-[#0f2a1f]/50 md:text-[10px] md:tracking-[0.3em]">
            <div>● {data ? data.articles.length : 0} signals</div>
            <div className="hidden md:block">● live</div>
          </div>
        </header>

        {!data && !error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 animate-ping rounded-full border border-[#0f4d33]/40" />
                <div className="absolute inset-2 animate-pulse rounded-full border border-[#0f4d33]/70" />
                <div className="absolute inset-5 rounded-full bg-[#0f4d33]" />
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/65">
                Researching {decoded}…
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
            <div className="max-w-md rounded-lg border border-[#7a2e1c]/30 bg-[#f3f1e7] p-5 text-center shadow-sm">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#7a2e1c]">
                Research failed
              </div>
              <p className="mt-2 text-sm text-[#0f2a1f]">{error}</p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => router.invalidate()}
                  className="rounded bg-[#0f4d33] px-3 py-1.5 text-xs uppercase tracking-widest text-[#f3f1e7] hover:bg-[#0a3a26]"
                >
                  Retry
                </button>
                <Link
                  to="/"
                  className="rounded border border-[#0f2a1f]/25 px-3 py-1.5 text-xs uppercase tracking-widest text-[#0f2a1f]/75 hover:border-[#0f4d33] hover:text-[#0f4d33]"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>
        )}

        <footer className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between gap-3 p-4 text-[9px] uppercase tracking-[0.22em] text-[#0f2a1f]/50 md:p-10 md:text-[10px] md:tracking-[0.3em]">
          <div className="hidden sm:block">Drag · Scroll · Hover</div>
          <div className="sm:hidden">Pinch · Drag</div>
          <div className="pointer-events-auto text-right">
            {data ? (
              <a
                href="#simplified-view"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("simplified-view")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 rounded border border-[#0f2a1f]/25 bg-[#f3f1e7]/80 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.22em] text-[#0f2a1f]/80 backdrop-blur transition-colors hover:border-[#0f4d33] hover:bg-[#0f4d33] hover:text-[#f3f1e7] md:text-[10px] md:tracking-[0.3em]"
              >
                Simplified view <span aria-hidden>↓</span>
              </a>
            ) : (
              "Exposé"
            )}
          </div>
        </footer>
      </section>

      {data && (
        <SimplifiedView
          data={data}
          onReverify={reverify}
          reverifying={reverifying}
          lastVerified={lastVerified}
        />
      )}
    </div>
  );
}

function SimplifiedView({
  data,
  onReverify,
  reverifying,
  lastVerified,
}: {
  data: ResearchData;
  onReverify: () => void;
  reverifying: boolean;
  lastVerified: Date | null;
}) {
  const stances = data.person.stances ?? [];
  const verifiedCount = data.articles.filter((a) => a.verified).length;


  return (
    <section id="simplified-view" className="scroll-mt-4 border-t border-[#0f2a1f]/15 bg-[#f3f1e7] px-4 py-12 sm:px-6 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0f2a1f]/15 pb-4 text-[9px] uppercase tracking-[0.3em] text-[#0f2a1f]/55 md:text-[10px] md:tracking-[0.35em]">
          <div>Simplified view</div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-[#0f2a1f]/40">
              {verifiedCount.toString().padStart(2, "0")}/
              {data.articles.length.toString().padStart(2, "0")} verified
              {lastVerified && (
                <span className="ml-2 normal-case tracking-normal text-[#0f2a1f]/35">
                  ({lastVerified.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onReverify}
              disabled={reverifying}
              className="inline-flex items-center gap-1.5 rounded-sm bg-[#0f4d33] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#f3f1e7] transition-colors hover:bg-[#0a3a26] disabled:cursor-not-allowed disabled:bg-[#0f2a1f]/25 md:text-[10px]"
            >
              <span
                className={
                  "inline-block h-1.5 w-1.5 rounded-full bg-[#f3f1e7] " +
                  (reverifying ? "animate-pulse" : "")
                }
              />
              {reverifying ? "Re-verifying…" : "Re-verify citations"}
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-10 md:mt-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <h2 className="text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl md:text-6xl">
              The record,
              <br />
              <span className="font-serif font-normal italic text-[#0f4d33]">
                in their own
              </span>
              <br />
              words.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#0f2a1f]/70 md:mt-6">
              A flat, readable summary of {data.person.name}'s stated positions
              and the reported actions that sit alongside them. No graph. Just
              the page.
            </p>
          </div>

          <div className="space-y-10">
            <div>
              <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
                Subject
              </div>
              <p className="text-base leading-relaxed text-[#0f2a1f]/85 md:text-lg">
                {data.person.bio}
              </p>
            </div>

            {stances.length > 0 && (
              <div>
                <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
                  What they say they stand for
                </div>
                <ul className="divide-y divide-[#0f2a1f]/10 border-y border-[#0f2a1f]/10">
                  {stances.map((s, i) => (
                    <li key={i} className="flex gap-4 py-3 text-sm text-[#0f2a1f]/85">
                      <span className="font-mono text-[10px] font-bold text-[#0f4d33]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Public registers — deterministic, non-biased data sources */}
        <PublicRegisters name={data.person.name} />

      </div>
    </section>
  );
}

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

type Register = {
  name: string;
  body: string;
  what: string;
  group: string;
  build: (name: string) => string;
};

const g = (n: string) => encodeURIComponent(n);
const gsite = (n: string, q: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(`${n} ${q}`)}`;

const REGISTERS: Register[] = [
  {
    group: "Parliament & voting",
    name: "TheyWorkForYou",
    body: "mySociety · theyworkforyou.com",
    what: "Voting record, speeches, attendance and rebellions for current & former MPs and Lords.",
    build: (n) => `https://www.theyworkforyou.com/search/?s=${g(n)}`,
  },
  {
    group: "Political finance",
    name: "Electoral Commission",
    body: "search.electoralcommission.org.uk",
    what: "Donations, loans and campaign spending for parties, MPs and regulated donees.",
    build: (n) =>
      `https://search.electoralcommission.org.uk/?currentPage=1&rows=10&query=${g(n)}&sort=AcceptedDate&order=desc&tab=1&et=pp&et=ppm&et=tp&et=perpar&et=rd`,
  },
  {
    group: "Political finance",
    name: "MPs' Register of Interests",
    body: "publications.parliament.uk",
    what: "Outside earnings, second jobs, directorships, gifts, hospitality and shareholdings.",
    build: (n) => gsite(n, `site:publications.parliament.uk "Register of Members' Financial Interests"`),
  },
  {
    group: "Political finance",
    name: "Lords Register of Interests",
    body: "publications.parliament.uk · Lords",
    what: "Same disclosures for members of the House of Lords.",
    build: (n) => gsite(n, `site:publications.parliament.uk "Register of Lords' Interests"`),
  },
  {
    group: "Political finance",
    name: "IPSA",
    body: "theipsa.org.uk",
    what: "MP expenses, staffing and office costs for this specific person, published by the independent regulator.",
    build: (n) => `https://www.theipsa.org.uk/mp-staffing-business-costs?search=${g(n)}`,
  },
  {
    group: "Political finance",
    name: "Ministers' Interests",
    body: "Cabinet Office · gov.uk",
    what: "List of ministers' relevant outside interests, published by the Cabinet Office.",
    build: (n) => gsite(n, `site:gov.uk "List of Ministers' Interests"`),
  },
  {
    group: "Corporate & ownership",
    name: "Companies House",
    body: "find-and-update.company-information.service.gov.uk",
    what: "Directors, shareholders, PSCs and filing history for any UK company or officer.",
    build: (n) =>
      `https://find-and-update.company-information.service.gov.uk/search?q=${g(n)}`,
  },
  {
    group: "Corporate & ownership",
    name: "OpenCorporates",
    body: "opencorporates.com",
    what: "Aggregated cross-border company data — useful for offshore and group structures.",
    build: (n) => `https://opencorporates.com/officers?q=${g(n)}&utf8=%E2%9C%93`,
  },
  {
    group: "Lobbying & influence",
    name: "Ministerial Meetings",
    body: "Gov.uk · transparency data",
    what: "Quarterly returns of ministers' meetings with external organisations and lobbyists.",
    build: (n) => gsite(n, `site:gov.uk "meetings with external organisations" transparency`),
  },
  {
    group: "Contracts & spending",
    name: "Find a Tender",
    body: "find-tender.service.gov.uk",
    what: "Higher-value UK public procurement notices (post-Brexit replacement for OJEU).",
    build: (n) => `https://www.find-tender.service.gov.uk/Search/Results?Keywords=${g(n)}`,
  },
  {
    group: "Media & think tanks",
    name: "Who Funds You?",
    body: "whofundsyou.org",
    what: "Independent transparency ratings for UK think tanks and policy bodies.",
    build: () => `https://whofundsyou.org/`,
  },
  {
    group: "Media & think tanks",
    name: "Press Gazette",
    body: "pressgazette.co.uk",
    what: "Industry journalism tracking UK and global media ownership.",
    build: (n) => `https://pressgazette.co.uk/?s=${g(n)}`,
  },
  {
    group: "Leaks & sanctions",
    name: "OpenSanctions",
    body: "opensanctions.org",
    what: "Searchable database of PEPs, sanctioned entities and politically exposed persons.",
    build: (n) => `https://www.opensanctions.org/search/?q=${g(n)}`,
  },
  {
    group: "Leaks & sanctions",
    name: "ICIJ Offshore Leaks",
    body: "offshoreleaks.icij.org",
    what: "Panama, Paradise and Pandora Papers — offshore entities and their officers.",
    build: (n) => `https://offshoreleaks.icij.org/search?q=${g(n)}`,
  },
  {
    group: "Biographical",
    name: "Wikidata",
    body: "wikidata.org",
    what: "Structured biographical data: education, family ties, positions held, awards.",
    build: (n) => `https://www.wikidata.org/w/index.php?search=${g(n)}`,
  },
  {
    group: "Biographical",
    name: "EveryPolitician",
    body: "everypolitician.org",
    what: "Cross-referenced profiles of legislators worldwide (mySociety archive).",
    build: (n) => `https://www.google.com/search?q=${encodeURIComponent(`${n} site:everypolitician.org`)}`,
  },
];

function PublicRegisters({ name }: { name: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(280, Math.round(el.clientWidth * 0.8));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="mt-16 border-t border-[#0f2a1f]/15 pt-10 md:mt-24 md:pt-16">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">
          Cross-check{" "}
          <span className="font-serif font-normal italic text-[#0f4d33]">
            yourself
          </span>
          .
        </h3>
        <div className="text-[9px] uppercase tracking-[0.3em] text-[#0f2a1f]/55 md:text-[10px]">
          {REGISTERS.length} non-partisan registers
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-sm text-[#0f2a1f]/65 md:text-base">
        Each link opens the official register pre-filtered for{" "}
        <span className="font-semibold text-[#0f2a1f]/85">{name}</span> so you
        can verify what's reported above against the primary source.
      </p>

      <div className="mt-8 flex items-center justify-between gap-3">
        <div className="font-serif text-xs italic text-[#0f2a1f]/55">
          Swipe or use the arrows →
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Scroll registers left"
            onClick={() => scrollBy(-1)}
            className="flex h-10 w-10 items-center justify-center border border-[#0f2a1f]/25 bg-[#f3f1e7]/80 text-[#0f2a1f] transition-colors hover:border-[#0f4d33] hover:bg-[#0f4d33] hover:text-[#f3f1e7]"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Scroll registers right"
            onClick={() => scrollBy(1)}
            className="flex h-10 w-10 items-center justify-center border border-[#0f2a1f]/25 bg-[#f3f1e7]/80 text-[#0f2a1f] transition-colors hover:border-[#0f4d33] hover:bg-[#0f4d33] hover:text-[#f3f1e7]"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]"
      >
        {REGISTERS.map((r) => (
          <a
            key={r.name}
            href={r.build(name)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col border border-[#0f2a1f]/15 bg-[#0f4d33]/[0.03] p-5 transition-colors hover:border-[#0f4d33] hover:bg-[#0f4d33]/[0.07] sm:w-[300px]"
          >
            <div className="text-[9px] uppercase tracking-[0.22em] text-[#0f2a1f]/55">
              {r.group}
            </div>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h5 className="text-base font-bold tracking-tight text-[#0f2a1f] md:text-lg">
                {r.name}
              </h5>
              <span className="text-[#0f4d33] transition-transform group-hover:translate-x-0.5">
                ↗
              </span>
            </div>
            <p className="mt-3 flex-1 text-xs leading-relaxed text-[#0f2a1f]/70 md:text-sm">
              {r.what}
            </p>
            <p className="mt-4 font-serif text-[11px] italic text-[#0f2a1f]/50">
              — {r.body}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-10 border border-dashed border-[#0f2a1f]/20 bg-[#0f4d33]/[0.02] p-4 md:p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#0f2a1f]/55">
          The power is in the join
        </p>
        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#0f2a1f]/75 md:text-sm">
          <li>· Companies House <span className="text-[#0f2a1f]/45">+</span> Register of Interests → MP sits on board of a company that donates to their party.</li>
          <li>· Electoral Commission <span className="text-[#0f2a1f]/45">+</span> Contracts Finder → donor wins a government contract after the party receives a donation.</li>
          <li>· ACOBA <span className="text-[#0f2a1f]/45">+</span> Ministerial Meetings → minister meets a company, then joins its board after leaving office.</li>
          <li>· Lobbying Register <span className="text-[#0f2a1f]/45">+</span> Voting Record → a lobbyist's client benefits directly from an MP's vote.</li>
        </ul>
      </div>

      <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-[#0f2a1f]/45">
        Always verify against the primary source · Exposé does not host this data
      </p>
    </div>
  );
}
