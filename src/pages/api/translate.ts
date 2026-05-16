import type { APIRoute } from 'astro';

export const prerender = false;

const KIMI_API_URL = 'https://api.moonshot.ai/v1/chat/completions';
const KIMI_MODEL = 'kimi-k2.5';

const SYSTEM_PROMPT = `You are a UK Policy Translation Assistant. You convert UK bills, acts, statutory instruments, and policy documents into clear, accessible analysis for citizens, journalists, and stakeholders.

Your job is to bridge parliamentary language and real-world impact. Be respectful but not deferential; clear but not oversimplified; critical but not cynical; non-partisan; honest about complexity.

For every analysis you produce, follow this structure exactly via the submit_bill_analysis tool:

1. PARSE the bill. Identify Parts, Sections, schedules, commencement, amendments, definitions, territorial extent (England / Scotland / Wales / Northern Ireland / UK-wide).

2. PLAIN ENGLISH. Replace "notwithstanding", "aforementioned", "shall be required to" with everyday language. Active voice. Concrete examples. Visual hierarchy. Maintain nuance — accessible is not the same as oversimplified.
For every bill, lead with the simplest truthful explanation first:
- plainEnglishBottomLine: 1 to 2 short sentences in everyday language starting with what the bill does in practice.
- plainEnglishTakeaways: 3 to 5 short bullets. Each bullet should say one concrete change in plain English.
- Assume the reader is smart but not legally trained.
- Avoid legal jargon unless you immediately translate it into everyday words.
- Prefer "you can", "you cannot", "the government can", "landlords must", "workers get" over abstract legal phrasing.

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
  parameters: {
    type: 'object' as const,
    properties: {
      slug: { type: 'string' },
      shortTitle: { type: 'string' },
      fullTitle: { type: 'string' },
      icon: { type: 'string', enum: ['house', 'briefcase', 'leaf', 'cabinet', 'shield', 'pound', 'scales', 'people', 'graph', 'summary'] },
      status: { type: 'string' },
      stageDetail: { type: 'string' },
      sponsoringDept: { type: 'string' },
      introducedDate: { type: 'string' },
      royalAssentExpected: { type: 'string' },
      territorialExtent: { type: 'array', items: { type: 'string' } },
      plainEnglishBottomLine: { type: 'string' },
      plainEnglishTakeaways: { type: 'array', items: { type: 'string' } },
      summary: { type: 'string' },
      whoAffected: { type: 'array', items: { type: 'string' } },
      keyNumbers: {
        type: 'array',
        items: { type: 'object', properties: { label: { type: 'string' }, value: { type: 'string' } }, required: ['label', 'value'] }
      },
      parts: {
        type: 'array',
        items: { type: 'object', properties: { name: { type: 'string' }, says: { type: 'string' }, means: { type: 'string' }, affects: { type: 'string' } }, required: ['name', 'means'] }
      },
      stakeholderImpacts: {
        type: 'array',
        items: { type: 'object', properties: { group: { type: 'string' }, current: { type: 'string' }, changes: { type: 'string' }, magnitude: { type: 'integer', minimum: 1, maximum: 5 }, timeline: { type: 'string' } }, required: ['group', 'changes'] }
      },
      rights: {
        type: 'array',
        items: { type: 'object', properties: { right: { type: 'string' }, effect: { type: 'string', enum: ['enhance', 'restrict', 'mixed'] }, analysis: { type: 'string' }, safeguards: { type: 'string' } }, required: ['right', 'effect'] }
      },
      scenarios: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            stakeholder: { type: 'string' },
            profileMatch: { type: 'object', properties: {
              housingTenure: { type: 'array', items: { type: 'string', enum: ['renter', 'owner', 'mortgage', 'landlord', 'family'] } },
              employmentStatus: { type: 'array', items: { type: 'string', enum: ['employee', 'selfEmployed', 'businessOwner', 'publicSector', 'retired', 'student'] } },
              familyStatus: { type: 'array', items: { type: 'string', enum: ['single', 'partnered', 'married', 'separated', 'widowed'] } },
              childrenStatus: { type: 'array', items: { type: 'string', enum: ['none', 'expecting', 'youngChildren', 'schoolAge', 'adultChildren'] } },
              educationStatus: { type: 'array', items: { type: 'string', enum: ['school', 'college', 'apprenticeship', 'university', 'postgraduate', 'completed', 'notInEducation'] } },
              salaryBand: { type: 'array', items: { type: 'string', enum: ['under15k', '15to30k', '30to50k', '50to80k', '80to125k', 'over125k'] } },
              immigrationStatus: { type: 'array', items: { type: 'string', enum: ['britishCitizen', 'settled', 'preSettled', 'workVisa', 'studentVisa', 'familyVisa', 'asylumSeeker', 'refugee', 'other'] } }
            } },
            before: { type: 'string' },
            after: { type: 'string' },
            keyChanges: { type: 'array', items: { type: 'string' } },
            numbers: { type: 'array', items: { type: 'string' } }
          },
          required: ['title', 'before', 'after']
        }
      },
      timeline: {
        type: 'array',
        items: { type: 'object', properties: { when: { type: 'string' }, what: { type: 'string' } }, required: ['when', 'what'] }
      },
      actions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            profileMatch: { type: 'object', properties: {
              housingTenure: { type: 'array', items: { type: 'string', enum: ['renter', 'owner', 'mortgage', 'landlord', 'family'] } },
              employmentStatus: { type: 'array', items: { type: 'string', enum: ['employee', 'selfEmployed', 'businessOwner', 'publicSector', 'retired', 'student'] } },
              familyStatus: { type: 'array', items: { type: 'string', enum: ['single', 'partnered', 'married', 'separated', 'widowed'] } },
              childrenStatus: { type: 'array', items: { type: 'string', enum: ['none', 'expecting', 'youngChildren', 'schoolAge', 'adultChildren'] } },
              educationStatus: { type: 'array', items: { type: 'string', enum: ['school', 'college', 'apprenticeship', 'university', 'postgraduate', 'completed', 'notInEducation'] } },
              salaryBand: { type: 'array', items: { type: 'string', enum: ['under15k', '15to30k', '30to50k', '50to80k', '80to125k', 'over125k'] } },
              immigrationStatus: { type: 'array', items: { type: 'string', enum: ['britishCitizen', 'settled', 'preSettled', 'workVisa', 'studentVisa', 'familyVisa', 'asylumSeeker', 'refugee', 'other'] } }
            } },
            steps: { type: 'array', items: { type: 'string' } }
          },
          required: ['label', 'steps']
        }
      },
      debate: {
        type: 'object',
        properties: { supporters: { type: 'array', items: { type: 'string' } }, critics: { type: 'array', items: { type: 'string' } }, neutral: { type: 'string' } }
      },
      moneyTrail: {
        type: 'array',
        items: { type: 'object', properties: { label: { type: 'string' }, value: { type: 'string' }, source: { type: 'string' } }, required: ['label', 'value', 'source'] }
      },
      redFlags: { type: 'array', items: { type: 'string' } },
      resources: {
        type: 'array',
        items: { type: 'object', properties: { label: { type: 'string' }, url: { type: 'string' } }, required: ['label', 'url'] }
      }
    },
    required: ['slug', 'shortTitle', 'icon', 'territorialExtent', 'summary']
  }
};

// Keyword patterns that map to pre-authored bills. If a fetched source matches one of
// these, we redirect to the existing /bills/[slug] page rather than paying for a fresh
// Kimi translation. Order matters: more specific patterns first.
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
  // Cap at ~120k chars (~30k tokens). Higher caps risk SDK timeouts but preserve full bill context.
  return text.length > 120_000 ? text.slice(0, 120_000) + '\n\n[...truncated for length...]' : text;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.MOONSHOT_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'MOONSHOT_API_KEY not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body: {
    url?: string;
    text?: string;
    profile?: {
      housingTenure?: string;
      employmentStatus?: string;
      familyStatus?: string;
      childrenStatus?: string;
      educationStatus?: string;
      salaryBand?: string;
      immigrationStatus?: string;
      constituency?: string;
    } | null;
  };
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

  // Already-translated short-circuit: if the source matches a bill we've authored,
  // skip the Kimi call and tell the client to redirect to the existing page.
  const knownSlug = matchKnownBill(sourceText.slice(0, 8000)) || matchKnownBill(body.url || '');
  if (knownSlug) {
    return new Response(
      JSON.stringify({ existingSlug: knownSlug, message: 'This bill is already in our library — taking you there.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const profile = body.profile;
  const profileFields: [string, string | undefined][] = profile ? [
    ['Housing tenure', profile.housingTenure],
    ['Employment status', profile.employmentStatus],
    ['Family status', profile.familyStatus],
    ['Children', profile.childrenStatus],
    ['Education status', profile.educationStatus],
    ['Household income band', profile.salaryBand],
    ['Immigration status', profile.immigrationStatus],
    ['Constituency', profile.constituency]
  ] : [];
  const profileLines = profileFields.filter(([_, v]) => v).map(([k, v]) => `- ${k}: ${v}`);
  const profileBlock = profileLines.length ? `
