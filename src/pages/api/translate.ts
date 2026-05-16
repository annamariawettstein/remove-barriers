import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

export const prerender = false;

const SYSTEM_PROMPT = `You are a UK Policy Translation Assistant. You convert UK bills, acts, statutory instruments, and policy documents into clear, accessible analysis for citizens, journalists, and stakeholders.

Your job is to bridge parliamentary language and real-world impact. Be respectful but not deferential; clear but not oversimplified; critical but not cynical; non-partisan; honest about complexity.

For every analysis you produce, follow this structure exactly via the submit_bill_analysis tool:

1. PARSE the bill. Identify Parts, Sections, schedules, commencement, amendments, definitions, territorial extent (England / Scotland / Wales / Northern Ireland / UK-wide).

2. PLAIN ENGLISH. Replace "notwithstanding", "aforementioned", "shall be required to" with everyday language. Active voice. Concrete examples. Visual hierarchy. Maintain nuance — accessible is not the same as oversimplified.

3. STAKEHOLDER IMPACT. For each main group (individuals by demographic, businesses by sector/size, public sector, third sector, professionals), state: current situation, what changes, magnitude (1=minor to 5=transformative), timeline, new obligations, new rights, new restrictions.

4. RIGHTS & FREEDOMS. Map against Human Rights Act 1998 / ECHR (Articles 2, 3, 5, 6, 8, 10, 11, 14), common law rights, and Equality Act 2010 protected characteristics. For each affected right: does the bill enhance, restrict, or have mixed effect? What's the justification? What safeguards?

5. BEFORE/AFTER SCENARIOS. Concrete cases showing real impact. Include best case, worst case, edge case, typical case, and vulnerable case. Show legal position, practical reality, and example process under both old and new law.

6. IMPLEMENTATION TIMELINE. Royal Assent, commencement provisions, transitional arrangements, regulatory timeline, review/sunset dates.

7. ACTIONABLE NEXT STEPS. For citizens, businesses, public bodies — concrete actions.

8. THE DEBATE. Supporters' arguments with evidence. Critics' arguments with evidence. Neutral analysis of what the evidence shows.

9. MONEY TRAIL. This is critical. Surface the money flowing around this bill: donations to sponsors from interested parties, lobbying spend declared on this issue, ministerial meetings, government contracts at stake. Cite Electoral Commission, Lobby Register, Companies House, Cabinet Office transparency releases, Contracts Finder. If you can't verify a figure from the source material, omit it rather than fabricate.

10. RED FLAGS. Highlight: broad delegated powers (Henry VIII powers), ouster clauses, retrospective provisions, skeleton legislation, fast-tracking, reverse burden of proof, wide discretionary powers, no sunset clause, limited oversight.

QUALITY RULES:
- Source-cite every claim where possible. Use legislation.gov.uk, bills.parliament.uk, Explanatory Notes, Hansard, Impact Assessments.
- For uncertain impacts, distinguish what's clear vs. speculative. Note what depends on secondary legislation.
- For devolution, clearly state territorial application.
- If you don't have enough information to fill a section confidently, leave the field empty rather than fabricate. Empty arrays are acceptable.
- Do NOT use emojis anywhere in your output. The platform uses a blueprint-style icon set; emoji would break the visual language. Pick the bill's thematic icon from the enum provided in the icon field of the tool schema.
- The output is JSON via the submit_bill_analysis tool. Always call that tool. Never reply in prose.`;

