const { notConfigured } = require("./providerInterface");

/**
 * IMAGE GENERATION - PROVIDER NOT CONNECTED
 * ==========================================
 * Wire up an image generation provider here (e.g. OpenAI Images, Stability AI,
 * Replicate, etc). Read credentials from IMAGE_PROVIDER_API_KEY /
 * IMAGE_PROVIDER_BASE_URL in .env.
 *
 * Expected return shape once connected:
 *   { status: "ok", data: { imageUrl: string }, message: "ok" }
 */
async function generateImage(prompt, options = {}) {
  if (!process.env.IMAGE_PROVIDER_API_KEY) {
    return notConfigured("Image Create", "IMAGE_PROVIDER_API_KEY");
  }

  // TODO: replace with a real provider call, e.g.:
  // const response = await fetch(`${process.env.IMAGE_PROVIDER_BASE_URL}/images/generations`, {...});
  return notConfigured("Image Create", "IMAGE_PROVIDER_API_KEY");
}

module.exports = { generateImage };
