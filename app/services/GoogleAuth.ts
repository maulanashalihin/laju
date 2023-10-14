
export function redirectParamsURL(): string {
    
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '), // space separated string
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
    });

    return params.toString();
}
