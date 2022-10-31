<template>
    <div id="conversation" class="h-full w-full flex flex-col justify-between relative">
      <div class="absolute flex justify-center pt-12 h-full w-full" v-if="loading.conversation">
          <div class="p-4 h-[40px] rounded-full bg-white shadow w-[100px]">
              <div class="relative">
                  <loader dot-color="bg-blue-500" />
              </div>
          </div>
      </div>
      <div class="h-full overflow-y-auto py-4 pb-8 px-4" ref="message_list">
        <message-list v-if="conversation"
                      :conversation="conversation"
                      :user-id="userId"
                      :display-style="displayStyle"></message-list>
        <div class="flex mt-4" :class="displayStyle == 'comments' ? 'pl-[40px]' : 'justify-end pr-[40px]'" v-if="loading.messages > 0">
            <div class="flex flex-col space-y-2">
                <div :key="`loading-message-${i}`" class="bg-blue-500 p-4 relative w-[100px]" :class="displayStyle == 'comments' ? 'bg-gray-200 rounded' : 'rounded-full bg-blue-500'" v-for="i in loading.messages">
                    <div class="relative">
                        <loader :dot-color="displayStyle == 'comments' ? 'bg-gray-600' : 'bg-white'" :background-color="displayStyle == 'comments' ? 'bg-gray-200' : 'bg-blue-500'" />
                    </div>
                </div>
            </div>
        </div>
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
                  <input id="imageUploader" ref="imageUploader" type="file" @change.prevent="onImageOrVideoUpload" multiple class="hidden" :accept="supportedMediaFormat()" />
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
  import { trustupWebsocket } from "@deegital/js-trustup-io-websocket";

  import conversation_endpoint from "../models/Conversation";
  import message_endpoint from "../models/Message";
  import KeyPress from '../vendors/keyPress'
  
  import MessageList from "./messageList";
  import VoiceRecorder from "./voiceRecorder";
  import UploadedFile from "@deegital/trustup-spa-js-assets/classes/UploadedFile";
  import UploadedImage from "@deegital/trustup-spa-js-assets/classes/UploadedImage";
  import Loader from "@deegital/trustup-spa-js-assets/components/_Partials/Loader";
  import {trying} from "@henrotaym/helpers";
  import user_endpoint from "../models/User";
  
  export default {
    name: "trustup-conversation",
  
    components: { VoiceRecorder, MessageList, Loader },
  
    props: {
      appKey: { type: String, required: true },
  
      modelType: { type: String, required: true },
  
      modelId: { required: true },
  
      userId: { type: Number, required: true },

        displayStyle: {
            type: String,
            default: 'chat'
        }   
    },
  
    data() {
      return {
          loading: {
              conversation: true,
              messages: 0,
          },
        message_text: '',
        files: [],
        images: [],
  
        supportedImageFormats: {
          size: 30000000, // 30MB
          extensions: ['jpg', 'jpeg', 'png', 'gif'],
          mimes: ['image/jpeg', 'image/gif', 'image/png'],
          dimensions: { height: 2000, width: 2000 }
        },
        supportedVideoFormats: {
          size: 100000000, // 100MB
          extensions: ['mp4', 'mov'],
          mimes: ['video/mp4', 'video/quicktime']
        },
        supportedFileFormats: {
          size: 30000000, // 30MB
          extensions: ['pdf', 'doc', 'docx', 'xlxs', 'xls', 'csv'],
          mimes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.template', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
        },
  
        conversation: null,
        users: null,
  
        keypress: null,
  
        textareaFocus: false,
      }
    },
    methods: {
      scrollConversation() {
        const messageList = this.$refs?.message_list;
        if (!messageList) return;
  
        messageList.scrollTop = messageList.scrollHeight;
      },
      
      setTextareaFocus() {
        this.textareaFocus = this.message_text.length > 0
      },
  
      onTabChange() {
        if (document.visibilityState !== "visible") return;
        this.seeConversation();
      },
  
      supportedMediaFormat() {
        return this.supportedImageFormats.mimes.join() + ',' + this.supportedVideoFormats.mimes.join()
      },
  
      connectToChannel() {
        trustupWebsocket.echo().channel(this.pusherChannel)
            .listen('MessageSentEvent', (e) => {
              if ( e.message && e.message.user_id == this.userId ) {
                  return;
              }
  
              console.log('Channel received message', e.message)
              this.onNewMessageAdded(e.message);
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
  
      disconnectFromChannel() {
        trustupWebsocket.echo().leave(this.pusherChannel);
      },
  
      seeConversation() {
        return conversation_endpoint.see(this.conversation.id, this.userId);
      },
  
      async fetchConversation() {
        this.loading.conversation = true;
        this.conversation = await conversation_endpoint.get(this.appKey, this.modelType, this.modelId, this.userId, true)
        this.loading.conversation = false;
      },
  
      scrollToBottom() {
        this.$nextTick(() => {
          const container = this.$refs.message_list;
          if (!container) return;
          // Waiting for all media to be loaded before scrolling
          container.querySelectorAll('img').forEach(img => { 
            img.removeEventListener('load', this.scrollConversation);
            img.addEventListener('load', this.scrollConversation);
          });
          container.querySelectorAll('video').forEach(vid => { 
            vid.removeEventListener('loadeddata', this.scrollConversation);
            vid.addEventListener('loadeddata', this.scrollConversation);
          });
  
          this.scrollConversation();
        })
      },
  
      async send() {
        if (this.message_text.length == 0) return;
  
        this.beforeSendingMessage();
        let message = await message_endpoint.send(this.conversation.id, this.userId, this.message_text);
  
          if ( message ) {
              this.message_text = ''
              this.textareaFocus = false
              this.onNewMessageAdded(message);
          }
      },
  
      beforeSendingMessage() {
          this.loading.messages++;
          this.scrollToBottom();
      },
  
      onNewMessageAdded(message = null) {
          if ( message ) {
              this.conversation.messages.push(message);
              this.seeConversation();
              this.scrollToBottom();
          }

          if (this.loading.messages === 0) return;

          this.loading.messages --;
      },
  
      async sendAudio(blob) {
        const file = new File([blob], "record.mp3", {type: "audio/x-mpeg-3"})
  
        this.beforeSendingMessage();
        let message = await message_endpoint.sendFile(this.conversation.id, this.userId, file);
        this.onNewMessageAdded(message);
      },
  
      async handleFileUpload()
      {
        let files = this.$refs.fileUploader.files;
        for ( let i = 0; i < files.length; i++ ) {
          const data = await this.processFile(new UploadedFile(this.supportedFileFormats), files[i])
  
          console.log('New file:', data);
          this.files.push(data);
          this.resetInput('fileUploader');
  
        this.beforeSendingMessage();
          const message = await message_endpoint.sendFile(this.conversation.id, this.userId, data.file, data.name);
          this.onNewMessageAdded(message);
        }
      },
  
      async onImageOrVideoUpload()
      {
        [...this.$refs.imageUploader.files].forEach(this.handleImageOrVideoUpload);
      },

      async handleImageOrVideoUpload(file)
      {
        const isVideo = this.supportedVideoFormats.mimes.includes(file.type);
        const processedFile = isVideo ?
          await this.processVideo(file)
          : await this.processImage(file);

        if (!processedFile) return;

        console.log(`New ${isVideo ? 'video': 'image'}`, processedFile);
        this.images.push(processedFile);
        this.resetInput('imageUploader');

        this.beforeSendingMessage();
        const message = isVideo ?
          await this.sendVideo(processedFile)
          : await this.sendImage(processedFile);

        if (!message) return;

        this.onNewMessageAdded(message);
      },

      async processImage(image)
      {
        return this.processFile(new UploadedImage(this.supportedImageFormats), image);
      },

      async processVideo(video)
      {
        return this.processFile(new UploadedFile(this.supportedVideoFormats), video);
      },

      sendImage(image)
      {
        return message_endpoint.sendImage(this.conversation.id, this.userId, image.source, image.name);
      },

      sendVideo(video)
      {
        return message_endpoint.sendFile(this.conversation.id, this.userId, video.file, video.name);
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
  
    },
    computed: {
      pusherChannel() {
        return `conversation.${this.conversation.id}`;
      }
    },
  
    async created() {
      await this.fetchConversation();
      this.connectToChannel();
      this.scrollToBottom();
      this.seeConversation();
    },
  
    mounted() {
      this.keypress = new KeyPress(this.$refs.textarea)
          .onKeydown(['Enter'], (e) => e.preventDefault())
          .onKeydown(['NumpadEnter'], (e) => e.preventDefault())
          .on(['Enter'], () => this.send())
          .on(['NumpadEnter'], () => this.send())
  
      // Detect if user change tab
      document.addEventListener("visibilitychange", this.onTabChange);
      this.$refs.textarea.addEventListener('input', this.setTextareaFocus)
      this.scrollToBottom();
    },
  
    beforeDestroy() {
      this.disconnectFromChannel();
      this.keypress.removeListeners();
      document.removeEventListener("visibilitychange", this.onTabChange);
      this.$refs.textarea.removeEventListener('input', this.setTextareaFocus);
      
      this.$refs.message_list.querySelectorAll('img').forEach(img =>
        img.removeEventListener('load', this.scrollConversation)
      )
      
      this.$refs.message_list.querySelectorAll('video').forEach(vid =>
        vid.removeEventListener('loadeddata', this.scrollConversation))
    },
  }
  </script>
  