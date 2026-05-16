import { createServerFn } from "@tanstack/react-start";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway";

const MODEL = "google/gemini-3-flash-preview";
const IMPACT_MODEL = "google/gemini-2.5-flash";
const TODAY = "Friday 16 May 2026";

const CardSchema = z.object({
  illustration: z
    .string()
    .min(1)
    .max(8)
    .describe("One single emoji that visually represents the topic. No text."),
  headline: z.string().min(8).max(120),
  summary: z.string().min(40).max(280),
  affected_groups: z
    .array(z.string().min(2).max(40))
    .min(3)
    .max(6)
    .describe("Short labels for groups of people this most affects."),
  // kept internal for prompting balance; not shown in UI
  pestel_letter: z.enum(["P", "E", "S", "T", "EN", "L"]),
});

const CardsResponseSchema = z.object({
  cards: z.array(CardSchema).min(6).max(6),
});

export type PestelCard = z.infer<typeof CardSchema>;

const ImpactSchema = z.object({
  paragraphs: z.array(z.string().min(20).max(1200)).min(2).max(4),
  caveat: z.string().min(0).max(500).optional().default(""),
});

export type PersonalImpact = z.infer<typeof ImpactSchema>;

const PowerTraceSchema = z.object({
  paragraphs: z.array(z.string().min(40).max(500)).length(2),
  beneficiaries: z.string().min(40).max(400),
});

export type PowerTrace = z.infer<typeof PowerTraceSchema>;

const PowerTraceInput = z.object({
  cardHeadline: z.string().min(4).max(200),
  cardSummary: z.string().min(4).max(600),
});

export const getPowerTrace = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PowerTraceInput.parse(d))
  .handler(async ({ data }): Promise<Result<PowerTrace>> => {
    try {
      const gateway = createLovableAiGatewayProvider(getKey());
      const model = gateway(MODEL);
      const { object } = await generateObject({
        model,
        schema: PowerTraceSchema,
        system:
          "You are a UK civic explainer. Given a policy change, identify " +
          "(a) the political and lobby actors who drove it through, and " +
          "(b) who benefits and who loses, in plain English. Cite only " +
          "named public-record actors (parties, registered campaigns, named " +
          "lobbyists in the Lobbying Register, named MPs/Lords with declared " +
          "interests). For private individuals not in these registers, refer " +
          "to them structurally (e.g. 'small landlords') not by name. " +
          "UK English. Kitchen-table register. No emojis, no exclamation marks.",
        prompt:
          `Today is ${TODAY}.\n` +
          `Policy: ${data.cardHeadline}\n` +
          `Summary: ${data.cardSummary}\n\n` +
          `Return 2 short paragraphs on the drivers (who pushed this through and why), ` +
          `and a 1-paragraph "beneficiaries" field summarising who benefits and who loses.`,
      });
      return { data: object, error: null };
    } catch (err) {
      console.error("getPowerTrace failed:", err);
      return { data: null, error: mapError(err) };
    }
  });

const DecisionContextSchema = z.object({
  proposers: z
    .array(
      z.object({
        name: z.string().min(2).max(80),
        why: z.string().min(10).max(220),
      }),
    )
    .min(1)
    .max(4),
  beneficiaries: z
    .array(
      z.object({
        name: z.string().min(2).max(80),
        why: z.string().min(10).max(220),
      }),
    )
    .min(1)
    .max(4),
  losers: z
    .array(
      z.object({
        name: z.string().min(2).max(80),
        why: z.string().min(10).max(220),
      }),
    )
    .min(0)
    .max(4),
});

export type DecisionContext = z.infer<typeof DecisionContextSchema>;

type Result<T> = { data: T | null; error: string | null };

function mapError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/429|rate.?limit/i.test(msg)) {
    return "Too many requests right now — try again in a minute.";
  }
  if (/402|credit|quota|exhaust/i.test(msg)) {
    return "AI credits are exhausted. Add credits in Settings → Workspace → Usage.";
  }
  return "The AI didn't respond. Try again in a moment.";
}

function getKey(): string {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return key;
}

export const getPestelCards = createServerFn({ method: "GET" }).handler(
  async (): Promise<Result<z.infer<typeof CardsResponseSchema>>> => {
    try {
      const gateway = createLovableAiGatewayProvider(getKey());
      const model = gateway(MODEL);
      const { object } = await generateObject({
        model,
        schema: CardsResponseSchema,
        system:
          "You are a calm UK civic explainer in the spirit of Citizens Advice. " +
          "You write for the household triage manager: time-poor, cross-tribal, not an activist. " +
          "Plain English, no jargon, no marketing tone, no emojis in text, no exclamation marks.",
        prompt:
          `Today is ${TODAY}. Produce exactly 6 UK-relevant items that a typical UK household would care about right now. ` +
          `Internally balance them across the PESTEL dimensions (Political, Economic, Social, Technological, Environmental, Legal) — ` +
          `one per dimension, recorded in 'pestel_letter' (P, E, S, T, EN, L). DO NOT mention PESTEL or its letters in any user-visible field. ` +
          `Each item: 'illustration' = a single emoji that visually represents the topic (e.g. 🏠, ⚡, 🚆, 🩺, 🌧️). ` +
          `'headline' under 12 words. 'summary' 1–2 sentences under 50 words, specific (numbers, named bodies, dates) but phrased as a development if uncertain. ` +
          `'affected_groups' = 3–6 short labels of people most affected (e.g. 'Private renters', 'Small business owners', 'Pensioners', 'Parents of school-age children'). ` +
          `Return a single object with a 'cards' array of exactly 6 items.`,
      });
      return { data: object, error: null };
    } catch (err) {
      console.error("getPestelCards failed:", err);
      return { data: null, error: mapError(err) };
    }
  },
);

