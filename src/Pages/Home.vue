<template>
    <div class="flex justify-center items-center h-[100vh]">
        <button
            class="px-12 py-8 bg-shade-6 rounded uppercase"
            @click="createConversation(router)"
        >
            new chat +
        </button>
    </div>
</template>

<script lang="ts" setup>
import {createConversation} from "../Lib/helpers";
import {useRouter} from "vue-router";

const router = useRouter();

</script>

<style scoped>

</style>
