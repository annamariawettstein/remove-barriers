export type CrossCheckCard = {
  category: string;
  title: string;
  description: string;
  url: string;
  source: string;
};

type SubjectPack = {
  aliases: string[];
  cards: CrossCheckCard[];
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const SUBJECT_PACKS: SubjectPack[] = [
  {
    aliases: ["shell", "shell plc", "royal dutch shell"],
    cards: [
      {
        category: "Company register",
        title: "Companies House",
        description: "Registered entity, filings, exemptions, and the legal UK company record.",
        url: "https://find-and-update.company-information.service.gov.uk/company/04366849",
        source: "GOV.UK"
      },
      {
        category: "Control",
        title: "PSC register",
        description: "Use this to check whether control is dispersed or concentrated through a reportable controller.",
        url: "https://find-and-update.company-information.service.gov.uk/company/04366849/persons-with-significant-control",
        source: "GOV.UK"
      },
      {
        category: "Board & officers",
        title: "Directors and officers",
        description: "Check who formally sits on the UK board and who holds company secretary roles.",
        url: "https://find-and-update.company-information.service.gov.uk/company/04366849/officers",
        source: "GOV.UK"
      },
      {
        category: "Investor reporting",
        title: "Annual report",
        description: "Public strategy, risk, production, governance, and remuneration disclosures in one place.",
        url: "https://www.shell.com/investors/results-and-reporting/annual-report.html",
        source: "Shell"
      },
      {
        category: "Government payments",
        title: "Payments to governments",
        description: "Where Shell discloses taxes, royalties, and similar extractive-sector payments by country and project.",
        url: "https://www.shell.com/sustainability/our-approach/tax-transparency/payments-to-governments.html",
        source: "Shell"
      }
    ]
  },
  {
    aliases: ["bp", "bp plc", "bp p l c", "bp p.l.c."],
    cards: [
      {
        category: "Company register",
        title: "Companies House",
        description: "Registered entity, filings, and the base legal record for the listed UK parent.",
        url: "https://find-and-update.company-information.service.gov.uk/company/00102498",
        source: "GOV.UK"
      },
      {
        category: "Control",
        title: "PSC register",
        description: "Shows the listed-company exemption and whether BP reports a registrable controller.",
        url: "https://find-and-update.company-information.service.gov.uk/company/00102498/persons-with-significant-control",
        source: "GOV.UK"
      },
      {
        category: "Board & officers",
        title: "Directors and officers",
        description: "Formal board appointments, resignations, and secretary roles on the UK company record.",
        url: "https://find-and-update.company-information.service.gov.uk/company/00102498/officers",
        source: "GOV.UK"
      },
      {
        category: "Investor reporting",
        title: "Annual report",
        description: "Use this for production, capital allocation, climate positioning, and pay disclosures.",
        url: "https://www.bp.com/en/global/corporate/investors/annual-report.html",
        source: "bp"
      },
      {
        category: "Government payments",
        title: "Payments to governments report",
        description: "Project-level and country-level extractive-sector payments disclosed under reporting rules.",
        url: "https://www.bp.com/content/dam/bp/business-sites/en/global/corporate/pdfs/sustainability/group-reports/bp-report-on-payments-to-governments-2024.pdf",
        source: "bp"
      }
    ]
  },
  {
    aliases: ["glencore", "glencore energy uk", "glencore energy uk ltd", "glencore plc"],
    cards: [
      {
        category: "Company register",
        title: "Glencore Energy UK Ltd",
        description: "UK legal entity record, filing history, and company status for the trading arm.",
        url: "https://find-and-update.company-information.service.gov.uk/company/04542769",
        source: "GOV.UK"
      },
      {
        category: "Control",
        title: "PSC register",
        description: "Check who legally controls the UK entity and whether that control is direct or upstream.",
        url: "https://find-and-update.company-information.service.gov.uk/company/04542769/persons-with-significant-control",
        source: "GOV.UK"
      },
      {
        category: "Board & officers",
        title: "Directors and officers",
        description: "Formal list of current officers connected to the UK company.",
        url: "https://find-and-update.company-information.service.gov.uk/company/04542769/officers",
        source: "GOV.UK"
      },
      {
        category: "Investor reporting",
        title: "Publications",
        description: "Annual report, sustainability reporting, and other filings published by the group.",
        url: "https://www.glencore.com/en/publications",
        source: "Glencore"
      },
      {
        category: "Government payments",
        title: "Payments to governments report",
        description: "Country and project payment disclosures that are especially useful for extractive-sector scrutiny.",
        url: "https://www.glencore.com/.rest/api/v1/documents/static/14111fd1-4953-4978-976b-6ad591be9497/GLEN-2024-Payments-to-Governments-Report.pdf",
        source: "Glencore"
      },
      {
        category: "Transparency",
        title: "Tax and transparency hub",
        description: "Glencore's own disclosure page covering fiscal transparency and related reporting.",
        url: "https://www.glencore.com/who-we-are/transparency",
        source: "Glencore"
      }
    ]
  },
  {
    aliases: ["harbour energy", "harbour energy plc", "harbour"],
    cards: [
      {
        category: "Company register",
        title: "Companies House",
        description: "The legal company record, filing history, and charges for Harbour Energy plc.",
        url: "https://find-and-update.company-information.service.gov.uk/company/SC234781",
        source: "GOV.UK"
      },
      {
        category: "Board & officers",
        title: "Directors and officers",
        description: "Use this to check current officers and formal appointments on the UK record.",
        url: "https://find-and-update.company-information.service.gov.uk/company/SC234781/officers",
        source: "GOV.UK"
      },
      {
        category: "Investor reporting",
        title: "Annual report 2025",
        description: "Production, tax, public policy, and shareholder return disclosures in the latest annual report.",
        url: "https://www.harbourenergy.com/media/a11hxbdn/harbour-energy-annual-report-accounts-2025_web.pdf",
        source: "Harbour Energy"
      },
      {
        category: "Government payments",
        title: "Annual report 2024",
        description: "Includes the payments-to-governments reporting section and related tax disclosures.",
        url: "https://www.harbourenergy.com/media/0lslwqop/harbour-energy-annual-report-and-accounts-2024.pdf",
        source: "Harbour Energy"
      },
      {
        category: "Results",
        title: "Full-year results",
        description: "A shorter route into current production, cash flow, tax effects, and portfolio changes.",
        url: "https://www.harbourenergy.com/news-and-media/full-year-results-2025/",
        source: "Harbour Energy"
      }
    ]
  },
  {
    aliases: ["totalenergies", "total energies", "totalenergies se", "total"],
    cards: [
      {
        category: "Investor reporting",
        title: "Annual financial reports",
        description: "Annual reports, registration documents, and the main investor disclosure archive.",
        url: "https://totalenergies.com/investors/publications-and-regulated-information/regulated-information/annual-financial-reports",
        source: "TotalEnergies"
      },
      {
        category: "Government payments",
        title: "Payments to governments",
        description: "Direct route into project- and country-level payment disclosures under French and EU rules.",
        url: "https://totalenergies.com/investors/publications-and-regulated-information/regulated-information/report-payments-governments",
        source: "TotalEnergies"
      },
      {
        category: "Tax & ethics",
        title: "Business ethics and tax approach",
        description: "Useful for checking what the company says publicly about tax governance and responsible conduct.",
        url: "https://totalenergies.com/sustainability/creating-shared-value/business-ethics",
        source: "TotalEnergies"
      }
    ]
  }
];

export function getCrossCheckCards(subjectName: string) {
  const key = normalize(subjectName);
  const pack = SUBJECT_PACKS.find((entry) => entry.aliases.some((alias) => normalize(alias) === key));
  return pack?.cards ?? [];
}
