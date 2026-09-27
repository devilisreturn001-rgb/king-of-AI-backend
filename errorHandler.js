// Central error handler. Never leaks stack traces or secrets to the client.
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  // Never log secrets or full request bodies - just enough to debug.
  console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${err.message}`);

  res.status(status).json({
    success: false,
    error: {
      message: err.publicMessage || err.message || "Something went wrong.",
      code: err.code || "INTERNAL_ERROR",
    },
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { message: `Route not found: ${req.originalUrl}`, code: "NOT_FOUND" },
  });
}

class ApiError extends Error {
  constructor(statusCode, message, code = "API_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.publicMessage = message;
    this.code = code;
  }
}

module.exports = { errorHandler, notFoundHandler, ApiError };
