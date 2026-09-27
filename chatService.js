const { chatCompletion } = require("./openaiClient");
const { notConfigured } = require("./providerInterface");

const SYSTEM_PROMPT =
  "You are King of AI, a friendly, clear assistant built for students and " +
  "beginners. Explain concepts simply, use short paragraphs and examples, " +
  "and when asked for code, return clean, well-commented code in a single " +
  "fenced code block.";

async function sendMessage(history, newMessage) {
  if (!process.env.OPENAI_API_KEY) {
    return notConfigured("AI Chat", "OPENAI_API_KEY");
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: newMessage },
  ];

  const result = await chatCompletion(messages, { temperature: 0.6, maxTokens: 1200 });

  if (!result.ok) {
    return { status: "error", data: null, message: result.error };
  }

  return {
    status: "ok",
    data: { role: "assistant", content: result.text },
    message: "ok",
  };
}

module.exports = { sendMessage };
