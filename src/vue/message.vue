<template>
    <div>
        <div v-if="message.deleted_at">
            <i class="fas fa-ban mr-2"></i><i>Ce message a été supprimé par son propriétaire</i>
        </div>
        <div v-else>
            <div class="text-xs font-extralight mb-1 relative z-10">
                {{ message.create_at_formated }}
            </div>
            <div>
                <div v-if="message.text">
                    {{ message.text }}
                </div>

                <audio-player v-else-if="message.type.includes('audio/')" :media_url="message.media_url"></audio-player>

                <div v-else-if="message.type.includes('video/')" :media_url="message.media_url" class="mt-2 max-w-[450px]">
                    <video controls :src="message.media_url"></video>
                </div>

                <div v-else-if="message.type.includes('image/')" :media_url="message.media_url" class="mt-2 max-w-[300px]">
                    <img :src="message.media_url" alt="" class="rounded">
                </div>

                <div v-else class="mt-2 w-[150px]">
                    <a :href="message.media_url" target="_blank" rel="nofollow" class="block hover:underline">
                        <div class="bg-stone-100 w-full aspect-[21/29] rounded flex items-center justify-center p-4">
                            <i class="fas fa-file-alt text-4xl text-blue-500"></i>
                        </div>
                        <div class="text-sm mt-1">
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

    }
}
</script>

<style scoped>

</style>
