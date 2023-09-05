<template>
    <Markdown
        :class="prose"
        :source="message.content"
    />
</template>

<script lang="ts" setup>
import {ref} from 'vue';

// @ts-ignore
import Markdown from 'vue3-markdown-it';
import {computedAsync} from "@vueuse/core";
import {Theme} from "../Lib/types";
import {useStore} from "../Lib/helpers";
const store = useStore();

defineProps<{message: {content: string}}>();

const prose = computedAsync(async () => {
    const theme: Theme =  await store.get("theme") || "theme-default";

    if(theme === "theme-light") {
        return "prose";
    }
    else {
        return "prose prose-invert";
    }
});

</script>

<style scoped>

</style>