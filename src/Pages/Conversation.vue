<template>
    <div class="w-full relative pt-32" ref="container">
        <div
            class="fixed bg-shade-9 top-0 flex justify-between items-center"
            ref="bar"
        >
            <div>
                <input
                    class="focus:bg-shade-6 bg-transparent py-8 px-12"
                    v-model="systemPrompt"
                    type="text"
                />
            </div>
            <!--            <Find :conversation="conversation"/>-->
            <button
                class="p-20 rounded hover:bg-shade-6"
                @click="deleteConversation"
            >
                <IconTrash />
            </button>
        </div>

        <div class="max-w-800 mx-auto pt-20 pb-80">
            <div class="space-y-12">
                <div
                    v-for="(message, index) in displayMessages"
                    class="flex rounded-md max-w-800 px-25 py-18"
                    :class="
                        message.role === 'assistant'
                            ? 'ml-auto bg-shade-9'
                            : 'mr-auto bg-shade-5'
                    "
                    :id="'message-' + index"
                >
                    <Markdown :message="message" />
                </div>
            </div>

            <div
                v-if="!openai"
                class="h-600 w-full flex justify-center items-center"
            >
                <p class="text-2xl">Set your api key (⌘ + ,)</p>
            </div>

            <div class="fixed bottom-10 container w-full">
                <div class="max-w-800">
                    <AsyncIndicator
                        v-if="loading"
                        class="w-50 h-50 mx-auto mb-24 stroke-current"
                    />
                    <ChatBox v-model="input" @submit="sendMessage" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import OpenAI from "openai";
import ChatBox from "../components/ChatBox.vue";
import "highlight.js/styles/github-dark-dimmed.css";
import AsyncIndicator from "../components/AsyncIndicator.vue";
import {
    createOpenAiClient,
    sendChatMessage,
    shortcut,
    useStore,
} from "../Lib/helpers";
import { invoke } from "@tauri-apps/api";
import { useRoute, useRouter } from "vue-router";
import { useConversationsStore } from "../Lib/ConversationsStore";
import Markdown from "../components/Markdown.vue";
import IconTrash from "../components/Icons/IconTrash.vue";

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
const openai = ref<OpenAI>();
const systemPrompt = ref("You are a helpful assistant");
const container = ref<HTMLElement>();
const bar = ref<HTMLElement>();

const displayMessages = computed(() => {
    return conversation.value.messages.filter(
        (msg: any) => msg.role !== "system",
    );
});

watch(
    () => route.params.id,
    () => initConversation(),
);
watch(systemPrompt, () => {
    conversation.value.messages[0].content = systemPrompt.value;
});

async function sendMessage() {
    if (openai.value === undefined) {
        return;
    }

    loading.value = true;
    await pushMessage({ role: "user", content: input.value });
    input.value = "";

    try {
        await pushMessage({ role: "assistant", content: "" });

        // @ts-ignore
        await sendChatMessage(
            openai.value,
            conversation.value.messages,
            (chunk) => {
                let messageIndex = conversation.value.messages.length - 1;
                conversation.value.messages[messageIndex].content += chunk;
            },
        );

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
    conversation.value.title = "";

    await sendChatMessage(
        openai.value,
        [
            ...conversation.value.messages,
            {
                role: "user",
                content:
                    "without any preface, create a 2-5 word title for this conversation as a helpful reminder to what it is about. Do not use any quotations.",
            },
        ],
        (chunk) => {
            conversation.value.title += chunk;
        },
    );

    await saveConversation();
}

async function saveConversation() {
    const data = conversation.value;
    const last_modified = Date.now();

    conversationStore.saveConversation({ ...data, last_modified });
    conversationStore.updateConversation(data);
}

function resetConversation() {
    conversation.value.messages = [
        {
            role: "system",
            content: systemPrompt.value,
        },
    ];
    conversation.value.title = null;

    saveConversation();
}

async function scrollToBottom() {
    await nextTick();
    window.scrollTo(0, document.body.scrollHeight);
}

async function initConversation() {
    try {
        conversation.value = await invoke("get_conversation", {
            conversationId: route.params.id as string,
        });
        systemPrompt.value = conversation.value.messages[0].content;
    } catch (error) {
        conversation.value.id = route.params.id;
        resetConversation();
    }

    store.set("last-conversation", conversation.value.id);
}

async function deleteConversation() {
    await invoke("delete_conversation", {
        conversationId: route.params.id as string,
    });

    store.set("last-conversation", null);
    await conversationStore.loadConversations();
    await router.push("/");
}

function setBarWidth() {
    const width = container.value?.offsetWidth;

    if (bar.value) {
        bar.value.style.width = width + "px";
    }
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

    window.onresize = setBarWidth;
    setBarWidth();
});
</script>

<style scoped></style>
