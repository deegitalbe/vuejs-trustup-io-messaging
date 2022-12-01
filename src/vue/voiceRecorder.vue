<template>
    <div class="relative cursor-pointer" :class="{'!text-orange-700': recording_stream}" @click="toggleRecord">
      <i class="relative fas fa-microphone"></i>
      <span :class="{'hidden': !recording_stream}"
            class="absolute inline-flex bg-orange-400 rounded-full opacity-75 animate-ping h-9 w-9"></span>
    </div>
  </template>
  
  <script>
  export default {
    name: "voiceRecorder",
  
    data() {
      return {
        stream: null,
        loaded: false,
        rec: null,
        recording: false,
        recording_stream: false,
        audio: [],
        recordedAudio: null,
        mimeType: null,
        audioDownload: {}
      }
    },
  
    mounted() {
  
    },
  
    methods: {
  
      async load() {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        })
  
        this.mimeType = ['audio/wav', 'audio/mpeg', 'audio/webm', 'audio/ogg'].filter(MediaRecorder.isTypeSupported)[0];
        this.rec = new MediaRecorder(this.stream, {
          mimeType: this.mimeType
        });
        console.log(this.mimeType, this.rec.mimeType);
  
        this.rec.ondataavailable = e => {
          this.audio.push(e.data);
  
          if (this.rec.state == "inactive") {
            let blob = new Blob(this.audio, {
              type: this.mimeType
            });
            this.recordedAudio = URL.createObjectURL(blob);
            this.audioDownload.href = this.recordedAudio.src;
            this.audioDownload.download = 'audio.mp3';
            this.audioDownload.innerHTML = 'Download';
            this.send(blob, this.mimeType);
          }
        }
  
        console.log('test')
        this.loaded = true
      },
  
      async unload() {
        this.stream.getTracks().forEach(function (track) {
          track.stop();
        });
  
      },
  
      async toggleRecord() {
        this.recording = !this.recording
        this.recording ? await this.startRecording() : await this.stopRecording()
      },
  
      async startRecording() {
        await this.load()
  
        this.audio = [];
        this.recording_stream = true
        this.rec.start();
      },
  
      async stopRecording() {
        await this.unload()
  
        this.recording_stream = false
        this.rec.stop();
      },
  
      send(blob, mimeType) {
        this.$parent.sendAudio(blob, mimeType)
      }
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  