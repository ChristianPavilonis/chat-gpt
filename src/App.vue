<template>
    <div class="container mx-auto text-white pb-100">
        <RouterView/>
    </div>
</template>

<script setup lang="ts">

import {inject, onMounted} from "vue";
import {Store} from "tauri-plugin-store-api";
import {useRouter} from "vue-router";

const router = useRouter();
const store = inject<Store>("store");


function navigateToSettings() {
    router.push("/settings");
}

onMounted(() => {
    document.addEventListener("keydown", function (event) {
        if (event.metaKey && event.key === ",") {
            navigateToSettings();
        }
    });
});

</script>


<style>

</style>
