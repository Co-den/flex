// server/src/integrations/googleBusiness.js
const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config({path:".env"});

const SCOPES = ["https://www.googleapis.com/auth/business.manage"];

/**
 * Returns an OAuth client if credentials set in env (SERVICE_ACCOUNT_JSON or use Application Default)
 * NOTE: Business Profile API typically requires OAuth2 flows or an authorized account that manages Business Profiles.
 */
async function getAuthClient() {
  // If using a service account JSON string in env var:
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: SCOPES,
    });
    return auth.getClient();
  }

  // Otherwise allow ADC (e.g., if running on GCP with appropriate scopes)
  const auth = new google.auth.GoogleAuth({ scopes: SCOPES });
  return auth.getClient();
}

/**
 * Fetch reviews for a location resourceName (e.g. accounts/{accountId}/locations/{locationId})
 * You need to supply resourceName or accountId + locationId.
 */
async function listReviewsForLocation(resourceName) {
  if (!resourceName) throw new Error("resourceName required (accounts/{accountId}/locations/{locationId})");
  const authClient = await getAuthClient();
  const mybusiness = google.mybusiness({ version: "v4", auth: authClient });

  // Note: method name may differ with library version — check docs if you get method not found.
  const resp = await mybusiness.accounts.locations.reviews.list({
    parent: resourceName,
    pageSize: 200,
  });
  return resp.data.reviews || [];
}

module.exports = { listReviewsForLocation };
