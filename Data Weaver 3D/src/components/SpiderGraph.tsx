import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Billboard } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

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

export type ResearchData = {
  person: Person;
  articles: Article[];
};

type DataNode = {
  id: string;
  label: string;
  type: string;
  position: [number, number, number];
  kind: "person" | "article";
  person?: Person;
  article?: Article;
};

// Stable positions arranged on a sphere around the core.
function distributePositions(count: number, radius = 4): [number, number, number][] {
  if (count <= 0) return [];
  const pts: [number, number, number][] = [];
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    pts.push([Math.cos(phi) * r * radius, y * radius, Math.sin(phi) * r * radius]);
  }
  return pts;
}

function deriveGraphArticles(data: ResearchData): Article[] {
  if (data.articles.length > 0) return data.articles;

  const fallback: Article[] = [];

  if (data.person.netWorth) {
    fallback.push({
      title: `${data.person.name} net worth`,
      source: "Public record",
      summary: `Estimated net worth: ${data.person.netWorth}.`,
      concern: "Net worth",
      url: "",
      verified: true,
      stanceIndex: null,
    });
  }

  for (const residence of data.person.residences ?? []) {
    fallback.push({
      title: `${data.person.name} residence`,
      source: "Public record",
      summary: `Reported permanent residence: ${residence}.`,
      concern: "Where they live",
      url: "",
      verified: true,
      stanceIndex: null,
    });
  }

  for (const statement of data.person.publicStatements ?? []) {
    fallback.push({
      title: statement.quote,
      source: statement.source,
      summary: statement.context,
      concern: "Public statement",
      url: statement.url,
      verified: statement.verified,
      stanceIndex: null,
    });
  }

  for (const ref of data.person.crossReferences ?? []) {
    fallback.push({
      title: ref.said,
      source: ref.source,
      summary: ref.did,
      concern: "Cross reference",
      url: ref.url,
      verified: ref.verified,
      stanceIndex: null,
    });
  }

  return fallback;
}

function buildNodes(data: ResearchData): { nodes: DataNode[]; edges: [string, string][] } {
  const graphArticles = deriveGraphArticles(data);
  const positions = distributePositions(graphArticles.length, 4.2);
  const nodes: DataNode[] = [
    {
      id: "core",
      label: data.person.name,
      type: data.person.role || "Subject",
      position: [0, 0, 0],
      kind: "person",
      person: data.person,
    },
    ...graphArticles.map((a, i) => ({
      id: `a${i}`,
      label: a.concern,
      type: a.source,
      position: positions[i],
      kind: "article" as const,
      article: a,
    })),
  ];
  const edges: [string, string][] = graphArticles.map((_, i) => ["core", `a${i}`]);
  // a few interconnections between articles for visual richness
  for (let i = 0; i < graphArticles.length; i++) {
    const j = (i + 2) % graphArticles.length;
    if (i !== j) edges.push([`a${i}`, `a${j}`]);
  }
  return { nodes, edges };
}

