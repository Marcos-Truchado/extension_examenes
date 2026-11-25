const apiKeyInput = document.getElementById("apiKey");
const modelSelect = document.getElementById("model");
const savedMsg = document.getElementById("saved-msg");

// Load saved values
chrome.storage.sync.get(["apiKey", "model"], (data) => {
  if (data.apiKey) apiKeyInput.value = data.apiKey;
  if (data.model) modelSelect.value = data.model;
});

document.getElementById("save").addEventListener("click", () => {
  const apiKey = apiKeyInput.value.trim();
  const model = modelSelect.value;

  if (!apiKey) {
    apiKeyInput.style.borderColor = "#f07070";
    return;
  }
  apiKeyInput.style.borderColor = "";

  chrome.storage.sync.set({ apiKey, model }, () => {
    savedMsg.classList.add("show");
    setTimeout(() => savedMsg.classList.remove("show"), 2500);
  });
});
