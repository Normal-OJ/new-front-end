<script setup lang="ts">
import { useTitle } from "@vueuse/core";

useTitle("Home | Normal OJ");
</script>

<template>
  <div class="mx-auto flex max-w-7xl gap-8 p-4">
    <system-announcements />

    <login-section />
  </div>
</template>
