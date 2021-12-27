import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/add",
    name: "addDocument",
    meta: {
      title: "Dodaj dokument",
    },

    component: () => import("../views/AddDocument.vue"),
  },
  {
    path: "/document",
    name: "documentsView",
    meta: {
      title: "Lista dokumentów",
    },

    component: () => import("../views/DocumentsView.vue"),
  },
  {
    path: "/document/:docID",
    name: "documentView",
    meta: {
      title: "Dokument",
    },

    component: () => import("../views/EditDocument.vue"),
  },
  {
    path: "/ustawienia",
    name: "settingsView",
    meta: {
      title: "Ustawienia",
    },

    component: () => import("../views/SettingsView.vue"),
  },
  {
    path: "/brak-dostepu",
    name: "unauthorized",
    meta: {
      title: "Brak dostępu",
    },

    component: () => import("../views/Unauthorized.vue"),
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  console.log(to);
  document.title = to.meta.title ? to.meta.title + " - WebID" : "WebID";
  next();
});

export default router;
