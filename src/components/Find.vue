<template>
    <div>
        <input class="border-[2px]" v-model="query" @input="search">
    </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";

const props = defineProps<{conversation: any}>();

const query = ref("");

function search() { // todo: Maybe move to rust and replace text with markdown highlight.
    const messages = props.conversation.messages;

    let regex = new RegExp(query.value, 'gi');

    for(let i = 0; i < messages.length; i++) {
        if(regex.test(messages[i].content)) {
            let el = document.querySelector(`#message-${i}`);
            if(!el) {
                continue;
            }

            el.innerHTML = el.innerHTML.replace(regex, (match) => {
                return `<span class="bg-yellow-300">${match}</span>`;
            });
        }
    }

    // html = html.replace(regex, (match) => {
    //     return `<span class="bg-yellow-300">${match}</span>`
    // });
    // el.innerHTML = html;

}

</script>

<style scoped>

</style>