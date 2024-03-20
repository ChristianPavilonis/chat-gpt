<template>
    <div class="flex">
        <Sidebar />
        <div class="container mx-auto overflow-y-auto">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import {
    createConversation,
    newWindow,
    setTheme,
    shortcut,
} from "./Lib/helpers";
import Sidebar from "./components/Sidebar.vue";

const router = useRouter();

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
            createConversation(router);
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
