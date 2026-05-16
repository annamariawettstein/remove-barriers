import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

type Statement = {
  quote: string;
  context: string;
  date: string;
  source: string;
  url: string;
  verified: boolean;
};

type CrossRef = {
  said: string;
  did: string;
  source: string;
  url: string;
  verified: boolean;
};

type Person = {
  name: string;
  role: string;
  country: string;
  leaning: string;
  bio: string;
  stances: string[];
  imageUrl: string | null;
  netWorth: string;
  residences: string[];
  publicStatements: Statement[];
  crossReferences: CrossRef[];
};

type Article = {
  title: string;
  source: string;
  summary: string;
  concern: string;
  url: string;
  stanceIndex: number | null;
  verified: boolean;
};

type ResearchResult = {
  person: Person;
  articles: Article[];
};

async function verifyUrl(url: string): Promise<boolean> {
  if (!/^https?:\/\//i.test(url)) return false;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6000);
    // Try HEAD first
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ExposeBot/1.0; +https://expose.app)",
      },
    }).catch(() => null);
    // Some publishers block HEAD — fall back to a lightweight GET
    if (!res || res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; ExposeBot/1.0; +https://expose.app)",
          Range: "bytes=0-1024",
        },
      }).catch(() => null);
    }
    clearTimeout(t);
    if (!res) return false;
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

async function fetchWikipedia(name: string): Promise<{ extract: string; imageUrl: string | null; title: string }> {
  try {
    const title = encodeURIComponent(name.trim().replace(/\s+/g, "_"));
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
      { headers: { "User-Agent": "Lattice/1.0" } },
    );
    if (!res.ok) return { extract: "", imageUrl: null, title: name };
    const data = (await res.json()) as {
      extract?: string;
      thumbnail?: { source?: string };
      originalimage?: { source?: string };
      title?: string;
    };
    return {
      extract: data.extract ?? "",
      imageUrl: data.originalimage?.source ?? data.thumbnail?.source ?? null,
      title: data.title ?? name,
    };
  } catch {
    return { extract: "", imageUrl: null, title: name };
  }
}

const SYSTEM_PROMPT = `You are an investigative research assistant specialising in surfacing inauthentic public behaviour by public figures. Given a subject, return STRICT JSON with this schema:
{
  "person": {
    "name": string,
    "role": string,
    "country": string,
    "leaning": string,
    "bio": string,
    "stances": string[],
    "netWorth": string,
    "residences": string[],
    "publicStatements": [ { "quote": string, "context": string, "date": string, "source": string, "url": string } ],
    "crossReferences": [ { "said": string, "did": string, "source": string, "url": string } ]
  },
  "articles": [ { "title": string, "source": string, "summary": string, "concern": string, "url": string, "stanceIndex": number } ]
}

Rules:
- "role" = primary public role / job title.
- "country" = country they are primarily based or active in.
- "leaning" = concise political / ideological leaning (e.g. "Centre-right", "Progressive", "Libertarian", "Non-political").
- "bio" = 2-3 sentence neutral biography.
- "stances" = 4-6 short phrases (max ~10 words each) describing the subject's STATED public positions, declared values, or campaign promises — what they say they stand for. Each must be specific enough that an article can be read as contradicting it.
- "netWorth" = single concise string with the best public estimate AND its attribution and year, e.g. "~£730m (Sunday Times Rich List, 2024)". If genuinely unknown, return "Unknown / not publicly disclosed". Never fabricate a precise figure.
- "residences" = 1-4 short strings naming the places the subject is reported to permanently live or own primary homes in (e.g. "Kirby Sigston, North Yorkshire, UK", "Santa Monica, California, US"). Use the most specific town/region + country you are confident about. If unknown, return an empty array.
- "publicStatements" = 4-6 notable verbatim or near-verbatim public statements the subject has made (speeches, interviews, social posts, parliamentary remarks). Each MUST include the original publication / outlet that reported it and, where you are confident, a direct URL to that report. If not confident in the URL, return "" — never fabricate. Include an approximate date string (e.g. "March 2023").
- "crossReferences" = 3-6 short side-by-side pairs comparing something the subject SAID publicly with what they actually DID (vote, action, business decision, undisclosed interest). Each has "said" (short paraphrase / quote), "did" (the contradicting reported action), "source" (publication), and "url" (direct article URL or "" if unsure).
- Return exactly 8 articles. Each must describe a real-world reported incident, controversy, contradiction, lobbying connection, or hidden behaviour that goes AGAINST one specific stance above.
- "stanceIndex" = 0-based index into the "stances" array identifying which stance this article most clearly contradicts. Every article MUST set this.
- "concern" = one short phrase naming the hidden behaviour (e.g. "Undisclosed lobbying ties", "Voted against stated platform").
- "source" = the publication name only (e.g. "The Guardian", "Reuters").
- "url" = the EXACT direct URL of the original article on the publisher's domain. Only include a URL if you are highly confident it is real and resolves. Do NOT guess slugs, dates, or paths. If unsure, return an empty string "" — never fabricate.
- Prefer well-known publishers (BBC, Guardian, Reuters, FT, NYT, Times, Telegraph, Politico, etc.) whose article URLs you are confident about.
- Output ONLY the JSON object, no prose, no markdown fences.`;

