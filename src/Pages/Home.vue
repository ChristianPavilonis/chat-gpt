<template>
    <div>
        <button @click="createConversation">new conversation</button>
    </div>
</template>

<script lang="ts" setup>

import {v4 as uuidV4} from "uuid";
import {useRouter} from "vue-router";

const router = useRouter();

function createConversation() {
    const id = uuidV4();

    router.push(`conversation/${id}`);
}

</script>

<style scoped>

</style>
