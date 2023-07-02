<template>
    <div
        v-if="event"
        ref="menu"
        class="absolute bg-black/60 py-4 rounded z-10"
        :style="{
            top: `${placementY}px`,
            left: `${placementX}px`,
        }"
    >
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {onClickOutside, useMouseInElement, useParentElement} from "@vueuse/core";

let props = defineProps<{ event: any }>();
let emit = defineEmits(['close']);

let menu = ref();
let parent = useParentElement();
let placementX = ref();
let placementY = ref();

onClickOutside(menu, () => {
    emit('close');
});

onMounted(() => {
    if (props.event && parent.value instanceof HTMLElement) {
        placementX.value = props.event.clientX - parent.value?.offsetLeft;
        placementY.value = props.event.clientY - parent.value?.offsetTop;
    }
})

</script>

<style scoped>

</style>