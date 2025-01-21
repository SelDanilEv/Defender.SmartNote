import { createRouter, createWebHistory } from "vue-router";
import Notes from "../views/NotesView.vue";
import AI from "../views/AIView.vue";
import LoginView from "../views/LoginView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/note", name: "Notes", component: Notes },
  { path: "/ai", name: "AI", component: AI },
  { path: "/login", name: "Login", component: LoginView },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
