import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/help")({
  component: HelpPage,
  head: () => ({
    meta: [
      { title: "Exposé — Help, regulation & policy" },
      {
        name: "description",
        content:
          "How Exposé works, what we do alongside UK regulation and legislation, and where to go if the site is down.",
      },
    ],
  }),
});

function HelpPage() {
  return (
    <div className="min-h-screen w-full bg-[#f3f1e7] text-[#0f2a1f]">
      {/* faint blueprint grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#0f2a1f 1px, transparent 1px), linear-gradient(90deg, #0f2a1f 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <header className="relative z-10 flex items-start justify-between p-4 md:p-10">
        <Link
          to="/"
          className="text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/55 transition-colors hover:text-[#0f4d33] md:tracking-[0.4em]"
        >
          ← Exposé
        </Link>
        <div className="text-right text-[9px] uppercase tracking-[0.25em] text-[#0f2a1f]/50 md:text-[10px] md:tracking-[0.3em]">
          <div>Help & policy</div>
          <div className="text-[#0f2a1f]/40">Lattice · 2026</div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-6 sm:px-6 md:px-10 md:pt-16">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#0f2a1f]/55">
          Help, regulation & policy
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-7xl">
          What we do,{" "}
          <span className="font-serif font-normal italic text-[#0f4d33]">
            and what we don't
          </span>
          <span className="text-[#0f4d33]">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#0f2a1f]/75 md:text-base">
          Exposé is a public accountability layer. We pull together publicly
          reported behaviour by figures and institutions, and pair it against
          their own stated positions. We don't break stories — we make existing
          ones legible.
        </p>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-[1fr_1.5fr] md:gap-16">
          <Section index="01" title="If the site is down">
            <p>
              If a page won't load or research keeps failing, the platform may
              be rate limited, under maintenance, or temporarily blocked by an
              upstream source.
            </p>
            <ul className="mt-3 space-y-1.5">
              <Bullet>
                Status:{" "}
                <a
                  href="https://status.lovable.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-[#0f4d33]/40 underline-offset-2 hover:decoration-[#0f4d33]"
                >
                  status.lovable.app
                </a>
              </Bullet>
              <Bullet>
                Report an outage:{" "}
                <a
                  href="mailto:help@expose.local"
                  className="underline decoration-[#0f4d33]/40 underline-offset-2 hover:decoration-[#0f4d33]"
                >
                  help@expose.local
                </a>
              </Bullet>
              <Bullet>
                Cached reading lists & primary sources:{" "}
                <a
                  href="https://web.archive.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-[#0f4d33]/40 underline-offset-2 hover:decoration-[#0f4d33]"
                >
                  web.archive.org
                </a>
              </Bullet>
            </ul>
          </Section>

          <Section index="02" title="What we do">
            <p>
              Each subject brief is built from three things: a neutral
              biography, the subject's own stated public positions, and a set
              of reported signals — articles, filings, votes, declarations —
              that appear to contradict those positions.
            </p>
            <p className="mt-3">
              We cross-check every citation link before showing it. If we can't
              verify a link, we mark it as <em className="font-serif">unverified</em>{" "}
              and replace it with a search fallback instead of pretending it
              exists.
            </p>
          </Section>

          <Section index="03" title="What we don't do">
            <ul className="space-y-1.5">
              <Bullet>We don't publish original reporting or leaks.</Bullet>
              <Bullet>
                We don't infer guilt — we surface contradictions between
                stated positions and publicly reported behaviour.
              </Bullet>
              <Bullet>
                We don't make legal claims. Treat the briefs as a starting
                point for your own reading.
              </Bullet>
            </ul>
          </Section>

          <Section index="04" title="Regulation & policy">
            <p>
              Exposé is a UK-based research tool and operates in line with
              relevant UK law, including:
            </p>
            <ul className="mt-3 space-y-1.5">
              <Bullet>
                <strong>Defamation Act 2013</strong> — we only summarise
                already-public reporting and link back to the original
                publisher.
              </Bullet>
              <Bullet>
                <strong>UK GDPR & Data Protection Act 2018</strong> — we
                process personal data of public figures only where it relates
                to their public role, in the public interest.
              </Bullet>
              <Bullet>
                <strong>Online Safety Act 2023</strong> — we don't host
                user-generated content, comments, or anonymous submissions.
              </Bullet>
              <Bullet>
                <strong>Copyright, Designs and Patents Act 1988</strong> — we
                quote briefly and link to sources, in line with fair dealing
                for criticism, review and news reporting.
              </Bullet>
            </ul>
          </Section>

          <Section index="05" title="Working alongside legislation">
            <p>
              Exposé is built to support, not replace, the existing
              accountability stack:
            </p>
            <ul className="mt-3 space-y-1.5">
              <Bullet>
                <strong>Electoral Commission</strong> — donations & spending.
              </Bullet>
              <Bullet>
                <strong>Register of Members' Financial Interests</strong> —
                MP outside earnings & gifts.
              </Bullet>
              <Bullet>
                <strong>ACOBA</strong> — post-government employment
                appointments.
              </Bullet>
              <Bullet>
                <strong>Companies House</strong> — directorships and
                beneficial ownership.
              </Bullet>
              <Bullet>
                <strong>IPSO / Ofcom / ICO</strong> — for complaints about
                press, broadcast, and data use, respectively.
              </Bullet>
            </ul>
            <p className="mt-3">
              If a brief surfaces something you believe is wrong or out of
              date, those bodies (and the original publisher) remain the
              correct route for formal correction. Email us and we'll review
              the brief in parallel.
            </p>
          </Section>

          <Section index="06" title="Removal & corrections">
            <p>
              Subjects and their representatives can request a review by
              emailing{" "}
              <a
                href="mailto:corrections@expose.local"
                className="underline decoration-[#0f4d33]/40 underline-offset-2 hover:decoration-[#0f4d33]"
              >
                corrections@expose.local
              </a>
              . Include the brief URL, the specific line, and a link to
              corrected public reporting. We respond within 7 working days.
            </p>
          </Section>
        </div>

        <div className="mt-16 border-t border-[#0f2a1f]/15 pt-8 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/50 md:mt-24">
          <Link
            to="/"
            className="transition-colors hover:text-[#0f4d33]"
          >
            ← Back to Exposé
          </Link>
        </div>
      </main>
    </div>
  );
}

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-2 border-t border-[#0f2a1f]/15 pt-6 md:col-span-2 md:grid-cols-[1fr_2fr] md:gap-12 md:pt-8">
      <div>
        <div className="font-mono text-[10px] font-bold text-[#0f4d33]">
          {index}
        </div>
        <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
          {title}
          <span className="text-[#0f4d33]">.</span>
        </h2>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-[#0f2a1f]/80 md:text-base">
        {children}
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-[#0f4d33]" />
      <span>{children}</span>
    </li>
  );
}
