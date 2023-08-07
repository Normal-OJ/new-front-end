<script setup lang="ts">
import { useSession } from "@/stores/session";
import { useI18n } from "vue-i18n";

import useInteractions from "@/composables/useInteractions";

const { isDesktop } = useInteractions();

const { t } = useI18n();

const session = useSession();
const navs = [
  {
    name: t("components.courseSideBar.ann"),
    path: "/announcements",
  },
  {
    name: t("components.courseSideBar.hw"),
    path: "/homeworks",
  },
  {
    name: t("components.courseSideBar.problems"),
    path: "/problems",
  },
  {
    name: t("components.courseSideBar.submissions"),
    path: "/submissions",
  },
  ...(session.isAdmin
    ? [
        {
          name: t("components.courseSideBar.members"),
          path: "/members",
        },
      ]
    : []),
];
</script>

<template>
  <template v-if="isDesktop">
    <ul class="menu menu-compact w-40 bg-base-100 p-2 lg:menu-normal">
      <li
        v-for="{ name, path } in navs"
        :class="[{ 'border-l-4 border-blue-500': $route.path === `/course/${$route.params.name}${path}` }]"
      >
        <router-link :to="`/course/${$route.params.name}${path}`">{{ name }}</router-link>
      </li>
    </ul>
  </template>
  <div v-else class="flex w-full justify-center p-2">
    <div class="tabs items-center justify-center">
      <div
        v-for="{ name, path } in navs"
        class="tab tab-bordered"
        :class="[{ 'tab-active': $route.path === `/course/${$route.params.name}${path}` }]"
      >
        <router-link :to="`/course/${$route.params.name}${path}`">{{ name }}</router-link>
      </div>
    </div>
  </div>
</template>
