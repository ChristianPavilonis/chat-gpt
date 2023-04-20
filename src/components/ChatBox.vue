<template>
    <form @submit.prevent="submit" class="bg-black/30 w-full flex">
            <textarea
                class="bg-transparent w-full resize-none transition-all overflow-y-hidden px-24 text-lg"
                :value="modelValue"
                @input="update"
                @keyup="setTextareaHeight"
                @keydown.enter="handleEnter"
                :style="textareaStyle"
            ></textarea>
        <button type="submit" class="p-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-25 h-25">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
            </svg>
        </button>
    </form>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref} from 'vue';

const props = defineProps({
    modelValue: {
        default: "",
        type: String,
    },
});

const emit = defineEmits(['update:modelValue', 'submit']);
const textareaStyle = ref();

function update(event: any) {
    emit('update:modelValue', event.target.value);
}

function setTextareaHeight() {
    let numberOfLineBreaks = (props.modelValue.match(/\n/g) || []).length;
    let newHeight = 20 + numberOfLineBreaks * 20 + 40 + 2;

    textareaStyle.value = {
        height: newHeight + "px",
    }
}

function handleEnter(event: any) {
    if (!event.shiftKey) {
        submit();
    }
}

function submit() {
    if (props.modelValue?.trim() !== "") {
        emit('submit');
    }
}

onMounted(() => {
    setTextareaHeight();
})

</script>

<style scoped>

</style>