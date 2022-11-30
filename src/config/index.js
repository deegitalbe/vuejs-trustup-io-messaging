import { getEnvironmentVariable } from "../env"

const config = {
    auth: {
        url: getEnvironmentVariable("TRUSTUP_AUTH_API_URL", "https://auth.trustup.io/api"),
        authorization_header: getEnvironmentVariable("TRUSTUP_SERVER_AUTHORIZATION")
    },
    messaging: {
        url: getEnvironmentVariable("MESSAGING_TRUSTUP_API_URL", "https://messaging.trustup.io/api")
    },
};

export default config;
