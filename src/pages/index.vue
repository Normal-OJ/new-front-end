<script setup lang="ts">
import { useTitle } from "@vueuse/core";

import useInteractions from "@/composables/useInteractions";

const { isDesktop } = useInteractions();

useTitle("Home | Normal OJ");
</script>

<template>
  <div
    class="mx-auto flex max-w-7xl gap-8 overflow-y-scroll p-4"
    :class="{
      'flex-col-reverse gap-0 px-0': !isDesktop,
    }"
  >
    <system-announcements />

    <login-section />
  </div>
</template>
