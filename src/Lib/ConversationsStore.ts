import {defineStore} from "pinia";
import {invoke} from "@tauri-apps/api";


interface ConversationsStore {
    activeConversation: any;
    conversations: any[];
}

export const useConversationsStore = defineStore('ConversationsStore', {
    state: (): ConversationsStore => ({
        activeConversation: {},
        conversations: [],
    }),

    getters: {},

    actions: {

        setConversations(conversations: any) {
            this.conversations = conversations;
        },

        pushConversation(conversation: any) {
            this.conversations.push(conversation);
        },

        updateConversation(newConversation: any) {
            let index = this.conversations.findIndex(
                (conversation) => conversation.id === newConversation.id
            );

            this.conversations[index] = newConversation;
        },

        async loadConversations() {
            let conversations = await invoke("get_conversations");

            this.setConversations(conversations);
        }

    },

});