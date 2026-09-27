const express = require("express");
const router = express.Router();
const imageEditService = require("../services/imageEditService");
const { imageUpload } = require("../middleware/upload");
const { ApiError } = require("../middleware/errorHandler");

router.post("/", imageUpload.single("image"), async (req, res, next) => {
  try {
    const { instruction } = req.body || {};
    if (!req.file) {
      throw new ApiError(400, "An 'image' file is required.", "INVALID_INPUT");
    }
    if (!instruction || typeof instruction !== "string" || !instruction.trim()) {
      throw new ApiError(400, "A non-empty 'instruction' string is required.", "INVALID_INPUT");
    }

    const result = await imageEditService.editImage(req.file.buffer, instruction.trim());

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
