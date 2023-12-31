<script setup lang="ts">
import { computed } from "vue";
import useInteractions from "@/composables/useInteractions";

const { isDesktop } = useInteractions();
const sidebarType = computed(() => {
  return isDesktop.value ? "side" : "tab";
});
</script>

<template>
  <div>
    <course-top-bar />
    <div
      class="flex"
      :class="{
        'flex-col': !isDesktop,
      }"
    >
      <course-side-bar :display-type="sidebarType" />
      <div class="flex-1">
        <router-view />
      </div>
    </div>
  </div>
</template>
