export type Topic =
  | "work-rights"
  | "civic"
  | "money"
  | "family-care"
  | "housing"
  | "infrastructure";

export type Severity = "high" | "watch" | "fyi";

export type PersonaTag =
  | "Renter"
  | "Parent"
  | "Carer"
  | "Employee"
  | "Self-employed"
  | "Cared-for";

export type FilterKey =
  | "for-me"
  | "this-week"
  | "womens-rights"
  | "work-money"
  | "care-family"
  | "housing-renting"
  | "civic-political";

export type Astroturf = {
  level: "Low" | "Medium" | "High";
  matched: number;
  total: number;
};

export type SpinReality = {
  spin: string;
  reality: string;
};

export type WeeklyCard = {
  id: string;
  variant: "high" | "standard";
  topic: Topic;
  topicLabel: string;
  severity: Severity;
  headline: string;
  meaning: string;
  affectsYouIf: string[];
  affectsTags: PersonaTag[];
  commencement: string;
  spinReality?: SpinReality;
  astroturf?: Astroturf;
  source: {
    label: string;
    href: string;
  };
  filters: FilterKey[];
  womenImpact?: boolean;
};

export const TOPIC_ACCENT: Record<Topic, string> = {
  "work-rights": "#3D3A8C", // indigo
  civic: "#475569", // slate
  money: "#1F4D3A", // forest
  "family-care": "#B0532C", // terracotta
  housing: "#9A5A3C", // clay
  infrastructure: "#3A3F47", // graphite
};

export const SEVERITY_STYLE: Record<
  Severity,
  { label: string; fg: string; bg: string; border: string }
> = {
  high: {
    label: "High impact for you",
    fg: "#7A1020",
    bg: "#F8E5E7",
    border: "#E0AFB5",
  },
  watch: {
    label: "Watch",
    fg: "#7A4A05",
    bg: "#F8EBD0",
    border: "#E0C58A",
  },
  fyi: {
    label: "FYI",
    fg: "#3A3F47",
    bg: "#ECE9E1",
    border: "#C9C4B6",
  },
};

export const ASTROTURF_STYLE: Record<
  Astroturf["level"],
  { fg: string; bg: string }
> = {
  Low: { fg: "#3A3F47", bg: "#ECE9E1" },
  Medium: { fg: "#7A4A05", bg: "#F8EBD0" },
  High: { fg: "#7A1020", bg: "#F8E5E7" },
};

export const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "for-me", label: "For me" },
  { key: "this-week", label: "This week" },
  { key: "womens-rights", label: "Women's rights" },
  { key: "work-money", label: "Work & money" },
  { key: "care-family", label: "Care & family" },
  { key: "housing-renting", label: "Housing & renting" },
  { key: "civic-political", label: "Civic & political" },
];

export const PERSONA_TAGS: PersonaTag[] = [
  "Renter",
  "Parent",
  "Carer",
  "Employee",
  "Self-employed",
  "Cared-for",
];