function NodeCard({
  node,
  onHover,
  onOpen,
  isActive,
}: {
  node: DataNode;
  onHover: (n: DataNode | null) => void;
  onOpen: (n: DataNode) => void;
  isActive: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const basePos = useRef(new THREE.Vector3(...node.position));

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const seed = node.id.charCodeAt(0) + (node.id.charCodeAt(1) || 0);
    const offset = Math.sin(t * 0.6 + seed) * 0.08;
    groupRef.current.position.set(
      basePos.current.x,
      basePos.current.y + offset,
      basePos.current.z,
    );
    const base = node.kind === "person" ? 2.2 : 1;
    const target = isActive ? base * 1.15 : base;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.15);
    groupRef.current.scale.setScalar(s);
  });

  const isCore = node.kind === "person";
  const accent = "#0f4d33";
  const ink = "#0f2a1f";
  const paper = "#f3f1e7";

  return (
    <group ref={groupRef}>
      <Billboard>
        <Html center distanceFactor={6} zIndexRange={[10, 0]} style={{ pointerEvents: "auto" }}>
          <div
            onPointerEnter={() => {
              onHover(node);
              document.body.style.cursor = "pointer";
            }}
            onPointerLeave={() => {
              onHover(null);
              document.body.style.cursor = "auto";
            }}
            style={{
              borderColor: isActive ? accent : "rgba(15,42,31,0.25)",
              boxShadow: isActive
                ? `0 8px 28px rgba(15,77,51,0.25), 0 0 0 1px ${accent}`
                : `0 4px 14px rgba(15,42,31,0.12)`,
              background: paper,
              color: ink,
            }}
            className="select-none rounded-md border-2 transition-all duration-200"
          >
            <div
              className="flex items-center gap-2 rounded-t-sm px-3 py-2"
              style={{
                background: isCore ? accent : "rgba(15,77,51,0.08)",
                color: isCore ? paper : ink,
                borderBottom: `1px solid ${isCore ? accent : "rgba(15,42,31,0.15)"}`,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: isCore ? paper : accent }}
              />
              <div className="flex flex-col leading-tight">
                <span
                  className="font-bold"
                  style={{ fontSize: isCore ? 13 : 11, maxWidth: isCore ? 200 : 180 }}
                >
                  {node.label}
                </span>
                <span
                  className="text-[9px] uppercase tracking-widest"
                  style={{ color: isCore ? "rgba(243,241,231,0.7)" : "rgba(15,42,31,0.5)" }}
                >
                  {node.type}
                </span>
              </div>
            </div>

            {isActive && (
              <div className="w-60 px-3 py-2.5">
                {isCore && node.person ? (
                  <>
                    <p className="mb-2 text-[10px] leading-snug text-[#0f2a1f]/80">
                      {truncate(node.person.bio, 140)}
                    </p>
                    <div className="mb-2 grid grid-cols-2 gap-1.5">
                      <Stat label="Country" value={node.person.country} />
                      <Stat label="Leaning" value={node.person.leaning} />
                    </div>
                  </>
                ) : node.article ? (
                  <>
                    <p className="mb-2 text-[10px] leading-snug text-[#0f2a1f]/80">
                      {truncate(node.article.summary, 160)}
                    </p>
                    <div className="mb-2 rounded border border-[#0f2a1f]/15 bg-[#0f4d33]/5 px-2 py-1">
                      <div className="text-[8px] uppercase tracking-wider text-[#0f2a1f]/50">
                        Source
                      </div>
                      <div className="text-[11px] font-bold text-[#0f2a1f]">
                        {node.article.source}
                      </div>
                    </div>
                  </>
                ) : null}

                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(node);
                  }}
                  className="group/btn flex w-full items-center justify-between rounded-sm bg-[#0f4d33] px-2.5 py-1.5 text-[10px] uppercase tracking-widest text-[#f3f1e7] transition-colors hover:bg-[#0a3a26]"
                >
                  <span>More info</span>
                  <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
                </button>
              </div>
            )}
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[#0f2a1f]/15 bg-[#0f4d33]/5 px-2 py-1">
      <div className="text-[8px] uppercase tracking-wider text-[#0f2a1f]/50">{label}</div>
      <div className="text-[11px] font-bold text-[#0f2a1f]">{value}</div>
    </div>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}



function Edge({
  from,
  to,
  active,
}: {
  from: [number, number, number];
  to: [number, number, number];
  active: boolean;
}) {
  const ref = useRef<THREE.LineSegments>(null!);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([...from, ...to], 3));
    return g;
  }, [from, to]);

  useFrame((s) => {
    const m = ref.current.material as THREE.LineBasicMaterial;
    m.opacity = active ? 0.95 : 0.28 + Math.sin(s.clock.elapsedTime * 1.5) * 0.05;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color={active ? "#0f4d33" : "#0f2a1f"} transparent />
    </lineSegments>
  );
}

