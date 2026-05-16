const toggle = document.getElementById("enabled");

chrome.storage.sync.get({ enabled: true }, (state) => {
  toggle.checked = state.enabled;
});

toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});
