import React, { useEffect, useMemo, useState } from "react";
import { SpiderGraph } from "./SpiderGraph";
import type { ResearchData } from "./types";
import { getCrossCheckCards } from "./crossCheckData";
import {
  EXPOSE_CASE_STUDIES,
  getCaseStudyPreset,
} from "../../data/exposeCaseStudies";

const SUGGESTIONS = [
  "Keir Starmer",
  "Nigel Farage",
  "Kemi Badenoch",
  "Shell",
  "BP",
  "Glencore",
  "Institute of Economic Affairs",
];

const EXPOSE_HISTORY_KEY = "lattice.expose.history.v1";
const EXPOSE_CACHE_KEY = "lattice.expose.cache.v1";
const MAX_HISTORY_ITEMS = 12;

type ExposeHistoryEntry = {
  key: string;
  name: string;
  role: string;
  preview: string;
  savedAt: number;
};

type ExposeCacheRecord = {
  savedAt: number;
  data: ResearchData;
};

function subjectKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function readLocalJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota and privacy-mode failures. The page still works without persistence.
  }
}

function loadExposeHistory() {
  return readLocalJson<ExposeHistoryEntry[]>(EXPOSE_HISTORY_KEY, []);
}

function loadExposeCache() {
  return readLocalJson<Record<string, ExposeCacheRecord>>(EXPOSE_CACHE_KEY, {});
}

function saveExposeResult(queryName: string, data: ResearchData) {
  if (typeof window === "undefined") return;
  const key = subjectKey(queryName);
  const now = Date.now();
  const cache = loadExposeCache();
  cache[key] = { savedAt: now, data };
  writeLocalJson(EXPOSE_CACHE_KEY, cache);

  const history = loadExposeHistory().filter((entry) => entry.key !== key);
  const preview =
    data.person.bio?.trim() ||
    data.articles[0]?.concern?.trim() ||
    data.articles[0]?.summary?.trim() ||
    "Saved Expose thread";
  history.unshift({
    key,
    name: data.person.name || queryName,
    role: data.person.role || "",
    preview,
    savedAt: now,
  });
  writeLocalJson(EXPOSE_HISTORY_KEY, history.slice(0, MAX_HISTORY_ITEMS));
}

function loadCachedExposeResult(name: string) {
  const cache = loadExposeCache();
  return cache[subjectKey(name)]?.data ?? null;
}

function getSummaryPreview(data: ResearchData) {
  return (
    data.narrative?.summary?.trim() ||
    data.person.bio?.trim() ||
    data.articles[0]?.concern?.trim() ||
    data.articles[0]?.summary?.trim() ||
    "Saved Expose thread"
  );
}

function formatSavedAt(savedAt: number) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(savedAt);
  } catch {
    return "";
  }
}

function trimPreview(text: string, max = 140) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function readNameFromUrl() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("name")?.trim() || "";
}

function updateUrl(name: string) {
  if (typeof window === "undefined") return;
  const next = new URL(window.location.href);
  if (name) next.searchParams.set("name", name);
  else next.searchParams.delete("name");
  window.history.pushState({}, "", next);
}

type ExposeResearchAppProps = {
  initialName?: string;
  initialData?: ResearchData | null;
};

