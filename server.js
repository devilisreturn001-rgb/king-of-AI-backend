require("dotenv").config();
const express = require("express");
const cors = require("cors");

const rateLimiter = require("./middleware/rateLimiter");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const healthRoutes = require("./routes/health");
const chatRoutes = require("./routes/chat");
const imageRoutes = require("./routes/image");
const imageEditRoutes = require("./routes/imageEdit");
const videoRoutes = require("./routes/video");
const animationRoutes = require("./routes/animation");
const songRoutes = require("./routes/song");
const studyRoutes = require("./routes/study");
const analyzeRoutes = require("./routes/analyze");
const appBuilderRoutes = require("./routes/appBuilder");

const app = express();

// --- CORS ---
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "*").split(",").map((s) => s.trim());
app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(rateLimiter);

// --- Routes ---
app.use("/api/health", healthRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/image-edit", imageEditRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/animation", animationRoutes);
app.use("/api/song", songRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/app-builder", appBuilderRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`King of AI backend running on port ${PORT}`);
});

module.exports = app;
