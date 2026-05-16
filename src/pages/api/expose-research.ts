import type { APIRoute } from 'astro';

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

const KIMI_API_URL = 'https://api.moonshot.ai/v1/chat/completions';
const KIMI_MODEL = 'kimi-k2.5';

async function verifyUrl(url: string): Promise<boolean> {
  if (!/^https?:\/\//i.test(url)) return false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ExposeBot/1.0; +https://remove-barriers.vercel.app)'
      }
    }).catch(() => null);
    if (!res || res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ExposeBot/1.0; +https://remove-barriers.vercel.app)',
          Range: 'bytes=0-1024'
        }
      }).catch(() => null);
    }
    clearTimeout(timer);
    if (!res) return false;
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

async function fetchWikipedia(name: string): Promise<{ extract: string; imageUrl: string | null; title: string }> {
  try {
    const title = encodeURIComponent(name.trim().replace(/\s+/g, '_'));
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, {
      headers: { 'User-Agent': 'Lattice/1.0' }
    });
    if (!res.ok) return { extract: '', imageUrl: null, title: name };
    const data = await res.json() as {
      extract?: string;
      thumbnail?: { source?: string };
      originalimage?: { source?: string };
      title?: string;
    };
    return {
      extract: data.extract ?? '',
      imageUrl: data.originalimage?.source ?? data.thumbnail?.source ?? null,
      title: data.title ?? name
    };
  } catch {
    return { extract: '', imageUrl: null, title: name };
  }
}

