<script setup lang="ts">
import { computed } from "vue";
import { useSession } from "@/stores/session";
import { formatTime } from "@/utils/formatTime";
import { useI18n } from "vue-i18n";
import type { ProblemId2Meta } from "@/composables/useProblemSelection";

const { t } = useI18n();

interface Props {
  homework: HomeworkListItem | HomeworkPreviewForm;
  problems: ProblemId2Meta;
  preview?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  preview: false,
});

const session = useSession();
const STATUS_LABEL = {
  RUNNING: t("components.hw.card.statusLabel.running"),
  NOT_START: t("components.hw.card.statusLabel.notStart"),
  OVER: t("components.hw.card.statusLabel.over"),
};
const STATUS_CLASS = {
  [STATUS_LABEL.RUNNING]: "badge-success",
  [STATUS_LABEL.NOT_START]: "",
  [STATUS_LABEL.OVER]: "badge-error",
};

const state = computed(() => {
  const { start, end } = props.homework;
  const now = Date.now();
  if (now < start * 1000) {
    return STATUS_LABEL.NOT_START;
  }
  if (now > end * 1000) {
    return STATUS_LABEL.OVER;
  }
  return STATUS_LABEL.RUNNING;
});
</script>

<template>
  <div class="card mx-auto w-full bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="flex items-start justify-between">
        <div class="lg:text-2x card-title mb-8 md:text-xl">
          {{ homework.name }}
          <div :class="['badge', STATUS_CLASS[state]]">{{ state }}</div>
        </div>
        <due-countdown v-if="state === STATUS_LABEL.RUNNING" class="mt-2" :due="homework.end" />
      </div>

      <div class="flex flex-wrap lg:flex-nowrap lg:gap-x-8">
        <div class="mb-8 w-full lg:flex-[2_1_0%]">
          <div class="card-title">{{ t("components.hw.card.availability.text") }}</div>
          <div class="mt-2 flex flex-wrap overflow-x-auto lg:flex-nowrap">
            <table class="table table-compact w-full">
              <thead>
                <tr>
                  <th>{{ t("components.hw.card.availability.from") }}</th>
                  <th>{{ t("components.hw.card.availability.due") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ formatTime(homework.start) }}</td>
                  <td>{{ formatTime(homework.end) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mb-8 w-full lg:flex-[3_1_0%]">
          <div class="card-title">{{ t("components.hw.card.problems.text") }}</div>
          <homework-problems :homework="homework" :problems="problems" />
        </div>
      </div>

      <div class="flex flex-wrap lg:flex-nowrap lg:gap-x-8">
        <div class="w-full lg:flex-1">
          <div class="card-title">{{ t("components.hw.card.description.text") }}</div>
          <markdown-renderer class="mt-2" :md="homework.markdown" />
        </div>
      </div>

      <div v-if="homework.id && !preview && session.isAdmin" class="card-actions justify-end">
        <router-link class="btn mr-3" :to="`/course/${$route.params.name}/homeworks/${homework.id}/edit`">
          <i-uil-edit class="mr-1 lg:h-5 lg:w-5" /> {{ t("components.hw.card.description.edit") }}
        </router-link>
        <router-link class="btn" :to="`/course/${$route.params.name}/homeworks/${homework.id}/stats`">
          <i-uil-chart-line class="mr-1 lg:h-5 lg:w-5" /> {{ t("components.hw.card.description.stats") }}
        </router-link>
      </div>
    </div>
  </div>
</template>
