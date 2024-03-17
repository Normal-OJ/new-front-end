<script setup lang="ts">
import { useSession } from "@/stores/session";
import { useI18n } from "vue-i18n";
import type { ProblemId2Meta } from "@/composables/useProblemSelection";
import { isQuotaUnlimited } from "@/constants";

interface Props {
  homework: HomeworkListItem | HomeworkPreviewForm;
  problems: ProblemId2Meta;
}

defineProps<Props>();

const { t } = useI18n();
const session = useSession();
</script>

<template>
  <table class="table table-compact mt-2 w-full">
    <thead>
      <tr>
        <th>{{ t("components.hw.card.problems.id") }}</th>
        <th>{{ t("components.hw.card.problems.pid") }}</th>
        <th>{{ t("components.hw.card.problems.name") }}</th>
        <th>{{ t("components.hw.card.problems.quota") }}</th>
        <th>{{ t("components.hw.card.problems.score") }}</th>
        <th>{{ t("components.hw.card.problems.stats") }}</th>
        <th v-if="session.isAdmin">{{ t("components.hw.card.problems.copycat") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(pid, index) in homework.problemIds">
        <td>{{ index + 1 }}</td>
        <td>
          <router-link class="link" :to="`/course/${$route.params.name}/problem/${pid}`">
            {{ pid }}
          </router-link>
        </td>
        <td>
          <ui-spinner v-if="!problems[pid.toString()]" />
          <span v-else>{{ problems[pid.toString()].name }}</span>
        </td>
        <td>
          <ui-spinner v-if="!problems[pid.toString()]" />
          <span v-else-if="isQuotaUnlimited(problems[pid.toString()].quota)" class="text-sm">{{
            $t("components.problem.card.unlimited")
          }}</span>
          <span v-else>{{ problems[pid.toString()].quota }}</span>
        </td>
        <td>
          {{
            (
              homework.studentStatus[session.username] &&
              homework.studentStatus[session.username][pid.toString()]
            )?.score || "-"
          }}
        </td>
        <td>
          <div class="tooltip" data-tip="Stats">
            <router-link
              class="btn btn-ghost btn-xs"
              :to="`/course/${$route.params.name}/problem/${pid}/stats`"
            >
              <i-uil-chart-line class="lg:h-5 lg:w-5" />
            </router-link>
          </div>
        </td>
        <td v-if="session.isAdmin">
          <div class="tooltip" data-tip="Copycat">
            <router-link
              class="btn btn-ghost btn-xs"
              :to="`/course/${$route.params.name}/problem/${pid}/copycat`"
            >
              <i-uil-file-exclamation-alt class="lg:h-5 lg:w-5" />
            </router-link>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
