export type Statement = {
  quote: string;
  context: string;
  date: string;
  source: string;
  url: string;
  verified: boolean;
};

export type CrossRef = {
  said: string;
  did: string;
  source: string;
  url: string;
  verified: boolean;
};

export type Person = {
  name: string;
  role: string;
  country: string;
  leaning: string;
  bio: string;
  stances: string[];
  imageUrl: string | null;
  netWorth?: string;
  residences?: string[];
  publicStatements?: Statement[];
  crossReferences?: CrossRef[];
};

export type Article = {
  title: string;
  source: string;
  summary: string;
  concern: string;
  url: string;
  verified: boolean;
  stanceIndex: number | null;
};

export type GraphNode = {
  id: string;
  label: string;
  type: string;
  position?: [number, number, number];
  kind: "subject" | "person" | "company" | "institution" | "event" | "article";
  summary?: string;
  details?: string[];
  source?: string;
  url?: string;
  verified?: boolean;
  metadata?: { label: string; value: string }[];
  person?: Person;
  article?: Article;
};

export type ResearchData = {
  person: Person;
  articles: Article[];
  mode?: "research" | "caseStudy";
  narrative?: {
    headline?: string;
    summary?: string;
    hiddenPattern?: string;
    whyItMatters?: string;
    takeaways?: string[];
    deepDive?: string[];
    systemFailures?: string[];
    timeline?: {
      date: string;
      event: string;
      publicLine?: string;
      source?: string;
    }[];
  };
  graph?: {
    nodes: GraphNode[];
    edges: [string, string][];
  };
};
