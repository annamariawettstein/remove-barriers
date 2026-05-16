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
- Use emoji as section markers consistently with the structure: 📋 quick summary, 📊 key numbers, 🎯 stakeholders, 🔍 parts, 👥 impact, ⚖️ rights, 📖 scenarios, 📅 timeline, ✅ actions, 💷 money, 🗣️ debate, ⚠️ red flags, 📚 resources.
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
      emoji: { type: 'string', description: 'A single emoji that thematically represents the bill' },
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
    required: ['slug', 'shortTitle', 'fullTitle', 'emoji', 'status', 'stageDetail', 'sponsoringDept', 'introducedDate', 'territorialExtent', 'summary', 'whoAffected', 'keyNumbers']
  }
};

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
      'User-Agent': 'Lattice-Bill-Translator/0.1 (https://hong-kong-seven.vercel.app)',
      Accept: 'text/html,application/xhtml+xml'
    }
  });
  if (!resp.ok) {
    throw new Error(`Source returned ${resp.status}`);
  }
  const html = await resp.text();
  const text = stripHtml(html);
  // Cap at ~120k chars (~30k tokens) to stay within sensible input budget
  return text.length > 120_000 ? text.slice(0, 120_000) + '\n\n[...truncated for length...]' : text;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body: { url?: string; text?: string };
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
      sourceText = body.text.slice(0, 120_000);
      sourceLabel = 'Pasted text';
    } else {
      return new Response(JSON.stringify({ error: 'Provide a `url` to a UK bill or `text` of the bill content (min 100 chars)' }), { status: 400 });
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: `Could not fetch source: ${e.message}` }), { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const userMessage = `Source: ${sourceLabel}\n\nTranslate the following UK bill into the structured analysis required by the submit_bill_analysis tool. Be source-grounded — if a section can't be filled with confidence from this content, leave the field empty rather than fabricate.\n\nBill content:\n${sourceText}`;

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 32000,
      thinking: { type: 'adaptive' },
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