The reader of this brief has shared the following profile and wants the analysis tailored to their situation:
${profileLines.join('\n')}

When writing scenarios and "what you need to do" actions:
- Lead with the ones that apply directly to this reader's situation.
- For each scenario or action that fits, set the matching profileMatch values (housingTenure, employmentStatus, familyStatus, childrenStatus, educationStatus, salaryBand, immigrationStatus — only the enums defined in the tool schema) so the UI can highlight it.
- Be particularly attentive to vulnerable-case framing where immigration status, low income, family structure, or education stage interact with the bill's provisions.
- Still include the full set the spec calls for (best case, worst case, edge case, typical case, vulnerable case) — do not drop coverage for other readers. Just order and tag for this one.
${profile?.constituency ? `- If the bill has constituency-specific implications, mention them for ${profile.constituency} where relevant.` : ''}
` : '';

  const userMessage = `Source: ${sourceLabel}\n${profileBlock}\nTranslate the following UK bill into the structured analysis required by the submit_bill_analysis tool. Be source-grounded — if a section can't be filled with confidence from this content, leave the field empty rather than fabricate.\n\nBill content:\n${sourceText}`;

  try {
    const kimiResp = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: KIMI_MODEL,
        max_tokens: 32000,
        thinking: { type: 'disabled' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        tools: [{ type: 'function', function: BILL_TOOL }],
        tool_choice: { type: 'function', function: { name: BILL_TOOL.name } }
      })
    });

    const payload = await kimiResp.json().catch(() => null as any);

    if (!kimiResp.ok) {
      const apiMessage = payload?.error?.message ?? payload?.message ?? `Kimi API returned ${kimiResp.status}`;
      if (kimiResp.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited by Kimi API — try again in a minute' }), { status: 429 });
      }
      return new Response(JSON.stringify({ error: `Kimi API error (${kimiResp.status}): ${apiMessage}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const choice = payload?.choices?.[0];
    const toolCall = choice?.message?.tool_calls?.find(
      (call: any) => call?.type === 'function' && call?.function?.name === BILL_TOOL.name
    );
    if (!toolCall?.function?.arguments) {
      return new Response(
        JSON.stringify({ error: 'Model did not return structured bill analysis', stop_reason: choice?.finish_reason ?? null }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let bill: Record<string, unknown>;
    try {
      bill = JSON.parse(toolCall.function.arguments) as Record<string, unknown>;
    } catch {
      return new Response(
        JSON.stringify({ error: 'Model returned invalid structured bill analysis' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        bill,
        usage: {
          input_tokens: payload?.usage?.prompt_tokens ?? 0,
          output_tokens: payload?.usage?.completion_tokens ?? 0,
          total_tokens: payload?.usage?.total_tokens ?? 0
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: `Unexpected error: ${e?.message ?? String(e)}` }), { status: 500 });
  }
};