const SYSTEM_PROMPT = `You are an investigative research assistant specialising in public accountability. Given a public figure, company, media brand, or think tank, return STRICT JSON with this schema:
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
- "role" = primary public role or organisation type.
- "country" = where they are primarily active.
- "leaning" = concise political, ideological, or sector description.
- "bio" = 2-3 sentence neutral biography in plain English.
- "stances" = 4-6 short phrases describing what the subject says it stands for, its public positioning, or declared values.
- "netWorth" = concise best public estimate if relevant, otherwise "Unknown / not publicly disclosed".
- "residences" = 1-4 places if relevant and public, otherwise [].
- "publicStatements" = 4-6 notable public statements or declared positions with source and URL if known.
- "crossReferences" = 3-6 short pairs comparing what the subject said with what they did, funded, owned, lobbied for, or was reported to be connected to.
- Return exactly 8 articles if possible. Each should describe a reported controversy, contradiction, lobbying connection, funding trail, ownership issue, or hidden behaviour relevant to the subject.
- "stanceIndex" = 0-based index into the stances array for the stance most relevant to that article. Use null only if no clear match exists.
- For oil, gas, mining, and other extractive-sector companies, prioritise ownership structure, directors, payments to governments, tax transparency, public-policy influence, and climate-positioning contradictions where they are well sourced.
- Prefer BBC, Reuters, FT, Guardian, Telegraph, Times, Politico, Companies House, Electoral Commission, Parliament, Gov.uk, and similar public-record or major reporting sources.
- Only include a direct URL if you are highly confident it is real. If not, return "".
- Output ONLY the JSON object. No markdown fences, no explanation.`;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.MOONSHOT_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'MOONSHOT_API_KEY not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body = await request.json().catch(() => null) as { name?: string } | null;
  const name = body?.name?.trim();
  if (!name || name.length < 2 || name.length > 120) {
    return new Response(JSON.stringify({ error: 'Invalid name' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const wiki = await fetchWikipedia(name);
  const userPrompt = `Subject: ${name}\n\nBackground context (from Wikipedia, may be empty):\n${wiki.extract || '(none)'}\n\nReturn the JSON now.`;

  try {
    const res = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: KIMI_MODEL,
        max_tokens: 12000,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ]
      })
    });

    const payload = await res.json().catch(() => null as any);
    if (!res.ok) {
      const message = payload?.error?.message ?? payload?.message ?? `Kimi API returned ${res.status}`;
      return new Response(JSON.stringify({ error: `Research API error (${res.status}): ${message}` }), {
        status: res.status === 429 ? 429 : 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const content = payload?.choices?.[0]?.message?.content ?? '';
    let parsed: ResearchResult;
    try {
      const cleaned = String(content).replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      parsed = JSON.parse(cleaned) as ResearchResult;
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to parse AI output' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stances = Array.isArray(parsed.person?.stances)
      ? parsed.person.stances.filter((s): s is string => typeof s === 'string' && s.trim().length > 0).slice(0, 6)
      : [];

    const rawArticles = (parsed.articles ?? []).slice(0, 9);
    const verifiedArticles: Article[] = await Promise.all(
      rawArticles.map(async (article) => {
        const rawUrl = typeof article.url === 'string' ? article.url.trim() : '';
        const ok = /^https?:\/\//i.test(rawUrl) ? await verifyUrl(rawUrl) : false;
        const fallback = `https://www.google.com/search?q=${encodeURIComponent(`${article.title} ${article.source} ${name}`)}`;
        return {
          title: String(article.title ?? '').trim(),
          source: String(article.source ?? '').trim(),
          summary: String(article.summary ?? '').trim(),
          concern: String(article.concern ?? '').trim(),
          url: ok ? rawUrl : fallback,
          verified: ok,
          stanceIndex:
            typeof article.stanceIndex === 'number' && article.stanceIndex >= 0 && article.stanceIndex < stances.length
              ? article.stanceIndex
              : null
        };
      })
    );

    const rawStatements = Array.isArray(parsed.person?.publicStatements) ? parsed.person.publicStatements.slice(0, 6) : [];
    const publicStatements: Statement[] = await Promise.all(
      rawStatements.map(async (statement) => {
        const rawUrl = typeof statement?.url === 'string' ? statement.url.trim() : '';
        const ok = /^https?:\/\//i.test(rawUrl) ? await verifyUrl(rawUrl) : false;
        const fallback = `https://www.google.com/search?q=${encodeURIComponent(`"${String(statement?.quote ?? '').slice(0, 80)}" ${statement?.source ?? ''} ${name}`)}`;
        return {
          quote: String(statement?.quote ?? '').trim(),
          context: String(statement?.context ?? '').trim(),
          date: String(statement?.date ?? '').trim(),
          source: String(statement?.source ?? '').trim(),
          url: ok ? rawUrl : fallback,
          verified: ok
        };
      })
    );

    const rawCrossRefs = Array.isArray(parsed.person?.crossReferences) ? parsed.person.crossReferences.slice(0, 6) : [];
    const crossReferences: CrossRef[] = await Promise.all(
      rawCrossRefs.map(async (crossRef) => {
        const rawUrl = typeof crossRef?.url === 'string' ? crossRef.url.trim() : '';
        const ok = /^https?:\/\//i.test(rawUrl) ? await verifyUrl(rawUrl) : false;
        const fallback = `https://www.google.com/search?q=${encodeURIComponent(`${crossRef?.said ?? ''} ${crossRef?.did ?? ''} ${crossRef?.source ?? ''} ${name}`)}`;
        return {
          said: String(crossRef?.said ?? '').trim(),
          did: String(crossRef?.did ?? '').trim(),
          source: String(crossRef?.source ?? '').trim(),
          url: ok ? rawUrl : fallback,
          verified: ok
        };
      })
    );

    const residences = Array.isArray(parsed.person?.residences)
      ? parsed.person.residences.filter((r): r is string => typeof r === 'string' && r.trim().length > 0).slice(0, 4)
      : [];

    const result: ResearchResult = {
      person: {
        name: parsed.person?.name || wiki.title || name,
        role: parsed.person?.role || '—',
        country: parsed.person?.country || '—',
        leaning: parsed.person?.leaning || '—',
        bio: parsed.person?.bio || wiki.extract || '',
        stances,
        imageUrl: wiki.imageUrl,
        netWorth: (parsed.person?.netWorth || '').trim() || 'Unknown / not publicly disclosed',
        residences,
        publicStatements,
        crossReferences
      },
      articles: verifiedArticles
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: `Unexpected error: ${error?.message ?? String(error)}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
