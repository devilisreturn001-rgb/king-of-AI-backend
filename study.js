const express = require("express");
const router = express.Router();
const studyService = require("../services/studyService");
const { docUpload } = require("../middleware/upload");
const { ApiError } = require("../middleware/errorHandler");

router.post("/", docUpload.single("document"), async (req, res, next) => {
  try {
    const { topic, materialType } = req.body || {};
    const sourceText = req.file ? req.file.buffer.toString("utf-8") : null;

    if (!topic && !sourceText) {
      throw new ApiError(400, "Provide a 'topic' or upload a document.", "INVALID_INPUT");
    }
    if (!materialType) {
      throw new ApiError(400, "'materialType' is required (e.g. notes, mcqs, flashcards).", "INVALID_INPUT");
    }

    const result = await studyService.generateStudyMaterial({ topic, materialType, sourceText });

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