const ImpactInput = z.object({
  headline: z.string().min(4).max(200),
  summary: z.string().min(4).max(600),
  role: z.string().min(2).max(200),
});

export const getPersonalImpact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ImpactInput.parse(data))
  .handler(async ({ data }): Promise<Result<PersonalImpact>> => {
    try {
      const gateway = createLovableAiGatewayProvider(getKey());
      const model = gateway(IMPACT_MODEL);
      const { text } = await generateText({
        model,
        system:
          "You are explaining a UK policy change to a real person who has told us about themselves. " +
          "Use the card's plain-English line and the source they will see on the card. " +
          "Lean on parliament.uk, legislation.gov.uk, mySociety, ONS and Hansard vocabulary so the explanation " +
          "points to the correct primary source. Stay grounded — do not invent numbers. " +
          "If a number isn't in the input, say 'the source doesn't quantify this' instead. " +
          "UK English, kitchen-table register, calm Citizens-Advice tone. " +
          "Output exactly 3 short paragraphs separated by a blank line. " +
          "Then on a new line write 'Caveat: ' followed by one short sentence acknowledging what's uncertain. " +
          "No headings, no bullet points, no markdown, no emojis, no exclamation marks.",
        prompt:
          `Today is ${TODAY}. The user's situation: "${data.role}".\n\n` +
          `Event headline: ${data.headline}\n` +
          `Event summary: ${data.summary}\n\n` +
          `Write the 3 paragraphs explaining what this means specifically for them, then the Caveat line.`,
      });
      const parsed = parseImpactText(text);
      return { data: parsed, error: null };
    } catch (err) {
      console.error("getPersonalImpact failed:", err);
      return { data: null, error: mapError(err) };
    }
  });

function parseImpactText(raw: string): PersonalImpact {
  const cleaned = raw.replace(/\r\n/g, "\n").trim();
  // Split off caveat line if present
  let body = cleaned;
  let caveat = "";
  const caveatMatch = cleaned.match(/(^|\n)\s*caveat\s*[:\-—]\s*([\s\S]+)$/i);
  if (caveatMatch) {
    caveat = caveatMatch[2].trim();
    body = cleaned.slice(0, caveatMatch.index).trim();
  }
  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => p.replace(/^\s*[-*•]\s*/, "").trim())
    .filter((p) => p.length > 0);
  // If model produced one big blob, fall back to sentence-grouping
  const final =
    paragraphs.length >= 2
      ? paragraphs.slice(0, 4)
      : [body.trim()].filter(Boolean);
  return { paragraphs: final, caveat };
}

const DecisionContextInput = z.object({
  headline: z.string().min(4).max(200),
  summary: z.string().min(4).max(600),
});

export const getDecisionContext = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => DecisionContextInput.parse(data))
  .handler(async ({ data }): Promise<Result<DecisionContext>> => {
    try {
      const gateway = createLovableAiGatewayProvider(getKey());
      const model = gateway(MODEL);
      const { object } = await generateObject({
        model,
        schema: DecisionContextSchema,
        system:
          "You are a neutral UK civic explainer. Identify who pushed a decision through and who gains or loses from it. " +
          "Name concrete actors: ministers, departments, regulators, industry bodies, parties, lobbies, unions, firms. " +
          "No partisan adjectives, no editorial. If uncertain, phrase as 'likely' rather than asserting.",
        prompt:
          `Today is ${TODAY}.\n` +
          `Event headline: ${data.headline}\n` +
          `Event summary: ${data.summary}\n\n` +
          `Return:\n` +
          `- 'proposers': 1–3 named actors who pushed this through, each with a short 'why' (their stated or likely motivation).\n` +
          `- 'beneficiaries': 1–4 groups or actors who gain, each with a short 'why'.\n` +
          `- 'losers': 0–4 groups or actors who lose out, each with a short 'why'.\n` +
          `Keep each 'why' under 30 words, neutral tone.`,
      });
      return { data: object, error: null };
    } catch (err) {
      console.error("getDecisionContext failed:", err);
      return { data: null, error: mapError(err) };
    }
  });

const PasteInput = z.object({
  text: z.string().min(20).max(4000),
  role: z.string().min(2).max(200),
});

export const analyzePastedInput = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PasteInput.parse(data))
  .handler(async ({ data }): Promise<Result<PersonalImpact>> => {
    try {
      const gateway = createLovableAiGatewayProvider(getKey());
      const model = gateway(MODEL);
      const { object } = await generateObject({
        model,
        schema: ImpactSchema,
        system:
          "You explain UK bills, letters, and government documents to ordinary people in plain English. " +
          "Calm Citizens-Advice register. Stay sourced to the text the user provided — do not invent facts beyond it. " +
          "No jargon, no marketing tone, no emojis.",
        prompt:
          `Today is ${TODAY}. The user's situation: "${data.role}".\n\n` +
          `They pasted the following text:\n"""\n${data.text}\n"""\n\n` +
          `Write 2–3 short paragraphs explaining what this text means specifically for someone in that situation. ` +
          `Be concrete: real numbers, real rules, real next actions where appropriate. ` +
          `Then write a single 'caveat' line acknowledging what's uncertain or where they should verify.`,
      });
      return { data: object, error: null };
    } catch (err) {
      console.error("analyzePastedInput failed:", err);
      return { data: null, error: mapError(err) };
    }
  });
