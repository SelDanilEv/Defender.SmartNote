import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router/main.router";

createApp(App).use(store).use(router).mount("#app");
