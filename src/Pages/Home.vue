<template>
    <div class="max-w-750 mx-auto pt-20">
        <div class="space-y-12">
            <div class="flex bg-black/50 rounded-md" v-for="message in displayMessages">
                <div class="uppercase mr-15">{{ message.role }}</div>
                <div>{{ message.content }}</div>
            </div>
        </div>

        <div class="fixed bottom-0 left-0">
            <form @submit="sendMessage">
                <textarea class="bg-black/30 rounded-md" v-model="input" cols="30" rows="2">
                </textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    </div>

</template>

<script lang="ts" setup>
import {computed, inject, onMounted, ref} from 'vue';
import {Store} from "tauri-plugin-store-api";
import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from "openai";

const store = inject<Store>("store") || new Store(".settings.dat");
let key: string | null;

const messages = ref<Array<ChatCompletionRequestMessage>>([{
    role: "system", content: "You are a helpful assistant",
}]);

const input = ref("");

const displayMessages = computed(() => messages.value.filter((msg) => msg.role !== "system"))

async function sendMessage() {
    if (key == null) {
        return;
    }

    messages.value.push({role: "user", content: input.value});

    const configuration = new Configuration({
        apiKey: key,
    });

    const openai = new OpenAIApi(configuration);


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
}


onMounted(async () => {
    key = await store.get("openai-key");
})

</script>

<style scoped>

</style>