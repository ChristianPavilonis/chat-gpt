<template>
    <div class="flex justify-center items-center h-[100vh]">
        <button
            class="px-12 py-8 bg-shade-6 rounded uppercase"
            @click="createConversation(router)"
        >
            new chat +
        </button>
    </div>
</template>

<script lang="ts" setup>
import { createConversation, useStore } from "../Lib/helpers";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();
const store = useStore();

onMounted(async () => {
    let conversationId = await store.get<string>("last-conversation");

    if (conversationId) {
        router.push(`conversation/${conversationId}`);
    }
});
</script>

<style scoped></style>
