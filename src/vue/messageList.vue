<template>
  <div v-if="conversation" class="flex flex-col space-y-0.5">
    <div v-for="(message, index) in conversation.messages" class="flex flex-col items-end">
      <div class="message-item w-full flex group relative" :class="messageContainerClass(message, conversation.messages[index-1], conversation.messages[index+1])">
        <div class="flex items-center max-w-full sm:max-w-[75%] gap-2" :class="messageSide(message) == 'left' ? 'flex-row-reverse' : 'flex-row'">
          <div v-if="sentByAuthUser(message) && !message.deleted_at" @click="deleteMessage(message)" class="invisible group-hover:visible h-fit p-2 rounded-full hover:bg-gray-200 cursor-pointer text-gray-400 hover:text-gray-600 items-center justify-center"><i class="fas fa-trash"></i></div>
          <div class="flex items-end gap-2" :class="messageSide(message) == 'left' ? 'flex-row-reverse' : 'flex-row'">
            <div class="w-full bg-blue-500 p-3 rounded-2xl relative overflow-hidden" :class="messageClass(message, conversation.messages[index-1], conversation.messages[index+1])">
              <message :message="message"></message>
            </div>
            <div class="flex">
              <div v-if="['alone', 'bottom'].includes(messageRounded(message, conversation.messages[index-1], conversation.messages[index+1]))" class="w-8 h-8 border rounded-full bg-red-300 flex items-center justify-center" :title="conversation.users[message.user_id].first_name + ' ' + conversation.users[message.user_id].last_name">{{ conversation.users[message.user_id].first_name.charAt(0) }}</div>
              <div v-else class="w-8 h-8"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex space-x-0.5" v-if="conversation.users">
        <template v-for="user in conversation.users">
          <div v-if="user && user.id != userId && user.last_message_seen_id == message.id" class="mt-1 mb-2 w-6 h-6 border rounded-full bg-red-300 flex items-center justify-center" :title="user.first_name + ' ' + user.last_name">{{ user.first_name.charAt(0) }}</div>
        </template>
      </div>
    </div>

  </div>
</template>

<script>

import Message from "./message";
import message_endpoint from '../models/Message'

import {Client, Request} from "@henrotaym/api-client";

export default {
  name: "messageList",

  components: {Message},

  props: {
    conversation: Object,
    userId: {
      type: Number,
      required: true
    },
  },


  methods: {

    messageContainerClass(message, message_prev, message_next) {
      return {
        '!mt-4': this.messageMargin(message, message_prev),

        'justify-start': this.messageSide(message) == 'left',
        'justify-end': this.messageSide(message) == 'right',
      }
    },

    messageClass(message, message_prev, message_next) {

      const messageRoundedValue = this.messageRounded(message, message_prev, message_next)
      const sentByAuthUserValue = this.sentByAuthUser(message)
      const messageSideValue = this.messageSide(message)

      return {
        'text-white bg-blue-500': sentByAuthUserValue,
        'bg-gray-200': !sentByAuthUserValue,

        'rounded-br-md': messageSideValue == 'right' && messageRoundedValue == 'top',
        'rounded-tr-md rounded-br-md': messageSideValue == 'right' && messageRoundedValue == 'mid',
        'rounded-tr-md': messageSideValue == 'right' && messageRoundedValue == 'bottom',

        'rounded-bl-md': messageSideValue == 'left' && messageRoundedValue == 'top',
        'rounded-tl-md rounded-bl-md': messageSideValue == 'left' && messageRoundedValue == 'mid',
        'rounded-tl-md': messageSideValue == 'left' && messageRoundedValue == 'bottom',
      }
    },

    sentByAuthUser(message) {
      return message.user_id == this.userId
    },

    messageSide(message) {
      return this.sentByAuthUser(message) ? 'right' : 'left'
    },

    messageMargin(message, message_prev) {
      return message_prev && message_prev.user_id != message.user_id
    },

    messageRounded(message, message_prev, message_next) {
      if (message_next && message_prev && message_prev.user_id != message.user_id && message_next.user_id != message.user_id) return 'alone'
      if (message_prev && message_prev.user_id != message.user_id) return 'top'
      if (message_next && message_next.user_id != message.user_id) return 'bottom'

      if  (message_next == null) return 'bottom'

      return 'mid'
    },

    async deleteMessage(message) {
      if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
        const deleted_message = await message_endpoint.delete(message)
      }
    }
  }
}
</script>

<style scoped>

</style>
