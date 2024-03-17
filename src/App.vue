<template>
    <div class="flex">
        <Sidebar />
        <div class="container mx-auto overflow-y-auto">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted } from "vue";
import { Store } from "tauri-plugin-store-api";
import { useRouter } from "vue-router";
import { newWindow, setTheme, shortcut, useStore } from "./Lib/helpers";
import Sidebar from "./components/Sidebar.vue";
import { useConversationsStore } from "./Lib/ConversationsStore.ts";

const store = useStore();
const router = useRouter();
const conversationsStore = useConversationsStore();

function navigateToSettings() {
    router.push("/settings");
}

onMounted(async () => {
    shortcut({
        key: ",",
        modifier: true,
        handler(event): void {
            navigateToSettings();
        },
    });

    shortcut({
        key: "n",
        modifier: true,
        handler(event): void {
            conversationsStore.createConversation(router);
        },
    });

    shortcut({
        key: "N",
        modifier: true,
        handler(event): void {
            newWindow();
        },
    });

    await setTheme();
});
</script>

<style></style>
