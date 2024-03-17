<script setup lang="ts">
import { useI18n } from "vue-i18n";

interface Props {
  name: string;
  id: string | number;
  quota: string | number;
  score?: string | number;
  tags?: string[];
  showStats?: boolean;
  showCopycat?: boolean;
}

const { t } = useI18n();

withDefaults(defineProps<Props>(), {
  showStats: true,
  showCopycat: false,
});
</script>
<template>
  <div class="card card-compact max-w-full bg-base-200/50 shadow-xl">
    <div class="card-body">
      <router-link :to="`/course/${$route.params.name}/problem/${id}`">
        <h2 class="card-title underline">{{ name }}</h2>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span v-if="score !== undefined" class="text-lg font-bold">
              {{ t("components.problem.infoCard.score") }} : {{ score }}
            </span>
            <span class="font-semibold"> {{ t("components.problem.infoCard.quota") }} : {{ quota }} </span>
          </div>
          <div v-if="tags" class="flex flex-col">
            <span class="font-semibold"> {{ t("components.problem.infoCard.tags") }} : </span>
            <span v-for="tag in tags" :key="tag" class="badge-info badge">{{ tag }}</span>
          </div>
        </div>
      </router-link>
      <div v-if="showStats || showCopycat" class="card-actions justify-end">
        <router-link
          v-if="showStats"
          class="btn btn-sm gap-2"
          :to="`/course/${$route.params.name}/problem/${id}/stats`"
        >
          <i-uil-chart-line class="lg:h-5 lg:w-5" />
        </router-link>
        <router-link
          v-if="showCopycat"
          class="btn btn-sm gap-2"
          :to="`/course/${$route.params.name}/problem/${id}/copycat`"
        >
          <i-uil-file-exclamation-alt class="lg:h-5 lg:w-5" />
        </router-link>
      </div>
    </div>
  </div>
</template>