function PulsePacket({
  from,
  to,
  speed,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    const t = (s.clock.elapsedTime * speed) % 1;
    ref.current.position.lerpVectors(from, to, t);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshBasicMaterial color="#0f4d33" />
    </mesh>
  );
}

function Scene({
  nodes,
  edges,
  onOpen,
}: {
  nodes: DataNode[];
  edges: [string, string][];
  onOpen: (n: DataNode) => void;
}) {
  const [hovered, setHovered] = useState<DataNode | null>(null);
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    const targetSpeed = hovered ? 0.0 : 0.08;
    groupRef.current.rotation.y += targetSpeed * 0.016;
  });

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const packets = useMemo(
    () =>
      edges.slice(0, nodes.length).map(([a, b], i) => ({
        from: new THREE.Vector3(...nodeMap[a].position),
        to: new THREE.Vector3(...nodeMap[b].position),
        speed: 0.25 + (i % 5) * 0.07,
        key: `${a}-${b}`,
      })),
    [edges, nodeMap, nodes.length],
  );

  return (
    <group ref={groupRef}>
      {edges.map(([a, b]) => (
        <Edge
          key={`${a}-${b}`}
          from={nodeMap[a].position}
          to={nodeMap[b].position}
          active={hovered?.id === a || hovered?.id === b}
        />
      ))}
      {packets.map((p) => (
        <PulsePacket key={p.key} from={p.from} to={p.to} speed={p.speed} />
      ))}
      {nodes.map((n) => (
        <NodeCard
          key={n.id}
          node={n}
          onHover={setHovered}
          onOpen={onOpen}
          isActive={hovered?.id === n.id}
        />
      ))}
    </group>
  );
}

