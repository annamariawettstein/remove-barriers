import type { PersonaTag, WeeklyCard } from "./weekly-cards";

export const ROLE_TO_TAGS: Record<PersonaTag, string[]> = {
  Renter: ["Renter on a variable tenancy", "Renting", "Private rented", "Live in a flat-share", "Council-housed or on the waiting list"],
  Parent: [
    "Parent of a 3-4 year old",
    "Parent of a 3–4 year old",
    "Pregnant or new parent",
    "Parent navigating school admissions",
    "Appealing a school placement",
    "Manage a household",
  ],
  Carer: ["Receiving or providing social care", "Carer", "Frontline support worker", "Work in safeguarding"],
  Employee: ["Returning to work", "Pregnant or new parent", "Employee", "Manage staff", "Council staff"],
  "Self-employed": ["Self-employed", "Gig worker", "Mortgage holder"],
  "Cared-for": ["Receiving or providing social care", "On benefits with deductions"],
};

export function userTagsFor(personas: PersonaTag[]): string[] {
  return personas.flatMap((p) => ROLE_TO_TAGS[p] ?? []);
}

export function matchScore(card: WeeklyCard, personas: PersonaTag[]): number {
  if (personas.length === 0) return 0;
  const userTags = userTagsFor(personas);
  const matches = card.affectsYouIf.filter((t) => userTags.includes(t)).length;
  const severityWeight =
    card.severity === "high" ? 3 : card.severity === "watch" ? 1 : 0.5;
  return matches * severityWeight;
}

export function tagMatches(tag: string, personas: PersonaTag[]): boolean {
  if (personas.length === 0) return false;
  return userTagsFor(personas).includes(tag);
}

export function matchingCardCount(personas: PersonaTag[], cards: WeeklyCard[]): number {
  if (personas.length === 0) return 0;
  return cards.filter((c) => matchScore(c, personas) > 0).length;
}
