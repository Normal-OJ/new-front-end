<script setup lang="ts">
import { useRoute } from "vue-router";
import { useTheme } from "@/stores/theme";
import { useDark, useToggle } from "@vueuse/core";
import { useSession } from "@/stores/session";
import { watchEffect } from "vue";
import { useStorage } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const isDark = useDark({
  selector: "html",
  attribute: "data-theme",
  valueDark: "dark",
  valueLight: "light",
});
const toggleDark = useToggle(isDark);

const isMini = useStorage("mini-sidebar", false);

const theme = useTheme();
watchEffect(() => {
  theme.setIsDark(isDark.value);
});

const { locale } = useI18n();
const localeInStorate = useStorage("locale", locale);
// initialize with the one in storage
locale.value = localeInStorate.value;
// if user change the value, update the storage
watchEffect(() => {
  localeInStorate.value = locale.value;
});

const route = useRoute();
const matchRoute = (path: string) => {
  return route.matched.some((r) => r.path === path);
};

const session = useSession();
</script>

<template>
  <label for="noj-drawer" class="drawer-overlay"></label>
  <ul
    :class="['menu w-96 flex-col overflow-y-auto bg-primary py-4 text-white', isMini ? 'lg:w-14' : 'lg:w-28']"
  >
    <router-link class="my-2 flex cursor-pointer justify-center" to="/">
      <img src="../assets/logo.svg" alt="NOJ Logo" :class="['mb-2', isMini ? 'w-10' : 'w-14']" />
    </router-link>
    <li>
      <side-bar-link :class="{ 'btn-lg': !isMini, 'btn-active': matchRoute('/') }" to="/">
        <i-uil-home class="h-6 w-6" />
        <span v-show="!isMini" class="text-sm">Home</span>
      </side-bar-link>
    </li>
    <li v-if="session.isLogin">
      <side-bar-link :class="{ 'btn-lg': !isMini, 'btn-active': matchRoute('/courses') }" to="/courses">
        <i-uil-book-alt class="h-6 w-6" />
        <span v-show="!isMini" class="text-sm">Course</span>
      </side-bar-link>
    </li>
    <li>
      <side-bar-link :class="{ 'btn-lg': !isMini, 'btn-active': matchRoute('/about') }" to="/about">
        <i-uil-map-marker-info class="h-6 w-6" />
        <span v-show="!isMini" class="text-sm">About</span>
      </side-bar-link>
    </li>

    <div class="flex-1" />

    <li v-if="session.isAdmin">
      <side-bar-link :class="{ 'btn-lg': !isMini, 'btn-active': matchRoute('/admin') }" to="/admin">
        <i-uil-constructor class="h-6 w-6" />
        <span v-show="!isMini" class="text-sm">Admin</span>
      </side-bar-link>
    </li>
    <li v-if="session.isLogin">
      <side-bar-link :class="{ 'btn-lg': !isMini, 'btn-active': matchRoute('/profile') }" to="/profile">
        <i-uil-user class="h-6 w-6" />
        <span v-show="!isMini" class="text-sm">Profile</span>
      </side-bar-link>
    </li>
    <li>
      <side-bar-link :class="{ 'btn-lg': !isMini, 'btn-active': matchRoute('/settings') }" to="/settings">
        <i-uil-setting class="h-6 w-6" />
      </side-bar-link>
    </li>
    <li>
      <label class="btn btn-primary rounded-none p-2" @click="() => toggleDark()">
        <i-uil-sun v-if="isDark" class="swap-on h-6 w-6" />
        <i-uil-moon v-else class="swap-off h-6 w-6" />
      </label>
    </li>
    <li>
      <label class="swap swap-rotate">
        <input v-model="isMini" type="checkbox" />
        <i-uil-angle-double-right class="swap-on h-6 w-6" />
        <i-uil-angle-double-left class="swap-off h-6 w-6" />
      </label>
    </li>
  </ul>
</template>
