const express = require("express");
const router = express.Router();
const songService = require("../services/songService");
const { ApiError } = require("../middleware/errorHandler");

// Generate lyrics (real, LLM-backed)
router.post("/lyrics", async (req, res, next) => {
  try {
    const { topic, language, mood } = req.body || {};
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      throw new ApiError(400, "A non-empty 'topic' string is required.", "INVALID_INPUT");
    }

    const result = await songService.generateLyrics({ topic: topic.trim(), language, mood });

    if (result.status === "not_configured") {
      return res.status(503).json({ success: false, error: { message: result.message, code: "NOT_CONFIGURED" } });
    }
    if (result.status === "error") {
      return res.status(502).json({ success: false, error: { message: result.message, code: "PROVIDER_ERROR" } });
    }
    res.json({ success: true, data: result.data });
  } catch (err) {
    next(err);
  }
});

// Generate audio from lyrics (provider not connected by default)
router.post("/audio", async (req, res, next) => {
  try {
    const { lyrics } = req.body || {};
    if (!lyrics || typeof lyrics !== "string" || !lyrics.trim()) {
      throw new ApiError(400, "A non-empty 'lyrics' string is required.", "INVALID_INPUT");
    }

    const result = await songService.generateAudio(lyrics.trim());

    if (result.status === "not_configured") {
      return res.status(503).json({ success: false, error: { message: result.message, code: "NOT_CONFIGURED" } });
    }
    if (result.status === "error") {
      return res.status(502).json({ success: false, error: { message: result.message, code: "PROVIDER_ERROR" } });
    }
    res.json({ success: true, data: result.data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
