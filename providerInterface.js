/**
 * PROVIDER INTERFACE
 * ===================
 * Every AI capability (chat, image, image-edit, video, animation, song audio)
 * is implemented behind this same shape so providers can be swapped or added
 * without touching route code:
 *
 *   async function run(input, options) -> {
 *     status: "ok" | "not_configured" | "error",
 *     data: <result payload>  | null,
 *     message: string,
 *   }
 *
 * "not_configured" means the feature is real and wired up, but the required
 * API key / provider is missing from .env. Routes turn this into a clear
 * JSON error rather than pretending the feature worked.
 */

function notConfigured(featureName, envVarHint) {
  return {
    status: "not_configured",
    data: null,
    message: `${featureName} is not connected yet. Add ${envVarHint} in backend/.env and implement the provider call in the matching services/*.js file.`,
  };
}

module.exports = { notConfigured };
