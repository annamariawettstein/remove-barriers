import type { GraphNode, ResearchData } from "../components/expose/types";

export type ExposeCaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  hiddenPattern: string;
  whyItMatters: string;
  primaryQuery: string;
  supportingQueries: string[];
  aliases?: string[];
  preset: ResearchData;
};

function caseSubject(
  title: string,
  summary: string,
  hiddenPattern: string,
  whyItMatters: string,
  takeaways: string[],
): Pick<ResearchData, "person" | "mode" | "narrative"> {
  return {
    mode: "caseStudy",
    person: {
      name: title,
      role: "UK power-network case study",
      country: "United Kingdom",
      leaning: "Influence, patronage, institutional protection",
      bio: summary,
      stances: takeaways,
      imageUrl: null,
      publicStatements: [],
      crossReferences: [
        {
          said: hiddenPattern,
          did: whyItMatters,
          source: "Lattice case study",
          url: "",
          verified: false,
        },
      ],
      residences: [],
      netWorth: "Not applicable",
    },
    narrative: {
      headline: title,
      summary,
      hiddenPattern,
      whyItMatters,
      takeaways,
    },
  };
}

function article(
  title: string,
  source: string,
  summary: string,
  concern: string,
): ResearchData["articles"][number] {
  return {
    title,
    source,
    summary,
    concern,
    url: "",
    verified: false,
    stanceIndex: null,
  };
}

function node(
  id: string,
  label: string,
  kind: GraphNode["kind"],
  type: string,
  summary: string,
  details: string[] = [],
  position?: [number, number, number],
  metadata?: { label: string; value: string }[],
): GraphNode {
  return { id, label, kind, type, summary, details, position, metadata };
}

const PROFUMO = (() => {
  const summary =
    "What looked like a private sex scandal turned into a crisis about Parliament, Cold War security, and the private social circuits of the British ruling class.";
  const hiddenPattern =
    "A social broker linked politicians, aristocrats, intelligence-connected figures, and young women inside the same private circle, collapsing the boundary between elite leisure and public power.";
  const whyItMatters =
    "The scandal broke trust in the idea that upper-class social worlds were naturally disciplined, secure, and fit to govern themselves without scrutiny.";
  const takeaways = [
    "Private elite circles can create public-security risk",
    "Informal brokers matter as much as office-holders",
    "The lie to Parliament damaged trust more than the affair itself",
    "Scapegoating a marginal figure can protect a wider network",
  ];

  return {
    slug: "profumo-affair",
    title: "The Profumo Affair",
    subtitle: "Sex, espionage, and the social broker at the center",
    summary,
    hiddenPattern,
    whyItMatters,
    primaryQuery: "Stephen Ward",
    supportingQueries: ["John Profumo", "Christine Keeler", "Yevgeny Ivanov"],
    preset: {
      ...caseSubject("The Profumo Affair", summary, hiddenPattern, whyItMatters, takeaways),
      narrative: {
        ...caseSubject("The Profumo Affair", summary, hiddenPattern, whyItMatters, takeaways).narrative,
        deepDive: [
          "The Profumo Affair is often remembered as a sex scandal, but the deeper issue was that private elite social life had become a national-security vulnerability. A Cold War minister, a Soviet-linked diplomat, and a social circle built on glamour and access all sat too close together.",
          "Stephen Ward mattered because he was a broker rather than an office-holder. He moved between aristocrats, politicians, diplomats, showbusiness figures, and young women, proving that informal connectors can matter as much as ministers when networks of power are formed.",
          "The scandal also exposed how the British establishment initially treated the crisis as embarrassment rather than institutional risk. Once Profumo lied to Parliament, the issue shifted from private conduct to public trust and constitutional legitimacy.",
        ],
        systemFailures: [
          "Senior figures assumed their private lives were protected by class discretion and did not need serious scrutiny.",
          "Security thinking focused too narrowly on formal espionage rather than compromise, blackmail, and reputational weakness.",
          "Elite social networks were treated as respectable by default, which delayed harder questions about access and influence.",
          "Crisis management prioritised preserving authority over confronting the truth quickly.",
        ],
        timeline: [
          {
            date: "July 1961",
            event: "John Profumo met Christine Keeler at Cliveden, inside a social world that overlapped politics, wealth, and diplomatic access.",
            source: "Contemporary reporting / public record",
          },
          {
            date: "1962–1963",
            event: "Concern deepened because Keeler was also linked to Yevgeny Ivanov, a Soviet naval attaché with suspected intelligence ties.",
            source: "Cold War reporting",
          },
          {
            date: "March 1963",
            event: "Profumo denied impropriety in the House of Commons, turning a private scandal into a public test of ministerial truthfulness.",
            publicLine: "He denied misconduct to Parliament.",
            source: "Parliamentary record",
          },
          {
            date: "June 1963",
            event: "Profumo resigned after admitting he had misled Parliament, and the scandal became a wider indictment of elite judgment.",
            source: "Public statement / reporting",
          },
        ],
      },
      articles: [
        article("Profumo denies the affair in the Commons", "Parliament", "Profumo's misleading statement turned a private scandal into a constitutional one.", "Lie to Parliament"),
        article("Ward is prosecuted and cast as the connector", "Court record", "Stephen Ward became the pressure point through which the establishment contained reputational damage.", "Scapegoating"),
        article("Security panic over Keeler and Ivanov", "Cold War reporting", "The scandal widened because elite intimacy overlapped with espionage fears.", "National-security risk"),
        article("Macmillan government credibility breaks down", "Political reporting", "The scandal fed the wider sense that Britain's old governing class was secretive, brittle, and unable to reform itself.", "Collapse of deference"),
      ],
      graph: {
        nodes: [
          { id: "core", label: "The Profumo Affair", kind: "subject", type: "Case study", person: caseSubject("The Profumo Affair", summary, hiddenPattern, whyItMatters, takeaways).person, position: [0, 0, 0], summary },
          node("ward", "Stephen Ward", "person", "Social broker", "The osteopath who moved between aristocrats, politicians, intelligence-linked figures, and socialites.", ["Ward connected the people around whom the scandal cohered.", "His role mattered because he linked otherwise separate worlds."], [4.8, 0.8, 0.4], [{ label: "Role", value: "Connector" }]),
          node("profumo", "John Profumo", "person", "Secretary of State for War", "A senior minister whose lie to Parliament turned the affair into a government crisis.", ["His office made the scandal constitutional, not merely personal."], [-4.3, 1.4, 0.8], [{ label: "Office", value: "War Secretary" }]),
          node("keeler", "Christine Keeler", "person", "Model and central witness", "The shared connection between political and Soviet-linked worlds that triggered public fear.", ["Keeler's relationships exposed the permeability of elite social circles."], [3.2, -2.6, 1.2]),
          node("ivanov", "Yevgeny Ivanov", "person", "Soviet naval attaché", "His presence transformed the scandal into a Cold War security question.", ["The possibility of leakage mattered as much as any proven leak."], [-2.1, -3.4, -0.4]),
          node("commons", "House of Commons", "institution", "Parliament", "The place where Profumo's denial and later collapse damaged public trust in government.", ["Institutional trust cracked when the ministerial statement proved false."], [-5.2, -0.8, 1.8]),
          node("security", "Cold War security panic", "event", "Security crisis", "The fear that private elite networks had opened a route for sensitive information to move informally.", ["The scandal mattered because intimacy and state power were too close."], [1.1, 3.6, -0.8]),
          node("press", "Tabloid and broadsheet frenzy", "article", "Media pressure", "Coverage widened the scandal from a private affair into a legitimacy crisis for the governing class.", ["The press made the network visible to the public."], [5.2, -1.4, -1.5]),
        ],
        edges: [
          ["core", "ward"],
          ["core", "profumo"],
          ["core", "keeler"],
          ["core", "ivanov"],
          ["core", "commons"],
          ["core", "security"],
          ["core", "press"],
          ["ward", "profumo"],
          ["ward", "keeler"],
          ["keeler", "ivanov"],
          ["profumo", "commons"],
          ["security", "ivanov"],
          ["press", "commons"],
        ],
      },
    },
  } satisfies ExposeCaseStudy;
})();

