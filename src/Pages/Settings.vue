<template>
    <div class="max-w-900 mx-auto">
        <div class="mb-24">
            <RouterLink to="/">Back</RouterLink>
        </div>


        <h1 class="mb-24 text-lg">Settings</h1>

        <div class="flex items-end">
            <label class="mr-8 w-550">
                <span class="block uppercase font-semibold mb-12">Open Ai key</span>
                <input
                        class="bg-black/30 rounded py-8 px-12 w-full"
                        :type="showKey ? 'text' : 'password'"
                        v-model="openApiKey"
                        @change="saveKey"
                >
            </label>
            <button
                    class="py-4 px-8 border rounded"
                    @click="showKey = !showKey"
            >
                {{ showKey ? "Hide" : "Show" }}
            </button>
        </div>

        <div class="mt-12">
            <label class="block uppercase mb-4" for="model">
                Model
            </label>
            <select
                    class="bg-black"
                    v-model="model"
                    @change="saveModel"
                    name="model"
                    id="model"
            >
                <option value="gpt-4">GPT 4</option>
                <option value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
            </select>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {inject, onMounted, ref} from 'vue';
import {Store} from "tauri-plugin-store-api";
import {createOpenAiClient, shortcut, useStore} from "../Lib/helpers";
import {useRouter} from "vue-router";
import {computedAsync} from "@vueuse/core";

const showKey = ref(false);
const openApiKey = ref("");
const model = ref("");
const store = useStore();
const router = useRouter();

async function saveKey() {
    await store.set("openai-key", openApiKey.value);
}

async function saveModel() {
    await store.set("ai-model", model.value);
}

onMounted(async () => {
    const key: string | null = await store.get("openai-key");
    openApiKey.value = key || ""

    model.value = await store.get("ai-model") || "gpt-3.5-turbo";

    shortcut("Escape", (event) => {
        router.push("/");
    })
})

</script>

<style scoped>

</style>