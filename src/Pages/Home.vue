<template>
    <div class="max-w-750 mx-auto pt-20">
        <div class="space-y-12">
            <div
                v-for="message in displayMessages"
                class="flex rounded-md max-w-800 px-25 py-18"
                :class="message.role === 'assistant' ? 'ml-auto bg-black/50': 'mr-auto bg-black/20'"
            >
                <Markdown class="prose prose-invert" :source="message.content"/>
            </div>
        </div>

        <div v-if="!key" class="h-600 w-full flex justify-center items-center">
            <p class="text-2xl">Set your api key (⌘ + ,)</p>
        </div>

        <div class="fixed bottom-10 max-w-800 w-full">
            <AsyncIndicator v-if="loading" class="w-50 h-50 mx-auto mb-24 stroke-current"/>
            <ChatBox
                v-model="input"
                @submit="sendMessage"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, inject, onMounted, ref} from 'vue';
import {Store} from "tauri-plugin-store-api";
import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from "openai";
import ChatBox from "../components/ChatBox.vue";
// @ts-ignore
import Markdown from 'vue3-markdown-it';
import 'highlight.js/styles/github-dark-dimmed.css';
import AsyncIndicator from "../components/AsyncIndicator.vue";


const store = inject<Store>("store") || new Store(".settings.dat");
let key: string | null;

const messages = ref<Array<ChatCompletionRequestMessage>>([]);

const input = ref("");
const loading = ref(false);
const displayMessages = computed(() => {
    return messages.value.filter((msg) => msg.role !== "system");
})

async function sendMessage() {
    if (key == null) {
        return;
    }

    loading.value = true;

    messages.value.push({role: "user", content: input.value});

    input.value = "";

    const configuration = new Configuration({
        apiKey: key,
    });

    const openai = new OpenAIApi(configuration);


    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages.value,
        });

        if (completion.data.choices.length > 0) {
            const choice = completion.data.choices[0];

            if (choice.message) {
                messages.value.push(choice.message)
            }
        }

        await store.set("conversation", messages.value);
    } catch(error) {
        console.error(error);
    }

    loading.value = false;
}


function resetConversation() {
    messages.value = [{
        role: "system", content: "You are a helpful assistant",
    }];
    store.set("conversation", messages.value);
}

function registerClearShortcut() {
    document.addEventListener("keydown", (event) => {
        if(event.metaKey && event.key === "k") {
            resetConversation();
        }
    });
}

onMounted(async () => {
    key = await store.get("openai-key");

    const conversation: Array<ChatCompletionRequestMessage>|null = await store.get("conversation");

    if(conversation) {
         messages.value = conversation;
    }
    else {
        resetConversation();
    }

    registerClearShortcut();
})

</script>

<style scoped>

</style>