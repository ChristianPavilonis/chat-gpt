<template>
    <div class="text-white flex">
        <Sidebar/>
        <div class="container mx-auto overflow-y-auto">
            <RouterView/>
        </div>
    </div>
</template>

<script setup lang="ts">

import {inject, onMounted} from "vue";
import {Store} from "tauri-plugin-store-api";
import {useRouter} from "vue-router";
import {createConversation, shortcut} from "./Lib/helpers";
import Sidebar from "./components/Sidebar.vue";

const router = useRouter();

function navigateToSettings() {
    router.push("/settings");
}

onMounted(() => {
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
        handler(event) : void {
            createConversation(router)
        }
    })
});

</script>

<style>
</style>
