const { chatCompletion } = require("./openaiClient");
const { notConfigured } = require("./providerInterface");

/**
 * SONG CREATE
 * ============
 * Lyrics generation is REAL (uses the same chat model as AI Chat).
 * Audio generation needs a dedicated music-generation provider and is
 * NOT connected by default - wire it up using SONG_AUDIO_PROVIDER_API_KEY /
 * SONG_AUDIO_PROVIDER_BASE_URL in .env.
 */
async function generateLyrics({ topic, language = "English", mood = "uplifting" }) {
  if (!process.env.OPENAI_API_KEY) {
    return notConfigured("Song lyrics", "OPENAI_API_KEY");
  }

  const messages = [
    {
      role: "system",
      content:
        "You are a songwriter. Write clear, singable song lyrics with labeled " +
        "sections (Verse 1, Chorus, Verse 2, Chorus, Bridge, Outro). Keep language " +
        "simple and evocative.",
    },
    {
      role: "user",
      content: `Write song lyrics in ${language} about: "${topic}". Mood/style: ${mood}.`,
    },
  ];

  const result = await chatCompletion(messages, { temperature: 0.9, maxTokens: 900 });
  if (!result.ok) {
    return { status: "error", data: null, message: result.error };
  }

  return { status: "ok", data: { lyrics: result.text }, message: "ok" };
}

async function generateAudio(lyrics, options = {}) {
  if (!process.env.SONG_AUDIO_PROVIDER_API_KEY) {
    return notConfigured("Song audio generation", "SONG_AUDIO_PROVIDER_API_KEY");
  }
  // TODO: replace with a real music-generation provider call.
  return notConfigured("Song audio generation", "SONG_AUDIO_PROVIDER_API_KEY");
}

module.exports = { generateLyrics, generateAudio };