const CAMBRIDGE_FIVE = (() => {
  const summary =
    "The Cambridge Five exposed how British intelligence recruitment trusted class background, schooling, and personal familiarity far more than rigorous accountability.";
  const hiddenPattern =
    "Elite education and upper-class social proof worked as a shield: the right accent, college, and contacts made suspicion feel socially difficult.";
  const whyItMatters =
    "The scandal showed that informal trust systems can become a security failure when institutions confuse pedigree with loyalty.";
  const takeaways = [
    "Class culture can distort risk assessment",
    "Recruitment by social familiarity weakens scrutiny",
    "Informal trust can outmuscle formal oversight",
    "Club-like institutions are vulnerable to long-lived infiltration",
  ];

  return {
    slug: "cambridge-five",
    title: "The Cambridge Five",
    subtitle: "Elite education as a security weakness",
    summary,
    hiddenPattern,
    whyItMatters,
    primaryQuery: "Kim Philby",
    supportingQueries: ["Guy Burgess", "Donald Maclean", "Anthony Blunt"],
    preset: {
      ...caseSubject("The Cambridge Five", summary, hiddenPattern, whyItMatters, takeaways),
      narrative: {
        ...caseSubject("The Cambridge Five", summary, hiddenPattern, whyItMatters, takeaways).narrative,
        deepDive: [
          "The Cambridge Five were not just a spy ring. They were proof that British intelligence recruitment depended too heavily on class background, education, accent, and recommendation, which made the system easier to penetrate.",
          "Cambridge functioned as more than a university in this story. It was a sorting machine that produced people assumed to be intelligent, patriotic, and discreet. Soviet recruitment exploited that social confidence as much as it exploited ideology.",
          "Kim Philby's rise showed the scale of the failure. The problem was not simply that a hostile agent got in; it was that the system promoted him while mistaking familiarity and pedigree for evidence of loyalty.",
        ],
        systemFailures: [
          "Vetting was socially coded around the 'right sort of man' rather than rigorous verification.",
          "The British state underestimated ideology as a motive for betrayal within its own elite.",
          "Personal relationships and reputational caution softened suspicion when it finally appeared.",
          "The establishment was slow to adapt because admitting the scale of penetration meant admitting that its own recruitment model was flawed.",
        ],
        timeline: [
          {
            date: "1930s",
            event: "Several future members of the Cambridge Five were recruited while communism held real anti-fascist appeal among elite students.",
            source: "Intelligence history",
          },
          {
            date: "1940s",
            event: "Philby, Burgess, Maclean, Blunt, and Cairncross entered or influenced core state institutions including MI6, MI5, and the Foreign Office.",
            source: "Public record / historical research",
          },
          {
            date: "1951",
            event: "Burgess and Maclean defected to the Soviet Union, forcing Britain to confront the possibility of deep internal penetration.",
            source: "Historical record",
          },
          {
            date: "1963 and after",
            event: "Philby's exposure confirmed that insider status had protected one of the most damaging agents of the Cold War era.",
            source: "Intelligence history",
          },
        ],
      },
      articles: [
        article("Philby rises inside MI6", "Intelligence history", "A Soviet asset reached senior British intelligence roles because elite trust made suspicion harder to sustain.", "Institutional blind spot"),
        article("Cambridge recruitment culture under scrutiny", "Historical analysis", "The case reshaped thinking on vetting and loyalty across British and US intelligence.", "Recruitment failure"),
        article("Burgess, Maclean, Blunt and the trust problem", "Public record", "The scandal widened because it was not one rogue figure but a protected social cluster.", "Network protection"),
        article("Pedigree mistaken for reliability", "Institutional analysis", "The more someone looked like they belonged, the less likely institutions were to treat them as a threat.", "Class-coded trust"),
      ],
      graph: {
        nodes: [
          { id: "core", label: "The Cambridge Five", kind: "subject", type: "Case study", person: caseSubject("The Cambridge Five", summary, hiddenPattern, whyItMatters, takeaways).person, position: [0, 0, 0], summary },
          node("philby", "Kim Philby", "person", "MI6 officer", "The most famous case: a Soviet agent embedded deep inside British intelligence.", ["His rise showed how far elite trust could carry someone."], [4.5, 0.5, 0.5], [{ label: "Institution", value: "MI6" }]),
          node("burgess", "Guy Burgess", "person", "Diplomat and broadcaster", "Part of the Cambridge cluster whose social confidence disarmed scrutiny.", ["His position widened the scandal beyond one service."], [-4.4, 1.3, 0.7]),
          node("maclean", "Donald Maclean", "person", "Foreign Office official", "A high-level official whose escape deepened the sense of elite failure.", ["The case touched diplomacy as well as intelligence."], [2.6, -3.1, 0.6]),
          node("blunt", "Anthony Blunt", "person", "Art historian and court figure", "His later exposure showed how establishment roles could hide in plain sight.", ["The scandal reached cultural and royal-adjacent institutions too."], [-2.8, -3.0, -0.8]),
          node("cambridge", "Cambridge University", "institution", "Elite educational pipeline", "The recruitment ground where class, ideology, and social confidence overlapped.", ["The university mattered as a social filter, not just an academic one."], [0.4, 4.0, -0.5]),
          node("mi6", "MI6", "institution", "British intelligence service", "The service most associated with Philby and with upper-class recruitment culture.", ["The scandal changed how vetting and trust were understood."], [5.0, -1.8, -0.9]),
          node("vetting", "Vetting reform", "event", "Institutional response", "The lasting lesson was that pedigree is not a substitute for verification.", ["The scandal permanently altered intelligence culture."], [-5.0, -1.5, 1.2]),
        ],
        edges: [
          ["core", "philby"],
          ["core", "burgess"],
          ["core", "maclean"],
          ["core", "blunt"],
          ["core", "cambridge"],
          ["core", "mi6"],
          ["core", "vetting"],
          ["cambridge", "philby"],
          ["cambridge", "burgess"],
          ["cambridge", "maclean"],
          ["cambridge", "blunt"],
          ["philby", "mi6"],
          ["mi6", "vetting"],
        ],
      },
    },
  } satisfies ExposeCaseStudy;
})();

