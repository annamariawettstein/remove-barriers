// Expose seeded public-data MVP dataset.
// Refreshed from public sources in May 2026. This is still a curated local
// dataset, not a live backend, but the facts below are anchored to source links
// that fit the extension's evidence model.

(function () {
  const SOURCES = {
    govPm: {
      label: "GOV.UK Prime Minister profile",
      url: "https://www.gov.uk/government/people/keir-starmer"
    },
    govReeves: {
      label: "GOV.UK Chancellor profile",
      url: "https://www.gov.uk/government/people/rachel-reeves"
    },
    parliamentCabinet: {
      label: "UK Parliament Cabinet list",
      url: "https://members.parliament.uk/Government/Cabinet%20"
    },
    parliamentOpposition: {
      label: "UK Parliament opposition frontbench",
      url: "https://members.parliament.uk/Opposition/Cabinet"
    },
    parliamentDavey: {
      label: "UK Parliament Ed Davey profile",
      url: "https://members.parliament.uk/member/188/career"
    },
    parliamentFarage: {
      label: "UK Parliament Nigel Farage search result",
      url: "https://members.parliament.uk/members/commons?ForParliament=0&Gender=Any&PartyId=&SearchText=CO130FL&ShowAdvanced=False"
    },
    parliamentInterests: {
      label: "Register of Members' Financial Interests",
      url: "https://www.parliament.uk/business/publications/commons/register-of-members-financial-interests/"
    },
    ecQ42025: {
      label: "Electoral Commission Q4 2025 donations release",
      url: "https://www.electoralcommission.org.uk/media-centre/political-parties-accept-almost-ps65m-donations-2025"
    },
    ecAccounts2024: {
      label: "Electoral Commission 2024 party accounts release",
      url: "https://www.electoralcommission.org.uk/media-centre/uk-political-parties-financial-accounts-published-0"
    },
    ecAccounts2023: {
      label: "Electoral Commission 2023 party accounts release",
      url: "https://www.electoralcommission.org.uk/media-centre/uk-political-parties-financial-accounts-published"
    },
    ecDonations: {
      label: "Electoral Commission donations and loans guidance",
      url: "https://www.electoralcommission.org.uk/political-registration-and-regulation/financial-reporting/donations-and-loans"
    },
    ifsCharity: {
      label: "Charity Commission: Institute for Fiscal Studies",
      url: "https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/258815"
    },
    ipprReports: {
      label: "IPPR annual reports",
      url: "https://www.ippr.org/who-we-are/how-we-are-funded/annual-reports"
    },
    ieaCharity: {
      label: "Charity Commission: Institute of Economic Affairs",
      url: "https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/235351"
    },
    policyExchangeAbout: {
      label: "Policy Exchange about page",
      url: "https://policyexchange.org.uk/about/"
    },
    policyExchangeCharity: {
      label: "Charity Commission: Policy Exchange",
      url: "https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/3993017"
    },
    resolutionAnnual: {
      label: "Resolution Foundation annual report 2023/24",
      url: "https://www.resolutionfoundation.org/app/uploads/2025/07/Resolution-Annual-Report-23-24.pdf"
    },
    resolutionAbout: {
      label: "Resolution Foundation annual reports",
      url: "https://www.resolutionfoundation.org/about-us/annual-reports/"
    },
    chSerco: {
      label: "Companies House: Serco Group plc",
      url: "https://find-and-update.company-information.service.gov.uk/company/02048608"
    },
    chSercoPsc: {
      label: "Companies House PSC register: Serco Group plc",
      url: "https://find-and-update.company-information.service.gov.uk/company/02048608/persons-with-significant-control"
    },
    sercoResults2024: {
      label: "Serco full-year results 2024",
      url: "https://www.serco.com/media-and-news/2025/serco-group-plc-full-year-results-2024"
    },
    chBt: {
      label: "Companies House: BT Group plc",
      url: "https://find-and-update.company-information.service.gov.uk/company/04190816"
    },
    chBtPsc: {
      label: "Companies House PSC register: BT Group plc",
      url: "https://find-and-update.company-information.service.gov.uk/company/04190816/persons-with-significant-control"
    },
    btAnnual2025: {
      label: "BT annual report 2025",
      url: "https://www.bt.com/about/investors/financial-reporting-and-news/annual-reports"
    },
    chShell: {
      label: "Companies House: Shell plc",
      url: "https://find-and-update.company-information.service.gov.uk/company/04366849"
    },
    chShellPsc: {
      label: "Companies House PSC register: Shell plc",
      url: "https://find-and-update.company-information.service.gov.uk/company/04366849/persons-with-significant-control"
    },
    shellAnnual: {
      label: "Shell annual reporting hub",
      url: "https://www.shell.com/investors/results-and-reporting/annual-report.html"
    },
    shellPayments: {
      label: "Shell payments to governments reports",
      url: "https://www.shell.com/sustainability/our-approach/tax-transparency/payments-to-governments.html"
    },
    jlpOwnership: {
      label: "John Lewis Partnership employee ownership",
      url: "https://www.johnlewispartnership.co.uk/work/employee-ownership.html"
    },
    jlpAbout: {
      label: "John Lewis Partnership: who we are",
      url: "https://www.johnlewispartnership.co.uk/about/who-we-are.html"
    },
    jlpResults2025: {
      label: "John Lewis Partnership full-year results 2024/25",
      url: "https://www.johnlewispartnership.co.uk/media-centre/latest-news/2025/22218"
    },
    guardianTrust: {
      label: "The Scott Trust: governance and financial reports",
      url: "https://www.theguardian.com/info/2025/sep/11/the-scott-trust-corporate-governance-and-financial-reports"
    },
    chAssociated: {
      label: "Companies House: Associated Newspapers Limited",
      url: "https://find-and-update.company-information.service.gov.uk/company/00084121"
    },
    dmgtConsumer: {
      label: "DMGT consumer media business",
      url: "https://www.dmgt.com/businesses/consumer/"
    }
  };

  function metric(label, value, sourceKey, confidence) {
    return {
      label,
      value,
      source: SOURCES[sourceKey].label,
      url: SOURCES[sourceKey].url,
      confidence
    };
  }

  function item(label, value, detail, sourceKey, confidence) {
    return {
      label,
      value,
      detail,
      source: SOURCES[sourceKey].label,
      url: SOURCES[sourceKey].url,
      confidence
    };
  }

  function relSource(sourceKey) {
    return {
      label: SOURCES[sourceKey].label,
      url: SOURCES[sourceKey].url
    };
  }

  window.EXPOSE_ENTITIES = [
    {
      id: "p_keir_starmer",
      type: "politician",
      name: "Keir Starmer",
      aliases: ["Sir Keir Starmer", "Keir Starmer MP", "Prime Minister Keir Starmer", "Starmer"],
      badge: "LAB · Holborn and St Pancras",
      role: "Prime Minister",
      teaser: "Current office, constituency and Labour funding context from official public records.",
      summaryMetrics: [
        metric("Current office", "Prime Minister", "govPm", "high"),
        metric("Labour donations accepted", "GBP 1.98m in Q4 2025", "ecQ42025", "high"),
        metric("Latest party accounts published", "Labour missing from 2024 release", "ecAccounts2024", "high")
      ],
      sections: [
        {
          id: "office",
          title: "Office and parliamentary status",
          items: [
            item(
              "Executive role",
              "Heads the government and Cabinet",
              "The extension can use this as a high-signal routing hint when a page mentions government policy, Cabinet decisions, or No. 10.",
              "govPm",
              "high"
            ),
            item(
              "Parliamentary context",
              "Cabinet and Labour leadership",
              "Useful for distinguishing party leadership context from constituency-level MP context.",
              "parliamentCabinet",
              "high"
            )
          ]
        },
        {
          id: "party-funding",
          title: "Party funding context",
          tone: "flag",
          items: [
            item(
              "Labour 2025 donation flow",
              "GBP 1.98m accepted in Q4 2025",
              "This is party-level funding, not personal funding. It is the nearest public signal the extension currently has for the funding environment around Starmer's party leadership.",
              "ecQ42025",
              "high"
            ),
            item(
              "Accounts publication status",
              "2024 accounts release omitted Labour",
              "The Electoral Commission's 2024 release listed nine parties and noted that Labour had not yet submitted its accounts in time for publication.",
              "ecAccounts2024",
              "high"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Leader of a party with large declared donations",
          target: "Labour Party funding disclosures",
          detail: "This is a direct relationship to party-level disclosures filed with the Electoral Commission, not an inference about personal donor control.",
          confidence: "high",
          sources: [relSource("ecQ42025"), relSource("ecDonations")]
        }
      ]
    },
    {
      id: "p_rachel_reeves",
      type: "politician",
      name: "Rachel Reeves",
      aliases: ["Rachel Reeves MP", "Chancellor Rachel Reeves", "Reeves"],
      badge: "LAB · Leeds West and Pudsey",
      role: "Chancellor of the Exchequer",
      teaser: "Treasury leadership plus Labour funding context for pages about budgets, tax and markets.",
      summaryMetrics: [
        metric("Current office", "Chancellor", "govReeves", "high"),
        metric("Cabinet status", "Member of Cabinet", "parliamentCabinet", "high"),
        metric("Labour donations accepted", "GBP 1.98m in Q4 2025", "ecQ42025", "high")
      ],
      sections: [
        {
          id: "treasury",
          title: "Treasury context",
          items: [
            item(
              "Current remit",
              "Leads HM Treasury",
              "Pages about budgets, growth strategy, tax, or financial regulation are likely to have direct relevance to this office.",
              "govReeves",
              "high"
            )
          ]
        },
        {
          id: "party-funding",
          title: "Party funding context",
          items: [
            item(
              "Labour party funding environment",
              "GBP 1.98m accepted in Q4 2025",
              "Presented here because Reeves speaks for the government on fiscal policy while leading figures operate within the same party donation environment.",
              "ecQ42025",
              "high"
            ),
            item(
              "2024 publication status",
              "Labour accounts not in the 2024 Commission release",
              "Useful context for pages about transparency, compliance or donor disclosure timing.",
              "ecAccounts2024",
              "high"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Treasury office to party finance environment",
          target: "Labour Party disclosures",
          detail: "The extension keeps office, policy and party-funding layers separate. This link is structural and party-level rather than personal.",
          confidence: "high",
          sources: [relSource("govReeves"), relSource("ecQ42025")]
        }
      ]
    },
    {
      id: "p_kemi_badenoch",
      type: "politician",
      name: "Kemi Badenoch",
      aliases: ["Kemi Badenoch MP", "Badenoch"],
      badge: "CON · North West Essex",
      role: "Leader of the Opposition",
      teaser: "Opposition leadership context with current Conservative funding and published accounts.",
      summaryMetrics: [
        metric("Current office", "Leader of the Opposition", "parliamentOpposition", "high"),
        metric("Conservative donations accepted", "GBP 4.02m in Q4 2025", "ecQ42025", "high"),
        metric("Conservative income", "GBP 50.17m in 2024", "ecAccounts2024", "high")
      ],
      sections: [
        {
          id: "office",
          title: "Opposition frontbench role",
          items: [
            item(
              "Parliamentary role",
              "Leads the official opposition frontbench",
              "Useful on pages about shadow policy, parliamentary scrutiny and leadership messaging.",
              "parliamentOpposition",
              "high"
            )
          ]
        },
        {
          id: "party-funding",
          title: "Party funding context",
          items: [
            item(
              "Conservative 2025 donation flow",
              "GBP 4.02m accepted in Q4 2025",
              "This is the highest-significance current public donation snapshot available in the curated MVP.",
              "ecQ42025",
              "high"
            ),
            item(
              "Published accounts",
              "Income GBP 50.17m, spending GBP 49.23m in 2024",
              "The Electoral Commission's 2024 release gives the party's latest published annual totals.",
              "ecAccounts2024",
              "high"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Leader of a party with major declared donations",
          target: "Conservative Party funding disclosures",
          detail: "A direct link to declared party filings. The extension does not treat party funding as a proxy for personal donations unless a separate record exists.",
          confidence: "high",
          sources: [relSource("ecQ42025"), relSource("ecAccounts2024")]
        }
      ]
    },
    {
      id: "p_nigel_farage",
      type: "politician",
      name: "Nigel Farage",
      aliases: ["Nigel Farage MP", "Farage"],
      badge: "REFORM · Clacton",
      role: "MP and Reform UK leader",
      teaser: "Useful on pages about insurgent-party funding, media profile and outside interests.",
      summaryMetrics: [
        metric("Current office", "MP for Clacton", "parliamentFarage", "high"),
        metric("Reform donations accepted", "GBP 5.46m in Q4 2025", "ecQ42025", "high"),
        metric("Reform income", "GBP 10.83m in 2024", "ecAccounts2024", "high")
      ],
      sections: [
        {
          id: "party-funding",
          title: "Party funding context",
          tone: "flag",
          items: [
            item(
              "Reform 2025 donation flow",
              "GBP 5.46m accepted in Q4 2025",
              "In the Commission's Q4 2025 release, Reform UK recorded the largest accepted donations total of the listed parties.",
              "ecQ42025",
              "high"
            ),
            item(
              "Published annual accounts",
              "Income GBP 10.83m, spending GBP 5.43m in 2024",
              "This gives the extension a concrete annual baseline for stories about Reform's growth.",
              "ecAccounts2024",
              "high"
            )
          ]
        },
        {
          id: "interests",
          title: "Personal register context",
          items: [
            item(
              "Outside interests layer",
              "See Parliamentary register",
              "The MVP uses the parliamentary register as the source of truth for outside earnings and benefits rather than reproducing figures that change over time.",
              "parliamentInterests",
              "high"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Leader of the party with the largest Q4 2025 donations total",
          target: "Reform UK declared funding",
          detail: "This is tied to the Electoral Commission's public quarterly release and helps explain why pages about Reform often carry funding context.",
          confidence: "high",
          sources: [relSource("ecQ42025"), relSource("parliamentInterests")]
        }
      ]
    },
    {
      id: "p_ed_davey",
      type: "politician",
      name: "Ed Davey",
      aliases: ["Sir Ed Davey", "Ed Davey MP", "Davey"],
      badge: "LD · Kingston and Surbiton",
      role: "Leader of the Liberal Democrats",
      teaser: "Leadership and party-funding context for Liberal Democrat pages and coalition-era references.",
      summaryMetrics: [
        metric("Current office", "Leader of the Liberal Democrats", "parliamentDavey", "high"),
        metric("Liberal Democrat donations accepted", "GBP 2.06m in Q4 2025", "ecQ42025", "high"),
        metric("Liberal Democrat income", "GBP 12.58m in 2024", "ecAccounts2024", "high")
      ],
      sections: [
        {
          id: "office",
          title: "Leadership and parliamentary role",
          items: [
            item(
              "Party role",
              "Leads the Liberal Democrats",
              "Useful on campaign, coalition or tactical-voting coverage where party leadership context matters more than constituency detail.",
              "parliamentDavey",
              "high"
            )
          ]
        },
        {
          id: "party-funding",
          title: "Party funding context",
          items: [
            item(
              "Q4 2025 donations",
              "GBP 2.06m accepted",
              "A compact funding signal for pages about campaign scale, donor support or organisational growth.",
              "ecQ42025",
              "high"
            ),
            item(
              "2024 annual accounts",
              "Income GBP 12.58m, spending GBP 12.87m",
              "The published annual accounts help show the party's smaller but still material operating scale.",
              "ecAccounts2024",
              "high"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Leader of a party with published annual accounts and current quarterly donations",
          target: "Liberal Democrat public filings",
          detail: "The extension can ground donor-scale references in Commission filings instead of vague commentary.",
          confidence: "high",
          sources: [relSource("ecQ42025"), relSource("ecAccounts2024")]
        }
      ]
    },
    {
      id: "tt_policy_exchange",
      type: "think_tank",
      name: "Policy Exchange",
      aliases: ["Policy Exchange think tank"],
      badge: "Think tank · registered charity",
      role: "Policy research organisation",
      teaser: "Useful on pages where manifesto crossover, right-of-centre policy design or donor transparency are relevant.",
      summaryMetrics: [
        metric("Charity number", "1096300", "policyExchangeCharity", "high"),
        metric("Published income", "GBP 7.71m in year to Sep 2024", "policyExchangeCharity", "high"),
        metric("Manifesto crossover", "34 papers reflected in 2024 manifestos", "policyExchangeAbout", "medium")
      ],
      sections: [
        {
          id: "scale",
          title: "Scale and reporting",
          items: [
            item(
              "Financial scale",
              "Income GBP 7.71m; spending GBP 7.57m",
              "The charity register gives a current high-level operating scale for the organisation.",
              "policyExchangeCharity",
              "high"
            )
          ]
        },
        {
          id: "policy-pipeline",
          title: "Policy-to-manifesto pipeline",
          items: [
            item(
              "Claimed policy uptake",
              "34 papers were reflected in 2024 party manifestos",
              "This comes from Policy Exchange's own about page and is useful as a self-reported influence claim rather than independent validation.",
              "policyExchangeAbout",
              "medium"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Think tank to manifesto relationship",
          target: "Conservative, Labour, Liberal Democrat and Reform manifesto language",
          detail: "This is based on Policy Exchange's own published claim about uptake of its papers, so it is labelled medium-confidence and source-attributed.",
          confidence: "medium",
          sources: [relSource("policyExchangeAbout"), relSource("policyExchangeCharity")]
        }
      ]
    },
    {
      id: "tt_ifs",
      type: "think_tank",
      name: "Institute for Fiscal Studies",
      aliases: ["IFS", "Institute for Fiscal Studies (IFS)"],
      badge: "Think tank · charity",
      role: "Economics and tax research institute",
      teaser: "High-signal for fiscal policy pages because it couples public authority with visible charitable reporting.",
      summaryMetrics: [
        metric("Charity number", "258815", "ifsCharity", "high"),
        metric("Latest income", "GBP 11.37m in 2024", "ifsCharity", "high"),
        metric("Stated independence", "Independent of government and political parties", "ifsCharity", "high")
      ],
      sections: [
        {
          id: "independence",
          title: "Independence claim",
          items: [
            item(
              "Published positioning",
              "Independent of government and political parties",
              "The organisation states this in its charity record, which is useful context when the IFS is quoted as an authority in news coverage.",
              "ifsCharity",
              "high"
            )
          ]
        },
        {
          id: "scale",
          title: "Scale and reporting",
          items: [
            item(
              "Current financial scale",
              "Total income GBP 11.37m; spending GBP 11.67m in 2024",
              "The annual return gives a concrete sense of operating scale for one of the UK's most cited fiscal think tanks.",
              "ifsCharity",
              "high"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Frequently cited on tax and budget pages",
          target: "Budget, tax and inequality coverage",
          detail: "This is not an influence claim. It is a context flag for pages where IFS analysis is often used as an external reference point.",
          confidence: "medium",
          sources: [relSource("ifsCharity"), relSource("govReeves")]
        }
      ]
    },
    {
      id: "tt_ifa",
      type: "think_tank",
      name: "Institute of Economic Affairs",
      aliases: ["IEA", "Institute of Economic Affairs (IEA)"],
      badge: "Think tank · charity",
      role: "Free-market policy institute",
      teaser: "Useful on deregulatory, tax and market-liberalisation pages because its funding and affiliations are active context questions.",
      summaryMetrics: [
        metric("Charity number", "235351", "ieaCharity", "high"),
        metric("Latest donations and legacies", "GBP 5.67m in 2024", "ieaCharity", "high"),
        metric("Funding description", "From foundations, companies and individuals", "ieaCharity", "high")
      ],
      sections: [
        {
          id: "funding",
          title: "Funding and reporting",
          items: [
            item(
              "2024 donations and legacies",
              "GBP 5.67m",
              "The charity accounts describe donation income as coming from foundations, corporate donors and individual supporters.",
              "ieaCharity",
              "high"
            ),
            item(
              "Reporting scale",
              "Spending GBP 6.19m in 2024",
              "This gives the extension a tangible sense of operating scale rather than just ideological description.",
              "ieaCharity",
              "high"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Donor transparency questions recur around the IEA",
          target: "Corporate, foundation and individual supporter mix",
          detail: "The accounts confirm broad funding categories but not a complete public donor list, which is why transparency on this entity remains an active context flag.",
          confidence: "high",
          sources: [relSource("ieaCharity")]
        }
      ]
    },
    {
      id: "tt_resolution_foundation",
      type: "think_tank",
      name: "Resolution Foundation",
      aliases: ["Resolution Foundation", "Resolution"],
      badge: "Think tank · charity and company",
      role: "Living standards and labour-market think tank",
      teaser: "Strong fit for pages about wages, housing costs, social security and middle-income living standards.",
      summaryMetrics: [
        metric("Latest income", "GBP 4.05m in 2023/24", "resolutionAnnual", "high"),
        metric("Main donor structure", "Backed by the Resolution Trust", "resolutionAnnual", "high"),
        metric("Trust origin", "Trust set up by Sir Clive Cowdery", "resolutionAnnual", "high")
      ],
      sections: [
        {
          id: "funding",
          title: "Funding structure",
          items: [
            item(
              "Core donor",
              "Resolution Trust is the main source of funds",
              "The annual report says the trust was established by Sir Clive Cowdery to fund independent research on improving living standards for low-to-middle income families.",
              "resolutionAnnual",
              "high"
            ),
            item(
              "Operating scale",
              "Incoming resources GBP 4.05m in 2023/24",
              "This is a practical size marker for understanding how large the organisation is relative to peer think tanks.",
              "resolutionAnnual",
              "high"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Trust-backed think tank",
          target: "Resolution Trust / Sir Clive Cowdery",
          detail: "This is a direct funding-structure relationship taken from the Foundation's own annual report.",
          confidence: "high",
          sources: [relSource("resolutionAnnual"), relSource("resolutionAbout")]
        }
      ]
    },
    {
      id: "tt_ippr",
      type: "think_tank",
      name: "IPPR",
      aliases: ["Institute for Public Policy Research", "IPPR North"],
      badge: "Think tank · charity and trading subsidiary",
      role: "Centre-left public policy institute",
      teaser: "Useful on pages about Labour-adjacent policy debate, regional policy and progressive economic reform.",
      summaryMetrics: [
        metric("Charity status", "Registered charity since 1988", "ipprReports", "high"),
        metric("Trading arm", "Owns IPPR Trading Limited", "ipprReports", "high"),
        metric("Latest group income", "GBP 4.46m in 2024", "ipprReports", "medium")
      ],
      sections: [
        {
          id: "structure",
          title: "Organisation structure",
          items: [
            item(
              "Corporate structure",
              "Charity with a wholly owned trading subsidiary",
              "The annual reports show the charity owning IPPR Trading Limited, which helps the extension distinguish charitable and commercial activity.",
              "ipprReports",
              "high"
            ),
            item(
              "Latest trading result",
              "Trading subsidiary profit GBP 204k in 2024",
              "Useful context for pages discussing events, publications or other revenue-generating work.",
              "ipprReports",
              "medium"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Think tank plus trading subsidiary",
          target: "IPPR Trading Limited",
          detail: "A direct structural relationship that helps users understand how the organisation mixes charitable research with trading activity.",
          confidence: "high",
          sources: [relSource("ipprReports")]
        }
      ]
    },
    {
      id: "c_john_lewis_partnership",
      type: "company",
      name: "John Lewis Partnership",
      aliases: ["John Lewis", "Waitrose", "John Lewis Partnership plc", "JLP"],
      badge: "Company · employee-owned retail group",
      role: "Owner of John Lewis and Waitrose",
      teaser: "A good ownership test case because it is neither a normal listed plc nor a private family holding company.",
      summaryMetrics: [
        metric("Ownership model", "Employee-owned business", "jlpOwnership", "high"),
        metric("Approximate owners", "About 70,000 Partners", "jlpOwnership", "high"),
        metric("Profit before tax and exceptional items", "GBP 126m in 2024/25", "jlpResults2025", "high")
      ],
      sections: [
        {
          id: "ownership",
          title: "Ownership and governance",
          items: [
            item(
              "Ownership structure",
              "Held in trust for employees known as Partners",
              "This is one of the clearest alternative ownership structures in the UK retail economy and is worth surfacing whenever John Lewis or Waitrose is mentioned.",
              "jlpOwnership",
              "high"
            ),
            item(
              "Brand structure",
              "Operates John Lewis and Waitrose",
              "The extension treats mentions of either consumer brand as part of the same ownership graph.",
              "jlpAbout",
              "high"
            )
          ]
        },
        {
          id: "scale",
          title: "Recent trading context",
          items: [
            item(
              "2024/25 result",
              "Profit before tax and exceptional items rose to GBP 126m",
              "Useful when pages discuss strategy, investment or retail resilience rather than just brand perception.",
              "jlpResults2025",
              "high"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Employee ownership relationship",
          target: "John Lewis and Waitrose staff Partners",
          detail: "A direct structural relationship. The extension should distinguish this from both dispersed public shareholders and private controlling families.",
          confidence: "high",
          sources: [relSource("jlpOwnership"), relSource("jlpAbout")]
        }
      ]
    },
    {
      id: "c_bt_group",
      type: "company",
      name: "BT Group",
      aliases: ["BT", "BT Group plc", "Openreach"],
      badge: "Company · listed telecoms group",
      role: "Telecoms and network infrastructure company",
      teaser: "Useful on pages where ownership, network control and regulated infrastructure intersect.",
      summaryMetrics: [
        metric("Company type", "Public limited company", "chBt", "high"),
        metric("Revenue", "GBP 20.4bn in year to March 2025", "btAnnual2025", "high"),
        metric("PSC status", "No PSC record because listed shares are admitted to trading", "chBtPsc", "high")
      ],
      sections: [
        {
          id: "ownership",
          title: "Ownership structure",
          items: [
            item(
              "Control model",
              "Listed company with market-traded ownership",
              "The PSC register states the company is exempt because voting shares are admitted to trading on a regulated market.",
              "chBtPsc",
              "high"
            ),
            item(
              "Internal shareholding",
              "BT employee share ownership trust held 176.8m shares in 2025",
              "This does not imply control, but it is a meaningful ownership detail that can matter on executive pay or governance pages.",
              "btAnnual2025",
              "medium"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Infrastructure company with public-market ownership",
          target: "Shareholders plus Openreach operating footprint",
          detail: "This is a structural context link, not a claim about any one shareholder controlling the company.",
          confidence: "high",
          sources: [relSource("chBt"), relSource("chBtPsc"), relSource("btAnnual2025")]
        }
      ]
    },
    {
      id: "c_serco",
      type: "company",
      name: "Serco",
      aliases: ["Serco Group", "Serco Group plc"],
      badge: "Company · listed outsourcing contractor",
      role: "Government contractor",
      teaser: "Good test case for procurement, public contracts and listed-company ownership.",
      summaryMetrics: [
        metric("Company type", "Public limited company", "chSerco", "high"),
        metric("Revenue", "GBP 4.8bn in 2024", "sercoResults2024", "high"),
        metric("PSC status", "No PSC record because shares trade on the LSE", "chSercoPsc", "high")
      ],
      sections: [
        {
          id: "ownership",
          title: "Ownership structure",
          items: [
            item(
              "Control model",
              "Listed-company ownership, no single PSC disclosed",
              "The PSC register marks Serco as exempt because voting shares are admitted to trading on a regulated market.",
              "chSercoPsc",
              "high"
            )
          ]
        },
        {
          id: "contracts",
          title: "Scale of operations",
          items: [
            item(
              "2024 operating scale",
              "Revenue GBP 4.8bn; order book GBP 13.3bn",
              "This gives procurement stories a factual size baseline instead of relying on generic references to outsourcing.",
              "sercoResults2024",
              "high"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Public contractor with listed-company ownership",
          target: "Government procurement and public-market shareholders",
          detail: "The extension can use this as a bridge between contract stories and ownership structure without implying a hidden controller.",
          confidence: "high",
          sources: [relSource("chSerco"), relSource("sercoResults2024")]
        }
      ]
    },
    {
      id: "c_shell",
      type: "company",
      name: "Shell",
      aliases: ["Shell plc", "Royal Dutch Shell"],
      badge: "Company · listed energy major",
      role: "Oil and gas company",
      teaser: "Useful on pages about energy, tax, extraction and multinational ownership.",
      summaryMetrics: [
        metric("Company type", "Public limited company", "chShell", "high"),
        metric("PSC status", "No PSC record because shares trade on regulated markets", "chShellPsc", "high"),
        metric("Transparency layer", "Publishes annual payments-to-governments reports", "shellPayments", "high")
      ],
      sections: [
        {
          id: "ownership",
          title: "Ownership structure",
          items: [
            item(
              "Control model",
              "Dispersed public ownership rather than a named PSC",
              "The Companies House PSC register states Shell is exempt because voting shares are admitted to trading on regulated markets.",
              "chShellPsc",
              "high"
            )
          ]
        },
        {
          id: "transparency",
          title: "Disclosure footprint",
          items: [
            item(
              "Tax and extraction reporting",
              "Publishes payments to governments under UK reporting rules",
              "This makes Shell a stronger fit for source-linked extraction or tax-transparency context than a normal listed company with fewer public disclosures.",
              "shellPayments",
              "high"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Listed multinational with enhanced extractives disclosure",
          target: "Governments receiving reportable payments",
          detail: "A direct relationship to Shell's published transparency reports, not an inferred lobbying claim.",
          confidence: "high",
          sources: [relSource("chShell"), relSource("shellPayments"), relSource("shellAnnual")]
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
      teaser: "Ownership and governance context for one of the UK's most-cited news brands.",
      summaryMetrics: [
        metric("Ownership model", "Controlled via the Scott Trust", "guardianTrust", "high"),
        metric("Governance layer", "Trust publishes governance and financial reports", "guardianTrust", "high"),
        metric("Control type", "Trust structure rather than private owner", "guardianTrust", "high")
      ],
      sections: [
        {
          id: "ownership",
          title: "Ownership web",
          items: [
            item(
              "Ultimate control",
              "Scott Trust structure",
              "This is a useful contrast case when pages mention media concentration or editorial independence.",
              "guardianTrust",
              "high"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Media brand under trust ownership",
          target: "Scott Trust governance",
          detail: "A direct structural ownership relationship, not a claim about editorial content.",
          confidence: "high",
          sources: [relSource("guardianTrust")]
        }
      ]
    },
    {
      id: "m_daily_mail",
      type: "media",
      name: "Daily Mail",
      aliases: ["MailOnline", "The Daily Mail", "Associated Newspapers", "Mail on Sunday", "Metro", "The i Paper"],
      badge: "Media · DMGT consumer media",
      role: "News and consumer media brand",
      teaser: "Useful when pages mention the Daily Mail, DMGT or Associated Newspapers and ownership scale matters.",
      summaryMetrics: [
        metric("Operating company", "Associated Newspapers Limited", "chAssociated", "high"),
        metric("Reach claim", "Nearly 9 million people reached daily in the UK", "dmgtConsumer", "medium"),
        metric("Ownership context", "Part of DMGT consumer media", "dmgtConsumer", "high")
      ],
      sections: [
        {
          id: "ownership",
          title: "Ownership and scale",
          items: [
            item(
              "Operating company",
              "Associated Newspapers Limited",
              "Useful for tying the consumer-facing brand back to a real company record in Companies House.",
              "chAssociated",
              "high"
            ),
            item(
              "Group media footprint",
              "DMGT says its consumer brands reach nearly 9 million people daily in the UK",
              "This is a self-reported scale claim from the parent group rather than regulator-measured audience share.",
              "dmgtConsumer",
              "medium"
            )
          ]
        }
      ],
      relationships: [
        {
          title: "Brand to operating-company relationship",
          target: "Associated Newspapers / DMGT consumer media",
          detail: "The extension can connect mentions of Daily Mail, MailOnline, Metro or The i Paper back to the same ownership cluster.",
          confidence: "high",
          sources: [relSource("chAssociated"), relSource("dmgtConsumer")]
        }
      ]
    }
  ];
})();
