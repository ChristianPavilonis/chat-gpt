<template>
    <div>
        <input class="border-[2px]" v-model="query" @input="search">
    </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";

const props = defineProps<{conversation: any}>();

const query = ref("");

function search() {
    // move search to rust
}

</script>

<style scoped>

</style>
