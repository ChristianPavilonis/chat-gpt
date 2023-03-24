<template>
    <div class="max-w-900 mx-auto">
        <div class="mb-24">
            <RouterLink to="/">Back</RouterLink>
        </div>


        <h1 class="mb-24 text-lg">Settings</h1>

        <div>
            <label>
                <span class="block uppercase font-semibold mb-12">Open Ai key</span>
                <input class="bg-black/30 rounded py-8 px-12" type="password" v-model="openApiKey" @change="save">
            </label>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {inject, onMounted, ref} from 'vue';
import {Store} from "tauri-plugin-store-api";


const openApiKey = ref("");
const store = inject<Store>("store") || new Store(".settings.dat");

async function save() {
    await store.set('openai-key', openApiKey.value);
}

onMounted(async () => {
    const key: string | null = await store.get("openai-key");

    openApiKey.value = key || ""
})

</script>

<style scoped>

</style>