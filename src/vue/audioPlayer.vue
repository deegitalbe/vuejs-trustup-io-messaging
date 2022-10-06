<template>
    <div class="w-full sm:w-[350px]">
        <audio ref="player">
            <source :src="media_url" type="audio/mpeg" />
        </audio>
        <div id="audio-player" class="flex space-x-4 justify-between items-center z-10 relative">
            <span @click="togglePlay" v-if="player" class="cursor-pointer bg-white text-blue-500 rounded-full p-1 text-sm w-7 h-7 flex items-center justify-center"><i class="fas text-xs" :class="{'fa-play': !playing, 'fa-pause': playing}"></i></span>
            <div class="flex space-x-1 items-center overflow-hidden">
                <div v-for="lineHeight in voiceLines" class="w-1 bg-white rounded-full" :style="'height: ' + lineHeight + 'px'"></div>
            </div>
            <span id="time" class="time bg-white text-blue-500 rounded-full w-12 h-7 flex items-center justify-center px-1 text-sm">{{ time_left }}</span>
        </div>
        <div ref="progressbar" class="absolute transition-all duration-200 left-0 -right-2 top-0 h-full bg-blue-400 z-0" style="width: 0;"></div>
    </div>
</template>

<script>

import moment from 'moment'

export default {
    name: "audioPlayer",

    props: ['media_url'],

    data() {
        return {
            player: null,
            duration: 0,
            time_left: '...',
            progress_bar: null,
            playing: false,

            voiceLines: []
        }
    },

    computed: {

    },

    mounted() {
        this.player = this.$refs.player
        this.progress_bar = document.getElementById('progressbar')

        this.player.onloadedmetadata = () => {
            this.getDuration(this.media_url, (duration) => {
                this.duration = duration
                this.time_left = moment.unix(Math.round(this.duration)).format('mm:ss')
            })
        };

        this.player.load()
        this.player.volume = 0.85
        this.player.addEventListener("timeupdate", () => {
            if (this.player.ended) {
                this.resetAudio()
            } else {
                // Progress bar update
                this.time_left = moment.unix(this.duration - this.player.currentTime).format('mm:ss')
                this.$refs.progressbar.style.width = ((this.player.currentTime / this.duration) * 100) + '%';
            }

        }, false);
    },

    created() {
        this.generateVoiceLineArray()
    },

    methods: {

        generateVoiceLineArray() {
            for (let i = 0; i < 30; i++) {
                this.voiceLines.push(Math.floor(Math.random() * 25) + 10)
            }
        },

        resetAudio() {
            this.playing = false
            this.$refs.progressbar.style.width = '100%';
        },

        // Simulate a fake player to get the real duration of the audio
        getDuration(url, next) {
            var _player = new Audio(url);
            _player.addEventListener("durationchange", function (e) {
                if (this.duration!=Infinity) {
                    var duration = this.duration
                    _player.remove();
                    next(duration);
                }
            }, false);
            _player.load();
            _player.currentTime = 24*60*60; //fake big time
            _player.volume = 0;
            _player.play();
        },

        togglePlay() {
            this.playing = !this.playing
            this.player[this.player.paused ? 'play' : 'pause']();
        },
    },
}
</script>

<style scoped>

</style>