const BILL_TOOL = {
  name: 'submit_bill_analysis',
  description: 'Submit the complete plain-English analysis of a UK bill, structured for the Lattice platform.',
  input_schema: {
    type: 'object' as const,
    properties: {
      slug: { type: 'string', description: 'Kebab-case slug derived from the bill title, e.g. "renters-rights-bill"' },
      shortTitle: { type: 'string', description: 'Short title of the bill' },
      fullTitle: { type: 'string', description: 'Full official title including session, e.g. "Renters\' Rights Bill 2024-25"' },
      icon: { type: 'string', enum: ['house', 'briefcase', 'leaf', 'cabinet', 'shield', 'pound', 'scales', 'people', 'graph', 'summary'], description: 'Pick one thematic icon from the enum that best represents the bill.' },
      status: { type: 'string', description: 'Current parliamentary stage, e.g. "Lords · Committee stage"' },
      stageDetail: { type: 'string', description: 'One-sentence detail of the current stage' },
      sponsoringDept: { type: 'string', description: 'Sponsoring government department' },
      introducedDate: { type: 'string', description: 'Date the bill was introduced, e.g. "11 September 2024"' },
      royalAssentExpected: { type: 'string', description: 'When Royal Assent is expected, e.g. "Summer 2025". Empty if unknown.' },
      territorialExtent: { type: 'array', items: { type: 'string' }, description: 'Where the bill applies: e.g. ["England"] or ["UK-wide"]' },
      summary: { type: 'string', description: '3-4 sentence plain-English overview' },
      whoAffected: { type: 'array', items: { type: 'string' }, description: 'Stakeholder labels with approximate scale' },
      keyNumbers: {
        type: 'array',
        items: {
          type: 'object',
          properties: { label: { type: 'string' }, value: { type: 'string' } },
          required: ['label', 'value']
        }
      },
      parts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'e.g. "Part 1 — Tenancy reform"' },
            says: { type: 'string', description: 'Legal text, paraphrased' },
            means: { type: 'string', description: 'Plain English' },
            affects: { type: 'string', description: 'Who it impacts directly' }
          },
          required: ['name', 'says', 'means', 'affects']
        }
      },
      stakeholderImpacts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            group: { type: 'string' },
            current: { type: 'string', description: 'Status quo before the bill' },
            changes: { type: 'string', description: 'What changes under the bill' },
            magnitude: { type: 'integer', minimum: 1, maximum: 5 },
            timeline: { type: 'string' }
          },
          required: ['group', 'current', 'changes', 'magnitude', 'timeline']
        }
      },
      rights: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            right: { type: 'string', description: 'Named right, e.g. "Right to a fair trial (Article 6 ECHR)"' },
            effect: { type: 'string', enum: ['enhance', 'restrict', 'mixed'] },
            analysis: { type: 'string' },
            safeguards: { type: 'string', description: 'Built-in protections; empty if none' }
          },
          required: ['right', 'effect', 'analysis']
        }
      },
      scenarios: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Specific named person + situation' },
            stakeholder: { type: 'string', description: 'Generic stakeholder description' },
            profileMatch: {
              type: 'object',
              properties: {
                housingTenure: { type: 'array', items: { type: 'string', enum: ['renter', 'owner', 'mortgage', 'landlord', 'family'] } },
                employmentStatus: { type: 'array', items: { type: 'string', enum: ['employee', 'selfEmployed', 'businessOwner', 'publicSector', 'retired', 'student'] } }
              }
            },
            before: { type: 'string' },
            after: { type: 'string' },
            keyChanges: { type: 'array', items: { type: 'string' } },
            numbers: { type: 'array', items: { type: 'string' }, description: 'Statistical context, source-cited' }
          },
          required: ['title', 'stakeholder', 'before', 'after', 'keyChanges']
        }
      },
      timeline: {
        type: 'array',
        items: {
          type: 'object',
          properties: { when: { type: 'string' }, what: { type: 'string' } },
          required: ['when', 'what']
        }
      },
      actions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string', description: 'e.g. "If you\'re a renter"' },
            profileMatch: {
              type: 'object',
              properties: {
                housingTenure: { type: 'array', items: { type: 'string', enum: ['renter', 'owner', 'mortgage', 'landlord', 'family'] } },
                employmentStatus: { type: 'array', items: { type: 'string', enum: ['employee', 'selfEmployed', 'businessOwner', 'publicSector', 'retired', 'student'] } }
              }
            },
            steps: { type: 'array', items: { type: 'string' } }
          },
          required: ['label', 'steps']
        }
      },
      debate: {
        type: 'object',
        properties: {
          supporters: { type: 'array', items: { type: 'string' } },
          critics: { type: 'array', items: { type: 'string' } },
          neutral: { type: 'string' }
        },
        required: ['supporters', 'critics', 'neutral']
      },
      moneyTrail: {
        type: 'array',
        items: {
          type: 'object',
          properties: { label: { type: 'string' }, value: { type: 'string' }, source: { type: 'string' } },
          required: ['label', 'value', 'source']
        }
      },
      redFlags: { type: 'array', items: { type: 'string' } },
      resources: {
        type: 'array',
        items: {
          type: 'object',
          properties: { label: { type: 'string' }, url: { type: 'string' } },
          required: ['label', 'url']
        }
      }
    },
    required: ['slug', 'shortTitle', 'fullTitle', 'icon', 'status', 'stageDetail', 'sponsoringDept', 'introducedDate', 'territorialExtent', 'summary', 'whoAffected', 'keyNumbers']
  }
};

