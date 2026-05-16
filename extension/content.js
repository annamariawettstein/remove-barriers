// Expose content script.
// Highlights known entities in page text, shows a hover card, and opens a
// source-linked sidebar dossier on click. Designed for dynamic sites too.

(function () {
  "use strict";

  const ENTITIES = window.EXPOSE_ENTITIES || [];
  if (!ENTITIES.length) return;

  const SETTINGS_DEFAULTS = {
    enabled: true,
    openSidebarOnClick: true,
    trackedEntityIds: []
  };

  const SKIP_TAGS = new Set([
    "SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "CODE", "PRE",
    "SVG", "CANVAS", "IFRAME", "OBJECT", "VIDEO", "AUDIO"
  ]);

  const aliasMap = new Map();
  const entityById = new Map();
  const allNames = [];

  for (const entity of ENTITIES) {
    entityById.set(entity.id, entity);
    const names = [entity.name, ...(entity.aliases || [])];
    for (const name of names) {
      aliasMap.set(name.toLowerCase(), entity);
      allNames.push(name);
    }
  }

  allNames.sort((a, b) => b.length - a.length);
  const escapedNames = allNames.map(escapeRegExp);
  const ENTITY_RE = new RegExp(`\\b(${escapedNames.join("|")})\\b`, "gi");

  const state = {
    settings: { ...SETTINGS_DEFAULTS },
    started: false,
    handlersAttached: false,
    observer: null,
    rescanTimer: null,
    activeSpan: null,
    activeEntityId: null,
    hideTimer: null,
    rootEl: null,
    cardEl: null,
    sidebarEl: null
  };

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function confidenceLabel(level) {
    return {
      high: "High confidence",
      medium: "Medium confidence",
      low: "Low confidence"
    }[level] || "Unscored";
  }

  function typeLabel(type) {
    return {
      politician: "POLITICIAN",
      company: "COMPANY",
      media: "MEDIA",
      think_tank: "THINK TANK"
    }[type] || "ENTITY";
  }

  function ensureRoot() {
    if (state.rootEl?.isConnected) return state.rootEl;
    const root = document.createElement("div");
    root.id = "expose-root";
    document.documentElement.appendChild(root);
    state.rootEl = root;
    return root;
  }

  function ensureCard() {
    if (state.cardEl?.isConnected) return state.cardEl;
    const root = ensureRoot();
    const card = document.createElement("div");
    card.className = "expose-card";
    card.setAttribute("role", "tooltip");
    card.addEventListener("mouseenter", clearHideTimer);
    card.addEventListener("mouseleave", scheduleHide);
    root.appendChild(card);
    state.cardEl = card;
    return card;
  }

  function ensureSidebar() {
    if (state.sidebarEl?.isConnected) return state.sidebarEl;
    const root = ensureRoot();
    const sidebar = document.createElement("aside");
    sidebar.className = "expose-sidebar";
    sidebar.setAttribute("aria-hidden", "true");
    root.appendChild(sidebar);
    state.sidebarEl = sidebar;
    return sidebar;
  }

  function renderMetric(metric) {
    return `
      <div class="expose-metric">
        <div class="expose-metric-label">${escapeHtml(metric.label)}</div>
        <div class="expose-metric-row">
          <div class="expose-metric-value">${escapeHtml(metric.value)}</div>
          ${renderConfidence(metric.confidence)}
        </div>
        ${renderSourceLink(metric)}
      </div>
    `;
  }

  function renderSourceLink(item) {
    if (!item?.source) return "";
    const href = item.url ? ` href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"` : "";
    return `<a class="expose-source-link"${href}>${escapeHtml(item.source)}</a>`;
  }

  function renderConfidence(level) {
    if (!level) return "";
    return `
      <span class="expose-confidence expose-confidence-${escapeHtml(level)}" title="${escapeHtml(confidenceLabel(level))}">
        ${escapeHtml(level)}
      </span>
    `;
  }

  function renderCard(entity) {
    const card = ensureCard();
    const summaryMetrics = (entity.summaryMetrics || []).slice(0, 3).map(renderMetric).join("");

    card.innerHTML = `
      <div class="expose-card-head">
        <div class="expose-card-type">${typeLabel(entity.type)}</div>
        <button class="expose-inline-button" type="button" data-expose-open="${escapeHtml(entity.id)}">Open dossier</button>
      </div>
      <div class="expose-card-name">${escapeHtml(entity.name)}</div>
      ${entity.badge ? `<div class="expose-card-sub">${escapeHtml(entity.badge)}</div>` : ""}
      ${entity.role ? `<div class="expose-card-role">${escapeHtml(entity.role)}</div>` : ""}
      ${entity.teaser ? `<div class="expose-card-teaser">${escapeHtml(entity.teaser)}</div>` : ""}
      <div class="expose-card-facts">${summaryMetrics}</div>
      <div class="expose-card-foot">Facts only. Every surfaced claim carries a source and a confidence score.</div>
    `;

    card.style.display = "block";
  }

  function positionCard(span) {
    const card = state.cardEl;
    if (!card || !span?.isConnected) return;
    const rect = span.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const margin = 8;
    let top = rect.bottom + margin + window.scrollY;
    let left = rect.left + window.scrollX;

    if (rect.bottom + cardRect.height + margin > window.innerHeight) {
      top = rect.top - cardRect.height - margin + window.scrollY;
    }

    const maxLeft = window.scrollX + window.innerWidth - cardRect.width - margin;
    if (left > maxLeft) left = maxLeft;
    if (left < window.scrollX + margin) left = window.scrollX + margin;

    card.style.top = `${top}px`;
    card.style.left = `${left}px`;
  }

  function clearHideTimer() {
    clearTimeout(state.hideTimer);
  }

  function scheduleHide() {
    clearHideTimer();
    state.hideTimer = setTimeout(() => {
      if (state.cardEl) state.cardEl.style.display = "none";
      state.activeSpan = null;
    }, 180);
  }

  function showFor(span) {
    const entityId = span?.dataset.exposeId;
    const entity = entityById.get(entityId);
    if (!entity) return;

    state.activeSpan = span;
    renderCard(entity);
    positionCard(span);
  }

  function renderSection(section) {
    const items = (section.items || []).map((item) => `
      <article class="expose-section-item">
        <div class="expose-section-item-head">
          <div class="expose-section-item-label">${escapeHtml(item.label)}</div>
          ${renderConfidence(item.confidence)}
        </div>
        <div class="expose-section-item-value">${escapeHtml(item.value)}</div>
        ${item.detail ? `<p class="expose-section-item-detail">${escapeHtml(item.detail)}</p>` : ""}
        ${renderSourceLink(item)}
      </article>
    `).join("");

    return `
      <section class="expose-section expose-section-${escapeHtml(section.tone || "default")}">
        <div class="expose-section-title">${escapeHtml(section.title)}</div>
        <div class="expose-section-items">${items}</div>
      </section>
    `;
  }

  function renderRelationship(relationship) {
    const sources = (relationship.sources || []).map((source) => `
      <a class="expose-source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">
        ${escapeHtml(source.label)}
      </a>
    `).join("");

    return `
      <article class="expose-relationship">
        <div class="expose-relationship-head">
          <div class="expose-relationship-title">${escapeHtml(relationship.title)}</div>
          ${renderConfidence(relationship.confidence)}
        </div>
        ${relationship.target ? `<div class="expose-relationship-target">${escapeHtml(relationship.target)}</div>` : ""}
        <p class="expose-relationship-detail">${escapeHtml(relationship.detail)}</p>
        <div class="expose-source-list">${sources}</div>
      </article>
    `;
  }

  function isTracked(entityId) {
    return (state.settings.trackedEntityIds || []).includes(entityId);
  }

  function openSidebar(entityId) {
    const entity = entityById.get(entityId);
    if (!entity) return;

    const sidebar = ensureSidebar();
    const tracked = isTracked(entityId);
    const summaryMetrics = (entity.summaryMetrics || []).map(renderMetric).join("");
    const sections = (entity.sections || []).map(renderSection).join("");
    const relationships = (entity.relationships || []).length
      ? entity.relationships.map(renderRelationship).join("")
      : `<div class="expose-empty-state">No relationship edges surfaced for this entity yet.</div>`;

    sidebar.innerHTML = `
      <div class="expose-sidebar-shell">
        <div class="expose-sidebar-head">
          <div>
            <div class="expose-sidebar-type">${typeLabel(entity.type)}</div>
            <div class="expose-sidebar-name">${escapeHtml(entity.name)}</div>
            ${entity.badge ? `<div class="expose-sidebar-sub">${escapeHtml(entity.badge)}</div>` : ""}
          </div>
          <button class="expose-close-button" type="button" data-expose-close>Close</button>
        </div>

        ${entity.role ? `<div class="expose-sidebar-role">${escapeHtml(entity.role)}</div>` : ""}
        ${entity.teaser ? `<p class="expose-sidebar-teaser">${escapeHtml(entity.teaser)}</p>` : ""}

        <div class="expose-sidebar-actions">
          <button class="expose-action-button" type="button" data-expose-track="${escapeHtml(entity.id)}">
            ${tracked ? "Following" : "Follow this thread"}
          </button>
          <div class="expose-methodology-note">No editorialising. Direct links only. Relationship distance is scored and labelled.</div>
        </div>

        <section class="expose-sidebar-block">
          <div class="expose-sidebar-block-title">At a glance</div>
          <div class="expose-metric-grid">${summaryMetrics}</div>
        </section>

        <section class="expose-sidebar-block">
          <div class="expose-sidebar-block-title">Exposure</div>
          ${sections || `<div class="expose-empty-state">No exposure sections configured.</div>`}
        </section>

        <section class="expose-sidebar-block">
          <div class="expose-sidebar-block-title">Hidden relationships</div>
          <div class="expose-relationship-list">${relationships}</div>
        </section>
      </div>
    `;

    sidebar.classList.add("is-open");
    sidebar.setAttribute("aria-hidden", "false");
    state.activeEntityId = entityId;
  }

  function closeSidebar() {
    if (!state.sidebarEl) return;
    state.sidebarEl.classList.remove("is-open");
    state.sidebarEl.setAttribute("aria-hidden", "true");
    state.activeEntityId = null;
  }

  function toggleTrack(entityId) {
    const next = new Set(state.settings.trackedEntityIds || []);
    if (next.has(entityId)) next.delete(entityId);
    else next.add(entityId);
    state.settings.trackedEntityIds = Array.from(next);
    chrome.storage?.sync?.set({ trackedEntityIds: state.settings.trackedEntityIds });
    if (state.activeEntityId === entityId) openSidebar(entityId);
  }

  function wrapMatchesInTextNode(node) {
    const text = node.nodeValue;
    if (!text || text.length < 2) return;

    ENTITY_RE.lastIndex = 0;
    let match;
    let cursor = 0;
    const fragments = [];

    while ((match = ENTITY_RE.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const entity = aliasMap.get(match[0].toLowerCase());
      if (!entity) continue;

      if (start > cursor) {
        fragments.push(document.createTextNode(text.slice(cursor, start)));
      }

      const span = document.createElement("span");
      span.className = "expose-entity";
      span.dataset.exposeId = entity.id;
      span.textContent = match[0];
      fragments.push(span);
      cursor = end;
    }

    if (!fragments.length) return;
    if (cursor < text.length) fragments.push(document.createTextNode(text.slice(cursor)));

    const parent = node.parentNode;
    for (const fragment of fragments) parent.insertBefore(fragment, node);
    parent.removeChild(node);
  }

  function shouldSkip(node) {
    let current = node.parentNode;
    while (current && current.nodeType === 1) {
      if (SKIP_TAGS.has(current.tagName)) return true;
      if (current.id === "expose-root") return true;
      if (current.classList?.contains("expose-entity")) return true;
      if (current.isContentEditable) return true;
      current = current.parentNode;
    }
    return false;
  }

  function scan(root) {
    if (!root || !state.settings.enabled) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || node.nodeValue.length < 2) return NodeFilter.FILTER_REJECT;
        if (shouldSkip(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const targets = [];
    let current;
    while ((current = walker.nextNode())) targets.push(current);
    for (const target of targets) wrapMatchesInTextNode(target);
  }

  function scheduleRescan(node) {
    clearTimeout(state.rescanTimer);
    state.rescanTimer = setTimeout(() => {
      if (!state.settings.enabled) return;
      if (node?.nodeType === 1) scan(node);
      else scan(document.body);
    }, 120);
  }

  function startObserver() {
    if (state.observer) return;
    state.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.nodeType !== 1) continue;
          if (addedNode.id === "expose-root") continue;
          scheduleRescan(addedNode);
          return;
        }
      }
    });

    state.observer.observe(document.body, { childList: true, subtree: true });
  }

  function stopObserver() {
    if (!state.observer) return;
    state.observer.disconnect();
    state.observer = null;
  }

  function unwrapAll() {
    document.querySelectorAll(".expose-entity").forEach((span) => {
      const parent = span.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(span.textContent || ""), span);
      parent.normalize?.();
    });

    if (state.cardEl) state.cardEl.style.display = "none";
    closeSidebar();
    stopObserver();
    state.started = false;
  }

  function attachHandlers() {
    if (state.handlersAttached) return;
    state.handlersAttached = true;

    document.addEventListener("mouseover", (event) => {
      const span = event.target?.closest?.(".expose-entity");
      if (!span) return;
      clearHideTimer();
      showFor(span);
    });

    document.addEventListener("mouseout", (event) => {
      const span = event.target?.closest?.(".expose-entity");
      if (!span) return;
      scheduleHide();
    });

    document.addEventListener("click", (event) => {
      const openButton = event.target?.closest?.("[data-expose-open]");
      if (openButton) {
        openSidebar(openButton.getAttribute("data-expose-open"));
        return;
      }

      const closeButton = event.target?.closest?.("[data-expose-close]");
      if (closeButton) {
        closeSidebar();
        return;
      }

      const trackButton = event.target?.closest?.("[data-expose-track]");
      if (trackButton) {
        toggleTrack(trackButton.getAttribute("data-expose-track"));
        return;
      }

      const span = event.target?.closest?.(".expose-entity");
      if (span && state.settings.openSidebarOnClick) {
        event.preventDefault();
        openSidebar(span.dataset.exposeId);
      }
    });

    window.addEventListener("scroll", () => {
      if (state.activeSpan && state.cardEl?.style.display === "block") {
        positionCard(state.activeSpan);
      }
    }, { passive: true });
  }

  function start() {
    if (state.started) return;
    scan(document.body);
    attachHandlers();
    startObserver();
    state.started = true;
  }

  function applySettings(partial) {
    state.settings = { ...state.settings, ...partial };
    if (state.settings.enabled) start();
    else unwrapAll();
  }

  function bootstrap() {
    if (!chrome?.storage?.sync) {
      start();
      return;
    }

    chrome.storage.sync.get(SETTINGS_DEFAULTS, (stored) => {
      applySettings(stored);
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") return;
      const next = {};
      let hasRelevantChange = false;
      for (const key of Object.keys(SETTINGS_DEFAULTS)) {
        if (!changes[key]) continue;
        next[key] = changes[key].newValue;
        hasRelevantChange = true;
      }
      if (hasRelevantChange) applySettings(next);
    });
  }

  bootstrap();
})();
