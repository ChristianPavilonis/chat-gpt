import OpenAI from "openai";
import { inject } from "vue";
import { Store } from "tauri-plugin-store-api";
import { Router, useRouter } from "vue-router";
import { v4 as uuidV4 } from "uuid";
import { useConversationsStore } from "./ConversationsStore";
import { invoke } from "@tauri-apps/api";

type Handler = (event: Event) => void;

interface Options {
    key: string;
    handler: Handler;
    modifier: boolean;
}

export function shortcut(
    options: string | Options,
    callback?: Handler,
    modifier: boolean = false,
) {
    document.addEventListener("keydown", function (event) {
        let key;
        let handler;
        let shouldHandle = false;
        let shift = false;

        if (typeof options === "string") {
            key = options;
            handler = callback;
        } else {
            key = options.key;
            handler = options.handler;
            modifier = options.modifier;
        }

        if (/[A-Z]/.test(key)) {
            shift = true;
        }

        if (handler === undefined) {
            throw Error("No handler");
        }

        shouldHandle = event.key === key.toLowerCase();

        if (modifier) {
            let isOnMac = /Macintosh/.test(window.navigator.userAgent);

            let modifierPressed = isOnMac ? event.metaKey : event.ctrlKey;

            shouldHandle = shouldHandle && modifierPressed;
        }

        if (shift) {
            shouldHandle = shouldHandle && event.shiftKey;
        } else {
            shouldHandle = shouldHandle && !event.shiftKey;
        }

        if (shouldHandle) {
            handler(event);
        }
    });
}

export async function createOpenAiClient() {
    const store = useStore();
    const key: string | null = await store.get("openai-key");

    if (key == null) {
        throw new Error("Key not set");
    }


    return new OpenAI({
        apiKey: key,
    });
}

export function useStore() {
    return inject<Store>("store") || new Store(".settings.dat");
}

export async function sendChatMessage(
    openai: OpenAI,
    messages: OpenAI.Chat.CreateChatCompletionRequestMessage[],
): Promise<OpenAI.Chat.CreateChatCompletionRequestMessage | undefined> {
    const store = useStore();
    const model: string = (await store.get("ai-model")) || "gpt-3.5-turbo";

    const completion = await openai.chat.completions.create({ model, messages });

    if (completion.choices.length > 0) {
        const choice = completion.choices[0];

        return choice.message;
    }
}

export async function createConversation(router: Router) {
    const id = uuidV4();
    let store = useConversationsStore();

    await router.push(`/conversation/${id}`);
    store.pushConversation({ id });
}

export async function setTheme() {
    const store = useStore();
    const theme: string = (await store.get("theme")) || "theme-default";

    document.body.classList.forEach((item) => {
        if (item.includes("theme-")) {
            document.body.classList.remove(item);
        }
    });

    document.body.classList.add(theme);
}

export async function newWindow() {
    await invoke("new_window");
}
