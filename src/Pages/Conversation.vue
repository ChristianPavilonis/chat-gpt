<template>
    <div class="max-w-800 mx-auto pt-20">
        <div class="space-y-12">
            <div
                v-for="message in displayMessages"
                class="flex rounded-md max-w-800 px-25 py-18"
                :class="message.role === 'assistant' ? 'ml-auto bg-black/50': 'mr-auto bg-black/20'"
            >
                <Markdown
                    class="prose prose-invert"
                    :source="message.content"
                />
            </div>
        </div>

        <div v-if="!openai" class="h-600 w-full flex justify-center items-center">
            <p class="text-2xl">Set your api key (⌘ + ,)</p>
        </div>

        <div class="fixed bottom-10 container w-full">
            <div class="max-w-800">
                <AsyncIndicator
                    v-if="loading"
                    class="w-50 h-50 mx-auto mb-24 stroke-current"
                />
                <ChatBox
                    v-model="input"
                    @submit="sendMessage"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, inject, nextTick, onMounted, ref} from 'vue';
import {Store} from "tauri-plugin-store-api";
import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from "openai";
import ChatBox from "../components/ChatBox.vue";
// @ts-ignore
import Markdown from 'vue3-markdown-it';
import 'highlight.js/styles/github-dark-dimmed.css';
import AsyncIndicator from "../components/AsyncIndicator.vue";
import {createOpenAiClient, sendChatMessage, shortcut, useStore} from "../Lib/helpers";
import {invoke} from "@tauri-apps/api";
import {v4 as uuidV4} from "uuid";
import {useRoute} from "vue-router";

const store = useStore();
const conversation = ref<any>({
    id: "",
    messages: [],
});
const input = ref("");
const loading = ref(false);
const route = useRoute();
const openai = ref<OpenAIApi>();

const displayMessages = computed(() => {
    return conversation.value.messages.filter((msg: any) => msg.role !== "system");
})

async function sendMessage() {
    if (openai.value === undefined) {
        return;
    }

    loading.value = true;
    await pushMessage({role: "user", content: input.value});
    input.value = "";

    try {
        // @ts-ignore
        const response = await sendChatMessage(openai.value, conversation.value.messages);

        await pushMessage(response)
    } catch (error) {
        console.error(error);
    }

    loading.value = false;
}

async function pushMessage(message: any) {
    conversation.value.messages.push(message);

    await scrollToBottom();
    await saveConversation();

}

async function saveConversation() {
    const data = conversation.value;

    await invoke("save_conversation", {
        conversation: data,
    });
}


function resetConversation() {
    conversation.value.messages = [{
        role: "system", content: "You are a helpful assistant",
    }];
    saveConversation();
}

async function scrollToBottom() {
    await nextTick();
    window.scrollTo(0, document.body.scrollHeight);
}

onMounted(async () => {
    try {
        openai.value = await createOpenAiClient();
    } catch (e) {
        console.error(e);
    }

    try {
        conversation.value = await invoke('get_conversation', {
            conversationId: route.params.id as string,
        });
    } catch (error) {
        conversation.value.id = route.params.id;
    }

    shortcut({
        key: "k",
        modifier: true,
        handler: (event) => {
            resetConversation();
        },
    });
})

</script>

<style scoped>

</style>