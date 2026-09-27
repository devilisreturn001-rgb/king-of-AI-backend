const express = require("express");
const router = express.Router();
const animationService = require("../services/animationService");
const { ApiError } = require("../middleware/errorHandler");

router.post("/", async (req, res, next) => {
  try {
    const { prompt, style, duration } = req.body || {};
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      throw new ApiError(400, "A non-empty 'prompt' string is required.", "INVALID_INPUT");
    }

    const result = await animationService.generateAnimation(prompt.trim(), { style, duration });

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
