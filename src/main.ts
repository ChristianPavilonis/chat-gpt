import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import { Store } from "tauri-plugin-store-api";
import {createRouter, createWebHashHistory} from "vue-router";
import Home from "./Pages/Home.vue";
import Settings from "./Pages/Settings.vue";

const store = new Store(".settings.dat");

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: "/", component: Home},
        {path: "/settings", component: Settings},
    ]
});


createApp(App).use(router).provide("store", store).mount("#app");