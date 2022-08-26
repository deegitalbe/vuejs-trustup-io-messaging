import {Client, Request} from "@henrotaym/api-client";
import MessagingCredentials from "../endpoints/MessagingCredentials";
import TrustupCredentials from "../endpoints/TrustupCredentials";

export default new class User {

    constructor() {
        this.client = new Client(new TrustupCredentials())
    }

    async get(user_id) {
        let request = new Request()
            .setVerb('GET')
            .setUrl('users/'+user_id)

        let response = await this.client.try(request)

        if (response.failed()) {
            console.error(response.getException().context())
            window.Toasteo.error('Erreur lors de la récupération du user ' + user_id)
            return null
        }

        return response.get().user
    }
}
