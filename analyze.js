const express = require("express");
const router = express.Router();
const analyzeService = require("../services/analyzeService");
const { dataUpload } = require("../middleware/upload");
const { ApiError } = require("../middleware/errorHandler");

router.post("/", dataUpload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "A 'file' (CSV or XLSX) is required.", "INVALID_INPUT");
    }

    const result = await analyzeService.analyzeDataset(req.file.buffer, req.file.originalname);

    if (result.status === "error") {
      return res.status(422).json({ success: false, error: { message: result.message, code: "PARSE_ERROR" } });
    }
    res.json({ success: true, data: result.data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
