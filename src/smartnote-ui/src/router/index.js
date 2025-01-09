import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";
import AI from "../views/AIView.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/ai", name: "AI", component: AI },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
