const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      service: "king-of-ai-backend",
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = router;
