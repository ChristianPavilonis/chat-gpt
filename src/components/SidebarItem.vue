<template>
    <RouterLink
        :to="`/conversation/${conversation.id}`"
        class="px-20 py-16 flex hover:bg-black/30 relative"
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
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useConversationsStore} from "../Lib/ConversationsStore";
import {storeToRefs} from "pinia";
import {useRoute, useRouter} from "vue-router";
import ContextMenu from "./ContextMenu.vue";

let conversationsStore = useConversationsStore();
let {conversations} = storeToRefs(conversationsStore);
let router = useRouter();
let route = useRoute();
let rightClickEvent = ref();

function isCurrentConversation(id: string) {
    return route.params.id === id;
}

defineProps<{conversation: any}>();

</script>

<style scoped>

</style>