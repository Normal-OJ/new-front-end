<script setup lang="ts">
import useInteractions from "@/composables/useInteractions";

const { isDesktop } = useInteractions();
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
      <course-side-bar />
      <div class="flex-1">
        <router-view />
      </div>
    </div>
  </div>
</template>
