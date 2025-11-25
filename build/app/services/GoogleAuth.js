"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectParamsURL = redirectParamsURL;
function redirectParamsURL() {
    return new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '),
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
    }).toString();
}
//# sourceMappingURL=GoogleAuth.js.map