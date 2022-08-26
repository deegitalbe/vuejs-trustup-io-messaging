import {JsonCredential} from "@henrotaym/api-client";

export default class TrustupCredentials extends JsonCredential {

    prepare(request) {
        super.prepare(request)
        request.setBaseUrl(process.env.MIX_TUSTUP_API_URL)
        request.addHeaders({
            'X-Server-Authorization': process.env.MIX_TRUSTUP_SERVER_AUTHORIZATION
        })
    }
}
