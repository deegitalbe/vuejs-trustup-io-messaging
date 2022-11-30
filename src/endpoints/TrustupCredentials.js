import {JsonCredential} from "@henrotaym/api-client";
import config from "../config";

export default class TrustupCredentials extends JsonCredential {

    prepare(request) {
        super.prepare(request)
        request.setBaseUrl(config.auth.url)
        request.addHeaders({ 'X-Server-Authorization': config.auth.authorization_header })
    }
}
