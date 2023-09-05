import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from "openai";
import {inject} from "vue";
import {Store} from "tauri-plugin-store-api";
import {Router, useRouter} from "vue-router";
import {v4 as uuidV4} from "uuid";
import {useConversationsStore} from "./ConversationsStore";

type Handler = (event: Event) => void;

interface Options {
    key: string;
    handler: Handler;
    modifier: boolean;
}

export function shortcut(options: string | Options, callback?: Handler, modifier: boolean = false) {
    document.addEventListener("keydown", function (event) {
        let key;
        let handler;

        if (typeof options === "string") {
            key = options;
            handler = callback;
        } else {
            key = options.key;
            handler = options.handler;
            modifier = options.modifier;
        }


        if (handler === undefined) {
            throw Error("No handler");
        }


        if (modifier) {
            let modifierPressed = /Macintosh/.test(window.navigator.userAgent) ?
                event.metaKey :
                event.ctrlKey;
            if (modifierPressed && event.key === key) {
                handler(event);
            }
        } else {
            if (event.key === key) {
                handler(event);
            }
        }
    });
}


export async function createOpenAiClient() {
    const store = useStore();
    const key: string | null = await store.get("openai-key");

    if (key == null) {
        throw new Error("Key not set");
    }

    const configuration = new Configuration({
        apiKey: key,
    });

    return new OpenAIApi(configuration);
}

export function useStore() {
    return inject<Store>("store") || new Store(".settings.dat");
}

export async function sendChatMessage(
    openai: OpenAIApi,
    messages: ChatCompletionRequestMessage[]
): Promise<ChatCompletionRequestMessage | undefined> {
    const store = useStore();
    const model: string = await store.get("ai-model") || "gpt-3.5-turbo";

    const completion = await openai.createChatCompletion({model, messages});

    if (completion.data.choices.length > 0) {
        const choice = completion.data.choices[0];

        return choice.message;
    }
}


export async function createConversation(router: Router) {
    const id = uuidV4();
    let store = useConversationsStore();

    await router.push(`/conversation/${id}`);
    store.pushConversation({id})
}

export async function setTheme() {
    const store = useStore();
    const theme : string = await store.get('theme') || "theme-default";

   document.body.classList.forEach((item) => {
       if(item.includes('theme-')) {
           document.body.classList.remove(item);
       }
   })

    document.body.classList.add(theme);
}
