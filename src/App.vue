<template>
    <div class="container mx-auto text-white pb-100">
        <RouterView/>
    </div>
</template>

<script setup lang="ts">

import {inject, onMounted} from "vue";
import {Store} from "tauri-plugin-store-api";
import {useRouter} from "vue-router";
import {shortcut} from "./Lib/helpers";

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
});

</script>


<style>

</style>