const MAXWELL = (() => {
  const summary =
    "Robert Maxwell combined media power, political access, financial opacity, and intimidation in a way that delayed serious scrutiny until after his empire collapsed.";
  const hiddenPattern =
    "A powerful media owner sat at the overlap of journalism, finance, politics, and intelligence gossip, making institutions wary of confronting him directly.";
  const whyItMatters =
    "The case showed how concentration of information power and elite access can suppress accountability even when warning signs have circulated for years.";
  const takeaways = [
    "Media ownership can act as a shield against scrutiny",
    "Financial opacity matters more when combined with political access",
    "Fear of retaliation can freeze journalists and institutions",
    "Collapse often reveals risks that were already socially visible",
  ];

  return {
    slug: "robert-maxwell",
    title: "Robert Maxwell",
    subtitle: "Media power, intelligence rumours, and pension theft",
    summary,
    hiddenPattern,
    whyItMatters,
    primaryQuery: "Robert Maxwell",
    supportingQueries: ["Mirror Group", "Ghislaine Maxwell"],
    preset: {
      ...caseSubject("Robert Maxwell", summary, hiddenPattern, whyItMatters, takeaways),
      narrative: {
        ...caseSubject("Robert Maxwell", summary, hiddenPattern, whyItMatters, takeaways).narrative,
        deepDive: [
          "Robert Maxwell's case is not just about one fraudulent businessman. It is about how media ownership, debt, intimidation, political access, and financial opacity can create a system that resists scrutiny until collapse.",
          "Maxwell held several identities at once: war hero, self-made tycoon, MP, publisher, international operator. That symbolic flexibility made him harder to challenge because he could present himself differently depending on the room he was in.",
          "The deeper structural issue was information asymmetry. Maxwell's businesses were leveraged and complex enough that regulators, journalists, trustees, and employees often saw only fragments of the true financial picture.",
          "When the pension scandal emerged after his death, it revealed not just greed but distributed failure. Auditors, boards, political contacts, and the wider media system all failed to stop a founder who controlled both narrative and internal information.",
        ],
        systemFailures: [
          "Media ownership gave Maxwell leverage over politicians and journalists who feared hostile coverage.",
          "Corporate complexity slowed scrutiny and allowed different oversight bodies to see only partial truths.",
          "Charismatic centralisation made internal challenge harder because authority and information were concentrated in one person.",
          "Public respectability and access delayed the moment when institutions treated warning signs as systemic rather than anecdotal.",
        ],
        timeline: [
          {
            date: "1960s–1980s",
            event: "Maxwell built a media and publishing empire that gave him political access and influence over public narratives.",
            source: "Media history",
          },
          {
            date: "Late 1980s",
            event: "Financial pressure deepened inside the empire while complexity and leverage made outside scrutiny harder.",
            source: "Financial reporting",
          },
          {
            date: "1991",
            event: "Maxwell died suddenly, and the financial architecture around his companies rapidly came under harder inspection.",
            source: "Public record",
          },
          {
            date: "1991–1992",
            event: "The pension scandal exposed how employees' retirement funds had been diverted to support the wider empire.",
            source: "Financial investigation",
          },
        ],
      },
      articles: [
        article("Mirror empire built on access and pressure", "Media history", "Maxwell's media scale gave him leverage across politics and journalism.", "Information power"),
        article("Pension funds looted after death", "Financial investigation", "The scale of the fraud shocked the UK because elite respectability had muted earlier alarm.", "Financial fraud"),
        article("Intelligence links remain part of the story", "Investigative reporting", "Rumours of intelligence overlap reinforced the sense that Maxwell operated inside protected circles.", "Opaque networks"),
        article("Complexity shields the empire", "Institutional analysis", "Financial opacity itself became part of Maxwell's power because it delayed coordinated scrutiny.", "Information asymmetry"),
      ],
      graph: {
        nodes: [
          { id: "core", label: "Robert Maxwell", kind: "subject", type: "Case study", person: caseSubject("Robert Maxwell", summary, hiddenPattern, whyItMatters, takeaways).person, position: [0, 0, 0], summary },
          node("maxwell", "Robert Maxwell", "person", "Media owner", "The central operator: politically connected, financially opaque, and feared by many in his orbit.", ["The case is about one man and the systems that tolerated him."], [4.3, 0.6, 0.2]),
          node("mirror", "Mirror Group", "company", "Media empire", "The publishing business that gave Maxwell reach, access, and leverage over public narratives.", ["Media ownership amplified his political and social power."], [-4.4, 1.1, 0.8], [{ label: "Sector", value: "Media" }]),
          node("pensions", "Employee pension funds", "event", "Fraud exposure", "Hundreds of millions were diverted to prop up the companies behind the public façade.", ["The scandal became undeniable only after the empire failed."], [1.6, -3.4, 0.5]),
          node("politics", "Political access", "institution", "Elite access", "Maxwell cultivated relationships that protected status and softened scrutiny.", ["Political respectability gave him cover."], [-2.7, -3.1, -0.8]),
          node("journalists", "Fear inside journalism", "article", "Intimidation effect", "Many journalists understood Maxwell as litigious and dangerous to challenge.", ["Retaliation risk changed editorial choices."], [5.0, -1.8, -1.2]),
          node("intel", "Intelligence rumours", "institution", "Opaque security overlap", "Disputed but persistent claims of links to intelligence deepened the aura of untouchability.", ["True or not, the overlap mattered to perception and power."], [0.4, 4.0, -0.4]),
          node("ghislaine", "Ghislaine Maxwell", "person", "Family and later scandal link", "Her later role in the Epstein case revived public interest in Maxwell's elite protection systems.", ["The family network kept the story alive beyond 1991."], [-5.1, -1.2, 1.5]),
        ],
        edges: [
          ["core", "maxwell"],
          ["core", "mirror"],
          ["core", "pensions"],
          ["core", "politics"],
          ["core", "journalists"],
          ["core", "intel"],
          ["core", "ghislaine"],
          ["maxwell", "mirror"],
          ["maxwell", "pensions"],
          ["maxwell", "politics"],
          ["maxwell", "journalists"],
          ["maxwell", "intel"],
        ],
      },
    },
  } satisfies ExposeCaseStudy;
})();

