<template>
    <div v-if="conversation" class="flex flex-col space-y-1">
      <div v-for="(message, index) in conversation.messages" class="flex flex-col items-end">
        <div :data-message-rounded="messageRounded(message, conversation.messages[index-1], conversation.messages[index+1])" class="relative flex w-full message-item group" :class="messageContainerClass(message, conversation.messages[index-1], conversation.messages[index+1])">
          <div class="max-w-full sm:max-w-[75%] pb-5 relative">
              <div class="flex items-center" :class="messageSide(message) == 'left' ? 'flex-row-reverse' : 'flex-row'">
                  <div v-if="sentByAuthUser(message) && !message.deleted_at" @click="deleteMessage(message)" class="items-center justify-center invisible p-2 text-gray-400 rounded-full cursor-pointer group-hover:visible h-fit hover:bg-gray-200 hover:text-gray-600"><i class="text-sm fas fa-trash"></i></div>
                  <div class="flex items-end gap-2" :class="messageSide(message) == 'left' ? 'flex-row-reverse' : 'flex-row'">
                      <div class="relative w-full overflow-hidden" :class="messageClass(message, conversation.messages[index-1], conversation.messages[index+1])">
                          <message :message="message"></message>
                      </div>
                      <div class="flex">
                          <div v-if="['alone', 'bottom'].includes(messageRounded(message, conversation.messages[index-1], conversation.messages[index+1]))" class="w-8 h-8 bg-center bg-cover border rounded-full" :title="conversation.users_map[message.user_id].first_name + ' ' + conversation.users_map[message.user_id].last_name" :style="`background-image: url(${conversation.users_map[message.user_id].avatar})`"></div>
                          <div v-else class="w-8 h-8"></div>
                      </div>
                  </div>
              </div>
              <div class="absolute bottom-0 z-10 text-xs text-gray-400 whitespace-nowrap font-extralight" :class="(sentByAuthUser(message) && displayStyle == 'chat') ? 'right-[40px]' : 'left-[40px]'">
                  {{ message.create_at_formated }}
              </div>
          </div>
        </div>
        <div class="hidden #flex space-x-0.5" v-if="conversation.users">
          <template v-for="user in conversation.users">
            <div v-if="user && user.id != userId && user.last_message_seen_id == message.id" class="w-6 h-6 mt-1 mb-2 bg-center bg-cover border rounded-full" :title="user.first_name + ' ' + user.last_name"  :style="`background-image: url(${user.avatar})`"></div>
          </template>
        </div>
      </div>
  
    </div>
  </template>
  
  <script>
  
  import Message from "./message.vue";
  import message_endpoint from '../models/Message'
  
  import {Client, Request} from "@henrotaym/api-client";
  
  export default {
    name: "messageList",
  
    components: {Message},
  
    props: {
        conversation: {
            type: Object,
            required: true,
        },
        
        userId: {
            type: Number,
            required: true
        },

        displayStyle: {
            type: String,
            required: true,
            default: 'chat'
        }
    },
  
  
    methods: {
  
      messageContainerClass(message, message_prev, message_next) {
        return {
          '!mt-4': this.messageMargin(message, message_prev),
  
          'justify-start text-left ': this.messageSide(message) == 'left',
          'justify-end text-right': this.messageSide(message) == 'right',
        }
      },
  
      messageClass(message, message_prev, message_next) {
  
        const messageRoundedValue = this.messageRounded(message, message_prev, message_next)
        const sentByAuthUserValue = this.displayStyle == 'chat' && this.sentByAuthUser(message)
        const messageSideValue = this.messageSide(message)
  
        return {
          'text-white bg-blue-500': sentByAuthUserValue,
          'bg-gray-200': !sentByAuthUserValue,

          'rounded-2xl': this.displayStyle == 'chat',
          'rounded': this.displayStyle == 'comments',
  
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
        if ( this.displayStyle == 'comments' ) {
            return 'left';
        }
        return this.sentByAuthUser(message) ? 'right' : 'left'
      },
  
      messageMargin(message, message_prev) {
        return message_prev && message_prev.user_id != message.user_id
      },
  
      messageRounded(message, message_prev, message_next) {
          // The message is sandwhiched between messages from other users.
        if (message_next && message_prev && message_prev.user_id != message.user_id && message_next.user_id != message.user_id) return 'alone'
        
        // The message is the first of multiple messages from the user.
        if (message_next && message_next.user_id == message.user_id && message_prev && message_prev.user_id != message.user_id) return 'top'
        
        // The message is the last one from the user.
        if (message_next && message_next.user_id != message.user_id) return 'bottom'
  
       // This is the last message
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
  