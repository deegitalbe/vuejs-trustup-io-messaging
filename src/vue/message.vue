<template>
    <div>
        <div class="p-3" v-if="message.deleted_at">
            <i class="fas fa-ban mr-2"></i><i>Ce message a été supprimé par son propriétaire</i>
        </div>
        <div v-else>
            <div :class="{'p-3': paddedBox}">
                <div v-if="message.text">
                    {{ message.text }}
                </div>

                <audio-player v-else-if="message.type.includes('audio/')" :media_url="message.media_url"></audio-player>

                <div v-else-if="message.type.includes('video/')" :media_url="message.media_url" class="max-w-[450px]">
                    <video controls :src="message.media_url"></video>
                </div>

                <div v-else-if="message.type.includes('image/')" :media_url="message.media_url" class="max-w-[300px]">
                    <img :src="message.media_url" alt="" class="rounded">
                </div>

                <div v-else class="w-auto">
                    <a :href="message.media_url" target="_blank" rel="nofollow" class="flex items-center space-x-2 hover:underline">
                        <div class="bg-stone-100 w-8 h-8 rounded-full flex items-center justify-center p-4">
                            <i class="fas fa-file-alt text-gray-400"></i>
                        </div>
                        <div class="text-xs">
                            {{ message.media_name }}
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AudioPlayer from "./audioPlayer";
export default {
    name: "message",
    components: {AudioPlayer},
    props: {
        message: Object,
    },

    computed: {
        paddedBox() {
            if ( this.message.type.includes('video/') || this.message.type.includes('image/') ) {
                return false;
            }
            return true;
        }
    }
}
</script>

<style scoped>

</style>