// Keyword patterns that map to pre-authored bills. If a fetched source matches one of
// these, we redirect to the existing /bills/[slug] page rather than paying for a fresh
// Claude translation. Order matters: more specific patterns first.
const KNOWN_BILL_PATTERNS: { slug: string; patterns: RegExp[] }[] = [
  { slug: 'renters-rights-bill', patterns: [/renters['’]?\s+rights\s+bill/i, /section\s+21\s+(?:notice|eviction)s?/i, /private\s+rented\s+sector\s+database/i] },
  { slug: 'employment-rights-bill', patterns: [/employment\s+rights\s+bill/i, /fair\s+work\s+agency/i, /guaranteed[\s-]+hours\s+(?:contract|offer)/i] },
  { slug: 'tobacco-and-vapes-bill', patterns: [/tobacco\s+and\s+vapes\s+bill/i, /smoke[\s-]+free\s+generation/i] },
  { slug: 'data-use-and-access-bill', patterns: [/data\s*\(\s*use\s+and\s+access\s*\)\s+bill/i, /smart\s+data\s+scheme/i] },
  { slug: 'crime-and-policing-bill', patterns: [/crime\s+and\s+policing\s+bill/i, /respect\s+order/i] }
];

function matchKnownBill(source: string): string | null {
  for (const { slug, patterns } of KNOWN_BILL_PATTERNS) {
    if (patterns.some(p => p.test(source))) return slug;
  }
  return null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchBillContent(url: string): Promise<string> {
  const allowedHosts = [
    'bills.parliament.uk',
    'www.legislation.gov.uk',
    'legislation.gov.uk',
    'publications.parliament.uk'
  ];
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid URL');
  }
  if (!allowedHosts.includes(parsed.hostname)) {
    throw new Error(`URL must be on one of: ${allowedHosts.join(', ')}`);
  }
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Lattice-Policy-Translator/0.1; +https://hong-kong-seven.vercel.app)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.9'
    }
  });
  if (!resp.ok) {
    if (resp.status === 403 && parsed.hostname.endsWith('parliament.uk')) {
      throw new Error('Parliament.uk blocks automated fetches. Copy the bill text and paste it into the "Or paste the bill text directly" field below instead.');
    }
    throw new Error(`Source returned ${resp.status}. Try pasting the bill text directly.`);
  }
  const html = await resp.text();
  const text = stripHtml(html);
  // Cap at ~50k chars (~12k tokens) — keeps the substantive sections, trims the tail.
  // Roughly 2-3x faster TTFT than the previous 120k cap.
  return text.length > 50_000 ? text.slice(0, 50_000) + '\n\n[...truncated — analysis based on first 50k chars...]' : text;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body: { url?: string; text?: string; profile?: { housingTenure?: string; employmentStatus?: string; constituency?: string } | null };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  let sourceText: string;
  let sourceLabel: string;
  try {
    if (body.url) {
      sourceText = await fetchBillContent(body.url);
      sourceLabel = `URL: ${body.url}`;
    } else if (body.text && body.text.trim().length > 100) {
      sourceText = body.text.slice(0, 50_000);
      sourceLabel = 'Pasted text';
    } else {
      return new Response(JSON.stringify({ error: 'Provide a `url` to a UK bill or `text` of the bill content (min 100 chars)' }), { status: 400 });
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: `Could not fetch source: ${e.message}` }), { status: 400 });
  }

  // Already-translated short-circuit: if the source matches a bill we've authored,
  // skip the Claude call and tell the client to redirect to the existing page.
  const knownSlug = matchKnownBill(sourceText.slice(0, 8000)) || matchKnownBill(body.url || '');
  if (knownSlug) {
    return new Response(
      JSON.stringify({ existingSlug: knownSlug, message: 'This bill is already in our library — taking you there.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const client = new Anthropic({ apiKey });

  const profile = body.profile;
  const profileBlock = profile && (profile.housingTenure || profile.employmentStatus || profile.constituency) ? `
The reader of this brief has shared the following profile and wants the analysis tailored to their situation:
${profile.housingTenure ? `- Housing tenure: ${profile.housingTenure}` : ''}
${profile.employmentStatus ? `- Employment status: ${profile.employmentStatus}` : ''}
${profile.constituency ? `- Constituency: ${profile.constituency}` : ''}

When writing scenarios and "what you need to do" actions:
- Lead with the ones that apply directly to this reader's situation.
- For each scenario or action that fits, set the matching profileMatch values (housingTenure / employmentStatus enums) so the UI can highlight it.
- Still include the full set the spec calls for (best case, worst case, edge case, typical case, vulnerable case) — do not drop coverage for other readers. Just order and tag for this one.
${profile.constituency ? `- If the bill has constituency-specific implications, mention them for ${profile.constituency} where relevant.` : ''}
` : '';

  const userMessage = `Source: ${sourceLabel}\n${profileBlock}\nTranslate the following UK bill into the structured analysis required by the submit_bill_analysis tool. Be source-grounded — if a section can't be filled with confidence from this content, leave the field empty rather than fabricate.\n\nBill content:\n${sourceText}`;

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 32000,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' }
        }
      ],
      tools: [BILL_TOOL as any],
      tool_choice: { type: 'tool', name: 'submit_bill_analysis' },
      messages: [{ role: 'user', content: userMessage }]
    });

    const message = await stream.finalMessage();

    const toolUse = message.content.find((b) => b.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') {
      return new Response(
        JSON.stringify({ error: 'Model did not return structured bill analysis', stop_reason: message.stop_reason }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const bill = toolUse.input as Record<string, unknown>;

    return new Response(
      JSON.stringify({
        bill,
        usage: {
          input_tokens: message.usage.input_tokens,
          output_tokens: message.usage.output_tokens,
          cache_creation_input_tokens: (message.usage as any).cache_creation_input_tokens ?? 0,
          cache_read_input_tokens: (message.usage as any).cache_read_input_tokens ?? 0
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: any) {
    if (e instanceof Anthropic.RateLimitError) {
      return new Response(JSON.stringify({ error: 'Rate limited by Claude API — try again in a minute' }), { status: 429 });
    }
    if (e instanceof Anthropic.APIError) {
      return new Response(JSON.stringify({ error: `Claude API error (${e.status}): ${e.message}` }), { status: 502 });
    }
    return new Response(JSON.stringify({ error: `Unexpected error: ${e?.message ?? String(e)}` }), { status: 500 });
  }
};
