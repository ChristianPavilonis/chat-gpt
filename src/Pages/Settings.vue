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
                        @change="save"
                >
            </label>
            <button
                    class="py-4 px-8 border rounded"
                    @click="showKey = !showKey"
            >
                {{ showKey ? "Hide" : "Show" }}
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {inject, onMounted, ref} from 'vue';
import {Store} from "tauri-plugin-store-api";
import {shortcut} from "../Lib/helpers";
import {useRouter} from "vue-router";

const showKey = ref(false);
const openApiKey = ref("");
const store = inject<Store>("store") || new Store(".settings.dat");
const router = useRouter();

async function save() {
    await store.set('openai-key', openApiKey.value);
}

onMounted(async () => {
    const key: string | null = await store.get("openai-key");
    openApiKey.value = key || ""

    shortcut("Escape", (event) => {
        router.push("/");
    })
})

</script>

<style scoped>

</style>