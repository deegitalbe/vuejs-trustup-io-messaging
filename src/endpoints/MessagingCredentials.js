import {JsonCredential} from "@henrotaym/api-client";

export default class MessagingCredentials extends JsonCredential {

    prepare(request) {
        super.prepare(request)
        console.log('api url:', process.env.MIX_MESSAGING_TRUSTUP_API_URL)
        request.setBaseUrl(process.env.MIX_MESSAGING_TRUSTUP_API_URL)
    }
}
