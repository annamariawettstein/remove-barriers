// Expose MVP — mock entity dataset (Lattice platform).
// All figures are illustrative. Replace with live API data when the backend is ready.

window.EXPOSE_ENTITIES = [
  // -------- Politicians --------
  {
    id: "p_rishi_sunak",
    type: "politician",
    name: "Rishi Sunak",
    aliases: ["Rt Hon Rishi Sunak", "Rishi Sunak MP"],
    party: "CON",
    constituency: "Richmond and Northallerton",
    role: "MP, former Prime Minister",
    facts: [
      { label: "Declared donations (2024)", value: "£412,420", source: "Electoral Commission" },
      { label: "Register of Interests entries", value: "14 (2024)", source: "House of Commons" },
      { label: "Hospitality declared (2024)", value: "£68,300", source: "Register of Members' Interests" }
    ]
  },
  {
    id: "p_keir_starmer",
    type: "politician",
    name: "Keir Starmer",
    aliases: ["Sir Keir Starmer", "Keir Starmer MP"],
    party: "LAB",
    constituency: "Holborn and St Pancras",
    role: "Prime Minister",
    facts: [
      { label: "Declared donations (2024)", value: "£284,110", source: "Electoral Commission" },
      { label: "Hospitality declared (2024)", value: "£107,145", source: "Register of Members' Interests" },
      { label: "Top donor (2024)", value: "Lord Waheed Alli (£39k)", source: "Electoral Commission" }
    ]
  },
  {
    id: "p_angela_rayner",
    type: "politician",
    name: "Angela Rayner",
    aliases: ["Angela Rayner MP"],
    party: "LAB",
    constituency: "Ashton-under-Lyne",
    role: "Deputy Prime Minister",
    facts: [
      { label: "Declared donations (2024)", value: "£24,780", source: "Electoral Commission" },
      { label: "Register of Interests entries", value: "9 (2024)", source: "House of Commons" }
    ]
  },
  {
    id: "p_jeremy_hunt",
    type: "politician",
    name: "Jeremy Hunt",
    aliases: ["Rt Hon Jeremy Hunt", "Jeremy Hunt MP"],
    party: "CON",
    constituency: "Godalming and Ash",
    role: "MP, former Chancellor",
    facts: [
      { label: "Outside earnings (2024)", value: "£412,950", source: "Register of Members' Interests" },
      { label: "Declared donations (2024)", value: "£18,200", source: "Electoral Commission" }
    ]
  },
  {
    id: "p_ed_davey",
    type: "politician",
    name: "Ed Davey",
    aliases: ["Sir Ed Davey", "Ed Davey MP"],
    party: "LD",
    constituency: "Kingston and Surbiton",
    role: "Leader, Liberal Democrats",
    facts: [
      { label: "Declared donations (2024)", value: "£141,300", source: "Electoral Commission" },
      { label: "Hospitality declared (2024)", value: "£8,420", source: "Register of Members' Interests" }
    ]
  },
  {
    id: "p_kemi_badenoch",
    type: "politician",
    name: "Kemi Badenoch",
    aliases: ["Rt Hon Kemi Badenoch", "Kemi Badenoch MP"],
    party: "CON",
    constituency: "North West Essex",
    role: "Leader of the Opposition",
    facts: [
      { label: "Declared donations (2024)", value: "£204,800", source: "Electoral Commission" },
      { label: "Hospitality declared (2024)", value: "£12,640", source: "Register of Members' Interests" }
    ]
  },
  {
    id: "p_rachel_reeves",
    type: "politician",
    name: "Rachel Reeves",
    aliases: ["Rachel Reeves MP"],
    party: "LAB",
    constituency: "Leeds West and Pudsey",
    role: "Chancellor of the Exchequer",
    facts: [
      { label: "Declared donations (2024)", value: "£152,940", source: "Electoral Commission" },
      { label: "Top donor (2024)", value: "Gary Lubner (£62k)", source: "Electoral Commission" }
    ]
  },
  {
    id: "p_wes_streeting",
    type: "politician",
    name: "Wes Streeting",
    aliases: ["Wes Streeting MP"],
    party: "LAB",
    constituency: "Ilford North",
    role: "Secretary of State for Health and Social Care",
    facts: [
      { label: "Donations from health-sector donors (2024)", value: "£175,000", source: "Electoral Commission" },
      { label: "Register of Interests entries", value: "11 (2024)", source: "House of Commons" }
    ]
  },
  {
    id: "p_yvette_cooper",
    type: "politician",
    name: "Yvette Cooper",
    aliases: ["Rt Hon Yvette Cooper", "Yvette Cooper MP"],
    party: "LAB",
    constituency: "Pontefract, Castleford and Knottingley",
    role: "Home Secretary",
    facts: [
      { label: "Declared donations (2024)", value: "£32,400", source: "Electoral Commission" }
    ]
  },
  {
    id: "p_david_lammy",
    type: "politician",
    name: "David Lammy",
    aliases: ["Rt Hon David Lammy", "David Lammy MP"],
    party: "LAB",
    constituency: "Tottenham",
    role: "Foreign Secretary",
    facts: [
      { label: "Outside earnings (2024)", value: "£198,400", source: "Register of Members' Interests" },
      { label: "Hospitality declared (2024)", value: "£24,180", source: "Register of Members' Interests" }
    ]
  },
  {
    id: "p_liz_truss",
    type: "politician",
    name: "Liz Truss",
    aliases: ["Rt Hon Liz Truss"],
    party: "CON",
    constituency: "Former: South West Norfolk",
    role: "Former Prime Minister",
    facts: [
      { label: "Speaking-engagement income (2024)", value: "£284,650", source: "Register of Members' Interests" },
      { label: "Lifetime donations received", value: "£1.2M", source: "Electoral Commission" }
    ]
  },
  {
    id: "p_suella_braverman",
    type: "politician",
    name: "Suella Braverman",
    aliases: ["Rt Hon Suella Braverman", "Suella Braverman MP"],
    party: "CON",
    constituency: "Fareham and Waterlooville",
    role: "MP, former Home Secretary",
    facts: [
      { label: "Declared donations (2024)", value: "£87,250", source: "Electoral Commission" }
    ]
  },
  {
    id: "p_penny_mordaunt",
    type: "politician",
    name: "Penny Mordaunt",
    aliases: ["Rt Hon Penny Mordaunt"],
    party: "CON",
    constituency: "Former: Portsmouth North",
    role: "Former Leader of the Commons",
    facts: [
      { label: "Lifetime donations received", value: "£894,300", source: "Electoral Commission" },
      { label: "Speaking-engagement income (2024)", value: "£42,800", source: "Register of Members' Interests" }
    ]
  },
  {
    id: "p_john_mcdonnell",
    type: "politician",
    name: "John McDonnell",
    aliases: ["John McDonnell MP"],
    party: "IND",
    constituency: "Hayes and Harlington",
    role: "MP (Independent)",
    facts: [
      { label: "Declared donations (2024)", value: "£4,800", source: "Electoral Commission" }
    ]
  },
  {
    id: "p_nigel_farage",
    type: "politician",
    name: "Nigel Farage",
    aliases: ["Nigel Farage MP"],
    party: "RFM",
    constituency: "Clacton",
    role: "Leader, Reform UK",
    facts: [
      { label: "Declared donations (2024)", value: "£478,200", source: "Electoral Commission" },
      { label: "Outside earnings (2024)", value: "£1.1M", source: "Register of Members' Interests" },
      { label: "Top donor (2024)", value: "Christopher Harborne (£200k)", source: "Electoral Commission" }
    ]
  },

  // -------- Companies --------
  {
    id: "c_serco",
    type: "company",
    name: "Serco",
    aliases: ["Serco Group", "Serco Group plc"],
    companyNumber: "02048608",
    sector: "Outsourcing / public services",
    facts: [
      { label: "Active UK gov contracts (2024)", value: "£2.1bn", source: "Contracts Finder" },
      { label: "Lobbying spend declared (Q1 2026)", value: "£68k", source: "Lobby Register" },
      { label: "Political donations (5yr)", value: "£0", source: "Electoral Commission" }
    ]
  },
  {
    id: "c_capita",
    type: "company",
    name: "Capita",
    aliases: ["Capita plc"],
    companyNumber: "02081330",
    sector: "Outsourcing / BPO",
    facts: [
      { label: "Active UK gov contracts (2024)", value: "£1.4bn", source: "Contracts Finder" },
      { label: "Lobbying spend declared (Q1 2026)", value: "£42k", source: "Lobby Register" }
    ]
  },
  {
    id: "c_g4s",
    type: "company",
    name: "G4S",
    aliases: ["G4S plc", "G4S Group"],
    companyNumber: "04992207",
    sector: "Security services",
    facts: [
      { label: "Active UK gov contracts (2024)", value: "£640m", source: "Contracts Finder" },
      { label: "Subsidiaries", value: "47 active", source: "Companies House" }
    ]
  },
  {
    id: "c_pwc",
    type: "company",
    name: "PwC",
    aliases: ["PricewaterhouseCoopers", "PricewaterhouseCoopers LLP"],
    companyNumber: "OC303525",
    sector: "Professional services",
    facts: [
      { label: "UK gov consulting fees (2024)", value: "£287m", source: "Contracts Finder" },
      { label: "Lobbying spend declared (Q1 2026)", value: "£94k", source: "Lobby Register" }
    ]
  },
  {
    id: "c_deloitte",
    type: "company",
    name: "Deloitte",
    aliases: ["Deloitte LLP"],
    companyNumber: "OC303675",
    sector: "Professional services",
    facts: [
      { label: "UK gov consulting fees (2024)", value: "£324m", source: "Contracts Finder" },
      { label: "Lobbying spend declared (Q1 2026)", value: "£71k", source: "Lobby Register" }
    ]
  },
  {
    id: "c_kpmg",
    type: "company",
    name: "KPMG",
    aliases: ["KPMG LLP"],
    companyNumber: "OC301540",
    sector: "Professional services",
    facts: [
      { label: "UK gov consulting fees (2024)", value: "£218m", source: "Contracts Finder" },
      { label: "Lobbying spend declared (Q1 2026)", value: "£58k", source: "Lobby Register" }
    ]
  },
  {
    id: "c_palantir",
    type: "company",
    name: "Palantir",
    aliases: ["Palantir Technologies UK", "Palantir UK"],
    companyNumber: "09773374",
    sector: "Data / software",
    facts: [
      { label: "NHS Federated Data Platform contract", value: "£330m (7yr)", source: "Contracts Finder" },
      { label: "Lobbying spend declared (Q1 2026)", value: "£124k", source: "Lobby Register" },
      { label: "MP meetings logged (2024)", value: "18", source: "Cabinet Office transparency" }
    ]
  },
  {
    id: "c_fujitsu",
    type: "company",
    name: "Fujitsu",
    aliases: ["Fujitsu Services Limited", "Fujitsu UK"],
    companyNumber: "00096056",
    sector: "Technology / outsourcing",
    facts: [
      { label: "Active UK gov contracts (2024)", value: "£840m", source: "Contracts Finder" },
      { label: "Post Office Horizon contract value", value: "£2.4bn (lifetime)", source: "Contracts Finder" }
    ]
  },
  {
    id: "c_bae",
    type: "company",
    name: "BAE Systems",
    aliases: ["BAE Systems plc", "BAE"],
    companyNumber: "01470151",
    sector: "Defence",
    facts: [
      { label: "MoD contracts (2024)", value: "£4.8bn", source: "Contracts Finder" },
      { label: "Lobbying spend declared (Q1 2026)", value: "£182k", source: "Lobby Register" },
      { label: "MP meetings logged (2024)", value: "31", source: "Cabinet Office transparency" }
    ]
  },
  {
    id: "c_shell",
    type: "company",
    name: "Shell",
    aliases: ["Shell plc", "Shell UK Limited"],
    companyNumber: "04366849",
    sector: "Energy",
    facts: [
      { label: "Lobbying spend declared (Q1 2026)", value: "£218k", source: "Lobby Register" },
      { label: "Political donations (5yr)", value: "£0", source: "Electoral Commission" },
      { label: "Ministerial meetings (2024)", value: "27", source: "Cabinet Office transparency" }
    ]
  },
  {
    id: "c_bp",
    type: "company",
    name: "BP",
    aliases: ["BP plc", "BP p.l.c."],
    companyNumber: "00102498",
    sector: "Energy",
    facts: [
      { label: "Lobbying spend declared (Q1 2026)", value: "£194k", source: "Lobby Register" },
      { label: "Ministerial meetings (2024)", value: "22", source: "Cabinet Office transparency" }
    ]
  },
  {
    id: "c_tesco",
    type: "company",
    name: "Tesco",
    aliases: ["Tesco plc", "Tesco Stores Limited"],
    companyNumber: "00445790",
    sector: "Retail",
    facts: [
      { label: "Lobbying spend declared (Q1 2026)", value: "£87k", source: "Lobby Register" },
      { label: "Subsidiaries", value: "412 active", source: "Companies House" }
    ]
  },
  {
    id: "c_vodafone",
    type: "company",
    name: "Vodafone",
    aliases: ["Vodafone Group", "Vodafone Group plc", "Vodafone UK"],
    companyNumber: "01833679",
    sector: "Telecoms",
    facts: [
      { label: "Lobbying spend declared (Q1 2026)", value: "£112k", source: "Lobby Register" },
      { label: "Ministerial meetings (2024)", value: "19", source: "Cabinet Office transparency" }
    ]
  },
  {
    id: "c_greensill",
    type: "company",
    name: "Greensill Capital",
    aliases: ["Greensill Capital UK", "Greensill"],
    companyNumber: "08126173",
    sector: "Finance (in administration)",
    facts: [
      { label: "Status", value: "In administration since 2021", source: "Companies House" },
      { label: "David Cameron retainer (2018–21)", value: "~£7m", source: "Treasury Select Committee" },
      { label: "Cameron text messages to Chancellor", value: "62", source: "Treasury Select Committee" }
    ]
  },
  {
    id: "c_oneweb",
    type: "company",
    name: "OneWeb",
    aliases: ["OneWeb Limited"],
    companyNumber: "12262866",
    sector: "Satellite communications",
    facts: [
      { label: "UK government investment", value: "£400m (2020)", source: "BEIS announcement" },
      { label: "Current UK gov stake", value: "Sold 2023 (Eutelsat merger)", source: "Companies House" }
    ]
  },
  {
    id: "c_blackstone",
    type: "company",
    name: "Blackstone",
    aliases: ["Blackstone Group", "Blackstone Inc"],
    companyNumber: "FC027538",
    sector: "Private equity",
    facts: [
      { label: "Donations to Conservative Party (5yr)", value: "£3.1m", source: "Electoral Commission" },
      { label: "Ministerial meetings (2024)", value: "14", source: "Cabinet Office transparency" }
    ]
  },

  // -------- News media (ownership & funding) --------
  {
    id: "m_guardian",
    type: "media",
    name: "The Guardian",
    aliases: ["Guardian News & Media", "Guardian Media Group"],
    owner: "Scott Trust Limited",
    funding: "Reader-funded + trust endowment",
    facts: [
      { label: "Ultimate owner", value: "Scott Trust Limited (independent foundation)", source: "Companies House" },
      { label: "Trust endowment", value: "~£1.04bn (2024)", source: "GMG Annual Report" },
      { label: "Funding model", value: "No shareholder dividends; surplus reinvested", source: "Scott Trust constitution" },
      { label: "UK political donations (5yr)", value: "£0", source: "Electoral Commission" }
    ]
  },
  {
    id: "m_times",
    type: "media",
    name: "The Times",
    aliases: ["The Times of London", "Sunday Times", "The Sunday Times", "Times Newspapers Limited"],
    owner: "News UK (News Corp)",
    funding: "Subscription + advertising",
    facts: [
      { label: "Parent group", value: "News Corp (NASDAQ: NWSA)", source: "Companies House" },
      { label: "Controlling shareholder", value: "Murdoch Family Trust (~39% voting)", source: "SEC 13D filings" },
      { label: "UK lobbying (Q1 2026)", value: "£42k via News UK", source: "Lobby Register" },
      { label: "Editorial endorsement (2024 GE)", value: "Labour", source: "The Times leader, 26 Jun 2024" }
    ]
  },
  {
    id: "m_sun",
    type: "media",
    name: "The Sun",
    aliases: ["The Sun on Sunday", "Sun Newspaper"],
    owner: "News UK (News Corp)",
    funding: "Advertising + cover price",
    facts: [
      { label: "Parent group", value: "News Corp (NASDAQ: NWSA)", source: "Companies House" },
      { label: "Controlling shareholder", value: "Murdoch Family Trust (~39% voting)", source: "SEC 13D filings" },
      { label: "UK print circulation (2024)", value: "~525k", source: "ABC audited" },
      { label: "Editorial endorsement (2024 GE)", value: "Labour", source: "The Sun, 03 Jul 2024" }
    ]
  },
  {
    id: "m_telegraph",
    type: "media",
    name: "The Telegraph",
    aliases: ["Daily Telegraph", "Sunday Telegraph", "Telegraph Media Group"],
    owner: "In dispute · sale process ongoing",
    funding: "Subscription + advertising",
    facts: [
      { label: "Previous owners", value: "Barclay family (1986–2023)", source: "Companies House" },
      { label: "2024 control", value: "RedBird IMI bid blocked by UK Govt", source: "DCMS announcement, Mar 2024" },
      { label: "Active bidders (2026)", value: "DMGT, Sir Paul Marshall, RedBird Capital", source: "FT reporting" },
      { label: "Editorial endorsement (2024 GE)", value: "Conservative", source: "Daily Telegraph leader" }
    ]
  },
  {
    id: "m_ft",
    type: "media",
    name: "Financial Times",
    aliases: ["FT.com", "The Financial Times"],
    owner: "Nikkei Inc (Japan)",
    funding: "Subscription-led",
    facts: [
      { label: "Ultimate owner", value: "Nikkei Inc (Tokyo)", source: "Companies House" },
      { label: "Acquired from", value: "Pearson plc · £844m (2015)", source: "Pearson press release" },
      { label: "Editorial independence", value: "Stated in shareholder agreement", source: "Nikkei/FT 2015 statement" },
      { label: "Paying subscribers", value: "~1.3M global (2024)", source: "FT annual review" }
    ]
  },
  {
    id: "m_mail",
    type: "media",
    name: "Daily Mail",
    aliases: ["Mail on Sunday", "The Daily Mail", "MailOnline", "Daily Mail and General Trust"],
    owner: "DMGT (Rothermere/Harmsworth family)",
    funding: "Advertising + cover price + digital",
    facts: [
      { label: "Parent group", value: "Daily Mail and General Trust (DMGT)", source: "Companies House" },
      { label: "Controlling owner", value: "Lord Rothermere (Jonathan Harmsworth)", source: "DMGT prospectus" },
      { label: "Public listing", value: "De-listed from LSE in 2022", source: "LSE notice" },
      { label: "Editorial endorsement (2024 GE)", value: "Conservative", source: "Daily Mail leader" }
    ]
  },
  {
    id: "m_mirror",
    type: "media",
    name: "Daily Mirror",
    aliases: ["Sunday Mirror", "The Mirror", "Reach plc"],
    owner: "Reach plc (LSE: RCH)",
    funding: "Advertising + cover price",
    facts: [
      { label: "Parent group", value: "Reach plc (FTSE Small Cap)", source: "Companies House" },
      { label: "Other titles owned", value: "Express, Star, OK!, regional dailies", source: "Reach plc annual report" },
      { label: "Market cap", value: "~£245m (2026)", source: "LSE" },
      { label: "Editorial endorsement (2024 GE)", value: "Labour", source: "Daily Mirror leader" }
    ]
  },
  {
    id: "m_express",
    type: "media",
    name: "Daily Express",
    aliases: ["Sunday Express", "The Express", "Express.co.uk"],
    owner: "Reach plc (LSE: RCH)",
    funding: "Advertising + cover price",
    facts: [
      { label: "Parent group", value: "Reach plc — acquired 2018 from Northern & Shell", source: "Companies House" },
      { label: "Former owner", value: "Richard Desmond (1974–2018)", source: "Companies House" },
      { label: "Editorial endorsement (2024 GE)", value: "Conservative", source: "Daily Express leader" }
    ]
  },
  {
    id: "m_independent",
    type: "media",
    name: "The Independent",
    aliases: ["Independent Digital News and Media", "Independent.co.uk"],
    owner: "Lebedev family + SCMG (Saudi-linked)",
    funding: "Advertising + reader contributions",
    facts: [
      { label: "Co-owners", value: "Evgeny Lebedev (~70%) + SCMG (~30%)", source: "Companies House" },
      { label: "SCMG beneficial owner", value: "Sultan Mohammed Abuljadayel (Saudi national)", source: "Companies House PSC register" },
      { label: "Print edition", value: "Discontinued 2016 — digital only", source: "INM announcement" },
      { label: "Sister title", value: "London Evening Standard (Lebedev sole)", source: "Companies House" }
    ]
  },
  {
    id: "m_spectator",
    type: "media",
    name: "The Spectator",
    aliases: ["Spectator magazine"],
    owner: "Sir Paul Marshall (Old Queen Street Ventures)",
    funding: "Subscription + advertising",
    facts: [
      { label: "Acquired Sept 2024", value: "£100m from Telegraph Media Group", source: "FT reporting" },
      { label: "Owner's other holdings", value: "GB News (~£40m), UnHerd (founder)", source: "Companies House" },
      { label: "Owner's day job", value: "Marshall Wace hedge fund (~$60bn AUM)", source: "SEC filings" }
    ]
  },
  {
    id: "m_gbnews",
    type: "media",
    name: "GB News",
    aliases: ["GBNews", "GB News UK"],
    owner: "Marshall + Legatum + Discovery Land",
    funding: "Investor-funded · loss-making",
    facts: [
      { label: "Major backers", value: "Sir Paul Marshall, Legatum Foundation, Discovery Land", source: "Companies House PSC register" },
      { label: "Reported loss (2023)", value: "~£42m", source: "Companies House filings" },
      { label: "Ofcom rulings (2024)", value: "Multiple due-impartiality breaches upheld", source: "Ofcom Broadcast Bulletins" }
    ]
  },
  {
    id: "m_bbc",
    type: "media",
    name: "BBC News",
    aliases: ["BBC", "British Broadcasting Corporation", "BBC.co.uk"],
    owner: "Statutory corporation · UK Parliament",
    funding: "Licence fee + commercial subsidiary",
    facts: [
      { label: "Funding model", value: "Licence fee (£169.50/yr) + BBC Studios", source: "BBC Annual Report" },
      { label: "Licence-fee income (2024)", value: "£3.7bn", source: "BBC Annual Report" },
      { label: "Royal Charter", value: "Current charter expires Dec 2027", source: "DCMS Charter Review" },
      { label: "Director-General appointment", value: "BBC Board · ratified by Culture Secretary", source: "BBC Charter Art. 27" }
    ]
  },
  {
    id: "m_sky",
    type: "media",
    name: "Sky News",
    aliases: ["Sky.com", "Sky News UK"],
    owner: "Comcast Corporation (US)",
    funding: "Advertising + Sky subscriptions",
    facts: [
      { label: "Ultimate owner", value: "Comcast Corporation (NASDAQ: CMCSA)", source: "Companies House" },
      { label: "Acquired", value: "Oct 2018 · £30bn deal won against 21st Century Fox", source: "Comcast press release" },
      { label: "UK editorial independence", value: "Ofcom undertakings (2018)", source: "Ofcom merger ruling" }
    ]
  },
  {
    id: "m_bloomberg",
    type: "media",
    name: "Bloomberg",
    aliases: ["Bloomberg News", "Bloomberg LP", "Bloomberg L.P."],
    owner: "Bloomberg L.P. (Michael Bloomberg)",
    funding: "Terminal subscriptions",
    facts: [
      { label: "Majority owner", value: "Michael Bloomberg (~88% stake)", source: "Forbes / Companies House" },
      { label: "Primary revenue", value: "Bloomberg Terminal subscriptions (~$20bn/yr est.)", source: "Industry estimates" },
      { label: "Owner's political donations (US, 2024 cycle)", value: "~$45m", source: "FEC filings" }
    ]
  },
  {
    id: "m_economist",
    type: "media",
    name: "The Economist",
    aliases: ["Economist", "Economist.com", "Economist Group"],
    owner: "Economist Group · mixed shareholders",
    funding: "Subscription + advertising",
    facts: [
      { label: "Largest shareholder", value: "Exor (Agnelli family) · 43.4%", source: "Companies House" },
      { label: "Other shareholders", value: "Rothschild, Cadbury, Schroder, Layton families", source: "Economist Group statement" },
      { label: "Editorial independence", value: "Board of Trustees holds veto over editor appointment", source: "Articles of Association" }
    ]
  }
];
