<template>
  <div id="conversation" class="h-full w-full flex flex-col justify-between relative">
<!--    <div v-if="conversation && conversation.title" class="relative z-20 h-8 flex items-center justify-center text-center sticky top-0 left-0 w-full bg-gray-100 text-sm font-light uppercase">#{{ conversation.id }} {{ conversation.title }}</div>-->
    <div class="h-full overflow-y-auto py-4 pb-8 px-4" ref="message_list">
      <message-list v-if="conversation"
                    :conversation="conversation"
                    :user-id="userId"></message-list>
    </div>
    <div class="w-full px-4 pr-8 py-4">
      <form ref="newMessage" class="flex flex-col space-y-2" @submit.prevent="send()">
        <div class="flex items-center space-x-4 relative">
                    <textarea
                      ref="textarea"
                      :disabled="!conversation"
                      class="w-full resize-none rounded-full border-0 outline-none outline-0 p-4 px-8 bg-gray-100"
                      placeholder="Message..."
                      name=""
                      id=""
                      rows="1"
                      v-model="message_text"
                    ></textarea>

          <div class="gap-6 flex items-center absolute right-8 top-0 bottom-0">

            <!-- Voice recorder button -->
            <voice-recorder 
              :disabled="!conversation"
              :model-type="modelType"
              :model-id="modelId"
              :user-id="userId"
              v-if="!textareaFocus"
              class="text-xl text-gray-500 hover:text-orange-700 transition-colors rounded-full flex justify-center items-center"
            ></voice-recorder>

            <!-- Image Uploader Button -->
            <div v-if="!textareaFocus">
              <label class="cursor-pointer text-xl text-gray-500 hover:text-green-700 transition-colors rounded-full flex justify-center items-center">
                <i class="fas fa-image"></i>
                <input id="imageUploader" ref="imageUploader" type="file" @change.prevent="handleImageUpload" multiple class="hidden" :accept="supportedMediaFormat()" />
              </label>
            </div>

            <!-- File Uploader Button -->
            <div v-if="!textareaFocus">
              <label class="cursor-pointer text-xl text-gray-500 hover:text-purple-700 transition-colors rounded-full flex justify-center items-center">
                <i class="fas fa-file-alt"></i>
                <input id="fileUploader" ref="fileUploader" type="file" @change.prevent="handleFileUpload" multiple class="hidden" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.wordprocessingml.template,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" />
              </label>
            </div>

            <!-- Send Message Button -->
            <div @click="send"
                 v-if="textareaFocus"
                 class="cursor-pointer text-xl text-gray-500 hover:text-blue-700 transition-colors rounded-full flex justify-center items-center pl-0.5">
              <i class="fas fa-chevron-right"></i></div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import conversation_endpoint from "../models/Conversation";
import message_endpoint from "../models/Message";
import KeyPress from '../vendors/keyPress'

import MessageList from "./messageList";
import VoiceRecorder from "./voiceRecorder";
import UploadedFile from "@deegital/trustup-spa-js-assets/classes/UploadedFile";
import UploadedImage from "@deegital/trustup-spa-js-assets/classes/UploadedImage";
import {trying} from "@henrotaym/helpers";
import user_endpoint from "../models/User";

