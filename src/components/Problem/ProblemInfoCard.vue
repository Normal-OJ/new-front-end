<script setup lang="ts">
import { UNLIMITED_QUOTA } from "@/constants";
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
        <h2
          class="card-title underline"
          :class="{
            'text-success': score === 100,
          }"
        >
          {{ name }}
        </h2>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span v-if="score !== undefined">
              <span class="text-2xl font-bold"> {{ score }} </span>
              <span class="text-xs">/ 100</span>
            </span>
            <span class="font-semibold lowercase">
              {{ quota == UNLIMITED_QUOTA ? t("components.problem.infoCard.unlimited") : quota }}
              {{ t("components.problem.infoCard.quota") }}
            </span>
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
