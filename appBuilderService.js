const { chatCompletion } = require("./openaiClient");
const { notConfigured } = require("./providerInterface");

/**
 * APP BUILDER
 * ============
 * Uses the same chat model as AI Chat to turn an app idea into a structured
 * scaffold: folder structure, key files with code, and run instructions.
 * Asks the model to return JSON so the mobile app can render a code preview.
 */
async function buildAppScaffold(ideaDescription) {
  if (!process.env.OPENAI_API_KEY) {
    return notConfigured("App Builder", "OPENAI_API_KEY");
  }

  const messages = [
    {
      role: "system",
      content:
        "You are an app-scaffolding assistant. Given an app idea, respond with " +
        "ONLY valid JSON (no markdown fences, no commentary) matching this shape: " +
        `{"appName": string, "description": string, "folderStructure": string[], ` +
        `"files": [{"path": string, "language": string, "code": string}], ` +
        `"runInstructions": string[]}. Keep it minimal but runnable: 3-6 files max.`,
    },
    { role: "user", content: `App idea: ${ideaDescription}` },
  ];

  const result = await chatCompletion(messages, { temperature: 0.4, maxTokens: 2000 });
  if (!result.ok) {
    return { status: "error", data: null, message: result.error };
  }

  let parsed;
  try {
    const cleaned = result.text.replace(/^```json\s*|^```\s*|```$/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    // Model didn't return clean JSON - fall back to raw text so nothing is lost.
    return {
      status: "ok",
      data: { appName: "Generated App", description: "", folderStructure: [], files: [], runInstructions: [], raw: result.text },
      message: "Model response was not valid JSON; showing raw output.",
    };
  }

  return { status: "ok", data: parsed, message: "ok" };
}

module.exports = { buildAppScaffold };
