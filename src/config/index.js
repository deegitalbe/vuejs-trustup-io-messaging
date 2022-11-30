const getViteValue = key => import.meta.env?.[key];
const getMixValue = key => process.env?.[key];

const auth_url = getMixValue(MIX_TRUSTUP_AUTH_API_URL) || getViteValue(VITE_TRUSTUP_AUTH_API_URL);
const messaging_url = getMixValue(MIX_MESSAGING_TRUSTUP_API_URL) || getViteValue(VITE_MESSAGING_TRUSTUP_API_URL);
const authorization_header = getMixValue(MIX_TRUSTUP_SERVER_AUTHORIZATION) || getViteValue(VITE_TRUSTUP_SERVER_AUTHORIZATION);

const config = {
    auth: { url: auth_url, authorization_header },
    messaging: { url: messaging_url },
};

export default config;
