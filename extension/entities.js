// Expose core utility demo dataset.
// Figures and summaries are illustrative, but every item is shaped around a
// source-linked evidence model so the UI can stay factual and transparent.

window.EXPOSE_ENTITIES = [
  {
    id: "p_keir_starmer",
    type: "politician",
    name: "Keir Starmer",
    aliases: ["Sir Keir Starmer", "Keir Starmer MP"],
    badge: "LAB · Holborn and St Pancras",
    role: "Prime Minister",
    teaser: "Funding, votes, committees, quotes, and relationship context in one place.",
    summaryMetrics: [
      {
        label: "Top donor sector",
        value: "Finance & business",
        source: "Electoral Commission",
        url: "https://www.electoralcommission.org.uk/",
        confidence: "high"
      },
      {
        label: "Committee influence",
        value: "Cabinet-level agenda control",
        source: "UK Parliament",
        url: "https://members.parliament.uk/",
        confidence: "high"
      },
      {
        label: "Rhetoric gap flags",
        value: "2 surfaced",
        source: "Hansard / division records",
        url: "https://hansard.parliament.uk/",
        confidence: "medium"
      }
    ],
    sections: [
      {
        id: "rhetoric-gap",
        title: "Voting record vs rhetoric gap",
        tone: "flag",
        items: [
          {
            label: "Border enforcement rhetoric vs detention votes",
            value: "Flagged for review",
            detail: "Public language emphasises reform and accountability; the dossier links division records where civil-liberties groups argued the voting pattern cut the other way.",
            source: "Hansard / Public Whip",
            url: "https://www.publicwhip.org.uk/",
            confidence: "medium"
          },
          {
            label: "Lobbying transparency stance vs party donor mix",
            value: "Mixed signal",
            detail: "No direct contradiction claim is made; the extension highlights this because the stated anti-lobbying posture sits next to a donor base concentrated in sectors with high lobbying spend.",
            source: "Electoral Commission",
            url: "https://www.electoralcommission.org.uk/",
            confidence: "medium"
          }
        ]
      },
      {
        id: "donor-fingerprint",
        title: "Donor fingerprint",
        items: [
          {
            label: "Sector concentration",
            value: "Finance, property, consulting",
            detail: "The score is based on declared donations grouped by SIC-style sector buckets.",
            source: "Electoral Commission",
            url: "https://www.electoralcommission.org.uk/",
            confidence: "high"
          },
          {
            label: "Largest named donor",
            value: "Waheed Alli",
            detail: "Shown here as a direct declared donor, not inferred through intermediary networks.",
            source: "Electoral Commission",
            url: "https://www.electoralcommission.org.uk/",
            confidence: "high"
          }
        ]
      },
      {
        id: "quote-history",
        title: "Quote history",
        items: [
          {
            label: "Institutional reform",
            value: "Older quote linked against current policy language",
            detail: "The extension stores dated quotes so users can compare current messaging to earlier stated principles without leaving the page.",
            source: "BBC / campaign archive",
            url: "https://www.bbc.co.uk/",
            confidence: "medium"
          }
        ]
      },
      {
        id: "committees",
        title: "Committee memberships and influence",
        items: [
          {
            label: "Cabinet and legislative pipeline",
            value: "High influence",
            detail: "Committee and executive roles are used as routing context for later relationship scoring.",
            source: "UK Parliament",
            url: "https://members.parliament.uk/",
            confidence: "high"
          }
        ]
      }
    ],
    relationships: [
      {
        title: "Shared donor network with business lobbying circles",
        target: "Business donors and advisers",
        detail: "The relationship score is based on direct declared donations and repeat appearances in advisory or hospitality records.",
        confidence: "medium",
        sources: [
          {
            label: "Electoral Commission",
            url: "https://www.electoralcommission.org.uk/"
          },
          {
            label: "Register of Members' Interests",
            url: "https://www.parliament.uk/business/publications/commons/register-of-members-financial-interests/"
          }
        ]
      }
    ]
  },
  {
    id: "p_nigel_farage",
    type: "politician",
    name: "Nigel Farage",
    aliases: ["Nigel Farage MP"],
    badge: "REFORM · Clacton",
    role: "MP, Reform UK leader",
    teaser: "High-signal example for donor concentration, media crossover, and outside earnings.",
    summaryMetrics: [
      {
        label: "Outside earnings",
        value: "Large media-linked income",
        source: "Register of Members' Interests",
        url: "https://www.parliament.uk/business/publications/commons/register-of-members-financial-interests/",
        confidence: "high"
      },
      {
        label: "Top donor concentration",
        value: "High",
        source: "Electoral Commission",
        url: "https://www.electoralcommission.org.uk/",
        confidence: "high"
      },
      {
        label: "Media adjacency",
        value: "Repeated broadcaster platform overlap",
        source: "Ofcom / broadcaster archives",
        url: "https://www.ofcom.org.uk/",
        confidence: "medium"
      }
    ],
    sections: [
      {
        id: "donor-fingerprint",
        title: "Donor fingerprint",
        items: [
          {
            label: "Dominant named donor",
            value: "Christopher Harborne",
            detail: "Marked as direct support where declared; related-entity links are separated and scored lower.",
            source: "Electoral Commission",
            url: "https://www.electoralcommission.org.uk/",
            confidence: "high"
          }
        ]
      },
      {
        id: "revolving-door",
        title: "Revolving door and private-sector roles",
        items: [
          {
            label: "Broadcasting and paid media roles",
            value: "Present",
            detail: "Outside earnings are displayed as a separate layer from donations so users can distinguish editorial visibility from direct funding.",
            source: "Register of Members' Interests",
            url: "https://www.parliament.uk/business/publications/commons/register-of-members-financial-interests/",
            confidence: "high"
          }
        ]
      },
      {
        id: "attendance",
        title: "Attendance and abstention",
        items: [
          {
            label: "Participation profile",
            value: "Track over time",
            detail: "The extension is structured to ingest division-participation feeds and surface missed votes next to issue rhetoric.",
            source: "TheyWorkForYou",
            url: "https://www.theyworkforyou.com/",
            confidence: "medium"
          }
        ]
      }
    ],
    relationships: [
      {
        title: "Media platform overlap",
        target: "GB News and aligned commentators",
        detail: "This is presented as platform adjacency, not evidence of editorial coordination.",
        confidence: "medium",
        sources: [
          {
            label: "Ofcom",
            url: "https://www.ofcom.org.uk/"
          },
          {
            label: "Register of Members' Interests",
            url: "https://www.parliament.uk/business/publications/commons/register-of-members-financial-interests/"
          }
        ]
      }
    ]
  },
  {
    id: "c_serco",
    type: "company",
    name: "Serco",
    aliases: ["Serco Group", "Serco Group plc"],
    badge: "Company · outsourcing / public services",
    role: "Government contractor",
    teaser: "Useful test case for contracts, lobbying, and committee overlap.",
    summaryMetrics: [
      {
        label: "Government contract exposure",
        value: "High",
        source: "Contracts Finder",
        url: "https://www.contractsfinder.service.gov.uk/",
        confidence: "high"
      },
      {
        label: "Lobbying footprint",
        value: "Declared activity present",
        source: "Register of Consultant Lobbyists",
        url: "https://registerofconsultantlobbyists.force.com/",
        confidence: "medium"
      }
    ],
    sections: [
      {
        id: "ownership",
        title: "Ownership and beneficiaries",
        items: [
          {
            label: "Listed company structure",
            value: "Public-company ownership",
            detail: "Ultimate control is dispersed across shareholders, so the extension focuses on beneficial ownership disclosures and board influence rather than implying a single beneficiary.",
            source: "Companies House",
            url: "https://find-and-update.company-information.service.gov.uk/",
            confidence: "high"
          }
        ]
      },
      {
        id: "lobbying",
        title: "PR and lobbying",
        items: [
          {
            label: "Consultant-lobbying visibility",
            value: "Traceable",
            detail: "This section is designed to connect firms, clients, and policy moments when the evidence is direct.",
            source: "Register of Consultant Lobbyists",
            url: "https://registerofconsultantlobbyists.force.com/",
            confidence: "medium"
          }
        ]
      }
    ],
    relationships: [
      {
        title: "Committee-contract overlap",
        target: "Home affairs and justice policy areas",
        detail: "The connection is scored from committee remit plus contract footprint, then clearly labelled as indirect unless a direct donor or board link exists.",
        confidence: "low",
        sources: [
          {
            label: "Contracts Finder",
            url: "https://www.contractsfinder.service.gov.uk/"
          },
          {
            label: "UK Parliament",
            url: "https://members.parliament.uk/"
          }
        ]
      }
    ]
  },
  {
    id: "m_guardian",
    type: "media",
    name: "The Guardian",
    aliases: ["Guardian", "Guardian Media Group"],
    badge: "Media · trust-owned",
    role: "News outlet",
    teaser: "Media ownership and governance context without telling the user what to think of the coverage.",
    summaryMetrics: [
      {
        label: "Ownership model",
        value: "Scott Trust structure",
        source: "Companies House / company filings",
        url: "https://find-and-update.company-information.service.gov.uk/",
        confidence: "high"
      },
      {
        label: "Editorial influence risk",
        value: "Governance layer surfaced",
        source: "Company filings",
        url: "https://find-and-update.company-information.service.gov.uk/",
        confidence: "medium"
      }
    ],
    sections: [
      {
        id: "ownership",
        title: "Ownership web",
        items: [
          {
            label: "Ultimate control",
            value: "Scott Trust Limited",
            detail: "The extension surfaces the ownership chain up to the controlling trust or holding vehicle where public records allow it.",
            source: "Companies House",
            url: "https://find-and-update.company-information.service.gov.uk/",
            confidence: "high"
          }
        ]
      },
      {
        id: "board-overlap",
        title: "Board overlap",
        items: [
          {
            label: "Trust and board cross-links",
            value: "Trackable through filings",
            detail: "Shared directors are shown as direct overlaps; sector or school ties are marked separately and scored lower.",
            source: "Companies House",
            url: "https://find-and-update.company-information.service.gov.uk/",
            confidence: "high"
          }
        ]
      }
    ],
    relationships: [
      {
        title: "Media ownership context",
        target: "Scott Trust and group governance",
        detail: "The relationship is structural ownership, not a judgement on any given article.",
        confidence: "high",
        sources: [
          {
            label: "Companies House",
            url: "https://find-and-update.company-information.service.gov.uk/"
          }
        ]
      }
    ]
  },
  {
    id: "tt_ifa",
    type: "think_tank",
    name: "Institute of Economic Affairs",
    aliases: ["IEA", "Institute of Economic Affairs (IEA)"],
    badge: "Think tank · policy network",
    role: "Policy and advocacy organisation",
    teaser: "Useful for tracing think tank to policy language pipelines and donor adjacency.",
    summaryMetrics: [
      {
        label: "Policy influence",
        value: "Indirect but recurring",
        source: "Published reports / speeches",
        url: "https://iea.org.uk/",
        confidence: "medium"
      },
      {
        label: "Funding transparency",
        value: "Partial",
        source: "Organisation disclosures",
        url: "https://iea.org.uk/",
        confidence: "low"
      }
    ],
    sections: [
      {
        id: "policy-pipeline",
        title: "Think tank to policy pipeline",
        items: [
          {
            label: "Language reuse detection",
            value: "Pattern match candidate",
            detail: "This section is designed for side-by-side policy language matching between reports, speeches, and legislation.",
            source: "Think tank reports / Hansard",
            url: "https://hansard.parliament.uk/",
            confidence: "low"
          }
        ]
      }
    ],
    relationships: [
      {
        title: "Shared donor and adviser ecosystem",
        target: "Politicians, commentators, media platforms",
        detail: "The system distinguishes direct governance ties from looser network overlap.",
        confidence: "low",
        sources: [
          {
            label: "Organisation disclosures",
            url: "https://iea.org.uk/"
          }
        ]
      }
    ]
  }
];
