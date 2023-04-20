import {Configuration, OpenAIApi} from "openai";
import {inject} from "vue";
import {Store} from "tauri-plugin-store-api";

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
        }
        else {
            if (event.key === key) {
                handler(event);
            }
        }
    });
}


export async function createOpenAiClient() {
    const store = useStore();
    const key: string | null = await store.get("openai-key");

    if(key == null) {
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