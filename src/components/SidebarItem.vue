<template>
    <RouterLink
        :to="`/conversation/${conversation.id}`"
        class="px-20 py-16 flex hover:bg-shade-6 relative text-sm"
        :class="isCurrentConversation(conversation.id) ? 'bg-shade-6' : ''"
    >
        {{ conversation.title || "New Chat" }}
    </RouterLink>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useConversationsStore } from "../Lib/ConversationsStore";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import ContextMenu from "./ContextMenu.vue";

let conversationsStore = useConversationsStore();
let { conversations } = storeToRefs(conversationsStore);
let router = useRouter();
let route = useRoute();
let rightClickEvent = ref();

function isCurrentConversation(id: string) {
    return route.params.id === id;
}

defineProps<{ conversation: any }>();
</script>

<style scoped></style>
