import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      meta: { layout: "default", auth: true },
      component: () => import("../views/index.vue"),
    },
    {
      path: "/sign-in-with-x",
      name: "sign-in-with-x",
      meta: { layout: "guest", auth: false },
      component: () => import("../views/sign-in-with-x.vue"),
    },
    {
      path: "/beta-registration",
      name: "aboutUs",
      meta: { layout: "guest", auth: false },
      component: () => import("../views/aboutUs.vue"),
    },
    {
      path: "/privacy",
      name: "privacy",
      meta: { layout: "guest", auth: false },
      component: () => import("../views/privacy.vue"),
    },
    {
      path: "/post/:id",
      name: "post",
      meta: { layout: "default", auth: true },
      component: () => import("../views/post.vue"),
    },
    {
      path: "/reply/:id",
      name: "reply",
      meta: { layout: "default", auth: true, isReply: true },
      component: () => import("../views/post.vue"),
    },
    {
      path: "/sign-in",
      name: "sign-in",
      meta: { layout: "guest", auth: false },
      component: () => import("../views/sign-in.vue"),
    },
    {
      path: "/sign-up",
      name: "sign-up",
      meta: { layout: "guest", auth: false },
      component: () => import("../views/sign-up.vue"),
    },
    {
      path: "/profile/:id",
      name: "profile",
      meta: { layout: "default", auth: true },
      component: () => import("../views/profile.vue"),
    },
    {
      path: "/search",
      name: "search",
      meta: { layout: "default", auth: true },
      component: () => import("../components/Rightbar/index.vue"),
    },
    {
      path: "/onboarding/login-method",
      name: "onboarding-login-method",
      meta: { layout: "guest", auth: false },
      component: () => import("../views/onboarding/LoginMethod.vue"),
    },
    {
      path: "/onboarding/create-account",
      name: "onboarding-create-account",
      meta: { layout: "guest", auth: false },
      component: () => import("../views/onboarding/CreateAccount.vue"),
    },
    {
      path: "/onboarding/verification-code",
      name: "onboarding-verification-code",
      meta: { layout: "guest", auth: false },
      component: () => import("../views/onboarding/VerificationCode.vue"),
    },
    {
      path: "/onboarding/create-password",
      name: "onboarding-create-password",
      meta: { layout: "guest", auth: false },
      component: () => import("../views/onboarding/CreatePassword.vue"),
    },
    {
      path: "/onboarding/create-username",
      name: "onboarding-create-username",
      meta: { layout: "guest", auth: false },
      component: () => import("../views/onboarding/CreateUsername.vue"),
    },
    {
      path: "/onboarding/add-avatar",
      name: "onboarding-add-avatar",
      meta: { layout: "guest", auth: false },
      component: () => import("../views/onboarding/AddAvatar.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      meta: { layout: "guest" },
      component: () => import("../components/Page404/index.vue"),
    },
  ],
});

let previousRoute = null;
router.beforeEach((to, from, next) => {
  next();
  previousRoute = from
});


export function goBack() {
  if (router.currentRoute.value.fullPath === '/') {
    return;
  }
  if (router.options.history.state.back) {
    router.go(-1);
  } else {
    router.push({ name: 'home' });
  }
}


export { previousRoute };
export default router;
