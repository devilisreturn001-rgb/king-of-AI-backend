const { chatCompletion } = require("./openaiClient");
const { notConfigured } = require("./providerInterface");

const MATERIAL_INSTRUCTIONS = {
  notes: "Write clear, well-organized study notes with headings and bullet points.",
  simple_explanation: "Explain the topic in very simple language, as if to a beginner, using an analogy.",
  summary: "Write a concise summary covering only the most important points.",
  important_questions: "List the most important exam-style questions on this topic, numbered.",
  mcqs: "Write 8 multiple-choice questions with 4 options each (A-D) and mark the correct answer clearly.",
  short_answers: "Write 6 short-answer questions with brief model answers (2-3 sentences each).",
  long_answers: "Write 3 long-answer/essay-style questions with detailed model answers.",
  flashcards: "Create 10 flashcards formatted as 'Q: ... / A: ...' pairs, one per line.",
  revision_material: "Create a compact one-page revision sheet with key formulas, terms, and facts.",
  study_timetable: "Create a 7-day study timetable to master this topic, with daily focus areas and time blocks.",
};

async function generateStudyMaterial({ topic, materialType, sourceText }) {
  if (!process.env.OPENAI_API_KEY) {
    return notConfigured("Study Material", "OPENAI_API_KEY");
  }

  const instruction = MATERIAL_INSTRUCTIONS[materialType] || MATERIAL_INSTRUCTIONS.notes;

  const userContent = sourceText
    ? `Topic/source material:\n"""${sourceText.slice(0, 6000)}"""\n\nTask: ${instruction}`
    : `Topic: "${topic}"\n\nTask: ${instruction}`;

  const messages = [
    {
      role: "system",
      content:
        "You are a study assistant for students. Be accurate, clear, and well " +
        "organized with headings and bullet points where useful.",
    },
    { role: "user", content: userContent },
  ];

  const result = await chatCompletion(messages, { temperature: 0.5, maxTokens: 1500 });
  if (!result.ok) {
    return { status: "error", data: null, message: result.error };
  }

  return {
    status: "ok",
    data: { materialType, content: result.text },
    message: "ok",
  };
}

module.exports = { generateStudyMaterial, MATERIAL_INSTRUCTIONS };
