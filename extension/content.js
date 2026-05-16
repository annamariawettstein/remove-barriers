// Lattice content script. Runs on every page at document_idle.
// 1. Reads enabled flag from chrome.storage (defaults to true).
// 2. Walks visible text nodes, wraps matches in <span class="lattice-entity">.
// 3. Renders a single shared hover card on demand.

(function () {
  "use strict";

  const ENTITIES = window.LATTICE_ENTITIES || [];
  if (!ENTITIES.length) return;

  const SKIP_TAGS = new Set([
    "SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "CODE", "PRE",
    "SVG", "CANVAS", "IFRAME", "OBJECT", "VIDEO", "AUDIO"
  ]);

  // Build alias → entity index and one big regex (longest names first to avoid
  // "Sunak" winning over "Rishi Sunak"). Names are escaped, boundaries enforced.
  const aliasMap = new Map();
  const allNames = [];
  for (const e of ENTITIES) {
    const names = [e.name, ...(e.aliases || [])];
    for (const n of names) {
      aliasMap.set(n.toLowerCase(), e);
      allNames.push(n);
    }
  }
  allNames.sort((a, b) => b.length - a.length);
  const escaped = allNames.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const ENTITY_RE = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  let cardEl = null;
  let activeSpan = null;
  let hideTimer = null;

  function ensureCard() {
    if (cardEl) return cardEl;
    cardEl = document.createElement("div");
    cardEl.className = "lattice-card";
    cardEl.setAttribute("role", "tooltip");
    cardEl.addEventListener("mouseenter", () => clearTimeout(hideTimer));
    cardEl.addEventListener("mouseleave", scheduleHide);
    document.body.appendChild(cardEl);
    return cardEl;
  }

  function renderCard(entity) {
    const card = ensureCard();
    const typeLabel = {
      politician: "POLITICIAN",
      company: "COMPANY",
      media: "NEWS MEDIA"
    }[entity.type] || "ENTITY";
    let subhead;
    if (entity.type === "politician") {
      subhead = `${entity.party || ""} · ${entity.constituency || ""}`;
    } else if (entity.type === "media") {
      subhead = `${entity.owner || ""}${entity.funding ? " · " + entity.funding : ""}`;
    } else {
      subhead = `${entity.sector || ""}${entity.companyNumber ? " · CH " + entity.companyNumber : ""}`;
    }
    const facts = (entity.facts || []).map(f => `
      <div class="lattice-fact">
        <div class="lattice-fact-label">${escapeHtml(f.label)}</div>
        <div class="lattice-fact-row">
          <span class="lattice-fact-value">${escapeHtml(f.value)}</span>
          <span class="lattice-fact-source">${escapeHtml(f.source)}</span>
        </div>
      </div>
    `).join("");

    card.innerHTML = `
      <div class="lattice-card-head">
        <div class="lattice-card-type">${typeLabel}</div>
        <div class="lattice-card-brand">lattice</div>
      </div>
      <div class="lattice-card-name">${escapeHtml(entity.name)}</div>
      <div class="lattice-card-sub">${escapeHtml(subhead)}</div>
      ${entity.role ? `<div class="lattice-card-role">${escapeHtml(entity.role)}</div>` : ""}
      <div class="lattice-card-facts">${facts}</div>
      <div class="lattice-card-foot">Demo data — figures illustrative</div>
    `;
    card.style.display = "block";
  }

  function positionCard(span) {
    const card = cardEl;
    if (!card) return;
    const rect = span.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const margin = 8;
    let top = rect.bottom + margin + window.scrollY;
    let left = rect.left + window.scrollX;
    // Flip above if it would overflow the viewport bottom.
    if (rect.bottom + cardRect.height + margin > window.innerHeight) {
      top = rect.top - cardRect.height - margin + window.scrollY;
    }
    // Pin to right edge.
    const maxLeft = window.scrollX + window.innerWidth - cardRect.width - margin;
    if (left > maxLeft) left = maxLeft;
    if (left < window.scrollX + margin) left = window.scrollX + margin;
    card.style.top = `${top}px`;
    card.style.left = `${left}px`;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (cardEl) cardEl.style.display = "none";
      activeSpan = null;
    }, 180);
  }

  function showFor(span) {
    clearTimeout(hideTimer);
    const id = span.dataset.latticeId;
    const entity = ENTITIES.find(e => e.id === id);
    if (!entity) return;
    activeSpan = span;
    renderCard(entity);
    positionCard(span);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function wrapMatchesInTextNode(node) {
    const text = node.nodeValue;
    if (!text || text.length < 2) return;
    ENTITY_RE.lastIndex = 0;
    let match;
    const fragments = [];
    let cursor = 0;
    while ((match = ENTITY_RE.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const entity = aliasMap.get(match[0].toLowerCase());
      if (!entity) continue;
      if (start > cursor) {
        fragments.push(document.createTextNode(text.slice(cursor, start)));
      }
      const span = document.createElement("span");
      span.className = "lattice-entity";
      span.dataset.latticeId = entity.id;
      span.textContent = match[0];
      fragments.push(span);
      cursor = end;
    }
    if (!fragments.length) return;
    if (cursor < text.length) {
      fragments.push(document.createTextNode(text.slice(cursor)));
    }
    const parent = node.parentNode;
    for (const f of fragments) parent.insertBefore(f, node);
    parent.removeChild(node);
  }

  function shouldSkip(node) {
    let p = node.parentNode;
    while (p && p.nodeType === 1) {
      if (SKIP_TAGS.has(p.tagName)) return true;
      if (p.classList && p.classList.contains("lattice-entity")) return true;
      if (p.isContentEditable) return true;
      p = p.parentNode;
    }
    return false;
  }

  function scan(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || n.nodeValue.length < 2) return NodeFilter.FILTER_REJECT;
        if (shouldSkip(n)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const targets = [];
    let n;
    while ((n = walker.nextNode())) targets.push(n);
    for (const t of targets) wrapMatchesInTextNode(t);
  }

  function attachHandlers() {
    document.addEventListener("mouseover", (ev) => {
      const target = ev.target;
      if (target && target.classList && target.classList.contains("lattice-entity")) {
        showFor(target);
      }
    });
    document.addEventListener("mouseout", (ev) => {
      const target = ev.target;
      if (target && target.classList && target.classList.contains("lattice-entity")) {
        scheduleHide();
      }
    });
    window.addEventListener("scroll", () => {
      if (activeSpan && cardEl && cardEl.style.display === "block") {
        positionCard(activeSpan);
      }
    }, { passive: true });
  }

  function unwrapAll() {
    document.querySelectorAll(".lattice-entity").forEach(span => {
      const parent = span.parentNode;
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      parent.removeChild(span);
      parent.normalize?.();
    });
    if (cardEl) {
      cardEl.style.display = "none";
      activeSpan = null;
    }
  }

  function start() {
    scan(document.body);
    attachHandlers();
  }

  // Read toggle state, run if enabled, and react to changes.
  if (chrome?.storage?.sync) {
    chrome.storage.sync.get({ enabled: true }, (state) => {
      if (state.enabled) start();
    });
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync" || !changes.enabled) return;
      if (changes.enabled.newValue) start();
      else unwrapAll();
    });
  } else {
    start();
  }
})();
