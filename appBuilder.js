const express = require("express");
const router = express.Router();
const appBuilderService = require("../services/appBuilderService");
const { ApiError } = require("../middleware/errorHandler");

router.post("/", async (req, res, next) => {
  try {
    const { idea } = req.body || {};
    if (!idea || typeof idea !== "string" || !idea.trim()) {
      throw new ApiError(400, "A non-empty 'idea' string is required.", "INVALID_INPUT");
    }

    const result = await appBuilderService.buildAppScaffold(idea.trim());

    if (result.status === "not_configured") {
      return res.status(503).json({ success: false, error: { message: result.message, code: "NOT_CONFIGURED" } });
    }
    if (result.status === "error") {
      return res.status(502).json({ success: false, error: { message: result.message, code: "PROVIDER_ERROR" } });
    }
    res.json({ success: true, data: result.data, message: result.message });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