const SAVILE = (() => {
  const summary =
    "Jimmy Savile became a devastating example of how celebrity, charity work, and institutional prestige can create a reputation shield strong enough to block serious scrutiny for years.";
  const hiddenPattern =
    "Multiple institutions deferred to status, protected their own reputations, and failed to connect warning signals that looked too dangerous or embarrassing to act on alone.";
  const whyItMatters =
    "The case showed that institutional protection can emerge without a formal conspiracy when fame, access, and self-protection all push in the same direction.";
  const takeaways = [
    "Reputation can become an operating shield",
    "Fragmented reporting helps abuse survive",
    "Institutions often fear scandal more than wrongdoing",
    "Celebrity access can distort ordinary safeguarding instincts",
  ];

  return {
    slug: "jimmy-savile",
    title: "Jimmy Savile",
    subtitle: "Institutional failure and celebrity immunity",
    summary,
    hiddenPattern,
    whyItMatters,
    primaryQuery: "Jimmy Savile",
    supportingQueries: ["BBC", "Stoke Mandeville Hospital"],
    preset: {
      ...caseSubject("Jimmy Savile", summary, hiddenPattern, whyItMatters, takeaways),
      narrative: {
        ...caseSubject("Jimmy Savile", summary, hiddenPattern, whyItMatters, takeaways).narrative,
        deepDive: [
          "Jimmy Savile's case is one of the clearest examples of distributed institutional failure. He was not protected by a single command structure so much as by many institutions each holding fragments of the pattern and each finding reasons not to act.",
          "Savile's public image was central to the shield. Celebrity, charity work, elite proximity, and eccentric persona altered how warning signs were interpreted. Behaviour that might have looked alarming in someone else was dismissed as part of his public character.",
          "Hospitals and the BBC mattered because they converted reputation into access. A broadcaster gave Savile status and legitimacy; hospitals and charities gave him unsupervised proximity that should have triggered much harder safeguarding boundaries.",
          "The deeper lesson is that institutions can enable harm without openly conspiring. Fear of scandal, fragmentation of information, and over-respect for status can together produce a remarkably durable form of protection.",
        ],
        systemFailures: [
          "Multiple institutions held partial warnings but lacked systems to connect them into one actionable picture.",
          "Celebrity and charitable image created a halo effect that raised the psychological barrier to challenge.",
          "Hospitals, broadcasters, and police often treated reputational risk as a more immediate problem than wrongdoing itself.",
          "Access to elite figures and public honours made people assume someone else must already have checked him properly.",
        ],
        timeline: [
          {
            date: "1960s–2000s",
            event: "Savile accumulated fame, charity status, and institutional access across broadcasting, hospitals, and public life.",
            source: "Public record",
          },
          {
            date: "Across multiple years",
            event: "Complaints, warnings, and rumours surfaced in fragmented ways across organisations and police systems.",
            source: "Institutional reviews",
          },
          {
            date: "2011",
            event: "Savile died before the full scale of the pattern had been publicly confronted.",
            source: "Public record",
          },
          {
            date: "2012 onward",
            event: "Posthumous reporting and reviews exposed how many institutions had missed, minimised, or failed to connect warning signals.",
            source: "Posthumous investigations",
          },
        ],
      },
      articles: [
        article("Rumours circulate without action", "Institutional reviews", "The key failure was not a lack of whispers, but a lack of coordinated intervention.", "Reputation shielding"),
        article("BBC and hospitals exposed", "Public inquiry reporting", "Multiple respected institutions were implicated by proximity, access, and deference.", "Institutional failure"),
        article("Celebrity untouchability collapses", "Posthumous investigations", "The scale of abuse forced a wider reckoning with status and safeguarding.", "Systemic protection"),
        article("Charity becomes a shield", "Safeguarding analysis", "Public benevolence and fundraising softened scrutiny instead of sharpening it.", "Prestige camouflage"),
      ],
      graph: {
        nodes: [
          { id: "core", label: "Jimmy Savile", kind: "subject", type: "Case study", person: caseSubject("Jimmy Savile", summary, hiddenPattern, whyItMatters, takeaways).person, position: [0, 0, 0], summary },
          node("savile", "Jimmy Savile", "person", "Celebrity broadcaster", "Savile cultivated eccentricity, charity, and elite access as part of a public image that deflected challenge.", ["The case is about the network around a celebrity, not just the celebrity himself."], [4.4, 0.7, 0.2]),
          node("bbc", "BBC", "institution", "National broadcaster", "The BBC provided prestige, platform, and status reinforcement that made rumours harder to process internally.", ["Institutional brand power helped shield Savile."], [-4.6, 1.2, 0.8]),
          node("hospital", "Stoke Mandeville Hospital", "institution", "Hospital access point", "One of the institutional sites that exposed how fame translated into unsupervised access.", ["Charity and visibility opened doors that should have been controlled."], [2.9, -3.1, 0.6]),
          node("police", "Police and reporting systems", "institution", "Fragmented accountability", "Multiple reports and warnings failed to aggregate into timely action.", ["Fragmentation worked in Savile's favour."], [-2.7, -3.0, -0.7]),
          node("charity", "Charity persona", "event", "Reputation shield", "High-profile charity work became part of the legitimacy structure around Savile.", ["Public benevolence can become institutional camouflage."], [0.6, 4.0, -0.5]),
          node("review", "Posthumous reviews", "article", "System exposure", "Only after death did institutions fully revisit how many warnings were discounted.", ["Retrospective review exposed the scale of shared failure."], [5.0, -1.6, -1.1]),
        ],
        edges: [
          ["core", "savile"],
          ["core", "bbc"],
          ["core", "hospital"],
          ["core", "police"],
          ["core", "charity"],
          ["core", "review"],
          ["savile", "bbc"],
          ["savile", "hospital"],
          ["savile", "charity"],
          ["bbc", "review"],
          ["police", "review"],
        ],
      },
    },
  } satisfies ExposeCaseStudy;
})();

