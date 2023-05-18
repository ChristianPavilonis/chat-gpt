import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import { Store } from "tauri-plugin-store-api";
import {createRouter, createWebHashHistory} from "vue-router";
import Home from "./Pages/Home.vue";
import Settings from "./Pages/Settings.vue";
import Conversation from "./Pages/Conversation.vue";
import {createPinia} from "pinia";

const store = new Store(".settings.dat");

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: "/", component: Home},
        {path: "/conversation/:id", component: Conversation},
        {path: "/settings", component: Settings},
    ]
});

const pinia = createPinia();

createApp(App)
    .use(router)
    .use(pinia)
    .provide("store", store)
    .mount("#app");