export type HousingTenure = "renter" | "owner" | "mortgage" | "landlord" | "family";
export type EmploymentStatus =
  | "employee"
  | "selfEmployed"
  | "businessOwner"
  | "publicSector"
  | "retired"
  | "student";

import type { IconName } from "./icons";

export type Profile = {
  housingTenure?: HousingTenure;
  employmentStatus?: EmploymentStatus;
  constituency?: string;
};

export type ProfileMatch = {
  housingTenure?: HousingTenure[];
  employmentStatus?: EmploymentStatus[];
};

export type Bill = {
  slug: string;
  shortTitle: string;
  fullTitle: string;
  icon: IconName;
  status: string;
  stageDetail: string;
  sponsoringDept: string;
  introducedDate: string;
  royalAssentExpected?: string;
  territorialExtent: string[];
  isStub?: boolean;

  summary: string;
  whoAffected: string[];
  keyNumbers: { label: string; value: string }[];

  parts?: { name: string; says: string; means: string; affects: string }[];

  stakeholderImpacts?: {
    group: string;
    current: string;
    changes: string;
    magnitude: 1 | 2 | 3 | 4 | 5;
    timeline: string;
  }[];

  rights?: {
    right: string;
    effect: "enhance" | "restrict" | "mixed";
    analysis: string;
    safeguards?: string;
  }[];

  scenarios?: {
    title: string;
    stakeholder: string;
    profileMatch?: ProfileMatch;
    before: string;
    after: string;
    keyChanges: string[];
    numbers?: string[];
  }[];

  timeline?: { when: string; what: string }[];

  actions?: {
    label: string;
    profileMatch?: ProfileMatch;
    steps: string[];
  }[];

  debate?: {
    supporters: string[];
    critics: string[];
    neutral: string;
  };

  moneyTrail?: { label: string; value: string; source: string }[];

  redFlags?: string[];

  resources?: { label: string; url: string }[];
};

