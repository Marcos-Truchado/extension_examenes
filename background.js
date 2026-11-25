// ─────────────────────────────────────────────────
//  Message listener
// ─────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ASK_AI") {
    handleAIRequest(request.text).then(sendResponse);
    return true;
  }
});

async function handleAIRequest(selectedText) {
  const { apiKey, model } = await chrome.storage.sync.get(["apiKey", "model"]);

  if (!apiKey) {
    return { error: "No hay API key configurada." };
  }

  const selectedModel = model || "openai/gpt-oss-120b";

  const systemPrompt = "Eres un asistente útil. Responde con precisión y de forma concisa.";

  const userPrompt = `Responde al siguiente texto:

"${selectedText}"`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: selectedModel,
        max_tokens: 1024,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      let errMsg = String(response.status);
      try { const e = await response.json(); errMsg = e.error?.message || errMsg; } catch(_) {}
      return { error: "Error API: " + errMsg };
    }

    const data = await response.json();
    if (!data.choices?.[0]) return { error: "Respuesta vacía. Inténtalo de nuevo." };

    const answer = data.choices[0].message?.content?.trim() || "";
    if (!answer) return { error: "Sin respuesta. Inténtalo de nuevo." };
    return { answer };

  } catch (e) {
    return { error: "Error de red: " + e.message };
  }
}
