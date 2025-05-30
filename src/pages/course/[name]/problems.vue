<script setup lang="ts">
import { useAxios } from "@vueuse/integrations/useAxios";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch, watchEffect } from "vue";
import { fetcher } from "@/models/api";
import { UserRole, useSession } from "@/stores/session";
import { useTitle } from "@vueuse/core";
import { isQuotaUnlimited } from "@/constants";
import useInteractions from "@/composables/useInteractions";

const session = useSession();
const rolesCanReadProblemStatus = [UserRole.Admin, UserRole.Teacher];
const route = useRoute();
const router = useRouter();

const { isDesktop } = useInteractions();

useTitle(`Problems - ${route.params.name} | Normal OJ`);
const {
  data: problems,
  error,
  isLoading,
} = useAxios<ProblemList>(`/problem?offset=0&count=-1&course=${route.params.name}`, fetcher);

const page = ref(!isNaN(Number(route.query.page)) ? Number(route.query.page) : 1);
watchEffect(() => {
  if (problems.value != null && (page.value < 1 || page.value >= problems.value.length)) {
    page.value = 1;
  }
});
watch(page, () => {
  router.replace({ query: { page: page.value } });
});
const maxPage = computed(() => {
  return problems.value ? Math.ceil(problems.value.length / 10) : 1;
});
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title justify-between">
          {{ $t("course.problems.text") }}

          <router-link
            v-if="session.isAdmin"
            class="btn btn-success"
            :to="`/course/${$route.params.name}/problem/new`"
          >
            <i-uil-plus-circle class="mr-1 lg:h-5 lg:w-5" /> {{ $t("course.problems.new") }}
          </router-link>
        </div>

        <div class="my-2" />
        <data-status-wrapper :error="error" :is-loading="isLoading">
          <template #loading>
            <skeleton-table v-if="isDesktop" :col="5" :row="5" />
            <div v-else class="flex items-center justify-center">
              <ui-spinner />
            </div>
          </template>
          <template #data>
            <table v-if="isDesktop" class="table w-full">
              <thead>
                <tr>
                  <th>{{ $t("course.problems.id") }}</th>
                  <th>{{ $t("course.problems.name") }}</th>
                  <th v-if="rolesCanReadProblemStatus.includes(session.role)">
                    {{ $t("course.problems.status") }}
                  </th>
                  <th>{{ $t("course.problems.tags") }}</th>
                  <th>{{ $t("course.problems.quota") }}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="{ problemId, problemName, tags, quota, submitCount, status } in (
                    problems || []
                  ).slice((page - 1) * 10, page * 10)"
                  :key="problemId"
                  class="hover"
                >
                  <td>
                    <router-link :to="`/course/${$route.params.name}/problem/${problemId}`" class="link">
                      {{ problemId }}
                    </router-link>
                  </td>
                  <td>
                    {{ problemName }}
                  </td>
                  <td v-if="rolesCanReadProblemStatus.includes(session.role)">
                    <span class="badge ml-1">{{ status === 0 ? "VISIBLE" : "HIDDEN" }}</span>
                  </td>
                  <td>
                    <span class="badge badge-info mr-1" v-for="tag in tags" :key="tag">{{ tag }}</span>
                  </td>
                  <td>
                    <template v-if="isQuotaUnlimited(quota)">
                      <span class="text-sm">{{ $t("components.problem.card.unlimited") }}</span>
                    </template>
                    <template v-else> {{ quota - submitCount }} / {{ quota }} </template>
                  </td>
                  <td>
                    <div class="tooltip" data-tip="Stats">
                      <router-link
                        class="btn btn-circle btn-ghost btn-sm mr-1"
                        :to="`/course/${$route.params.name}/problem/${problemId}/stats`"
                      >
                        <i-uil-chart-line class="lg:h-5 lg:w-5" />
                      </router-link>
                    </div>
                    <div class="tooltip" data-tip="Copycat">
                      <router-link
                        v-if="session.isAdmin"
                        class="btn btn-circle btn-ghost btn-sm mr-1"
                        :to="`/course/${$route.params.name}/problem/${problemId}/copycat`"
                      >
                        <i-uil-file-exclamation-alt class="lg:h-5 lg:w-5" />
                      </router-link>
                    </div>
                    <div class="tooltip" data-tip="Edit">
                      <router-link
                        v-if="session.isAdmin"
                        class="btn btn-circle btn-ghost btn-sm"
                        :to="`/course/${$route.params.name}/problem/${problemId}/edit`"
                      >
                        <i-uil-edit class="lg:h-5 lg:w-5" />
                      </router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <template
              v-else
              v-for="{ problemId, problemName, tags, quota, submitCount, status } in (problems || []).slice(
                (page - 1) * 10,
                page * 10,
              )"
            >
              <problem-info
                :id="problemId"
                :problem-name="problemName"
                :unlimited-quota="isQuotaUnlimited(quota)"
                :quota-limit="quota"
                :quota-remaining="quota - submitCount"
                :tags="tags"
                :visible="status"
                :is-admin="session.isAdmin"
              />
            </template>
          </template>
        </data-status-wrapper>

        <div class="card-actions mt-5">
          <pagination-buttons v-model="page" :maxPage="maxPage" />
        </div>
      </div>
    </div>
  </div>
</template>
