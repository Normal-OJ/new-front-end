<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useRoute } from "vue-router";
import { fetcher } from "@/models/api";

const route = useRoute();
useTitle(`Announcement - ${route.params.id} - ${route.params.name} | Normal OJ`);
const {
  data: announcements,
  error,
  isLoading,
} = useAxios<AnnouncementList>(`/ann/${route.params.name}/${route.params.id}`, fetcher);
</script>

<template>
  <div class="mx-auto flex max-w-7xl gap-8 p-4">
    <data-status-wrapper :error="error" :is-loading="isLoading">
      <template #loading>
        <skeleton-card />
      </template>
      <template #data>
        <announcement-card v-if="announcements" :announcement="announcements[0]" />
      </template>
    </data-status-wrapper>
  </div>
</template>
