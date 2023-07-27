<script setup lang="ts">
import { useAxios } from "@vueuse/integrations/useAxios";
import { useRoute } from "vue-router";
import { fetcher } from "@/models/api";
import { useSession } from "@/stores/session";
import { useTitle } from "@vueuse/core";
import { computed } from "vue";
import { useProblemSelection } from "@/composables/useProblemSelection";

const session = useSession();
const route = useRoute();

useTitle(`Homeworks - ${route.params.name} | Normal OJ`);
const { data, error, isLoading } = useAxios<HomeworkList>(`/course/${route.params.name}/homework`, fetcher);
const {
  problemId2Meta,
  error: fetchProblemError,
  isLoading: isFetchingProblem,
} = useProblemSelection(route.params.name as string);
const homeworks = computed(() => {
  if (!data.value) return [];
  return data.value.sort((a, b) => b.start - a.start);
});
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title mb-4 justify-between">
          {{ $t("course.hw.index.title") }}
          <router-link
            v-if="session.isAdmin"
            class="btn-success btn"
            :to="`/course/${$route.params.name}/homeworks/new`"
          >
            <i-uil-plus-circle class="mr-1 lg:h-5 lg:w-5" /> {{ $t("course.hw.index.new") }}
          </router-link>
        </div>
        <data-status-wrapper :error="error || fetchProblemError" :is-loading="isLoading || isFetchingProblem">
          <template #loading>
            <skeleton-card />
          </template>
          <template #data>
            <homework-card
              v-for="homework in homeworks"
              :key="homework.id"
              :homework="homework"
              :problems="problemId2Meta"
              class="mb-2"
            />
          </template>
        </data-status-wrapper>
      </div>
    </div>
  </div>
</template>
