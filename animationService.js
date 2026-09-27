const { notConfigured } = require("./providerInterface");

/**
 * ANIMATION VIDEO - PROVIDER NOT CONNECTED
 * ===========================================
 * Wire up an animation generation provider here. Read credentials from
 * ANIMATION_PROVIDER_API_KEY / ANIMATION_PROVIDER_BASE_URL in .env.
 *
 * Expected return shape once connected:
 *   { status: "ok", data: { videoUrl: string }, message: "ok" }
 */
async function generateAnimation(prompt, options = {}) {
  if (!process.env.ANIMATION_PROVIDER_API_KEY) {
    return notConfigured("Animation Create", "ANIMATION_PROVIDER_API_KEY");
  }

  // TODO: replace with a real provider call.
  return notConfigured("Animation Create", "ANIMATION_PROVIDER_API_KEY");
}

module.exports = { generateAnimation };
