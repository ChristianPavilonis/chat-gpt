import {defineStore} from "pinia";


export const useConversationsStore = defineStore('ConversationsStore', {
    state: () => ({
        activeConversation: {},
        conversations: [],
    }),

    getters: {},

    actions: {

        setConversations(conversations: any) {
            this.conversations = conversations;
        },

        updateConversation(newConversation: any) {
            let index = this.conversations.findIndex(
                (conversation) => conversation.id === newConversation.id
            );

            this.conversations[index] = newConversation;
        }

    },

});