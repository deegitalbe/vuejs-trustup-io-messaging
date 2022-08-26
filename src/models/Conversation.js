import {Client, Request} from "@henrotaym/api-client";
import MessagingCredentials from "../endpoints/MessagingCredentials";

export default new class Conversation {

    constructor() {
        this.client = new Client(new MessagingCredentials())
    }

    async get(app_name, model, model_id, create_if_not_exists = false, title = null) {
        let request = new Request()
            .setVerb('GET')
            .setUrl('conversations/' + app_name + '/' + model + '/' + model_id)
            .addQuery({
                'create_if_not_exists': create_if_not_exists,
                'title': title
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
            .setUrl('conversations/seen').addData({
                'conversation_id': conversation_id,
                'user_id': user_id,
            })

        let response = await this.client.try(request)

        if (response.failed()) {
            console.error(response.getException().context())
            window.Toasteo.error('Erreur lors du marquage de la conversation comme lue')
            return null
        }

        return true
    }

}
