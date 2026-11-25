chrome.storage.sync.get(["apiKey"], (data) => {
  const el = document.getElementById("status");
  if (data.apiKey) {
    el.className = "status ok";
    el.textContent = "✓ API Key configurada";
  } else {
    el.className = "status warn";
    el.textContent = "⚠ Falta configurar la API Key";
  }
});
