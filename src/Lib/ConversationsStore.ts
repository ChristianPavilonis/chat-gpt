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

<<<<<<< HEAD
        async saveConversation(conversation: any) {
            let result: any = await invoke("save_conversation", {
                conversation,
            });

            result.id = result.id.id.String;

            return result;
        },

=======
>>>>>>> parent of dc4295d (wip on chaning to surral db)
        async loadConversations() {
            let conversations = await invoke("get_conversations");

            this.setConversations(conversations);
<<<<<<< HEAD
        },

        async createConversation(router: any) {
            let conversation: any = await this.saveConversation({
                last_modified: Date.now(),
                messages: [],
                title: "New Chat",
            });

            await router.push(`/conversation/${conversation.id}`);
            this.pushConversation(conversation);
        },
=======
        }

>>>>>>> parent of dc4295d (wip on chaning to surral db)
    },

});