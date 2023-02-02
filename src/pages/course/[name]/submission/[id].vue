<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useClipboard, useIntervalFn } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useRoute, useRouter } from "vue-router";
import { LANG } from "@/constants";
import { formatTime } from "@/utils/formatTime";
import api, { fetcher } from "@/models/api";
import { useSession } from "@/stores/session";
import { useTitle } from "@vueuse/core";

const session = useSession();
const route = useRoute();
useTitle(`Submission - ${route.params.id} - ${route.params.name} | Normal OJ`);
const router = useRouter();
const {
  data: submission,
  error,
  isLoading,
  execute,
} = useAxios<Submission>(`/submission/${route.params.id}`, fetcher);
const { copy, copied, isSupported } = useClipboard();

const { pause, isActive } = useIntervalFn(() => {
  if (submission.value != null) {
    execute();
  }
}, 2000);

const expandTasks = ref<boolean[]>([]);
watchEffect(() => {
  if (submission.value != null) {
    if (submission.value.tasks) {
      expandTasks.value = submission.value.tasks.map(() => false);
    }
    if (submission.value.status !== -1) {
      pause();
    }
  }
});

const isRejudgeLoading = ref(false);
async function rejudge() {
  isRejudgeLoading.value = true;
  try {
    await api.Submission.rejudge(route.params.id as string);
    router.go(0);
  } catch (error) {
    alert("Request to rejudge failed.");
    throw error;
  } finally {
    isRejudgeLoading.value = false;
  }
}
</script>

<template>
  <div class="card-container pb-40">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="flex flex-wrap items-start justify-between">
          <div class="flex flex-col gap-4">
            <div class="card-title md:text-2xl lg:text-3xl">Submission {{ $route.params.id }}</div>
          </div>

          <div
            v-if="session.isAdmin"
            :class="['btn md:btn-md', isRejudgeLoading && 'loading']"
            @click="rejudge"
          >
            <i-uil-repeat class="mr-1" /> Rejudge
          </div>
        </div>

        <div class="divider" />

        <div class="card min-w-full rounded-none">
          <div class="card-body p-0">
            <div class="card-title md:text-xl lg:text-2xl">General</div>
            <div class="my-1" />

            <data-status-wrapper :error="error" :is-loading="isLoading">
              <template #loading>
                <skeleton-table :col="8" :row="1" />
              </template>
              <template #data>
                <table v-if="submission" class="table w-full">
                  <thead>
                    <tr>
                      <th>Problem</th>
                      <th>User</th>
                      <th>Status</th>
                      <th>Run Time</th>
                      <th>Memory</th>
                      <th>Score</th>
                      <th>Lang</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <router-link
                          :to="`/course/${$route.params.name}/problem/${submission.problemId}`"
                          class="link"
                        >
                          {{ submission.problemId }}
                        </router-link>
                      </td>
                      <td>{{ submission.user.username }} ({{ submission.user.displayedName }})</td>
                      <td><judge-status :status="submission.status" /></td>
                      <td>{{ submission.runTime }} ms</td>
                      <td>{{ submission.memoryUsage }} KB</td>
                      <td>{{ submission.score }}</td>
                      <td>{{ LANG[submission.languageType] }}</td>
                      <td>{{ formatTime(submission.timestamp) }}</td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </data-status-wrapper>

            <div class="my-4" />

            <div class="card-title md:text-xl lg:text-2xl">Detail</div>
            <div class="my-1" />
            <skeleton-table v-if="!submission" :col="5" :row="5" />
            <div v-else-if="isActive" class="flex items-center">
              <ui-spinner class="mr-3 h-6 w-6" /> Pending submission will be refetched automatically.
            </div>
            <table v-else class="table-compact table w-full" v-for="(task, taskIndex) in submission.tasks">
              <thead>
                <tr>
                  <th>#{{ taskIndex }}</th>
                  <th>Status</th>
                  <th>Run Time</th>
                  <th>Memory</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Overall</td>
                  <td><judge-status :status="task.status" /></td>
                  <td>{{ task.execTime }} ms</td>
                  <td>{{ task.memoryUsage }} KB</td>
                  <td>{{ task.score }}</td>
                </tr>
                <tr>
                  <td colspan="5">
                    <div
                      class="btn-ghost btn-block btn-sm btn gap-x-3"
                      @click="expandTasks[taskIndex] = !expandTasks[taskIndex]"
                    >
                      <i-uil-angle-down v-if="!expandTasks[taskIndex]" />
                      <i-uil-angle-up v-else />
                      {{ expandTasks[taskIndex] ? "Hide all results" : "Show all results" }}
                    </div>
                  </td>
                </tr>
                <tr v-show="expandTasks[taskIndex]" v-for="(_case, caseIndex) in task.cases">
                  <td>{{ taskIndex }}-{{ caseIndex }}</td>
                  <td><judge-status :status="_case.status" /></td>
                  <td>{{ _case.execTime }} ms</td>
                  <td>{{ _case.memoryUsage }} KB</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="my-4" />

        <skeleton-card v-if="!submission" />
        <div v-else class="card min-w-full rounded-none">
          <div class="card-body p-0">
            <div class="card-title md:text-xl lg:text-2xl">
              Source
              <!-- TODO submission?.code should without ? -->
              <button
                v-if="isSupported && submission"
                class="btn-info btn-xs btn ml-3"
                @click="copy(submission?.code || '')"
              >
                {{ copied ? "Copied!" : "Copy" }}
              </button>
            </div>
            <div class="my-1" />
            <code-editor v-model="submission.code" readonly />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
