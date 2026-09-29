const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: {
      message: "Too many requests. Please try again."
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});
