<script setup lang="ts">
import { fetcher } from "@/models/api";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useI18n } from "vue-i18n";
import { ROLE } from "@/constants";
import { useTitle } from "@vueuse/core";
import { computed } from "vue";

useTitle("Admin - Dashboard | Normal OJ");
const { t } = useI18n();
const {
  data: userSummary,
  error: userError,
  isLoading: userLoading,
} = useAxios<UserSummary>("/user/summary", fetcher);
const {
  data: courseSummary,
  error: courseError,
  isLoading: courseLoading,
} = useAxios<CourseSummary>("/course/summary", fetcher);
const courseSummaryTotal = computed(() => {
  if (!courseSummary.value) return null;
  return {
    userCount: courseSummary.value.breakdown.reduce((acc, cur) => acc + cur.userCount, 0),
    problemCount: courseSummary.value.breakdown.reduce((acc, cur) => acc + cur.problemCount, 0),
    submissionCount: courseSummary.value.breakdown.reduce((acc, cur) => acc + cur.submissionCount, 0),
    homeworkCount: courseSummary.value.breakdown.reduce((acc, cur) => acc + cur.homeworkCount, 0),
  };
});
</script>

<template>
  <div class="mb-4 flex flex-col gap-y-4">
    <h1 class="text-xl font-bold">
      {{ t("admin.dashboard.usercount.title") + ` (${userSummary?.userCount || "-"})` }}
    </h1>
    <data-status-wrapper :error="userError" :is-loading="userLoading">
      <template #loading>
        <skeleton-table :col="2" :row="5" />
      </template>
      <template #data>
        <table class="table table-compact w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>{{ t("admin.dashboard.usercount.count") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="{ role, count } in userSummary!.breakdown" :key="role">
              <td>{{ role }}</td>
              <td>{{ count }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>{{ t("admin.dashboard.usercount.total") }}</td>
              <td>{{ userSummary!.userCount }}</td>
            </tr>
          </tfoot>
        </table>
      </template>
    </data-status-wrapper>

    <divider class="divider" />

    <h1 class="text-xl font-bold">
      {{ t("admin.dashboard.coursecount.title") + ` (${courseSummary?.courseCount || "-"})` }}
    </h1>
    <data-status-wrapper :error="courseError" :is-loading="courseLoading">
      <template #loading>
        <skeleton-table :col="5" :row="15" />
      </template>
      <template #data>
        <table class="table table-compact w-full">
          <thead>
            <tr>
              <th>{{ t("admin.dashboard.coursecount.coursename") }}</th>
              <th>{{ t("admin.dashboard.coursecount.user") }}</th>
              <th>{{ t("admin.dashboard.coursecount.homework") }}</th>
              <th>{{ t("admin.dashboard.coursecount.problem") }}</th>
              <th>{{ t("admin.dashboard.coursecount.submission") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courseSummary!.breakdown" :key="course.course">
              <td>{{ course.course }}</td>
              <td>{{ course.userCount }}</td>
              <td>{{ course.homeworkCount }}</td>
              <td>{{ course.problemCount }}</td>
              <td>{{ course.submissionCount }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td><span class="font-bold">Total</span></td>
              <td>{{ courseSummaryTotal!.userCount }}</td>
              <td>{{ courseSummaryTotal!.homeworkCount }}</td>
              <td>{{ courseSummaryTotal!.problemCount }}</td>
              <td>{{ courseSummaryTotal!.submissionCount }}</td>
            </tr>
          </tfoot>
        </table>
      </template>
    </data-status-wrapper>
  </div>
</template>
