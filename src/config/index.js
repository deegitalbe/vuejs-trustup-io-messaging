const auth_url = MIX_TRUSTUP_AUTH_API_URL || VITE_TRUSTUP_AUTH_API_URL;
const messaging_url = MIX_MESSAGING_TRUSTUP_API_URL || VITE_MESSAGING_TRUSTUP_API_URL;
const authorization_header = MIX_TRUSTUP_SERVER_AUTHORIZATION || VITE_TRUSTUP_SERVER_AUTHORIZATION;

const config = {
    auth: { url: auth_url, authorization_header },
    messaging: { url: messaging_url },
};

export default config;