const PHONE_HACKING = (() => {
  const summary =
    "The phone-hacking scandal made visible a triangular relationship between major newspapers, politicians, and police in which each side depended on the others in ways that weakened accountability.";
  const hiddenPattern =
    "Media organisations wanted access and influence, politicians wanted endorsements and softer coverage, and police wanted both legitimacy and protection from hostile headlines.";
  const whyItMatters =
    "The scandal showed how mutual dependency can be as corrosive as direct corruption when every side has something to lose from real scrutiny.";
  const takeaways = [
    "Political media dependency distorts accountability",
    "Police caution can reflect power, not uncertainty",
    "Large outlets shape both narratives and incentives",
    "Scandal breaks when competing institutions can no longer protect one another",
  ];

  return {
    slug: "phone-hacking",
    title: "News International Phone Hacking",
    subtitle: "Media influence, political dependency, and fear",
    summary,
    hiddenPattern,
    whyItMatters,
    primaryQuery: "Rupert Murdoch",
    supportingQueries: ["News International", "News of the World"],
    preset: {
      ...caseSubject("News International Phone Hacking", summary, hiddenPattern, whyItMatters, takeaways),
      narrative: {
        ...caseSubject("News International Phone Hacking", summary, hiddenPattern, whyItMatters, takeaways).narrative,
        deepDive: [
          "Phone hacking was never just a newsroom misconduct story. It exposed a triangle of dependency between powerful newspapers, politicians, and police in which each side had reasons not to challenge the others too aggressively.",
          "Politicians courted Murdoch-owned media because endorsement and softer coverage mattered electorally. That made media executives powerful not simply because they owned newspapers, but because others believed those newspapers could shape careers and governments.",
          "The police dimension mattered because policing and the press had become too entangled. Informal relationships, mutual benefit, and fear of retaliation blurred the line between scrutiny and accommodation.",
          "The scandal became unstoppable when public outrage widened beyond celebrities and politicians to ordinary people and crime victims. At that point the old settlement between power, access, and aggressive reporting could no longer protect itself.",
        ],
        systemFailures: [
          "Politicians depended on major newspapers for support and feared retaliation from hostile coverage.",
          "Police relationships with powerful media groups weakened the distance needed for impartial investigation.",
          "Institutions that should have checked one another instead became too interdependent to act cleanly.",
          "Commercial pressure inside tabloid journalism rewarded escalation and punished restraint.",
        ],
        timeline: [
          {
            date: "2000s",
            event: "Voicemail interception and other intrusive methods became embedded within parts of the tabloid reporting culture.",
            source: "Inquiry reporting",
          },
          {
            date: "2006",
            event: "Early convictions suggested the issue was more than one rogue reporter, but the wider system was slow to accept that.",
            source: "Court / media reporting",
          },
          {
            date: "2011",
            event: "Public outrage surged when the scale and targets of hacking became impossible to dismiss as elite-only collateral.",
            source: "Public reporting",
          },
          {
            date: "2011 onward",
            event: "The News of the World closed and the Leveson Inquiry turned a media scandal into a constitutional reckoning about press power.",
            source: "Corporate action / inquiry",
          },
        ],
      },
      articles: [
        article("Voicemail interception becomes systemic scandal", "Inquiry reporting", "What began as newsroom misconduct widened into a crisis of power and access.", "Illegal reporting culture"),
        article("Politicians and police pulled into the frame", "Parliamentary scrutiny", "The scandal mattered because institutions around the press were implicated too.", "Mutual dependency"),
        article("News of the World closes", "Corporate action", "The closure became the visible sign that the old equilibrium had failed.", "Collapse of protection"),
        article("Fear shapes the triangle", "Institutional analysis", "The deeper problem was a shared incentive structure built on access, fear, and reputational risk.", "Access trading"),
      ],
      graph: {
        nodes: [
          { id: "core", label: "Phone Hacking", kind: "subject", type: "Case study", person: caseSubject("News International Phone Hacking", summary, hiddenPattern, whyItMatters, takeaways).person, position: [0, 0, 0], summary },
          node("murdoch", "Rupert Murdoch", "person", "Media owner", "The owner whose political influence became inseparable from the scandal's wider meaning.", ["Ownership structure mattered because influence flowed through it."], [4.6, 0.9, 0.2]),
          node("ni", "News International", "company", "Media group", "The corporate hub linking newspapers, political access, and newsroom practices.", ["The company sat at the center of the dependency triangle."], [-4.6, 1.1, 0.7]),
          node("notw", "News of the World", "company", "Tabloid newspaper", "The newspaper ultimately closed after the hacking scandal became impossible to contain.", ["The closure symbolised the breakdown of informal protection."], [2.8, -3.0, 0.8]),
          node("politicians", "Prime ministers and parties", "institution", "Political dependency", "Leaders across parties cultivated Murdoch media because endorsement and coverage mattered electorally.", ["Access to the press changed political behaviour."], [-2.8, -3.1, -0.8]),
          node("police", "Metropolitan Police", "institution", "Law-enforcement relationship", "Police were criticised for moving too cautiously around a powerful media organisation.", ["Fear of press power shaped enforcement incentives."], [0.8, 4.1, -0.5]),
          node("leveson", "Leveson Inquiry", "event", "Public reckoning", "The inquiry converted private influence dynamics into a visible constitutional problem.", ["Formal inquiry was needed because normal checks had failed."], [5.1, -1.7, -1.3]),
          node("victims", "Victims and public outrage", "article", "Moral turning point", "The scandal became politically unstoppable once the scale of intrusion hit crime victims and ordinary people.", ["Public disgust broke the old settlement."], [-5.0, -1.3, 1.5]),
        ],
        edges: [
          ["core", "murdoch"],
          ["core", "ni"],
          ["core", "notw"],
          ["core", "politicians"],
          ["core", "police"],
          ["core", "leveson"],
          ["core", "victims"],
          ["murdoch", "ni"],
          ["ni", "notw"],
          ["ni", "politicians"],
          ["ni", "police"],
          ["victims", "leveson"],
          ["police", "leveson"],
        ],
      },
    },
  } satisfies ExposeCaseStudy;
})();

