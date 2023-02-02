<script setup lang="ts">
import { useAxios } from "@vueuse/integrations/useAxios";
import { useRoute } from "vue-router";
import { fetcher } from "@/models/api";
import { useTitle } from "@vueuse/core";

const route = useRoute();
useTitle(`Problem - ${route.params.id} - ${route.params.name} | Normal OJ`);
const { data: problem, error, isLoading } = useAxios<Problem>(`/problem/view/${route.params.id}`, fetcher);
</script>

<template>
  <div class="card-container pb-40">
    <data-status-wrapper :error="error" :is-loading="isLoading">
      <template #loading>
        <skeleton-card />
      </template>
      <template #data>
        <problem-card v-if="problem" :problem="problem" />
      </template>
    </data-status-wrapper>
  </div>
</template>
