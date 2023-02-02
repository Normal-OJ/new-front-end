<script setup lang="ts">
import { useSession } from "@/stores/session";

const session = useSession();
const navs = [
  {
    name: "Announcements",
    path: "/announcements",
  },
  {
    name: "Homeworks",
    path: "/homeworks",
  },
  {
    name: "Problems",
    path: "/problems",
  },
  {
    name: "Submissions",
    path: "/submissions",
  },
  ...(session.isAdmin
    ? [
        {
          name: "Members",
          path: "/members",
        },
      ]
    : []),
];
</script>

<template>
  <ul class="menu menu-compact w-40 bg-base-100 p-2 lg:menu-normal">
    <li
      v-for="{ name, path } in navs"
      :class="[{ 'border-l-4 border-blue-500': $route.path === `/course/${$route.params.name}${path}` }]"
    >
      <router-link :to="`/course/${$route.params.name}${path}`">{{ name }}</router-link>
    </li>
  </ul>
</template>
