import {Client, Request} from "@henrotaym/api-client";
import MessagingCredentials from "../endpoints/MessagingCredentials";

export default new class Conversation {

    constructor() {
        this.client = new Client(new MessagingCredentials())
    }

    async get(app_key, model_type, model_id, user_id, create_if_not_exists = true, title = null) {
        let request = new Request()
            .setVerb('GET')
            .setUrl('conversations/' + app_key + '/' + model_type + '/' + model_id)
            .addQuery({
                create_if_not_exists,
                title,
                user_id
            })

        let response = await this.client.try(request)

        if (response.failed())
            console.error(response.getException().context())

        console.log(response.get().data)

        return response.get().data
    }

    async see(conversation_id, user_id) {
        let request = new Request()
            .setVerb('POST')
            .setUrl('conversations/seen')
            .addData({
                conversation_id,
                user_id
            })

        console.log({ request });

        let response = await this.client.try(request)

        if (response.failed()) {
            console.error(response.getException().context())
            window.Toasteo.error('Erreur lors du marquage de la conversation comme lue')
            return null
        }

        return true
    }

}
