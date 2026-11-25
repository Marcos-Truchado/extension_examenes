(() => {
  let floatingBtn = null;
  let responsePanel = null;
  let currentSelection = "";

  function createButton() {
    const btn = document.createElement("div");
    btn.id = "ai-selector-btn";
    btn.textContent = "·";
    btn.title = "";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (currentSelection) askAI(currentSelection);
    });
    document.body.appendChild(btn);
    return btn;
  }

  function createPanel() {
    const panel = document.createElement("div");
    panel.id = "ai-selector-panel";
    panel.innerHTML = `
      <div class="ai-panel-header">
        <span class="ai-panel-logo">···</span>
        <button class="ai-panel-close" id="ai-panel-close-btn">✕</button>
      </div>
      <div class="ai-panel-query" id="ai-panel-query"></div>
      <div class="ai-panel-body" id="ai-panel-body">
        <div class="ai-loading" id="ai-loading">
          <div class="ai-dots"><span></span><span></span><span></span></div>
        </div>
        <div class="ai-answer" id="ai-answer"></div>
      </div>
    `;
    panel.querySelector("#ai-panel-close-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      hideAll();
    });
    document.body.appendChild(panel);
    return panel;
  }

  function hideAll() {
    if (floatingBtn) floatingBtn.classList.remove("visible");
    if (responsePanel) responsePanel.classList.remove("visible");
  }

  function askAI(text) {
    if (floatingBtn) floatingBtn.classList.remove("visible");
    if (!responsePanel) responsePanel = createPanel();

    const queryEl = document.getElementById("ai-panel-query");
    const truncated = text.length > 100 ? text.slice(0, 100) + "…" : text;
    queryEl.textContent = `"${truncated}"`;

    document.getElementById("ai-loading").style.display = "flex";
    document.getElementById("ai-answer").textContent = "";
    document.getElementById("ai-answer").style.display = "none";

    responsePanel.classList.add("visible");

    chrome.runtime.sendMessage({ type: "ASK_AI", text }, (response) => {
      document.getElementById("ai-loading").style.display = "none";
      const answerEl = document.getElementById("ai-answer");
      answerEl.style.display = "block";
      if (response && response.answer) {
        answerEl.textContent = response.answer;
        answerEl.classList.remove("error");
      } else {
        answerEl.textContent = response?.error || "Error desconocido.";
        answerEl.classList.add("error");
      }
    });
  }

  document.addEventListener("mouseup", (e) => {
    setTimeout(() => {
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : "";

      if (text.length > 3) {
        currentSelection = text;
        if (!floatingBtn) floatingBtn = createButton();
        floatingBtn.classList.add("visible");
      } else {
        const target = e.target;
        if (target.closest("#ai-selector-btn") || target.closest("#ai-selector-panel")) return;
        if (floatingBtn) floatingBtn.classList.remove("visible");
      }
    }, 10);
  });

  document.addEventListener("mousedown", (e) => {
    const target = e.target;
    if (target.closest("#ai-selector-btn") || target.closest("#ai-selector-panel")) return;
    hideAll();
  });

  // Hide button on scroll but keep panel
  document.addEventListener("scroll", () => {
    if (floatingBtn) floatingBtn.classList.remove("visible");
  });
})();
