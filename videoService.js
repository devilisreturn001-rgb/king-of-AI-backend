const { notConfigured } = require("./providerInterface");

/**
 * TEXT-TO-VIDEO - PROVIDER NOT CONNECTED
 * =========================================
 * Wire up a text-to-video provider here. Read credentials from
 * VIDEO_PROVIDER_API_KEY / VIDEO_PROVIDER_BASE_URL in .env.
 *
 * Expected return shape once connected:
 *   { status: "ok", data: { videoUrl: string }, message: "ok" }
 */
async function generateVideo(prompt, options = {}) {
  if (!process.env.VIDEO_PROVIDER_API_KEY) {
    return notConfigured("Video Create", "VIDEO_PROVIDER_API_KEY");
  }

  // TODO: replace with a real provider call.
  return notConfigured("Video Create", "VIDEO_PROVIDER_API_KEY");
}

module.exports = { generateVideo };
