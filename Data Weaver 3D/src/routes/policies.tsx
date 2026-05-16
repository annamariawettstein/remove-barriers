import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createFileRoute("/policies")({
  component: PoliciesPage,
  head: () => ({
    meta: [
      { title: "Lattice — Our policies & regulation" },
      {
        name: "description",
        content:
          "How Lattice operates: editorial policy, data sources, UK regulation we work alongside, and how to request corrections.",
      },
    ],
  }),
});

function PoliciesPage() {
  return (
    <div className="min-h-screen w-full bg-[#f3f1e7] text-[#0f2a1f]">
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
          ← Lattice
        </Link>
        <nav className="flex items-center gap-5 text-[9px] uppercase tracking-[0.25em] text-[#0f2a1f]/55 md:text-[10px] md:tracking-[0.3em]">
          <Link to="/help" className="transition-colors hover:text-[#0f4d33]">
            Help
          </Link>
          <span className="text-[#0f2a1f]/40">Lattice · 2026</span>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-6 sm:px-6 md:px-10 md:pt-16">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#0f2a1f]/55">
          Our policies
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-7xl">
          How Lattice{" "}
          <span className="font-serif font-normal italic text-[#0f4d33]">
            operates
          </span>
          <span className="text-[#0f4d33]">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#0f2a1f]/75 md:text-base">
          Lattice is a UK-based public-accountability tool. We map the publicly
          reported behaviour of public figures and institutions against their
          own stated positions. This page sets out the editorial, data and
          legal policies we hold ourselves to.
        </p>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-[1fr_1.5fr] md:gap-16">
          <Section index="01" title="Editorial policy">
            <ul className="space-y-1.5">
              <Bullet>
                We only summarise reporting that is already public, and link
                back to the original publisher.
              </Bullet>
              <Bullet>
                We do not infer guilt. We surface where a stated position and
                publicly reported behaviour appear to diverge.
              </Bullet>
              <Bullet>
                Every citation link is cross-checked. If it can't be verified,
                it's marked <em className="font-serif">unverified</em> and a
                search fallback is shown instead.
              </Bullet>
              <Bullet>
                We do not publish original reporting, leaks, or anonymous tips.
              </Bullet>
            </ul>
          </Section>

          <Section index="02" title="Data sources">
            <p>
              Briefs are assembled from a fixed set of public registers and
              reporting bodies, never from private databases:
            </p>
            <ul className="mt-3 space-y-1.5">
              <Bullet>
                <strong>They Work For You</strong>, <strong>Electoral Commission</strong>,
                MPs' & Lords' Registers of Interests
              </Bullet>
              <Bullet>
                <strong>IPSA</strong>, <strong>Ministers' interests</strong>,
                <strong> ministerial meetings</strong>, <strong>Find a Tender</strong>
              </Bullet>
              <Bullet>
                <strong>Companies House</strong>, <strong>OpenCorporates</strong>,
                <strong> OpenSanctions</strong>, <strong>Offshore Leaks DB</strong>
              </Bullet>
              <Bullet>
                <strong>Wikidata</strong>, <strong>Every Politician</strong>,
                <strong> Who Funds You</strong>, <strong>Press Gazette</strong>
              </Bullet>
            </ul>
          </Section>

          <Section index="03" title="UK regulation we work within">
            <ul className="space-y-1.5">
              <Bullet>
                <strong>Defamation Act 2013</strong> — public-interest
                reporting on public roles; we summarise and link.
              </Bullet>
              <Bullet>
                <strong>UK GDPR & Data Protection Act 2018</strong> — we
                process personal data of public figures only where it relates
                to their public role.
              </Bullet>
              <Bullet>
                <strong>Online Safety Act 2023</strong> — no user-generated
                content, comments, or anonymous submissions are hosted.
              </Bullet>
              <Bullet>
                <strong>Copyright, Designs and Patents Act 1988</strong> —
                short quotation under fair dealing for criticism, review and
                news reporting.
              </Bullet>
            </ul>
          </Section>

          <Section index="04" title="Working alongside, not replacing">
            <p>
              Lattice supports the existing UK accountability stack — it does
              not replace it. The bodies below remain the correct route for
              formal action:
            </p>
            <ul className="mt-3 space-y-1.5">
              <Bullet>
                <strong>Electoral Commission</strong> — donations and spending.
              </Bullet>
              <Bullet>
                <strong>Register of Members' Financial Interests</strong> — MP
                outside earnings and gifts.
              </Bullet>
              <Bullet>
                <strong>ACOBA</strong> — post-government appointments.
              </Bullet>
              <Bullet>
                <strong>Companies House</strong> — directorships and
                beneficial ownership.
              </Bullet>
              <Bullet>
                <strong>IPSO / Ofcom / ICO</strong> — press, broadcast and
                data complaints.
              </Bullet>
            </ul>
          </Section>

          <Section index="05" title="Corrections & right of reply">
            <p>
              Subjects and their representatives can request a review at{" "}
              <a
                href="mailto:corrections@lattice.local"
                className="underline decoration-[#0f4d33]/40 underline-offset-2 hover:decoration-[#0f4d33]"
              >
                corrections@lattice.local
              </a>
              . We aim to respond within five working days. Verified factual
              errors are corrected and dated; opinions and characterisations
              are not subject to removal.
            </p>
          </Section>

          <Section index="06" title="Transparency">
            <p>
              Lattice is independent and not affiliated with any political
              party, campaign, or commercial client. Hosting and AI costs are
              disclosed annually. The source registers listed above are the
              sole inputs to a brief — we do not accept tips, dossiers, or
              opposition research.
            </p>
          </Section>
        </div>

        <div className="mt-20 border-t border-[#0f2a1f]/15 pt-8 text-[10px] uppercase tracking-[0.3em] text-[#0f2a1f]/45">
          Lattice · public accountability layer · 2026
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
  children: ReactNode;
}) {
  return (
    <section className="border-t border-[#0f2a1f]/15 pt-6 md:pt-8">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[10px] font-bold text-[#0f4d33]">
          {index}
        </span>
        <h2 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
      </div>
      <div className="mt-3 max-w-2xl text-sm leading-relaxed text-[#0f2a1f]/80 md:text-[15px]">
        {children}
      </div>
    </section>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-[#0f4d33]" />
      <span>{children}</span>
    </li>
  );
}
