<template>
    <div class="flex justify-center items-center h-[100vh]">
        <button class="px-12 py-8 bg-shade-6 rounded uppercase" @click="conversations.createConversation(router)">
            new chat +
        </button>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from "../Lib/helpers";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useConversationsStore } from "../Lib/ConversationsStore";

const router = useRouter();
const store = useStore();
const conversations = useConversationsStore();

onMounted(async () => {
    let conversationId = await store.get<string>("last-conversation");

    if (conversationId) {
        router.push(`conversation/${conversationId}`);
    }
});
</script>

<style scoped></style>
