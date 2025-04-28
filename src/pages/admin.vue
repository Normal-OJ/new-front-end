<script setup lang="ts">
import { useSession } from "@/stores/session";
import { watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useStorage, useTitle } from "@vueuse/core";
import { LOCAL_STORAGE_KEY } from "@/constants";

useTitle("Admin | Normal OJ");
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const tab = useStorage(LOCAL_STORAGE_KEY.ADMIN_TAB, "/admin/user");
const tabs = [
  { text: t("admin.tab.dashboard"), value: "/admin/dashboard" },
  { text: t("admin.tab.user"), value: "/admin/user" },
];
watchEffect(() => {
  if (!tabs.some((d) => d.value === route.path)) {
    router.replace(tab.value);
  }
  tab.value = route.path;
});
const session = useSession();
watchEffect(() => {
  if (!session.isAdmin) {
    router.replace("/");
  }
});
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="tabs">
          <router-link
            v-for="tab in tabs"
            :key="tab.value"
            :class="['tab tab-bordered', $route.path === tab.value && 'tab-active']"
            :to="tab.value"
            >{{ tab.text }}</router-link
          >
        </div>

        <div class="my-4" />

        <router-view />
      </div>
    </div>
  </div>
</template>
