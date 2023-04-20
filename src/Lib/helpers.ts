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