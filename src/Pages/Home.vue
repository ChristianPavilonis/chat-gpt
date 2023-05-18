<template>
    <div>
        <button @click="createConversation(router)">new conversation</button>
    </div>
</template>

<script lang="ts" setup>
import {createConversation} from "../Lib/helpers";
import {useRouter} from "vue-router";

const router = useRouter();

</script>

<style scoped>

</style>
