const express = require("express");
const router = express.Router();
const chatService = require("../services/chatService");
const { ApiError } = require("../middleware/errorHandler");

router.post("/", async (req, res, next) => {
  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      throw new ApiError(400, "A non-empty 'message' string is required.", "INVALID_INPUT");
    }
    if (history && !Array.isArray(history)) {
      throw new ApiError(400, "'history' must be an array if provided.", "INVALID_INPUT");
    }

    const result = await chatService.sendMessage(history || [], message.trim());

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
