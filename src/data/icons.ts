// Blueprint-style icon set. Thin strokes, no fill, monoline.
// 24x24 viewBox, 1.25 stroke. Match the methodology-section aesthetic in index.astro.
// Same source-of-truth for static .astro pages and runtime JS (bills/translate.astro).

export type IconName =
  | "summary"
  | "stats"
  | "target"
  | "search"
  | "people"
  | "scales"
  | "book"
  | "calendar"
  | "check"
  | "pound"
  | "speech"
  | "warning"
  | "library"
  | "house"
  | "briefcase"
  | "leaf"
  | "shield"
  | "cabinet"
  | "graph";

export const ICON_PATHS: Record<IconName, string> = {
  // Section header icons
  summary:    `<rect x="5" y="3" width="14" height="18" rx="0.5"/><path d="M9 3v2h6V3"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>`,
  stats:      `<line x1="3" y1="21" x2="21" y2="21"/><rect x="5" y="13" width="3" height="8"/><rect x="10.5" y="9" width="3" height="12"/><rect x="16" y="5" width="3" height="16"/>`,
  target:     `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>`,
  search:     `<circle cx="11" cy="11" r="6"/><line x1="15.5" y1="15.5" x2="20" y2="20"/>`,
  people:     `<circle cx="9" cy="9" r="3"/><circle cx="17" cy="10.5" r="2.3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M14.5 20c0-2.4 1.9-4.3 4.3-4.3"/>`,
  scales:     `<path d="M12 4v17"/><line x1="6" y1="21" x2="18" y2="21"/><path d="M6 8h12l-3 7H9z"/><line x1="6" y1="8" x2="18" y2="8"/>`,
  book:       `<path d="M12 5v15"/><path d="M3 5c3 0 6 .5 9 2v15c-3-1.5-6-2-9-2z"/><path d="M21 5c-3 0-6 .5-9 2v15c3-1.5 6-2 9-2z"/>`,
  calendar:   `<rect x="3.5" y="5.5" width="17" height="15" rx="0.5"/><line x1="3.5" y1="10" x2="20.5" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>`,
  check:      `<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>`,
  pound:      `<circle cx="12" cy="12" r="9"/><path d="M9 17h7"/><path d="M15 11.5h-6"/><path d="M9.5 17c2-1 2-3.5 2-5 0-2.5 1-4 3.5-4 1.2 0 2 .5 2.5 1"/>`,
  speech:     `<path d="M4 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>`,
  warning:    `<path d="M12 3l10 18H2z"/><line x1="12" y1="10" x2="12" y2="15"/><circle cx="12" cy="18" r="0.8" fill="currentColor"/>`,
  library:    `<rect x="3.5" y="4" width="3" height="16"/><rect x="7.5" y="4" width="3" height="16"/><rect x="13" y="6" width="3" height="14" transform="rotate(-12 14.5 13)"/><line x1="2" y1="20.5" x2="20" y2="20.5"/>`,

  // Topical / bill thumbnail icons
  house:      `<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><rect x="10" y="14" width="4" height="6"/>`,
  briefcase:  `<rect x="3" y="7" width="18" height="13" rx="0.5"/><path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><line x1="3" y1="13" x2="21" y2="13"/>`,
  leaf:       `<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/><path d="M5 19c4-4 7-7 14-14"/>`,
  shield:     `<path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>`,
  cabinet:    `<rect x="4" y="4" width="16" height="16" rx="0.5"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="4" y1="14.5" x2="20" y2="14.5"/><circle cx="12" cy="7" r="0.6" fill="currentColor"/><circle cx="12" cy="12.25" r="0.6" fill="currentColor"/><circle cx="12" cy="17.25" r="0.6" fill="currentColor"/>`,
  graph:      `<circle cx="6" cy="6" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="12" cy="13" r="2.2"/><circle cx="6" cy="20" r="2.2"/><circle cx="18" cy="20" r="2.2"/><line x1="7.5" y1="7.5" x2="10.5" y2="11.5"/><line x1="13.5" y1="11.5" x2="16.5" y2="7.5"/><line x1="7.5" y1="18.5" x2="10.5" y2="14.5"/><line x1="13.5" y1="14.5" x2="16.5" y2="18.5"/>`,
};

export function iconSvg(name: IconName, sizeClass = "w-5 h-5", colorClass = "text-retro-green"): string {
  const path = ICON_PATHS[name];
  if (!path) return "";
  return `<svg class="${sizeClass} ${colorClass} inline-block flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}