export default {
  name: "trustup-conversation",

  components: { VoiceRecorder, MessageList },

  props: {
    appKey: { type: String, required: true },

    modelType: { type: String, required: true },

    modelId: { required: true },

    userId: { type: Number, required: true }
  },

  data() {
    return {
      message_text: '',
      files: [],
      images: [],

      supportedImageFormats: {
        size: 30000000, // 30MB
        extensions: ['jpg', 'jpeg', 'png', 'gif'],
        mimes: ['image/jpeg', 'image/gif', 'image/png']
      },
      supportedVideoFormats: {
        maxSize: 30000000, // 30MB
        extensions: ['mp4', 'mov'],
        mimes: ['video/mp4', 'video/quicktime']
      },
      supportedFileFormats: {
        maxSize: 30000000, // 30MB
        extensions: ['pdf', 'doc', 'docx', 'xlxs', 'xls', 'csv'],
        mimes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.template', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
      },

      conversation: null,
      users: null,

      keypress: null,

      textareaFocus: false,
    }
  },

  mounted() {
    this.keypress = new KeyPress(this.$refs.textarea)
        .onKeydown(['Enter'], (e) => e.preventDefault())
        .onKeydown(['NumpadEnter'], (e) => e.preventDefault())
        .on(['Enter'], () => this.send())
        .on(['NumpadEnter'], () => this.send())

    // Detect if user change tab
    document.addEventListener("visibilitychange", this.onTabChange);
  },

  async created() {
    await this.fetchConversation()
    await this.connectToChannel()

    await this.seeConversation()

    this.$refs.textarea.addEventListener('input', () => this.textareaFocus = this.message_text.length > 0)
  },

  beforeDestroy() {
    this.keypress.removeListeners();
    document.removeEventListener("visibilitychange", this.onTabChange);
  },

  methods: {

    onTabChange() {
      if (document.visibilityState !== visible) return;
      this.seeConversation();
    },

    supportedMediaFormat() {
      return this.supportedImageFormats.mimes.join() + ',' + this.supportedVideoFormats.mimes.join()
    },

    connectToChannel() {
      window.Echo.channel('conversation.' + this.conversation.id)
          .listen('MessageSentEvent', (e) => {
            console.log('Channel received message', e.message)
            this.conversation.messages.push(e.message)
            this.seeConversation()
            this.scrollToBottom()
          })
          .listen('MessageDeletedEvent', (e) => {
            console.log('Channel deleted message', e.message)
            // Replace the message in the array by the deleted one
            this.conversation.messages.splice(this.conversation.messages.findIndex((_msg) => _msg.id == e.message.id), 1, e.message)
            this.seeConversation()
          })
          .listen('ConversationSeenEvent', ({ user }) => {
            console.log('Conversation is seen', user)
            if (!this.conversation) return;

            console.log(this.conversation)
            this.conversation.users = this.conversation.users || [];
            this.conversation.users_map = this.conversation.users_map || {};

            this.conversation.users_map[user.id] = user
            const index = this.conversation.users.find(u => u.id === user.id);
            if (index === -1) return;
            this.conversation.users.splice(index, 1, user);
          })

    },

    seeConversation() {
      return conversation_endpoint.see(this.conversation.id, this.userId);
    },

    async fetchConversation() {
      this.conversation = await conversation_endpoint.get(this.appKey, this.modelType, this.modelId, true)
      this.scrollToBottom()
    },

    scrollToBottom() {
      this.$nextTick(() => {

        // Waiting for all media to be loaded before scrolling
        document.querySelectorAll('#messaging img').forEach(img => img.addEventListener('load', () => this.$refs.message_list.scrollTop = this.$refs.message_list.scrollHeight))
        document.querySelectorAll('#messaging video').forEach(vid => vid.addEventListener('loadeddata', () => this.$refs.message_list.scrollTop = this.$refs.message_list.scrollHeight))

        this.$refs?.message_list.scrollTop = this.$refs?.message_list.scrollHeight;
      })
    },

    async send() {
      if (this.message_text.length == 0) return;

      if (!await message_endpoint.send(this.conversation.id, this.userId, this.message_text)) return;

      this.message_text = ''
      this.textareaFocus = false
    },

    async sendAudio(blob) {
      const file = new File([blob], "record.mp3", {type: "audio/x-mpeg-3"})

      let created_message = await message_endpoint.sendFile(this.conversation.id, this.userId, file)
    },

    async handleFileUpload()
    {
      let files = this.$refs.fileUploader.files;
      for ( let i = 0; i < files.length; i++ ) {
        const data = await this.processFile(new UploadedFile(this.supportedFileFormats), files[i])

        console.log('New file:', data);
        this.files.push(data);
        this.resetInput('fileUploader');

        const message = await message_endpoint.sendFile(this.conversation.id, this.userId, data.file, data.name)
      }
    },

    async handleImageUpload()
    {
      let images = this.$refs.imageUploader.files;
      for ( let i = 0; i < images.length; i++ ) {
        let data = this.supportedVideoFormats.mimes.includes(images[i].type) ?
            await this.processFile(new UploadedFile(this.supportedVideoFormats), images[i]) : // Special Handle for videos
            await this.processFile(new UploadedImage(this.supportedImageFormats), images[i])

        if (!data) return;

        console.log('New image:', data);
        this.images.push(data);
        this.resetInput('imageUploader');

        const message = await message_endpoint.sendFile(this.conversation.id, this.userId, data.file, data.name)
      }
    },

    async processFile(processor, file)
    {
      if (!processor.validSize(file)) {
        window.Toasteo.error('Taille du fichier trop grande (max ' + (processor.rules.size / 1000000) + 'MB)');
        return null
      }

      if (!processor.validExtension(file)) {
        window.Toasteo.error('L\'extension ['+file.name.split('.').pop().toLowerCase()+'] n\'est pas supportée.');
        return null
      }

      const [e2,data] = await trying(() => processor.get(file))
      if (e2 === undefined) {
        window.Toasteo.error('processor.get failed', e2);
        return null
      }

      return data
    },

    resetInput(id)
    {
      document.getElementById(id).value = null;
    },

  }
}
</script>

<style scoped>

</style>