export default function ExposeResearchApp({
  initialName = "",
  initialData = null,
}: ExposeResearchAppProps) {
  const [input, setInput] = useState(initialName);
  const [activeName, setActiveName] = useState(initialName);
  const [data, setData] = useState<ResearchData | null>(initialData);
  const [loading, setLoading] = useState(Boolean(initialName && !initialData));
  const [error, setError] = useState("");
  const [history, setHistory] = useState<ExposeHistoryEntry[]>([]);
  const [cacheHit, setCacheHit] = useState(false);
  const [requestNonce, setRequestNonce] = useState(0);

  useEffect(() => {
    const sync = () => {
      const name = readNameFromUrl();
      setActiveName(name);
      setInput(name);
      setHistory(loadExposeHistory());
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    if (!activeName) {
      setData(null);
      setError("");
      setLoading(false);
      setCacheHit(false);
      return;
    }

    let cancelled = false;
    setError("");
    const preset = getCaseStudyPreset(activeName);
    if (preset) {
      setData(preset);
      setLoading(false);
      setCacheHit(false);
      saveExposeResult(activeName, preset);
      setHistory(loadExposeHistory());
      return;
    }

    const cached = loadCachedExposeResult(activeName);
    if (cached) {
      setData(cached);
      setLoading(false);
      setCacheHit(true);
      return;
    }

    setCacheHit(false);
    setLoading(true);
    setData(null);

    fetch("/api/expose-research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: activeName }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const json = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(json?.error || `Request failed (${res.status})`);
        }
        return (await res.json()) as ResearchData;
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          saveExposeResult(activeName, json);
          setHistory(loadExposeHistory());
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeName, requestNonce]);

  const verifiedCount = useMemo(
    () => data?.articles.filter((article) => article.verified).length ?? 0,
    [data],
  );
  const crossCheckCards = useMemo(
    () => getCrossCheckCards(data?.person.name ?? activeName),
    [activeName, data?.person.name],
  );
  const summaryPreview = useMemo(
    () => (data ? getSummaryPreview(data) : ""),
    [data],
  );
  const isCaseStudy = data?.mode === "caseStudy";

  function submit(nextName: string) {
    const trimmed = nextName.trim();
    if (trimmed.length < 2) return;
    updateUrl(trimmed);
    setActiveName(trimmed);
    setInput(trimmed);
  }

  if (!activeName) {
    return (
      <div className="min-h-screen bg-[#f3f1e7] text-[#0f2a1f]">
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#0f2a1f 1px, transparent 1px), linear-gradient(90deg, #0f2a1f 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.35em] text-[#0f2a1f]/55">
            <a href="/expose" className="transition-colors hover:text-[#0f4d33]">
              ← Back to Expose
            </a>
            <span className="text-[#0f2a1f]/35">3D investigator</span>
          </div>

          <div className="max-w-4xl">
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#0f2a1f]/55">
              Expose / 3D investigator
            </div>
            <h1 className="mt-8 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
              Look past the headlines and see who{" "}
              <span className="font-serif italic font-normal text-[#0f4d33]">
                really
              </span>{" "}
              shapes what they say<span className="text-[#0f4d33]">.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#0f2a1f]/70 md:text-lg">
              Type a public figure or company. Expose pulls together funders,
              contradictions, and quiet incentives from public reporting and filings,
              then maps them in a 3D relationship view.
            </p>

            <form
              className="mt-12 w-full max-w-2xl"
              onSubmit={(event) => {
                event.preventDefault();
                submit(input);
              }}
            >
              <div className="flex items-center gap-2 border-b-2 border-[#0f2a1f]/30 p-1 focus-within:border-[#0f4d33]">
                <span className="pl-1 text-[#0f4d33]">→</span>
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="A name. A company. A reputation."
                  className="flex-1 bg-transparent px-2 py-3 text-base text-[#0f2a1f] placeholder:text-[#0f2a1f]/35 focus:outline-none md:text-lg"
                  maxLength={120}
                />
                <button
                  type="submit"
                  disabled={input.trim().length < 2}
                  className="rounded-sm bg-[#0f4d33] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3f1e7] transition-all hover:bg-[#0a3a26] disabled:cursor-not-allowed disabled:bg-[#0f2a1f]/20"
                >
                  Investigate →
                </button>
              </div>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#0f2a1f]/45">
                Try
              </span>
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => submit(suggestion)}
                  className="rounded-full border border-[#0f2a1f]/20 bg-transparent px-3 py-1.5 text-xs text-[#0f2a1f]/75 transition-colors hover:border-[#0f4d33] hover:bg-[#0f4d33] hover:text-[#f3f1e7]"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {history.length ? (
              <div className="mt-16 border-t border-[#0f2a1f]/12 pt-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
                  <span>Previous searches</span>
                  <span>{String(history.length).padStart(2, "0")} saved threads</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {history.slice(0, 6).map((entry) => (
                    <button
                      key={entry.key}
                      type="button"
                      onClick={() => submit(entry.name)}
                      className="rounded-md border border-[#0f2a1f]/12 bg-white/70 p-4 text-left transition hover:border-[#0f4d33]/35 hover:bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold tracking-tight text-[#0f2a1f]">
                            {entry.name}
                          </div>
                          {entry.role ? (
                            <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#0f2a1f]/45">
                              {entry.role}
                            </div>
                          ) : null}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.22em] text-[#0f2a1f]/35">
                          {formatSavedAt(entry.savedAt)}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-[#0f2a1f]/72">
                        {trimPreview(entry.preview)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-16 border-t border-[#0f2a1f]/12 pt-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
                <span>Case studies</span>
                <span>Follow hidden networks from real UK scandals</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {EXPOSE_CASE_STUDIES.map((study) => (
                  <div
                    key={study.slug}
                    className="rounded-md border border-[#0f2a1f]/12 bg-white/70 p-4"
                  >
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#0f4d33]/75">
                      {study.title}
                    </div>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#0f2a1f]">
                      {study.subtitle}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#0f2a1f]/72">
                      {study.hiddenPattern}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => submit(study.primaryQuery)}
                        className="rounded-sm bg-[#0f4d33] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3f1e7] transition hover:bg-[#0a3a26]"
                      >
                        Start with {study.primaryQuery}
                      </button>
                      {study.supportingQueries.slice(0, 1).map((query) => (
                        <button
                          key={query}
                          type="button"
                          onClick={() => submit(query)}
                          className="rounded-sm border border-[#0f2a1f]/15 px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#0f2a1f]/75 transition hover:border-[#0f4d33] hover:text-[#0f4d33]"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f1e7] text-[#0f2a1f]">
      <section className="relative h-screen w-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#0f2a1f 1px, transparent 1px), linear-gradient(90deg, #0f2a1f 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {data ? (
          <div className="absolute inset-0">
            <SpiderGraph data={data} />
          </div>
        ) : null}

        <header className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-start justify-between p-4 md:p-10">
          <div className="pointer-events-auto max-w-[70vw]">
            <a href="/expose" className="text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55 transition-colors hover:text-[#0f4d33] md:tracking-[0.4em]">
              ← Expose
            </a>
            <h1 className="mt-1.5 text-lg font-bold leading-tight tracking-tight md:mt-2 md:text-4xl">
              {data?.person.name ?? activeName}
              <span className="text-[#0f4d33]">.</span>
            </h1>
            <p className="mt-1 hidden max-w-md text-xs text-[#0f2a1f]/65 sm:block md:mt-2 md:text-sm">
              {data
                ? `${data.person.role} · ${data.person.country} · ${data.person.leaning}`
                : "Mapping reported contradictions…"}
            </p>
            {summaryPreview ? (
              <p className="mt-2 hidden max-w-lg text-sm leading-relaxed text-[#0f2a1f]/68 md:block">
                {summaryPreview}
              </p>
            ) : null}
            {cacheHit ? (
              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#0f4d33]/80">
                Loaded from saved cache
              </p>
            ) : null}
          </div>
          <div className="pointer-events-auto flex flex-col items-end gap-1 text-[9px] uppercase tracking-[0.25em] text-[#0f2a1f]/50 md:text-[10px] md:tracking-[0.3em]">
            <div>● {data ? data.articles.length : 0} signals</div>
            <button
              type="button"
              onClick={() => {
                updateUrl("");
                setActiveName("");
                setInput("");
              }}
              className="rounded border border-[#0f2a1f]/20 bg-[#f3f1e7]/80 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-[#0f2a1f]/75 backdrop-blur hover:border-[#0f4d33] hover:text-[#0f4d33]"
            >
              New search
            </button>
          </div>
        </header>

        {loading && !error ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 animate-ping rounded-full border border-[#0f4d33]/40" />
                <div className="absolute inset-2 animate-pulse rounded-full border border-[#0f4d33]/70" />
                <div className="absolute inset-5 rounded-full bg-[#0f4d33]" />
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/65">
                Researching {activeName}…
              </div>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
            <div className="max-w-md rounded-lg border border-[#7a2e1c]/30 bg-[#f3f1e7] p-5 text-center shadow-sm">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#7a2e1c]">
                Research failed
              </div>
              <p className="mt-2 text-sm text-[#0f2a1f]">{error}</p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => setRequestNonce((value) => value + 1)}
                  className="rounded bg-[#0f4d33] px-3 py-1.5 text-xs uppercase tracking-widest text-[#f3f1e7] hover:bg-[#0a3a26]"
                >
                  Retry
                </button>
                <button
                  onClick={() => {
                    updateUrl("");
                    setActiveName("");
                    setInput("");
                  }}
                  className="rounded border border-[#0f2a1f]/25 px-3 py-1.5 text-xs uppercase tracking-widest text-[#0f2a1f]/75 hover:border-[#0f4d33] hover:text-[#0f4d33]"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {data ? (
        <section className="border-t border-[#0f2a1f]/15 px-4 py-12 sm:px-6 md:px-12 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0f2a1f]/15 pb-4 text-[9px] uppercase tracking-[0.3em] text-[#0f2a1f]/55 md:text-[10px] md:tracking-[0.35em]">
              <div>{isCaseStudy ? "Summary" : "In plain English"}</div>
              <div className="text-[#0f2a1f]/40">
                {verifiedCount.toString().padStart(2, "0")}/{data.articles.length.toString().padStart(2, "0")} verified
              </div>
            </div>

            <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-20">
              <div>
                <h2 className="text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl md:text-6xl">
                  {isCaseStudy ? (
                    <>
                      Hidden network,
                      <br />
                      <span className="font-serif font-normal italic text-[#0f4d33]">
                        explained clearly
                      </span>
                      <span className="text-[#0f4d33]">.</span>
                    </>
                  ) : (
                    <>
                      The record,
                      <br />
                      <span className="font-serif font-normal italic text-[#0f4d33]">
                        in plain English
                      </span>
                      <span className="text-[#0f4d33]">.</span>
                    </>
                  )}
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#0f2a1f]/70">
                  {isCaseStudy
                    ? "A guided walkthrough of the people, companies, institutions, and reporting that made this network matter."
                    : "A readable summary of what this person or company says, and the public record that sits around it."}
                </p>
              </div>

              <div className="space-y-10">
                <div>
                  <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
                    {isCaseStudy ? "What happened" : "Subject"}
                  </div>
                  <p className="text-base leading-relaxed text-[#0f2a1f]/85 md:text-lg">
                    {data.narrative?.summary || data.person.bio}
                  </p>
                </div>

                {isCaseStudy && data.narrative?.hiddenPattern ? (
                  <div>
                    <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
                      Hidden network
                    </div>
                    <p className="text-base leading-relaxed text-[#0f2a1f]/85 md:text-lg">
                      {data.narrative.hiddenPattern}
                    </p>
                  </div>
                ) : null}

                {isCaseStudy && data.narrative?.whyItMatters ? (
                  <div>
                    <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
                      Why it mattered
                    </div>
                    <p className="text-base leading-relaxed text-[#0f2a1f]/85 md:text-lg">
                      {data.narrative.whyItMatters}
                    </p>
                  </div>
                ) : null}

                {isCaseStudy && data.narrative?.deepDive?.length ? (
                  <div>
                    <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
                      Deeper view
                    </div>
                    <div className="space-y-4">
                      {data.narrative.deepDive.map((paragraph, index) => (
                        <p
                          key={`${index}-${paragraph.slice(0, 24)}`}
                          className="text-base leading-relaxed text-[#0f2a1f]/85 md:text-lg"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {isCaseStudy && data.narrative?.systemFailures?.length ? (
                  <div>
                    <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
                      How the system failed
                    </div>
                    <ul className="space-y-3">
                      {data.narrative.systemFailures.map((item, index) => (
                        <li key={`${index}-${item.slice(0, 20)}`} className="flex gap-3 text-sm text-[#0f2a1f]/85 md:text-base">
                          <span className="mt-1 text-[#0f4d33]">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {data.person.stances?.length ? (
                  <div>
                    <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
                      {isCaseStudy ? "Key takeaways" : "What they publicly say"}
                    </div>
                    <ul className="divide-y divide-[#0f2a1f]/10 border-y border-[#0f2a1f]/10">
                      {data.person.stances.map((stance, index) => (
                        <li key={index} className="flex gap-4 py-3 text-sm text-[#0f2a1f]/85">
                          <span className="font-mono text-[10px] font-bold text-[#0f4d33]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{stance}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {isCaseStudy && data.narrative?.timeline?.length ? (
                  <div>
                    <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
                      Timeline
                    </div>
                    <ul className="space-y-4 border-l border-[#0f2a1f]/12 pl-4">
                      {data.narrative.timeline.map((item, index) => (
                        <li key={`${item.date}-${index}`} className="relative">
                          <span className="absolute -left-[1.15rem] top-1.5 h-2.5 w-2.5 rounded-full border border-[#0f4d33]/35 bg-[#f3f1e7]" />
                          <div className="text-[10px] uppercase tracking-[0.22em] text-[#0f4d33]/80">
                            {item.date}
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-[#0f2a1f]/85">
                            {item.event}
                          </p>
                          {item.publicLine ? (
                            <p className="mt-1 text-sm leading-relaxed text-[#0f2a1f]/68">
                              Public line: {item.publicLine}
                            </p>
                          ) : null}
                          {item.source ? (
                            <p className="mt-1 text-[11px] font-serif italic text-[#0f2a1f]/55">
                              — {item.source}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {crossCheckCards.length ? (
        <section className="border-t border-[#0f2a1f]/15 px-4 py-12 sm:px-6 md:px-12 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[#0f2a1f]/15 pb-4">
              <div className="max-w-3xl">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
                  Cross-check yourself
                </div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0f2a1f] md:text-5xl">
                  Open the official record
                  <span className="font-serif font-normal italic text-[#0f4d33]"> yourself</span>.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#0f2a1f]/72 md:text-lg">
                  Each link opens a filing, register, or company disclosure for{" "}
                  <strong>{data?.person.name ?? activeName}</strong> so you can
                  verify ownership, board roles, government payments, and public
                  claims against the source itself.
                </p>
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/45">
                {String(crossCheckCards.length).padStart(2, "0")} official sources
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {crossCheckCards.map((card) => (
                <a
                  key={`${card.title}-${card.url}`}
                  href={card.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-md border border-[#0f2a1f]/12 bg-white/70 p-6 transition hover:border-[#0f4d33]/35 hover:bg-white"
                >
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[#0f2a1f]/45">
                    {card.category}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-semibold tracking-tight text-[#0f2a1f]">
                      {card.title}
                    </h3>
                    <span className="text-xl text-[#0f4d33] transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#0f2a1f]/72">
                    {card.description}
                  </p>
                  <div className="mt-5 text-[11px] font-serif italic text-[#0f2a1f]/55">
                    — {card.source}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {history.length && activeName ? (
        <section className="border-t border-[#0f2a1f]/15 px-4 py-12 sm:px-6 md:px-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55">
              <span>Previous searches</span>
              <span>Jump back into saved threads</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {history
                .filter((entry) => entry.key !== subjectKey(activeName))
                .slice(0, 6)
                .map((entry) => (
                  <button
                    key={entry.key}
                    type="button"
                    onClick={() => submit(entry.name)}
                    className="rounded-md border border-[#0f2a1f]/12 bg-white/70 p-4 text-left transition hover:border-[#0f4d33]/35 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold tracking-tight text-[#0f2a1f]">
                          {entry.name}
                        </div>
                        {entry.role ? (
                          <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#0f2a1f]/45">
                            {entry.role}
                          </div>
                        ) : null}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-[#0f2a1f]/35">
                        {formatSavedAt(entry.savedAt)}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#0f2a1f]/72">
                      {trimPreview(entry.preview)}
                    </p>
                  </button>
                ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
