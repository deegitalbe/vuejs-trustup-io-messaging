import {JsonCredential} from "@henrotaym/api-client";
import config from "../config";

export default class MessagingCredentials extends JsonCredential {

    prepare(request) {
        super.prepare(request);
        request.setBaseUrl(config.messaging.url);
    }
}