const CITY = (() => {
  const summary =
    "The City of London network is less a single scandal than a structural case study in how finance, regulation, law, and government can align through repeated overlap, shared assumptions, and revolving doors.";
  const hiddenPattern =
    "Power accumulates through repeated movement between banks, regulators, advisers, law firms, and the Treasury rather than through one visible plot.";
  const whyItMatters =
    "This kind of network matters because it can shape policy, crisis response, and regulatory ambition without needing overt illegality or a single central mastermind.";
  const takeaways = [
    "Revolving doors create soft alignment",
    "Shared assumptions can matter more than formal lobbying",
    "Financial power often works through structural proximity",
    "Influence can be real even when no single act is corrupt",
  ];

  return {
    slug: "city-of-london",
    title: "The City of London Network",
    subtitle: "Britain’s quiet financial power structure",
    summary,
    hiddenPattern,
    whyItMatters,
    primaryQuery: "City of London",
    supportingQueries: ["Bank of England", "HM Treasury"],
    preset: {
      ...caseSubject("The City of London Network", summary, hiddenPattern, whyItMatters, takeaways),
      articles: [
        article("The revolving door normalises overlap", "Policy commentary", "Personnel movement softens the edge between regulator, adviser, and market participant.", "Revolving-door culture"),
        article("The City after crisis and Brexit", "Economic analysis", "Moments of stress reveal just how central finance is to UK statecraft.", "Policy influence"),
        article("Power without a single villain", "Institutional analysis", "This network works through incentives and proximity rather than one dramatic scandal.", "Structural influence"),
      ],
      graph: {
        nodes: [
          { id: "core", label: "City of London Network", kind: "subject", type: "Case study", person: caseSubject("The City of London Network", summary, hiddenPattern, whyItMatters, takeaways).person, position: [0, 0, 0], summary },
          node("city", "City of London", "institution", "Financial hub", "A geographically small but globally influential ecosystem of finance, law, accounting, and state access.", ["The network is structural rather than personality-driven."], [4.5, 0.8, 0.2]),
          node("boe", "Bank of England", "institution", "Central bank", "A key node where monetary policy, supervision, and elite financial culture meet.", ["Personnel overlap and shared assumptions are part of the story."], [-4.5, 1.0, 0.7]),
          node("treasury", "HM Treasury", "institution", "Fiscal and policy center", "A core state institution whose relationship with the City shapes crisis response and policy design.", ["Treasury-City proximity is one of the UK's defining power relationships."], [2.8, -3.1, 0.6]),
          node("banks", "Major investment banks", "company", "Private-sector power", "Banks are central not only economically but socially, through recruitment, advisory channels, and policy access.", ["Market actors feed into the public-policy conversation continuously."], [-2.9, -3.2, -0.8]),
          node("law", "Elite law and accounting firms", "company", "Professional services", "The legal and advisory layer helps move people, expertise, and norms across the same ecosystem.", ["These firms connect capital, regulation, and government."], [0.8, 4.0, -0.5]),
          node("revolving", "Revolving door", "event", "Career circulation", "The most important mechanism is often normalised career movement rather than overt scandal.", ["Influence accumulates through repeated role-switching."], [5.0, -1.6, -1.2]),
          node("crisis", "2008 crisis / austerity / Brexit", "article", "Stress tests", "Moments of crisis reveal how strongly the system is organised around preserving financial-sector stability.", ["The network becomes most visible when the stakes are highest."], [-5.0, -1.5, 1.4]),
        ],
        edges: [
          ["core", "city"],
          ["core", "boe"],
          ["core", "treasury"],
          ["core", "banks"],
          ["core", "law"],
          ["core", "revolving"],
          ["core", "crisis"],
          ["city", "boe"],
          ["city", "treasury"],
          ["city", "banks"],
          ["banks", "revolving"],
          ["law", "revolving"],
          ["treasury", "crisis"],
          ["boe", "crisis"],
        ],
      },
    },
  } satisfies ExposeCaseStudy;
})();

