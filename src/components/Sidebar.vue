<template>
    <div class="min-w-280">
        <div
            class="bg-shade-5 w-280 h-[100vh] flex flex-col justify-between fixed z-1"
        >
            <div class="overflow-y-auto scrollbar-hidden">
                <SidebarItem
                    v-for="conversation in conversationsStore.conversations"
                    :conversation="conversation"
                />
            </div>
            <div>
                <button
                    class="w-full py-16 border-t border-white/20 flex items-center justify-center"
                    @click="createConversation(router)"
                >
                    New Chat
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-24 h-24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useConversationsStore } from "../Lib/ConversationsStore";
import { createConversation } from "../Lib/helpers";
import { useRoute, useRouter } from "vue-router";
import SidebarItem from "./SidebarItem.vue";

let conversationsStore = useConversationsStore();
let router = useRouter();
let route = useRoute();

onMounted(async () => {
    await conversationsStore.loadConversations();
});
</script>

<style scoped>
.scrollbar-hidden::-webkit-scrollbar {
    display: none;
}
</style>
