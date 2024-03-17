import { defineStore } from "pinia";
import { invoke } from "@tauri-apps/api";

interface ConversationsStore {
    activeConversation: any;
    conversations: any[];
}

export const useConversationsStore = defineStore("ConversationsStore", {
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
                (conversation) => conversation.id === newConversation.id,
            );

            this.conversations[index] = newConversation;
            console.log(newConversation);
        },

        async saveConversation(conversation: any) {
            let result = await invoke("save_conversation", {
                conversation,
            });

            result.id = result.id.id.String;

            this.updateConversation(result);

            return result;
        },

        async loadConversations() {
            let conversations: any[] = await invoke("get_conversations");

            conversations = conversations.map((c: any) => {
                return { ...c, id: c.id.id.String };
            });

            this.setConversations(conversations);
        },

        async createConversation(router: Router) {
            let conversation = await this.saveConversation({
                last_modified: Date.now(),
                messages: [],
                title: "New Chat",
            });

            await router.push(`/conversation/${conversation.id}`);
            this.pushConversation(conversation);
        },
    },
});
