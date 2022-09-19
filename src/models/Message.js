import {Client, Request} from "@henrotaym/api-client";
import MessagingCredentials from "../endpoints/MessagingCredentials";

export default new class Message {

    constructor() {
        this.client = new Client(new MessagingCredentials())
    }

    async send(conversation_id, user_id, message_text) {
        let request = new Request()
            .setVerb('POST')
            .setUrl('messages').addData({
                conversation_id: conversation_id,
                'user_id': user_id,
                text: message_text
            })

        let response = await this.client.try(request)

        if (response.failed()) {
            console.error(response.getException().context())
            window.Toasteo.error('Erreur lors de l\'envoi du message')
            return null
        }

        return response.get().data
    }

    async sendFile(conversation_id, user_id, media_file, media_filename = null) {
        const request = new Request()
            .setVerb('POST')
            .setUrl('messages')
            .addData({
                conversation_id,
                user_id,
                media_file,
                media_filename
            })
            .asForm(true)

        console.log({ request });

        const response = await this.client.try(request)

        if (response.failed()) {
            console.error(response.getException().context())
            return null
        }


        return response.get().data
    }

    async delete(message) {
        let request = new Request()
            .setVerb('DELETE')
            .setUrl('messages/' + message.id)

        let response = await this.client.try(request)

        if (response.failed())
            console.error(response.getException().context())

        return response.get().data
    }
}
