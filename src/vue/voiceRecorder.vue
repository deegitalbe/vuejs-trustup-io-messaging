<template>
  <div class="relative cursor-pointer" @click="toggleRecord">
    <i class="fas fa-microphone relative"></i>
    <span :class="{'hidden': !recording}" class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-orange-400 opacity-75"></span>
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
            audio: [],
            recordedAudio: null,
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

            this.rec = new MediaRecorder(this.stream);

            this.rec.ondataavailable = e => {
                this.audio.push(e.data);

                if (this.rec.state == "inactive") {
                    let blob = new Blob(this.audio, {
                        type: 'audio/x-mpeg-3'
                    });
                    this.recordedAudio = URL.createObjectURL(blob);
                    this.audioDownload.href = this.recordedAudio.src;
                    this.audioDownload.download = 'audio.mp3';
                    this.audioDownload.innerHTML = 'Download';
                    this.send(blob);
                }
            }

            console.log('test')
            this.loaded = true
        },

        async unload() {
            this.stream.getTracks().forEach(function(track) {
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
            this.rec.start();
        },

        async stopRecording() {
            await this.unload()
            this.rec.stop();
        },

        send(blob) {
            this.$parent.sendAudio(blob)
        }
    }
}
</script>

<style scoped>

</style>