export const Route = createFileRoute("/api/research")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json().catch(() => null)) as { name?: string } | null;
        const name = body?.name?.trim();
        if (!name || name.length < 2 || name.length > 120) {
          return new Response(JSON.stringify({ error: "Invalid name" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "AI gateway not configured" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const wiki = await fetchWikipedia(name);

        const userPrompt = `Subject: ${name}\n\nBackground context (from Wikipedia, may be empty):\n${wiki.extract || "(none)"}\n\nReturn the JSON now.`;

        const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": apiKey,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (!aiRes.ok) {
          const errText = await aiRes.text().catch(() => "");
          if (aiRes.status === 429) {
            return new Response(JSON.stringify({ error: "Rate limited. Please retry shortly." }), {
              status: 429,
              headers: { "Content-Type": "application/json" },
            });
          }
          if (aiRes.status === 402) {
            return new Response(
              JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }),
              { status: 402, headers: { "Content-Type": "application/json" } },
            );
          }
          return new Response(JSON.stringify({ error: `AI error: ${errText.slice(0, 200)}` }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
          });
        }

        const aiData = (await aiRes.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const content = aiData.choices?.[0]?.message?.content ?? "";

        let parsed: ResearchResult;
        try {
          const cleaned = content.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
          parsed = JSON.parse(cleaned) as ResearchResult;
        } catch {
          return new Response(JSON.stringify({ error: "Failed to parse AI output" }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
          });
        }

        const stances = Array.isArray(parsed.person?.stances)
          ? parsed.person.stances
              .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
              .slice(0, 6)
          : [];

        const rawArticles = (parsed.articles ?? []).slice(0, 9);

        // Verify URLs in parallel so the UI can flag hallucinated citations.
        const verified = await Promise.all(
          rawArticles.map(async (a) => {
            const rawUrl = typeof a.url === "string" ? a.url.trim() : "";
            const isHttp = /^https?:\/\//i.test(rawUrl);
            const ok = isHttp ? await verifyUrl(rawUrl) : false;
            const fallback = `https://www.google.com/search?q=${encodeURIComponent(
              `${a.title} ${a.source} ${name}`,
            )}`;
            const idx =
              typeof a.stanceIndex === "number" &&
              a.stanceIndex >= 0 &&
              a.stanceIndex < stances.length
                ? a.stanceIndex
                : null;
            return {
              title: a.title,
              source: a.source,
              summary: a.summary,
              concern: a.concern,
              url: ok ? rawUrl : fallback,
              verified: ok,
              stanceIndex: idx,
            } satisfies Article;
          }),
        );

        // Verify statement + cross-reference URLs in parallel as well.
        const rawStatements = Array.isArray(parsed.person?.publicStatements)
          ? parsed.person.publicStatements.slice(0, 6)
          : [];
        const publicStatements: Statement[] = await Promise.all(
          rawStatements.map(async (s) => {
            const rawUrl = typeof s?.url === "string" ? s.url.trim() : "";
            const isHttp = /^https?:\/\//i.test(rawUrl);
            const ok = isHttp ? await verifyUrl(rawUrl) : false;
            const fallback = `https://www.google.com/search?q=${encodeURIComponent(
              `"${(s?.quote ?? "").slice(0, 80)}" ${s?.source ?? ""} ${name}`,
            )}`;
            return {
              quote: String(s?.quote ?? "").trim(),
              context: String(s?.context ?? "").trim(),
              date: String(s?.date ?? "").trim(),
              source: String(s?.source ?? "").trim(),
              url: ok ? rawUrl : fallback,
              verified: ok,
            };
          }),
        );

        const rawCrossRefs = Array.isArray(parsed.person?.crossReferences)
          ? parsed.person.crossReferences.slice(0, 6)
          : [];
        const crossReferences: CrossRef[] = await Promise.all(
          rawCrossRefs.map(async (c) => {
            const rawUrl = typeof c?.url === "string" ? c.url.trim() : "";
            const isHttp = /^https?:\/\//i.test(rawUrl);
            const ok = isHttp ? await verifyUrl(rawUrl) : false;
            const fallback = `https://www.google.com/search?q=${encodeURIComponent(
              `${c?.said ?? ""} ${c?.did ?? ""} ${c?.source ?? ""} ${name}`,
            )}`;
            return {
              said: String(c?.said ?? "").trim(),
              did: String(c?.did ?? "").trim(),
              source: String(c?.source ?? "").trim(),
              url: ok ? rawUrl : fallback,
              verified: ok,
            };
          }),
        );

        const residences = Array.isArray(parsed.person?.residences)
          ? parsed.person.residences
              .filter((r): r is string => typeof r === "string" && r.trim().length > 0)
              .slice(0, 4)
          : [];

        const result: ResearchResult = {
          person: {
            name: parsed.person?.name || wiki.title || name,
            role: parsed.person?.role || "—",
            country: parsed.person?.country || "—",
            leaning: parsed.person?.leaning || "—",
            bio: parsed.person?.bio || wiki.extract || "",
            stances,
            imageUrl: wiki.imageUrl,
            netWorth: (parsed.person?.netWorth || "").trim() || "Unknown / not publicly disclosed",
            residences,
            publicStatements,
            crossReferences,
          },
          articles: verified,
        };

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
