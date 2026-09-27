const { notConfigured } = require("./providerInterface");

/**
 * IMAGE EDITING - PROVIDER NOT CONNECTED
 * =========================================
 * Wire up an image editing / inpainting provider here. Read credentials from
 * IMAGE_EDIT_PROVIDER_API_KEY / IMAGE_EDIT_PROVIDER_BASE_URL in .env.
 *
 * Expected return shape once connected:
 *   { status: "ok", data: { imageUrl: string }, message: "ok" }
 */
async function editImage(imageBuffer, instruction, options = {}) {
  if (!process.env.IMAGE_EDIT_PROVIDER_API_KEY) {
    return notConfigured("Image Edit", "IMAGE_EDIT_PROVIDER_API_KEY");
  }

  // TODO: replace with a real provider call.
  return notConfigured("Image Edit", "IMAGE_EDIT_PROVIDER_API_KEY");
}

module.exports = { editImage };