const MONE_PPE = (() => {
  const summary =
    "The Michelle Mone and PPE Medpro case became a textbook example of how political access, emergency procurement, and hidden financial benefit can sit behind repeated public denials.";
  const hiddenPattern =
    "A politically connected intermediary helped route a company into the VIP lane, while ownership, trust structures, and public messaging kept the financial link less visible than the access itself.";
  const whyItMatters =
    "Citizens were asked to trust emergency spending decisions made at speed, but this case raised the question of whether private relationships were steering public money without the scrutiny ordinary suppliers faced.";
  const takeaways = [
    "Political access can matter more than ordinary procurement rules",
    "A denial can hide financial benefit even when the paper trail exists",
    "Emergency processes can widen the gap between insiders and everyone else",
    "Following the money explains more than the headline row alone",
  ];

  return {
    slug: "michelle-mone-ppe-medpro",
    title: "Michelle Mone and PPE Medpro",
    subtitle: "VIP lane access, denials, and the money trail",
    summary,
    hiddenPattern,
    whyItMatters,
    primaryQuery: "Michelle Mone PPE",
    supportingQueries: ["Michelle Mone", "PPE Medpro"],
    aliases: ["Doug Barrowman", "PPE Medpro Ltd", "Mone PPE", "Michelle Mone PPE Medpro"],
    preset: {
      ...caseSubject(
        "Michelle Mone and PPE Medpro",
        summary,
        hiddenPattern,
        whyItMatters,
        takeaways,
      ),
      narrative: {
        ...caseSubject(
          "Michelle Mone and PPE Medpro",
          summary,
          hiddenPattern,
          whyItMatters,
          takeaways,
        ).narrative,
        timeline: [
          {
            date: "May 2020",
            event: "Michelle Mone referred PPE Medpro through a private WhatsApp channel during the pandemic procurement rush.",
            publicLine: "Publicly, she denied involvement.",
            source: "NCA documents / reported evidence",
          },
          {
            date: "July 2020",
            event: "PPE Medpro received an £80m contract, then a second award worth roughly £122m through the high-priority lane.",
            source: "Contracts Finder",
          },
          {
            date: "October 2020",
            event: "About £29m was transferred into an Isle of Man trust linked to Michelle Mone and Doug Barrowman as beneficiaries.",
            publicLine: "Publicly, she said she had nothing to do with the contracts.",
            source: "Pandora Papers / reported trust records",
          },
          {
            date: "December 2023",
            event: "In a BBC interview, Mone admitted she had lied and said she did benefit financially.",
            publicLine: "\"I did benefit financially.\"",
            source: "BBC interview",
          },
        ],
      },
      articles: [
        article(
          "WhatsApp referral opens the door",
          "NCA documents",
          "The key starting point was not a public tender win alone, but a private referral into a favoured government channel.",
          "VIP access",
        ),
        article(
          "PPE Medpro wins two large contracts",
          "Contracts Finder",
          "The company secured two major PPE deals during the emergency procurement period.",
          "Public money",
        ),
        article(
          "Trust transfer follows the awards",
          "Pandora Papers reporting",
          "A large transfer into an Isle of Man trust sharpened questions about who financially benefited.",
          "Money trail",
        ),
        article(
          "BBC interview reverses the denial",
          "BBC",
          "Mone later admitted she had lied about her role and acknowledged financial benefit.",
          "Public contradiction",
        ),
      ],
      graph: {
        nodes: [
          {
            id: "core",
            label: "Michelle Mone and PPE Medpro",
            kind: "subject",
            type: "Case study",
            person: caseSubject(
              "Michelle Mone and PPE Medpro",
              summary,
              hiddenPattern,
              whyItMatters,
              takeaways,
            ).person,
            position: [0, 0, 0],
            summary,
          },
          node(
            "mone",
            "Michelle Mone",
            "person",
            "Politically connected intermediary",
            "A Conservative peer whose access mattered because she referred PPE Medpro while publicly denying meaningful involvement.",
            [
              "The contradiction sits between public denial and the later admission of financial benefit.",
            ],
            [4.8, 0.9, 0.4],
            [{ label: "Role", value: "House of Lords peer" }],
          ),
          node(
            "medpro",
            "PPE Medpro Ltd",
            "company",
            "Contract recipient",
            "The company that received large pandemic PPE contracts through the VIP lane.",
            [
              "Its success depended on access as much as capability.",
              "The later quality disputes made the award process more politically explosive.",
            ],
            [-4.7, 1.1, 0.7],
            [{ label: "Sector", value: "PPE supply" }],
          ),
          node(
            "barrowman",
            "Doug Barrowman",
            "person",
            "Financial link",
            "Mone's husband and the figure tied to the company and later financial benefit allegations.",
            [
              "He matters because the money trail does not stop at the company.",
            ],
            [2.7, -3.1, 0.8],
            [{ label: "Connection", value: "Husband / linked beneficiary" }],
          ),
          node(
            "vip",
            "VIP lane",
            "institution",
            "Fast-track procurement route",
            "A government procurement route that gave politically connected referrals a much better chance of success than ordinary suppliers.",
            [
              "Reportedly 47 companies entered this route for around £3.8bn in contracts.",
              "Success rates were far higher than in the normal channel.",
            ],
            [-2.8, -3.0, -0.8],
            [{ label: "Context", value: "Emergency procurement" }],
          ),
          node(
            "contracts",
            "£80m + £122m contracts",
            "event",
            "Awarded contracts",
            "Two large PPE awards turned a private referral into a major public-spending decision.",
            [
              "The speed and scale made scrutiny harder at the moment decisions were being made.",
            ],
            [0.9, 4.1, -0.5],
            [{ label: "Source", value: "Contracts Finder" }],
          ),
          node(
            "trust",
            "£29m Isle of Man trust",
            "event",
            "Money transfer",
            "A transfer into an offshore trust sharpened the question of who really benefited.",
            [
              "The trust structure matters because it moved the story from access to direct financial gain.",
            ],
            [5.1, -1.8, -1.3],
            [{ label: "Source", value: "Pandora Papers reporting" }],
          ),
          node(
            "bbc",
            "BBC admission",
            "article",
            "Public reversal",
            "The moment the public denial cracked and Mone acknowledged financial benefit.",
            [
              "This turned a disputed allegation into an admitted contradiction.",
            ],
            [-5.1, -1.4, 1.5],
            [{ label: "Date", value: "December 2023" }],
          ),
          node(
            "nhs",
            "Unusable gowns dispute",
            "article",
            "Product failure",
            "Part of the supplied PPE was later challenged as unusable, raising the stakes beyond access and into waste.",
            [
              "The controversy was not just who got paid, but what the public received.",
            ],
            [3.4, 3.2, 1.1],
            [{ label: "Context", value: "NHS rejection reporting" }],
          ),
        ],
        edges: [
          ["core", "mone"],
          ["core", "medpro"],
          ["core", "barrowman"],
          ["core", "vip"],
          ["core", "contracts"],
          ["core", "trust"],
          ["core", "bbc"],
          ["core", "nhs"],
          ["mone", "vip"],
          ["mone", "medpro"],
          ["medpro", "contracts"],
          ["contracts", "trust"],
          ["barrowman", "medpro"],
          ["barrowman", "trust"],
          ["vip", "contracts"],
          ["mone", "bbc"],
          ["medpro", "nhs"],
        ],
      },
    },
  } satisfies ExposeCaseStudy;
})();

export const EXPOSE_CASE_STUDIES: ExposeCaseStudy[] = [
  PROFUMO,
  CAMBRIDGE_FIVE,
  MAXWELL,
  SAVILE,
  PHONE_HACKING,
  CITY,
  MONE_PPE,
];

function normalizeQuery(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function getCaseStudyPreset(query: string): ResearchData | null {
  const key = normalizeQuery(query);
  const study = EXPOSE_CASE_STUDIES.find((entry) => {
    const allQueries = [
      entry.title,
      entry.primaryQuery,
      ...entry.supportingQueries,
      ...(entry.aliases ?? []),
    ];
    return allQueries.some((item) => normalizeQuery(item) === key);
  });
  return study?.preset ?? null;
}
