const enabledToggle = document.getElementById("enabled");
const sidebarToggle = document.getElementById("openSidebarOnClick");
const trackingStatus = document.getElementById("trackingStatus");

const defaults = {
  enabled: true,
  openSidebarOnClick: true,
  trackedEntityIds: []
};

function renderTrackingStatus(ids) {
  const count = ids.length;
  trackingStatus.textContent = `Tracking ${count} ${count === 1 ? "entity" : "entities"}.`;
}

chrome.storage.sync.get(defaults, (state) => {
  enabledToggle.checked = state.enabled;
  sidebarToggle.checked = state.openSidebarOnClick;
  renderTrackingStatus(state.trackedEntityIds || []);
});

enabledToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabledToggle.checked });
});

sidebarToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ openSidebarOnClick: sidebarToggle.checked });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync" || !changes.trackedEntityIds) return;
  renderTrackingStatus(changes.trackedEntityIds.newValue || []);
});
