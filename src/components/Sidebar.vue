<template>
    <div class="min-w-280">
        <div class="bg-black/20 w-280 h-[100vh] flex flex-col justify-between overflow-y-auto fixed">
            <div>
                <RouterLink
                    v-for="conversation in conversationsStore.conversations"
                    :to="`/conversation/${conversation.id}`"
                    class="px-20 py-16 flex hover:bg-black/30"
                    :class="isCurrentConversation(conversation.id) ? 'bg-black/30' : ''"
                >
                    <svg
                        class="w-24 h-24 mr-12"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
                    </svg>
                    {{ conversation.title || "New Chat" }}
                </RouterLink>
            </div>
            <div>
                <button
                    class="w-full py-16 border-t border-white/20 flex items-center justify-center"
                    @click="createConversation(router)"
                >
                    New Chat
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-24 h-24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue';
import {useConversationsStore} from "../Lib/ConversationsStore";
import {invoke} from "@tauri-apps/api";
import {storeToRefs} from "pinia";
import {createConversation} from "../Lib/helpers";
import {useRoute, useRouter} from "vue-router";

let conversationsStore = useConversationsStore();
let {conversations} = storeToRefs(conversationsStore);
let router = useRouter();
let route = useRoute();

function isCurrentConversation(id: string) {
    return route.params.id === id;
}

onMounted(async () => {
    let conversations = await invoke("get_conversations");

    conversationsStore.setConversations(conversations);
});
</script>

<style scoped>

</style>