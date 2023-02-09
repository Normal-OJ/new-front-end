<script setup lang="ts">
import { AxiosError } from "axios";
import { useSession } from "@/stores/session";
import api from "@/models/api";
import { useI18n } from "vue-i18n";

const {t} = useI18n();

interface Props {
  problem: Problem;
  preview?: boolean;
}
withDefaults(defineProps<Props>(), {
  isLoading: false,
  preview: false,
});

const session = useSession();

function downloadTestCase(problemId: number) {
  window.location.assign(api.Problem.getTestCaseUrl(problemId));
}
</script>

<template>
  <div class="card min-w-full">
    <div class="card-body">
      <div class="flex flex-wrap items-start justify-between gap-y-4">
        <div class="flex flex-col gap-4">
          <div class="card-title md:text-2xl lg:text-3xl">
            {{ t("components.problem.probCard.title") }}{{ $route.params.id }} - {{ problem.problemName }}
          </div>
          <div class="flex">
            <span class="badge-info badge mr-1" v-for="tag in problem.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-y-4">
          <div class="stats">
            <div class="stat place-items-center py-0">
              <div class="stat-title">{{ t("components.problem.probCard.quota") }}</div>
              <div class="stat-value">
                <span>{{ problem.quota - problem.submitCount }}</span>
                <span class="text-sm font-normal">{{ ` / ${problem.quota}` }}</span>
              </div>
            </div>
            <div class="stat place-items-center py-0">
              <div class="stat-title">{{ t("components.problem.probCard.score") }}</div>
              <div class="stat-value">
                <span>{{ problem.highScore }}</span>
                <span class="text-sm font-normal">{{ " / 100" }}</span>
              </div>
            </div>
          </div>

          <div class="ml-3 flex flex-wrap place-items-center gap-x-3" v-if="!preview">
            <router-link
              class="btn md:btn-md lg:btn-lg"
              :to="`/course/${$route.params.name}/problem/${$route.params.id}/submit`"
            >
              <i-uil-file-upload-alt class="lg:h-5 lg:w-5" /> {{ t("components.problem.probCard.submit") }}
            </router-link>
            <router-link
              class="btn md:btn-md lg:btn-lg"
              :to="`/course/${$route.params.name}/problem/${$route.params.id}/stats`"
            >
              <i-uil-chart-line class="lg:h-5 lg:w-5" /> {{ t("components.problem.probCard.stats") }}
            </router-link>
            <router-link
              v-if="session.isAdmin"
              :class="['btn-ghost tooltip tooltip-bottom btn-sm btn', 'inline-flex']"
              data-tip="Copycat"
              :to="`/course/${$route.params.name}/problem/${$route.params.id}/copycat`"
            >
              <i-uil-file-exclamation-alt class="lg:h-5 lg:w-5" />
            </router-link>
            <button
              v-if="session.isAdmin"
              :class="['btn-ghost tooltip tooltip-bottom btn-sm btn', 'inline-flex']"
              data-tip="Download test case"
              @click="downloadTestCase(Number.parseInt($route.params.id as string, 10))"
            >
              <i-uil-folder-download class="lg:h-5 lg:w-5" />
            </button>
          </div>
        </div>
      </div>

      <div class="divider" />

      <div class="card min-w-full rounded-none">
        <div class="card-body p-0">
          <div class="card-title md:text-xl lg:text-2xl">{{ t("components.problem.probCard.card.desc") }}</div>
          <markdown-renderer class="mb-10" :md="problem.description.description" />

          <div class="card-title md:text-xl lg:text-2xl">{{ t("components.problem.probCard.card.input") }}</div>
          <markdown-renderer class="mb-10" :md="problem.description.input" />

          <div class="card-title md:text-xl lg:text-2xl">{{ t("components.problem.probCard.card.output") }}</div>
          <markdown-renderer class="mb-10" :md="problem.description.output" />

          <div class="card-title md:text-xl lg:text-2xl">{{ t("components.problem.probCard.card.ex") }}</div>
          <div class="mb-10">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>{{ t("components.problem.probCard.card.sample.id") }}</th>
                  <th>{{ t("components.problem.probCard.card.sample.input") }}</th>
                  <th>{{ t("components.problem.probCard.card.sample.output") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in problem.description.sampleInput.length">
                  <td class="align-top">{{ i }}</td>
                  <td class="align-top">
                    <sample-code-block
                      v-if="problem.description.sampleInput[i - 1]"
                      :code="problem.description.sampleInput[i - 1]"
                    ></sample-code-block>
                    <span v-else class="italic opacity-70">{{ t("components.problem.probCard.card.sample.no.input") }}</span>
                  </td>
                  <td class="align-top">
                    <sample-code-block
                      v-if="problem.description.sampleOutput[i - 1]"
                      :code="problem.description.sampleOutput[i - 1]"
                    ></sample-code-block>
                    <span v-else class="italic opacity-70">{{ t("components.problem.probCard.card.sample.no.output") }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="card-title md:text-xl lg:text-2xl">{{ t("components.problem.probCard.card.hint") }}</div>
          <markdown-renderer class="mb-10" :md="problem.description.hint" />

          <div class="card-title md:text-xl lg:text-2xl">{{ t("components.problem.probCard.card.subtasks.title") }}</div>
          <table class="table w-full">
            <thead>
              <tr>
                <th>{{ t("components.problem.probCard.card.subtasks.id") }}</th>
                <th>{{ t("components.problem.probCard.card.subtasks.tl") }}</th>
                <th>{{ t("components.problem.probCard.card.subtasks.ml") }}</th>
                <th>{{ t("components.problem.probCard.card.subtasks.score") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="({ memoryLimit, timeLimit, taskScore }, index) in problem.testCase" :key="index">
                <td>{{ index }}</td>
                <td>{{ timeLimit }} ms</td>
                <td>{{ memoryLimit }} KB</td>
                <td>{{ taskScore }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
