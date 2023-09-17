import { createRouter, createWebHistory } from "vue-router";
import routes from "pages-generated";
import { useSession } from "@/stores/session";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const publicPages = [
  /^\/$/,
  /^\/about$/,
  /^\/announcements\/[0-9A-Fa-f]+$/,
  /^\/settings$/,
  /^\/reset_password$/,
];

router.beforeEach(async (to) => {
  const session = useSession();
  if (session.isNotValidated) {
    await session.validateSession();
  }
  if (!session.isLogin && !publicPages.some((regex) => regex.test(to.path))) {
    return { path: "/", query: { redirect: to.path } };
  }
});

export default router;
