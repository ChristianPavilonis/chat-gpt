import {defineStore} from "pinia";


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

        updateConversation(newConversation: any) {
            let index = this.conversations.findIndex(
                (conversation) => conversation.id === newConversation.id
            );

            this.conversations[index] = newConversation;
        }

    },

});