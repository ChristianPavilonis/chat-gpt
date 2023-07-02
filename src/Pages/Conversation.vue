<template>
    <div class="relative pt-32">
        <div class="fixed top-0 right-0">
            <button class="p-20 rounded hover:bg-black/30" @click="deleteConversation">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>

            </button>
        </div>
        <div class="max-w-800 mx-auto pt-20 pb-80">
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
    </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import {OpenAIApi} from "openai";
import ChatBox from "../components/ChatBox.vue";
// @ts-ignore
import Markdown from 'vue3-markdown-it';
import 'highlight.js/styles/github-dark-dimmed.css';
import AsyncIndicator from "../components/AsyncIndicator.vue";
import {createOpenAiClient, sendChatMessage, shortcut, useStore} from "../Lib/helpers";
import {invoke} from "@tauri-apps/api";
import {useRoute, useRouter} from "vue-router";
import {useConversationsStore} from "../Lib/ConversationsStore";

const conversationStore = useConversationsStore();
const store = useStore();
const conversation = ref<any>({
    id: "",
    messages: [],
    title: null,
});
const input = ref("");
const loading = ref(false);
const route = useRoute();
const router = useRouter();
const openai = ref<OpenAIApi>();

const displayMessages = computed(() => {
    return conversation.value.messages.filter((msg: any) => msg.role !== "system");
})

watch(() => route.params.id, () => initConversation());

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

        if (conversation.value.title == null) {
            generateTitle();
        }
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

async function generateTitle() {
    if (!openai.value) {
        return;
    }

    const response = await sendChatMessage(openai.value, [...conversation.value.messages, {
        role: "user",
        content: "without any preface, create a 2-5 word title for this conversation as a helpful reminder to what it is about. Do not use any quotations."
    }]);
    conversation.value.title = response?.content || "";

    await saveConversation();
}

async function saveConversation() {
    const data = conversation.value;

    await invoke("save_conversation", {
        conversation: data,
    });

    conversationStore.updateConversation(data);
}

function resetConversation() {
    conversation.value.messages = [{
        role: "system", content: "You are a helpful assistant",
    }];
    conversation.value.title = null;

    saveConversation();
}

async function scrollToBottom() {
    await nextTick();
    window.scrollTo(0, document.body.scrollHeight);
}

async function initConversation() {
    try {
        conversation.value = await invoke('get_conversation', {
            conversationId: route.params.id as string,
        });
    } catch (error) {
        conversation.value.id = route.params.id;
        resetConversation();
    }
}

async function deleteConversation() {
    await invoke("delete_conversation", {
        conversationId: route.params.id as string,
    });

    await conversationStore.loadConversations();
    await router.push("/");
}

onMounted(async () => {
    try {
        openai.value = await createOpenAiClient();
    } catch (e) {
        console.error(e);
    }

    await initConversation();

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