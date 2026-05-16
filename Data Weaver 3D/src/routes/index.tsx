import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Exposé — Reveal the intent behind public figures and companies" },
      {
        name: "description",
        content:
          "Exposé: an investigative platform that surfaces the real intent behind what public figures and companies say, do, and quietly fund.",
      },
    ],
  }),
});

const SUGGESTIONS = [
  "Keir Starmer",
  "Nigel Farage",
  "Rishi Sunak",
  "Kemi Badenoch",
  "Boris Johnson",
];

const INTRO_WORDS = ["intent", "agenda", "motives", "contradictions"];

function Intro({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % INTRO_WORDS.length);
    }, 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#f3f1e7] text-[#0f2a1f] cursor-pointer"
      onClick={onDone}
    >
      <div className="flex items-start justify-between p-6 text-[10px] uppercase tracking-[0.35em] text-[#0f2a1f]/60 md:p-10">
        <div>
          <div>Exposé —</div>
          <div className="text-[#0f2a1f]/40">Public accountability layer</div>
        </div>
        <div className="hidden md:block">
          <div>— Reveals</div>
          <div className="text-[#0f2a1f]/40">the intent</div>
        </div>
        <div className="hidden md:block">
          <div>— Behind people</div>
          <div className="text-[#0f2a1f]/40">and companies</div>
        </div>
        <div className="text-right">
          <div>Lattice</div>
          <div className="text-[#0f2a1f]/40">2026</div>
        </div>
      </div>

      <div className="flex flex-1 items-center px-6 md:px-24">
        <h1 className="max-w-6xl text-[10vw] font-bold leading-[0.95] tracking-tight md:text-[7vw]">
          Exposé reveals the{" "}
          <span
            key={index}
            className="inline-block font-serif italic font-normal text-[#0f4d33] animate-[introWord_500ms_ease-out]"
          >
            {INTRO_WORDS[index]}
          </span>{" "}
          behind public figures and the companies they shape<span className="text-[#0f4d33]">.</span>
        </h1>
      </div>

      <div className="flex items-end justify-between p-6 text-[10px] uppercase tracking-[0.35em] text-[#0f2a1f]/50 md:p-10">
        <span>Tap anywhere to continue</span>
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0f4d33] animate-pulse" />
          Enter
        </span>
      </div>

      <style>{`
        @keyframes introWord {
          0% { opacity: 0; transform: translateY(0.3em); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
    </div>
  );
}

function Landing() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) return;
    setSubmitting(true);
    navigate({
      to: "/research/$name",
      params: { name: trimmed },
    });
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-[#f3f1e7] text-[#0f2a1f]">
      {showIntro && <Intro onDone={() => setShowIntro(false)} />}

      {/* faint blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#0f2a1f 1px, transparent 1px), linear-gradient(90deg, #0f2a1f 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <header className="relative z-10 flex items-center justify-between p-6 md:p-10">
        <div className="text-sm font-bold tracking-tight">lattice</div>
        <nav className="flex items-center gap-5 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/60">
          <Link to="/policies" className="transition-colors hover:text-[#0f4d33]">
            Our policies
          </Link>
          <Link to="/help" className="transition-colors hover:text-[#0f4d33]">
            Help
          </Link>
          <span className="hidden text-[#0f2a1f]/40 md:inline">Issue 01 · 2026</span>
        </nav>
      </header>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col px-6 pt-12 md:pt-20">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#0f2a1f]/55">
          Exposé / Influence Graph
          <br />
          <span className="text-[#0f2a1f]/40">Public accountability layer</span>
        </div>

        <h1 className="mt-10 max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
          Look past the headlines and see who{" "}
          <span className="font-serif italic font-normal text-[#0f4d33]">
            really
          </span>{" "}
          shapes what they say<span className="text-[#0f4d33]">.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#0f2a1f]/70 md:text-lg">
          Type a public figure or a company. Exposé pulls together the funders,
          contradictions, and quiet incentives behind their public face — sourced
          from filings, reporting, and public records.
        </p>

        <form
          className="mt-12 w-full max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            submit(name);
          }}
        >
          <div className="group flex items-center gap-2 border-b-2 border-[#0f2a1f]/30 bg-transparent p-1 transition-colors focus-within:border-[#0f4d33]">
            <span className="pl-1 text-[#0f4d33]">→</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="A name. A company. A reputation."
              className="flex-1 bg-transparent px-2 py-3 text-base text-[#0f2a1f] placeholder:text-[#0f2a1f]/35 focus:outline-none md:text-lg"
              maxLength={120}
            />
            <button
              type="submit"
              disabled={submitting || name.trim().length < 2}
              className="rounded-sm bg-[#0f4d33] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3f1e7] transition-all hover:bg-[#0a3a26] disabled:cursor-not-allowed disabled:bg-[#0f2a1f]/20"
            >
              {submitting ? "Opening…" : "Investigate →"}
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#0f2a1f]/45">
            Try
          </span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              className="rounded-full border border-[#0f2a1f]/20 bg-transparent px-3 py-1.5 text-xs text-[#0f2a1f]/75 transition-colors hover:border-[#0f4d33] hover:bg-[#0f4d33] hover:text-[#f3f1e7]"
            >
              {s}
            </button>
          ))}
        </div>
      </main>

      <footer className="relative z-10 mt-24 p-6 text-center text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/45 md:p-10">
        Built on public reporting · Always verify sources
      </footer>
    </div>
  );
}