export const BILLS: Bill[] = [
  // =============================================================
  //  Renters' Rights Bill
  // =============================================================
  {
    slug: "renters-rights-bill",
    shortTitle: "Renters' Rights Bill",
    fullTitle: "Renters' Rights Bill 2024-25",
    icon: "house",
    status: "Lords · Committee stage",
    stageDetail: "Second Reading completed 4 February 2025. Committee in the Lords ongoing.",
    sponsoringDept: "Ministry of Housing, Communities and Local Government",
    introducedDate: "11 September 2024",
    royalAssentExpected: "Summer 2025",
    territorialExtent: ["England"],

    summary:
      "Ends 'no-fault' Section 21 evictions, moves all assured tenancies to a single periodic structure (no fixed terms), and creates a national landlord database plus a new ombudsman scheme. Rent increases are capped to once a year and challengeable at the First-tier Tribunal.",
    whoAffected: [
      "Private renters (~11M people)",
      "Private landlords (~2.3M)",
      "Letting agents",
      "Local councils (enforcement)",
      "Courts and Tribunals Service"
    ],
    keyNumbers: [
      { label: "Renters affected (England)", value: "~11 million" },
      { label: "Private landlords affected", value: "~2.3 million" },
      { label: "Section 21 notices served (2023)", value: "~26,000" },
      { label: "New civil-penalty ceiling", value: "£40,000 per breach" }
    ],

    parts: [
      {
        name: "Part 1 — Tenancy reform",
        says:
          "Repeals the assured shorthold tenancy regime. All assured tenancies become periodic. Removes Section 21 of the Housing Act 1988.",
        means:
          "Landlords can no longer evict tenants without giving a specific legal reason. Fixed-term contracts (e.g. 12-month ASTs) are abolished — tenants stay until they choose to leave or the landlord uses an updated Section 8 ground.",
        affects: "Every private tenant and landlord in England"
      },
      {
        name: "Part 2 — Grounds for possession (new Schedule 2)",
        says:
          "Expands and re-codifies the grounds in Schedule 2 of the 1988 Act. Adds new mandatory grounds for landlord/family moving in and selling, with a 12-month protected period and 4 months' notice.",
        means:
          "Landlords keep ways to recover their property — but must prove a valid reason in court. The protected period stops the new grounds being used at the very start of a tenancy.",
        affects: "Landlords selling or moving back in; tenants facing repossession"
      },
      {
        name: "Part 3 — Rent and rent increases",
        says:
          "Caps statutory rent increases to once every 12 months. Tenants can challenge increases at the First-tier Tribunal. Bans rental bidding above the advertised price.",
        means:
          "You can't get hit with mid-year rent hikes, and your landlord can't accept secret over-asks. If the increase looks above-market, you can take it to a tribunal that can set the rent.",
        affects: "All assured tenants; lettings sector"
      },
      {
        name: "Part 4 — Discrimination, pets, blanket bans",
        says:
          "Outlaws blanket bans on renting to families with children or people receiving housing benefit. Tenants have a right to request a pet that cannot be unreasonably refused.",
        means:
          "Adverts saying 'no DSS' or 'no kids' become illegal. You can ask for a pet, and the landlord needs a specific reason to say no (they can require pet insurance).",
        affects: "Benefit recipients, families, pet owners"
      },
      {
        name: "Part 5 — Landlord database & Ombudsman",
        says:
          "Creates a mandatory Private Rented Sector Database. Landlords must register every let property. Establishes a Private Rented Sector Ombudsman that landlords must join.",
        means:
          "Every landlord and every let property has to be on the register. A free complaints scheme replaces the patchy current setup — tenants can demand redress without going to court.",
        affects: "All landlords; local authority enforcement teams"
      }
    ],

    stakeholderImpacts: [
      {
        group: "Private renters",
        current:
          "Assured shorthold tenancies with fixed terms; Section 21 allows eviction with 2 months' notice and no reason given.",
        changes:
          "Indefinite periodic tenancies. No Section 21. Right to challenge rent rises. Protection from blanket discrimination bans.",
        magnitude: 5,
        timeline: "Estimated commencement: 6 months after Royal Assent"
      },
      {
        group: "Private landlords",
        current:
          "Two routes to repossess (S21 no-fault and S8 grounds). Free to set fixed terms and raise rent without statutory limit.",
        changes:
          "Must use a Section 8 ground and prove it. Cannot evict to sell within the first 12 months. Annual rent increase only, tribunal-reviewable. Must register on the database and join the Ombudsman.",
        magnitude: 5,
        timeline: "Phased over 6-18 months after Royal Assent"
      },
      {
        group: "Letting agents",
        current: "Marketing fixed-term ASTs, conducting referencing, drafting tenancy agreements.",
        changes:
          "Update all templates to periodic-only. Train staff on new grounds and tribunal rules. Database registration becomes a routine service offering.",
        magnitude: 3,
        timeline: "Immediate operational impact at commencement"
      },
      {
        group: "Local councils",
        current: "Limited enforcement powers; civil penalties up to £30,000 in some cases.",
        changes:
          "New investigatory powers and a £40,000 civil-penalty ceiling. Will need to enforce the database. Income kept locally for enforcement.",
        magnitude: 4,
        timeline: "Enforcement capacity ramp-up over 12 months"
      },
      {
        group: "Courts and Tribunals Service",
        current: "Section 21 evictions are largely paperwork; possession cases are c.25,000/yr in county courts.",
        changes:
          "Every possession case now requires a contested ground. First-tier Tribunal sees a step-change in rent challenges. The system has flagged capacity risk in committee evidence.",
        magnitude: 4,
        timeline: "Backlog risk peaks ~12 months after commencement"
      }
    ],

    rights: [
      {
        right: "Right to home and family life (Article 8 ECHR)",
        effect: "enhance",
        analysis:
          "Removing Section 21 reduces the risk of arbitrary loss of one's home — a long-standing tension under Article 8.",
        safeguards: "Courts retain jurisdiction over possession; landlords keep grounds for legitimate reasons."
      },
      {
        right: "Right to property (Article 1, Protocol 1 ECHR)",
        effect: "restrict",
        analysis:
          "Landlords lose the unconditional right to recover their property. Government argues the restriction is proportionate to the public interest in stable housing.",
        safeguards:
          "Grounds for sale and own-use are preserved; 12-month protected period is the main limit on landlord property rights."
      },
      {
        right: "Equality Act 2010 (race, disability, family status)",
        effect: "enhance",
        analysis:
          "The ban on 'no DSS' and 'no children' adverts addresses documented indirect discrimination affecting women, disabled people, and ethnic minorities."
      }
    ],

    scenarios: [
      {
        title: "Sarah, a single mother on Universal Credit, looking to move in Tottenham",
        stakeholder: "Renter on benefits with a child",
        profileMatch: { housingTenure: ["renter"] },
        before:
          "Most adverts say 'no DSS, no kids'. Sarah is turned down by 14 agencies before finding one that takes her family. Landlord raises rent £150/mo at the end of the fixed term and she can't afford to challenge it.",
        after:
          "Adverts may not exclude her on benefit or family grounds. She moves into an open-market flat on day one. Mid-tenancy rent rises are capped to once a year and she can challenge them at the First-tier Tribunal without court fees.",
        keyChanges: [
          "Discrimination ban removes the upfront filter",
          "Periodic tenancy means no automatic 12-month renewal pressure",
          "Tribunal route is free and her rent challenge is decided in weeks, not months"
        ],
        numbers: ["~46% of single-parent renters experienced 'no DSS' refusals in 2023 (Shelter)"]
      },
      {
        title: "James, owner-occupier in Liverpool, no rental property",
        stakeholder: "Homeowner",
        profileMatch: { housingTenure: ["owner", "mortgage"] },
        before: "Not directly affected — owns his own home outright.",
        after:
          "Still not a direct party, but local rental supply, neighbour disputes and council enforcement priorities all change around him. If he ever inherits a let property, the new rules apply.",
        keyChanges: [
          "Indirect: local rental market effects on neighbours",
          "Future-proof: rules apply if he ever lets a property"
        ]
      },
      {
        title: "Priya, accidental landlord with one flat after probate",
        stakeholder: "Single-property landlord",
        profileMatch: { housingTenure: ["landlord"] },
        before:
          "Used a Section 21 notice last year when her previous tenant fell behind, without going to court. Sets a 12-month AST with a 3% in-year increase clause.",
        after:
          "Cannot use Section 21. Must serve a Section 8 with a specified ground if she wants the flat back, and prove it in court. Her standard clauses on mid-year increases become unenforceable. She must register on the database (one-off fee, est. £50) and join the Ombudsman.",
        keyChanges: [
          "Loses the fastest route to repossession",
          "Compliance overhead: registration + Ombudsman membership",
          "Sales-ground available, but cannot use it inside the first 12 months"
        ],
        numbers: ["~43% of landlords own a single property (English Private Landlord Survey, 2024)"]
      },
      {
        title: "Mark, runs a five-person letting agency in Bristol",
        stakeholder: "Business owner — letting agency",
        profileMatch: { employmentStatus: ["businessOwner", "selfEmployed"] },
        before:
          "Generates revenue from tenancy renewals and referencing. Section 21 notices are routine paperwork billed to landlords.",
        after:
          "Renewal revenue disappears (no fixed terms). New revenue from database registration and Ombudsman onboarding. Possession cases need solicitor-grade support; small agencies will partner up or specialise.",
        keyChanges: [
          "Revenue model shifts away from churn",
          "New compliance services to sell",
          "Higher legal-services cost on every disputed eviction"
        ]
      },
      {
        title: "Tom, NHS hospital cleaner renting in Sheffield, partner has chronic illness",
        stakeholder: "Public-sector worker, vulnerable household",
        profileMatch: { employmentStatus: ["publicSector", "employee"] },
        before:
          "On a 12-month AST that the landlord declined to renew last year because they were 'thinking of selling' — Tom and his partner had to move twice in 30 months.",
        after:
          "Indefinite periodic tenancy. The sale ground requires landlord to actually market the property and observe a 12-month protected period and 4 months' notice. Tom's partner's medical care continuity is more protected.",
        keyChanges: [
          "No more end-of-fixed-term displacement",
          "Sale must be genuine, not a pretext",
          "Stability for healthcare planning"
        ]
      }
    ],

    timeline: [
      {
        when: "Royal Assent (expected summer 2025)",
        what: "Bill becomes the Renters' Rights Act. Most provisions await commencement regulations."
      },
      {
        when: "+ 0 to 3 months",
        what: "Government consults on database design, Ombudsman fees, and prescribed forms."
      },
      {
        when: "+ 3 to 6 months",
        what:
          "Section 21 repealed for new tenancies. Discrimination and bidding bans commence. New Section 8 grounds available."
      },
      {
        when: "+ 6 to 12 months",
        what:
          "All existing tenancies migrate to periodic. Database and Ombudsman go live. Tribunal rent-challenge route open."
      },
      {
        when: "+ 18 months",
        what:
          "End of transitional period for legacy ASTs. Civil-penalty regime in full operation; first published enforcement stats."
      },
      {
        when: "Year 3 and Year 5",
        what: "Post-implementation reviews; statutory report to Parliament."
      }
    ],

    actions: [
      {
        label: "If you're a renter",
        profileMatch: { housingTenure: ["renter"] },
        steps: [
          "Keep a record of your tenancy agreement and any notices you receive — old fixed-term protections still apply until migration.",
          "Don't sign anything that waives statutory rights — those clauses are unenforceable.",
          "If your landlord raises rent more than once in 12 months after commencement, that's challengeable — Shelter and Citizens Advice will publish updated guides.",
          "After commencement, check the Private Rented Sector Database for your property — landlords who aren't registered face civil penalties."
        ]
      },
      {
        label: "If you're a landlord",
        profileMatch: { housingTenure: ["landlord"] },
        steps: [
          "Stop using new fixed-term tenancies in your standard agreements — they'll convert to periodic automatically.",
          "Plan for a one-time database registration cost and ongoing Ombudsman membership.",
          "Move any 'mid-year rent rise' clauses to annual statutory increases.",
          "If you intend to sell or move in, document the decision now — you'll need to evidence the intent to use the new grounds."
        ]
      },
      {
        label: "If you're a small letting business",
        profileMatch: { employmentStatus: ["businessOwner", "selfEmployed"] },
        steps: [
          "Update tenancy templates and marketing copy ahead of commencement.",
          "Build a compliance line of service: database registration, Ombudsman onboarding, possession-ground assessments.",
          "Train staff on the new Section 8 grounds and the rent-tribunal route.",
          "Audit historic adverts for 'no DSS' or 'no children' language — bring everything into line."
        ]
      },
      {
        label: "If none of the above applies to you",
        steps: [
          "The rental market shapes house prices, mortgage demand, and local services — even non-renters feel knock-on effects.",
          "If you're considering letting in future, the new rules apply from day one of any new tenancy.",
          "If you sit on a council or planning body, factor in the new enforcement regime and the database's data availability for housing strategy."
        ]
      }
    ],

    debate: {
      supporters: [
        "Removes the leading cause of statutory homelessness (loss of an AST) — Crisis, Shelter and Generation Rent all support repeal of S21.",
        "Discrimination bans address documented evidence of indirect discrimination affecting women, disabled people and ethnic minorities.",
        "Brings England into line with Scotland (Private Tenancies Act 2016) and Wales (Renting Homes (Wales) Act 2016)."
      ],
      critics: [
        "National Residential Landlords Association argues court capacity is the binding constraint and the Bill commences before the courts can cope.",
        "Some landlord groups warn of supply withdrawal — though the Scottish experience (post-2017) shows the effect is modest and concentrated in the small-portfolio segment.",
        "Disagreement on whether 12 months is a long enough protected period for the sale ground."
      ],
      neutral:
        "The Bill closely follows the previous government's Renters (Reform) Bill but tightens grounds and removes the requirement for prior court-reform certification. The biggest open question is operational: whether the Ministry of Justice has scaled the courts to cope with all possession cases becoming contested overnight."
    },

    moneyTrail: [
      { label: "Donations from property-sector donors to bill sponsors (5yr)", value: "£0", source: "Electoral Commission" },
      { label: "NRLA lobbying spend (Q1 2026)", value: "£42k", source: "Lobby Register" },
      { label: "Generation Rent income (2024)", value: "£1.1m (donations + grants)", source: "Charity Commission" },
      { label: "Ministerial meetings with landlord groups (2024)", value: "11", source: "Cabinet Office transparency" }
    ],

    redFlags: [
      "Skeleton legislation: database design, Ombudsman fees, and key forms are left to regulations",
      "Court capacity risk: every possession case becomes contested but the MoJ has not committed to additional resourcing"
    ],

    resources: [
      { label: "Bill page · UK Parliament", url: "https://bills.parliament.uk/bills/3764" },
      { label: "Explanatory Notes", url: "https://bills.parliament.uk/publications/55996/documents/5169" },
      { label: "Shelter guide for tenants", url: "https://england.shelter.org.uk/" },
      { label: "NRLA briefing for landlords", url: "https://www.nrla.org.uk/" }
    ]
  },

  // =============================================================
  //  Employment Rights Bill
  // =============================================================
  {
    slug: "employment-rights-bill",
    shortTitle: "Employment Rights Bill",
    fullTitle: "Employment Rights Bill 2024-25",
    icon: "briefcase",
    status: "Lords · Report stage",
    stageDetail: "Commons stages complete. Lords Committee finished March 2025. Report stage ongoing.",
    sponsoringDept: "Department for Business and Trade",
    introducedDate: "10 October 2024",
    royalAssentExpected: "Autumn 2025",
    territorialExtent: ["England", "Scotland", "Wales"],

    summary:
      "Makes unfair-dismissal protection a day-one right (currently 2 years), abolishes most uses of zero-hours contracts in favour of guaranteed-hours offers, restricts 'fire and rehire' to genuine business-failure scenarios, and entitles workers to statutory sick pay from day one. Includes a Fair Work Agency to enforce minimum-wage and holiday-pay rules in one place.",
    whoAffected: [
      "Employees and workers (~33M)",
      "Employers (~5.5M)",
      "Trade unions",
      "HR and payroll providers",
      "Sectors with high zero-hours usage (hospitality, care, retail)"
    ],
    keyNumbers: [
      { label: "Workers gaining day-one unfair-dismissal protection", value: "~9 million" },
      { label: "Zero-hours workers affected", value: "~1.1 million" },
      { label: "SSP threshold removed", value: "£123/wk earnings rule gone" },
      { label: "New Fair Work Agency budget (year 1)", value: "~£80m (est.)" }
    ],

    parts: [
      {
        name: "Part 1 — Day-one rights",
        says:
          "Removes the 2-year qualifying period for unfair-dismissal protection. Repeals the Lower Earnings Limit for Statutory Sick Pay; SSP payable from day one.",
        means:
          "From your first day in a new job, you can claim unfair dismissal at tribunal if you're sacked without a fair reason and process. If you're off sick, you get SSP without waiting three 'waiting days'.",
        affects: "All employees, especially short-tenure and low-paid workers"
      },
      {
        name: "Part 2 — Zero-hours and guaranteed hours",
        says:
          "Creates a right to be offered a guaranteed-hours contract reflecting hours worked across a 12-week reference period. Compensation for shifts cancelled at short notice.",
        means:
          "If you regularly work 25 hours/week on a zero-hours contract for 12 weeks, you can ask for a 25-hour contract. If your shift is cancelled with less than the prescribed notice, you get paid.",
        affects: "Workers in hospitality, care, retail, gig economy"
      },
      {
        name: "Part 3 — Fire and rehire",
        says:
          "Makes dismissal-and-rehire on varied terms automatically unfair unless the employer faces severe financial distress and has consulted properly.",
        means:
          "Employers can no longer threaten to dismiss workers and rehire them on worse pay or conditions as a routine negotiating tactic.",
        affects: "Any unionised workforce; sectors with recent fire-and-rehire disputes (transport, telecoms)"
      },
      {
        name: "Part 4 — Fair Work Agency",
        says:
          "Merges HMRC's National Minimum Wage enforcement, the Gangmasters and Labour Abuse Authority, and the Employment Agency Standards Inspectorate into a single enforcement body.",
        means:
          "One body — with one phone number — investigates minimum wage, holiday pay, modern slavery and agency-worker complaints. Civil and criminal sanctions in one place.",
        affects: "Employers; vulnerable workers in low-paid sectors"
      },
      {
        name: "Part 5 — Trade union access and recognition",
        says:
          "Restores the union recognition threshold to a simple majority of those voting. Trade unions gain a statutory right to access workplaces for organising.",
        means:
          "Recognising a union becomes easier where workers want it. Unions can hold meetings on employer premises subject to a code of practice.",
        affects: "Trade unions; employers in non-unionised sectors"
      }
    ],

    stakeholderImpacts: [
      {
        group: "Employees",
        current: "Need 2 years' service for unfair-dismissal claims. SSP withheld for 3 'waiting days' and requires £123/wk earnings.",
        changes: "Day-one unfair-dismissal protection. SSP from day one with no earnings threshold. Right to guaranteed-hours offer.",
        magnitude: 5,
        timeline: "Phased over 6-18 months from Royal Assent"
      },
      {
        group: "Employers",
        current: "Flexible probationary period in practice (2 years); fire-and-rehire legally available.",
        changes: "Must follow a fair-dismissal process from day one. Statutory probationary period (likely 9 months) under consultation. Cannot routinely fire-and-rehire.",
        magnitude: 4,
        timeline: "Day-one rights need new HR processes from commencement"
      },
      {
        group: "Workers on zero-hours contracts",
        current: "No automatic right to guaranteed hours; shifts can be cancelled with no compensation.",
        changes: "Right to a contract reflecting actual hours; compensation for cancelled shifts.",
        magnitude: 5,
        timeline: "Commencement c.6 months after Royal Assent"
      },
      {
        group: "Trade unions",
        current: "Recognition requires 40% of all workers (not just voters); workplace access at employer discretion.",
        changes: "Recognition by majority of those voting; statutory access rights.",
        magnitude: 4,
        timeline: "Effective from Royal Assent"
      },
      {
        group: "Small and medium-sized employers",
        current: "Can operate light-touch HR for short-tenure staff.",
        changes: "Need formal probationary processes, written reasons for dismissal, day-one HR compliance.",
        magnitude: 4,
        timeline: "Compliance costs concentrated in year 1"
      }
    ],

    rights: [
      {
        right: "Right to a fair trial (Article 6 ECHR)",
        effect: "enhance",
        analysis: "Tribunal access expands materially — millions of workers gain a remedy from day one that was previously two years away."
      },
      {
        right: "Freedom of association (Article 11 ECHR)",
        effect: "enhance",
        analysis: "Statutory union access and restored recognition thresholds enhance the practical ability to organise."
      },
      {
        right: "Right to property (Article 1, Protocol 1)",
        effect: "restrict",
        analysis: "Employers face new restrictions on dismissal and contract variation, which government argues are proportionate to the social-policy aim of fair work.",
        safeguards: "Statutory probationary periods (under consultation); 'severe financial distress' exemption for fire-and-rehire."
      }
    ],

    scenarios: [
      {
        title: "Aisha, hospitality worker in Manchester, zero-hours contract for 8 months",
        stakeholder: "Worker on zero-hours, low earnings",
        profileMatch: { employmentStatus: ["employee"] },
        before: "Works 28 hrs/wk most weeks but has no guaranteed hours. Shifts cancelled the night before are unpaid. If she's sick for two days, she gets nothing because SSP only kicks in on day 4.",
        after: "After 12 weeks of 28-hour patterns, she can ask for a 28-hour guaranteed-hours contract. Last-minute cancellations get compensation. SSP from day one — full statutory amount for the two sick days.",
        keyChanges: [
          "Predictable income from guaranteed-hours offer",
          "Cancelled-shift compensation",
          "SSP from day 1, no earnings threshold"
        ],
        numbers: ["~1.1M workers currently on zero-hours contracts (ONS, 2024)"]
      },
      {
        title: "James, software engineer on a 3-month-old contract at a 200-person startup",
        stakeholder: "New employee in white-collar role",
        profileMatch: { employmentStatus: ["employee"] },
        before: "If dismissed today, no unfair-dismissal claim (under 2 years' service). Severance is whatever's in the contract.",
        after: "From day one, has the right to a fair process before dismissal. Statutory probationary period (likely 9 months) lets employers exit early performers on a lighter standard, but the basic process must be fair.",
        keyChanges: [
          "Day-one unfair-dismissal protection",
          "Fairer process for performance-based exits",
          "Probationary 'light-touch' standard preserved short of arbitrary dismissal"
        ]
      },
      {
        title: "Priya, runs a 12-person bakery in Leeds",
        stakeholder: "Small business owner",
        profileMatch: { employmentStatus: ["businessOwner", "selfEmployed"] },
        before: "Hires seasonal staff on zero-hours. Lets people go in the first year if they're not a fit, without formal process.",
        after: "Must build a proper probationary process from day one. Cannot zero-hours her core staff if their hours stabilise. Statutory sick pay for everyone, every day off sick.",
        keyChanges: [
          "Formal HR processes from day one",
          "Higher payroll cost from SSP from day 1",
          "Guaranteed-hours offers required for stable rota patterns"
        ],
        numbers: ["~5.5M SMEs in the UK; ~99% of all employers"]
      },
      {
        title: "Mark, retired NHS consultant",
        stakeholder: "Retired worker",
        profileMatch: { employmentStatus: ["retired"] },
        before: "Not directly affected.",
        after: "Indirectly affected as a pensioner and consumer — sector cost pass-through could reach service prices (hospitality, care). Care-sector recipients may see workforce stabilisation as zero-hours becomes less common.",
        keyChanges: [
          "Possible price effects in zero-hours-heavy sectors",
          "Improved care-worker conditions where applicable"
        ]
      },
      {
        title: "Sam, full-time public-sector employee (council planner)",
        stakeholder: "Public-sector employee",
        profileMatch: { employmentStatus: ["publicSector"] },
        before: "Already covered by collective bargaining; longer-than-statutory rights through union recognition.",
        after: "Marginal direct impact — most rights are already at or above the new floor. The Fair Work Agency interacts with the council's HR and contractor procurement. Easier union access could affect contractors and outsourced roles.",
        keyChanges: [
          "Minimal direct change for substantive employees",
          "Significant change for outsourced and agency staff in the same workplace"
        ]
      }
    ],

    timeline: [
      { when: "Royal Assent (expected autumn 2025)", what: "Bill becomes the Employment Rights Act. Most provisions await commencement and consultation." },
      { when: "+ 0 to 6 months", what: "Government consults on statutory probationary period length, Fair Work Agency design, and guaranteed-hours reference period." },
      { when: "+ 6 to 9 months", what: "Fire-and-rehire restrictions and union-recognition changes commence." },
      { when: "+ 9 to 12 months", what: "Day-one unfair-dismissal protection and SSP-from-day-one commence." },
      { when: "+ 12 to 18 months", what: "Guaranteed-hours regime and Fair Work Agency stand up fully." },
      { when: "Year 3", what: "Statutory review of zero-hours and probationary-period provisions." }
    ],

    actions: [
      {
        label: "If you're an employee",
        profileMatch: { employmentStatus: ["employee", "publicSector"] },
        steps: [
          "Keep a written record of hours actually worked — it'll matter for any guaranteed-hours request.",
          "If your contract has a 'pay-only-if-shift-completed' clause, that'll likely conflict with cancellation-compensation rules after commencement.",
          "When the statutory probationary period is set, expect a clearer dismissal process from day one — but also more documented performance reviews.",
          "If your workplace doesn't recognise a union, expect organising activity to become more visible from Year 1."
        ]
      },
      {
        label: "If you're a business owner or run an SME",
        profileMatch: { employmentStatus: ["businessOwner", "selfEmployed"] },
        steps: [
          "Audit zero-hours usage now — anyone with a stable rota over 12 weeks will be eligible for a guaranteed-hours offer.",
          "Move to written probationary processes, including objectives and review checkpoints from day one of a new hire.",
          "Plan for SSP cost from day one — model the payroll impact across a typical sickness year.",
          "Avoid any planned fire-and-rehire restructure — it'll be presumptively unfair after commencement unless you can show severe financial distress."
        ]
      },
      {
        label: "If you're self-employed (genuinely)",
        profileMatch: { employmentStatus: ["selfEmployed"] },
        steps: [
          "The Bill doesn't redraw the employment-status boundary, but the Fair Work Agency will pursue 'false self-employment' more actively.",
          "If you have one dominant client and work to their schedule, expect more attention to whether you're really a 'worker'.",
          "If you engage subcontractors, treat any zero-hours-style relationship with caution."
        ]
      },
      {
        label: "If none of the above applies to you",
        steps: [
          "The Bill changes the price and predictability of labour across the economy — knock-ons reach prices, public services, and unemployment data.",
          "Workforce conditions in care, hospitality and retail are particular pressure points to watch.",
          "Future jobs you take will sit under the new regime by default — useful context even if not directly affected now."
        ]
      }
    ],

    debate: {
      supporters: [
        "TUC, Unison, Unite and the Resolution Foundation argue UK employment law is now significantly weaker than peer economies and that the Bill brings it back to a comparable floor.",
        "Resolution Foundation modelling: ~9M workers benefit materially from day-one rights.",
        "The Confederation of British Industry (CBI) has signalled acceptance of the broad direction, with detailed disagreement on timing."
      ],
      critics: [
        "Federation of Small Businesses warns of compliance costs that fall hardest on SMEs without HR functions.",
        "Hospitality and care sectors argue guaranteed-hours rules misread the operational rationale for variable scheduling.",
        "Concerns from some legal commentators about tribunal capacity if day-one claims expand the caseload sharply."
      ],
      neutral:
        "The Bill is the most significant reform of UK employment law since the Employment Rights Act 1996. The contested issue is calibration — the statutory probationary period, the reference window for guaranteed hours, and the FWA's resourcing will largely determine its real-world bite."
    },

    moneyTrail: [
      { label: "Trade-union donations to Labour (2024)", value: "£8.4m", source: "Electoral Commission" },
      { label: "FSB lobbying spend (Q1 2026)", value: "£64k", source: "Lobby Register" },
      { label: "CBI lobbying spend (Q1 2026)", value: "£91k", source: "Lobby Register" },
      { label: "Ministerial meetings with TUC (2024)", value: "27", source: "Cabinet Office transparency" },
      { label: "Ministerial meetings with FSB (2024)", value: "9", source: "Cabinet Office transparency" }
    ],

    redFlags: [
      "Skeleton: statutory probationary period and guaranteed-hours reference period left to regulations",
      "Tribunal capacity: no published modelling of expected case-volume increase"
    ],

    resources: [
      { label: "Bill page · UK Parliament", url: "https://bills.parliament.uk/bills/3737" },
      { label: "Explanatory Notes", url: "https://bills.parliament.uk/publications/55887/documents/5066" },
      { label: "ACAS guidance", url: "https://www.acas.org.uk/" },
      { label: "TUC briefing", url: "https://www.tuc.org.uk/" }
    ]
  },

  // =============================================================
  //  Stubs — coming-soon entries
  // =============================================================
  {
    slug: "tobacco-and-vapes-bill",
    shortTitle: "Tobacco and Vapes Bill",
    fullTitle: "Tobacco and Vapes Bill 2024-25",
    icon: "leaf",
    status: "Commons · Committee stage",
    stageDetail: "Second Reading completed 26 November 2024.",
    sponsoringDept: "Department of Health and Social Care",
    introducedDate: "5 November 2024",
    territorialExtent: ["England", "Scotland", "Wales", "Northern Ireland"],
    isStub: true,
    summary:
      "Creates a 'smoke-free generation' — anyone born on or after 1 January 2009 will never legally be sold tobacco. Tightens vape advertising, flavours, and disposable vape rules.",
    whoAffected: ["Anyone born 2009 onwards", "Retailers", "Vape industry", "Public health authorities"],
    keyNumbers: [
      { label: "People affected by lifetime smoking ban", value: "~3.5M (cohort to date)" },
      { label: "UK vapers", value: "~5.6 million" },
      { label: "Annual smoking deaths", value: "~80,000" }
    ]
  },
  {
    slug: "data-use-and-access-bill",
    shortTitle: "Data (Use and Access) Bill",
    fullTitle: "Data (Use and Access) Bill 2024-25",
    icon: "cabinet",
    status: "Lords · Report stage",
    stageDetail: "Reform of UK data protection and creation of smart-data schemes.",
    sponsoringDept: "Department for Science, Innovation and Technology",
    introducedDate: "23 October 2024",
    territorialExtent: ["UK-wide"],
    isStub: true,
    summary:
      "Reforms UK GDPR around automated decisions, scientific research, and 'legitimate interests'. Creates statutory framework for 'smart data' schemes (banking, energy, telecoms) and digital verification services.",
    whoAffected: ["Everyone (data subjects)", "Businesses processing personal data", "Public services", "Tech sector"],
    keyNumbers: [
      { label: "UK adults online", value: "~95% (ONS)" },
      { label: "Smart-data sectors enabled", value: "7 (initial scope)" },
      { label: "Adequacy at risk if too divergent", value: "EU data flows worth ~£103bn" }
    ]
  },
  {
    slug: "crime-and-policing-bill",
    shortTitle: "Crime and Policing Bill",
    fullTitle: "Crime and Policing Bill 2024-25",
    icon: "shield",
    status: "Commons · Committee stage",
    stageDetail: "Anti-social behaviour, knife crime, retail theft, and stalking provisions.",
    sponsoringDept: "Home Office",
    introducedDate: "25 February 2025",
    territorialExtent: ["England", "Wales"],
    isStub: true,
    summary:
      "New 'Respect Orders' against persistent anti-social behaviour, ends the £200 shop-theft threshold that police largely ignored, expands stalking-protection orders, and tightens online weapon sales.",
    whoAffected: ["Victims of anti-social behaviour", "Retailers", "Police forces", "Courts"],
    keyNumbers: [
      { label: "Annual shop-theft offences", value: "~16.7m (BRC, 2024)" },
      { label: "Stalking cases recorded (2023)", value: "~120,000" },
      { label: "Police forces affected", value: "43 (England & Wales)" }
    ]
  }
];

export function billBySlug(slug: string): Bill | undefined {
  return BILLS.find(b => b.slug === slug);
}