export const WEEKLY_CARDS: WeeklyCard[] = [
  {
    id: "flexible-working",
    variant: "high",
    topic: "work-rights",
    topicLabel: "Work & Rights",
    severity: "high",
    headline:
      "Employment Rights Act: flexible working from day one",
    meaning:
      "Anyone returning from maternity leave can now request flexible hours from day one.",
    affectsYouIf: ["Returning to work", "Pregnant or new parent", "Manage staff"],
    affectsTags: ["Employee", "Parent"],
    commencement: "In force from 1 July 2026",
    spinReality: {
      spin: "\"Bosses can still refuse on any business grounds.\"",
      reality:
        "Refusals now require a written, evidenced reason from a closed list of eight grounds — and can be challenged at tribunal.",
    },
    source: {
      label: "legislation.gov.uk · Employment Rights Act 2024, s.80F as amended",
      href: "https://www.legislation.gov.uk/",
    },
    filters: ["this-week", "womens-rights", "work-money"],
    womenImpact: true,
  },
  {
    id: "vawg-strategy",
    variant: "high",
    topic: "family-care",
    topicLabel: "Safeguarding",
    severity: "high",
    headline:
      "VAWG strategy refresh: councils get new statutory duties",
    meaning:
      "Local authorities must now publish a public Violence Against Women & Girls action plan and name a lead officer.",
    affectsYouIf: [
      "Work in safeguarding",
      "Frontline support worker",
      "Council staff",
    ],
    affectsTags: ["Employee", "Carer"],
    commencement: "Duties begin 1 September 2026",
    source: {
      label: "Home Office press release · 14 May 2026",
      href: "https://www.gov.uk/",
    },
    filters: ["this-week", "womens-rights", "care-family", "civic-political"],
    womenImpact: true,
  },
  {
    id: "boe-rate-hold",
    variant: "standard",
    topic: "money",
    topicLabel: "Money",
    severity: "watch",
    headline: "Bank of England holds base rate at 4.75%",
    meaning:
      "No change to mortgage and variable-rent costs this month, but the MPC flagged \"persistent services inflation\".",
    affectsYouIf: [
      "Renter on a variable tenancy",
      "Mortgage holder",
      "On benefits with deductions",
    ],
    affectsTags: ["Renter", "Employee", "Self-employed"],
    commencement: "Decision dated 15 May 2026 · next review 19 June",
    astroturf: { level: "Low", matched: 2, total: 41 },
    source: {
      label: "Bank of England · May 2026 MPC report",
      href: "https://www.bankofengland.co.uk/",
    },
    filters: ["this-week", "work-money", "housing-renting"],
  },
  {
    id: "primary-placements",
    variant: "standard",
    topic: "family-care",
    topicLabel: "Care & Family",
    severity: "watch",
    headline: "DfE updates primary school placements for September",
    meaning:
      "Appeal windows shortened to 15 working days. Late applicants now get a digital decision within 10 days.",
    affectsYouIf: [
      "Parent of a 3–4 year old",
      "Appealing a school placement",
    ],
    affectsTags: ["Parent", "Carer"],
    commencement: "Applies to all 2026/27 admissions",
    source: {
      label: "GOV.UK · DfE admissions update, 12 May 2026",
      href: "https://www.gov.uk/",
    },
    filters: ["this-week", "care-family"],
  },
  {
    id: "simpler-recycling",
    variant: "standard",
    topic: "infrastructure",
    topicLabel: "Infrastructure",
    severity: "fyi",
    headline: "Simpler Recycling national standard begins phased rollout",
    meaning:
      "Four standard bins for every household in England by March 2027. Flats get communal containers first.",
    affectsYouIf: ["Live in a flat-share", "Manage a household"],
    affectsTags: ["Renter", "Parent"],
    commencement: "Phased from 30 March 2026",
    source: {
      label: "DEFRA · Simpler Recycling implementation guidance",
      href: "https://www.gov.uk/",
    },
    filters: ["this-week", "housing-renting"],
  },
  {
    id: "council-control",
    variant: "standard",
    topic: "civic",
    topicLabel: "Civic & Political",
    severity: "high",
    headline: "Local election results finalise council control",
    meaning:
      "23 councils change hands. Your council sets housing allocation, school admissions and adult social care.",
    affectsYouIf: [
      "Council-housed or on the waiting list",
      "Parent navigating school admissions",
      "Receiving or providing social care",
    ],
    affectsTags: ["Renter", "Parent", "Carer", "Cared-for"],
    commencement: "New cabinets in place from 19 May 2026",
    spinReality: {
      spin:
        "\"Turnout collapse proves voters reject all mainstream parties.\"",
      reality:
        "Turnout was 34.1% — within 1.8 points of the 2022 local average. Three of the six 'collapse' viral clips were misattributed footage from 2019.",
    },
    astroturf: { level: "Medium", matched: 18, total: 47 },
    source: {
      label: "Electoral Commission · provisional 2026 local results",
      href: "https://www.electoralcommission.org.uk/",
    },
    filters: ["this-week", "civic-political"],
  },
];