function DetailPanel({ node, stances, onClose }: { node: DataNode; stances: string[]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isPerson = node.kind === "person" && node.person;
  const isArticle = node.kind === "article" && node.article;

  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2a1f]/40 p-4 backdrop-blur-sm md:p-8">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <article className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden border-2 border-[#0f2a1f]/20 bg-[#f3f1e7] text-[#0f2a1f] shadow-2xl">
        <header className="flex items-center justify-between border-b border-[#0f2a1f]/15 px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] text-[#0f2a1f]/70">
          <div className="font-bold tracking-[0.3em] text-[#0f2a1f]">Exposé.</div>
          <div className="hidden md:block">Subject brief · {time}</div>
          <button
            onClick={onClose}
            className="rounded bg-[#0f4d33] px-2.5 py-1 text-[#f3f1e7] transition-colors hover:bg-[#0a3a26]"
          >
            Close ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {isPerson && node.person && (
            <div className="px-6 py-8 md:px-10 md:py-12">
              {node.person.imageUrl && (
                <img
                  src={node.person.imageUrl}
                  alt={node.person.name}
                  className="float-left mr-6 mb-4 w-40 rounded-sm border border-[#0f2a1f]/15 bg-[#0f4d33]/5 object-cover shadow-sm sm:w-56 md:mr-8 md:mb-6 md:w-72"
                  draggable={false}
                />
              )}
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#0f2a1f]/55">
                  Subject
                </div>
                <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-5xl">
                  {node.person.name}
                  <span className="text-[#0f4d33]">.</span>
                </h1>
                <div className="mt-2 text-xs uppercase tracking-[0.25em] text-[#0f4d33]">
                  {node.person.role}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Field label="Country" value={node.person.country} />
                  <Field label="Leaning" value={node.person.leaning} />
                  <Field label="Role" value={node.person.role} />
                  <Field label="Est. net worth" value={node.person.netWorth || "—"} />
                </div>

                {node.person.residences && node.person.residences.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#0f2a1f]/55">
                      Permanently lives
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {node.person.residences.map((r, i) => (
                        <li
                          key={i}
                          className="rounded-sm border border-[#0f2a1f]/15 bg-[#0f4d33]/5 px-2.5 py-1 text-xs text-[#0f2a1f]/85"
                        >
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6">
                  <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#0f2a1f]/55">
                    About
                  </div>
                  <p className="max-w-prose text-sm leading-relaxed text-[#0f2a1f]/85 md:text-base">
                    {node.person.bio || "No biography available."}
                  </p>
                </div>

                {node.person.stances && node.person.stances.length > 0 && (
                  <div className="mt-8 border-t border-[#0f2a1f]/15 pt-6">
                    <div className="mb-3 flex items-baseline gap-3">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#0f2a1f]/55">
                        What they <span className="font-serif italic text-[#0f4d33]">say</span> they stand for
                      </div>
                      <div className="text-[9px] uppercase tracking-[0.25em] text-[#7a2e1c]">
                        Compare against signals →
                      </div>
                    </div>
                    <ul className="grid gap-2 md:grid-cols-2">
                      {node.person.stances.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 rounded border border-[#0f2a1f]/15 bg-[#0f4d33]/5 p-3 text-sm text-[#0f2a1f]/90"
                        >
                          <span className="mt-[2px] font-mono text-[10px] font-bold text-[#0f4d33]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {node.person.publicStatements && node.person.publicStatements.length > 0 && (
                  <div className="mt-8 border-t border-[#0f2a1f]/15 pt-6">
                    <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#0f2a1f]/55">
                      Public <span className="font-serif italic text-[#0f4d33]">statements</span>
                    </div>
                    <ul className="space-y-3">
                      {node.person.publicStatements.map((s, i) => (
                        <li
                          key={i}
                          className="rounded border border-[#0f2a1f]/15 bg-[#0f4d33]/5 p-3"
                        >
                          <p className="font-serif text-sm italic leading-snug text-[#0f2a1f]/90 md:text-base">
                            “{s.quote}”
                          </p>
                          {s.context && (
                            <p className="mt-1 text-xs text-[#0f2a1f]/65">{s.context}</p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-widest text-[#0f2a1f]/55">
                            <span>{s.source}</span>
                            {s.date && <span className="text-[#0f2a1f]/35">· {s.date}</span>}
                            <span
                              className={
                                s.verified
                                  ? "rounded-sm bg-[#0f4d33]/15 px-1.5 py-[1px] text-[#0f4d33]"
                                  : "rounded-sm bg-[#7a2e1c]/15 px-1.5 py-[1px] text-[#7a2e1c]"
                              }
                            >
                              {s.verified ? "verified" : "search"}
                            </span>
                            {s.url && (
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noreferrer"
                                className="normal-case tracking-normal text-[#0f4d33] underline-offset-2 hover:underline"
                              >
                                {hostFromUrl(s.url) || "open"} ↗
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {node.person.crossReferences && node.person.crossReferences.length > 0 && (
                  <div className="mt-8 border-t border-[#0f2a1f]/15 pt-6">
                    <div className="mb-3 flex items-baseline gap-3">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#0f2a1f]/55">
                        Said <span className="font-serif italic text-[#7a2e1c]">vs</span> did
                      </div>
                      <div className="text-[9px] uppercase tracking-[0.25em] text-[#7a2e1c]">
                        Cross-reference
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {node.person.crossReferences.map((c, i) => (
                        <li
                          key={i}
                          className="grid gap-2 rounded border border-[#0f2a1f]/15 bg-[#f3f1e7] p-3 md:grid-cols-2 md:gap-4"
                        >
                          <div className="border-l-2 border-[#0f4d33]/40 pl-3">
                            <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#0f4d33]">
                              Said
                            </div>
                            <p className="mt-1 font-serif text-sm italic text-[#0f2a1f]/90">
                              “{c.said}”
                            </p>
                          </div>
                          <div className="border-l-2 border-[#7a2e1c]/40 pl-3">
                            <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#7a2e1c]">
                              Did
                            </div>
                            <p className="mt-1 text-sm text-[#0f2a1f]/85">{c.did}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-2 text-[10px] uppercase tracking-widest text-[#0f2a1f]/55">
                              <span>{c.source}</span>
                              <span
                                className={
                                  c.verified
                                    ? "rounded-sm bg-[#0f4d33]/15 px-1.5 py-[1px] text-[#0f4d33]"
                                    : "rounded-sm bg-[#7a2e1c]/15 px-1.5 py-[1px] text-[#7a2e1c]"
                                }
                              >
                                {c.verified ? "verified" : "search"}
                              </span>
                              {c.url && (
                                <a
                                  href={c.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="normal-case tracking-normal text-[#0f4d33] underline-offset-2 hover:underline"
                                >
                                  {hostFromUrl(c.url) || "open"} ↗
                                </a>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {isArticle && node.article && (
            <div className="px-6 py-8 md:px-10 md:py-12">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#7a2e1c]">
                Signal · {node.article.concern}
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
                {node.article.title}
                <span className="text-[#0f4d33]">.</span>
              </h1>
              <div className="mt-3 text-xs uppercase tracking-[0.25em] text-[#0f4d33]">
                Source · {node.article.source}
              </div>

              <div className="mt-8 max-w-3xl">
                <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#0f2a1f]/55">
                  Summary
                </div>
                <p className="text-sm leading-relaxed text-[#0f2a1f]/85 md:text-base">
                  {node.article.summary}
                </p>
                <div className="mt-6 rounded-md border border-[#7a2e1c]/25 bg-[#7a2e1c]/5 p-4">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#7a2e1c]">
                    Why it matters
                  </div>
                  <p className="mt-1 text-sm text-[#0f2a1f]/85">{node.article.concern}</p>
                </div>
                {node.article.stanceIndex !== null && stances[node.article.stanceIndex] && (
                  <div className="mt-6 rounded-md border border-[#0f4d33]/25 bg-[#0f4d33]/5 p-4">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#0f4d33]">
                      Contradicts stance #{String(node.article.stanceIndex + 1).padStart(2, "0")}
                    </div>
                    <p className="mt-1 font-serif text-base italic text-[#0f2a1f]/90">
                      “{stances[node.article.stanceIndex]}”
                    </p>
                  </div>
                )}
                <div className="mt-6 border-t border-[#0f2a1f]/15 pt-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#0f2a1f]/55">
                    <span>Citation</span>
                    <span
                      className={
                        node.article.verified
                          ? "rounded-sm bg-[#0f4d33]/15 px-1.5 py-0.5 text-[#0f4d33]"
                          : "rounded-sm bg-[#7a2e1c]/15 px-1.5 py-0.5 text-[#7a2e1c]"
                      }
                    >
                      {node.article.verified ? "Link verified" : "Link unverified — search fallback"}
                    </span>
                  </div>
                  <p className="mt-1 font-serif text-sm italic text-[#0f2a1f]/80">
                    {node.article.source}
                    {node.article.url ? `, ${hostFromUrl(node.article.url)}` : ""}. “{node.article.title}.”
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[#0f2a1f]/15 bg-[#0f4d33]/5 p-3">
      <div className="text-[9px] uppercase tracking-[0.22em] text-[#0f2a1f]/55">{label}</div>
      <div className="mt-0.5 text-sm font-bold text-[#0f2a1f]">{value}</div>
    </div>
  );
}

export function SpiderGraph({ data }: { data: ResearchData }) {
  const [selected, setSelected] = useState<DataNode | null>(null);
  const { nodes, edges } = useMemo(() => buildNodes(data), [data]);

  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: [0, 2, 11], fov: 55 }} dpr={[1, 2]} gl={{ alpha: true }} style={{ background: "transparent" }}>
        <fog attach="fog" args={["#f3f1e7", 14, 30]} />
        <ambientLight intensity={0.9} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#0f4d33" />
        <pointLight position={[-5, -3, -5]} intensity={0.4} color="#7a2e1c" />
        <Scene nodes={nodes} edges={edges} onOpen={setSelected} />
        <OrbitControls enablePan={false} minDistance={6} maxDistance={22} />
      </Canvas>
      {selected && <DetailPanel node={selected} stances={data.person.stances ?? []} onClose={() => setSelected(null)} />}
    </div>
  );
}
