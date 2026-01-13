/**
 * Google OAuth Authentication Service
 * This service handles the URL parameter generation for Google OAuth authentication flow.
 */

/**
 * Generates the URL parameters required for initiating Google OAuth authentication.
 *
 * @returns {string} A URL-encoded string containing all necessary OAuth parameters
 *
 * Parameters included:
 * - client_id: Your application's Google Client ID
 * - redirect_uri: The URL where Google will redirect after authentication
 * - scope: The permissions requested from the user
 *   - userinfo.email: Access to user's email
 *   - userinfo.profile: Access to user's basic profile info
 * - response_type: Set to 'code' for authorization code flow
 * - access_type: Set to 'offline' to receive a refresh token
 * - prompt: Set to 'consent' to always show the consent screen
 *
 * @throws {Error} If required environment variables are not set
 */
export function redirectParamsURL()
{
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID environment variable is not set');
    }
    if (!redirectUri) {
      throw new Error('GOOGLE_REDIRECT_URI environment variable is not set');
    }

    return new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '), // space separated string
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
      }).toString();

}
