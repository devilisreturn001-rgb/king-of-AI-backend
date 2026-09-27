const fetch = require("node-fetch");

/**
 * Thin wrapper around any OpenAI-compatible Chat Completions endpoint.
 * Works with OpenAI directly, or Azure OpenAI / other compatible providers
 * by changing OPENAI_BASE_URL.
 *
 * Returns { ok: boolean, text?: string, error?: string }
 */
async function chatCompletion(messages, { temperature = 0.7, maxTokens = 1200 } = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "OPENAI_API_KEY missing" };
  }

  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      // Never surface the raw provider error (could leak details); log server-side only.
      console.error("[openaiClient] provider error:", response.status, errText.slice(0, 300));
      return { ok: false, error: `Provider returned status ${response.status}` };
    }

    const json = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return { ok: false, error: "Provider returned an empty response" };
    }
    return { ok: true, text };
  } catch (err) {
    console.error("[openaiClient] request failed:", err.message);
    return { ok: false, error: "Failed to reach AI provider" };
  }
}

module.exports = { chatCompletion };
