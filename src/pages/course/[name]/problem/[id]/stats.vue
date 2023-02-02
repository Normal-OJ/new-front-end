<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import VChart from "vue-echarts";
import { TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { PieChart, BarChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { formatTime } from "@/utils/formatTime";
import { useTheme } from "@/stores/theme";
import { SUBMISSION_STATUS_REPR } from "@/constants";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useRoute } from "vue-router";
import { fetcher } from "@/models/api";
import { useTitle } from "@vueuse/core";

const route = useRoute();
const theme = useTheme();
useTitle(`Problem Stats - ${route.params.id} - ${route.params.name} | Normal OJ`);
use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout, GridComponent, BarChart]);

const {
  data: stats,
  error,
  isLoading,
} = useAxios<ProblemStats>(`/problem/${route.params.id}/stats`, fetcher);
const resultCounts = computed(() => {
  if (!stats.value) return [];
  const _stats = stats.value;
  return Object.entries(SUBMISSION_STATUS_REPR).map(([statusCode, { label, color }]) => ({
    name: label,
    value: _stats.statusCount[statusCode],
    itemStyle: { color: color },
  }));
});
const triedUserCount = computed(() => stats.value?.triedUserCount || null);
const acUserRatio = computed(() => stats.value?.acUserRatio || [null, null]);
const submissionCount = computed(() =>
  stats.value ? Object.values(stats.value?.statusCount).reduce((a, b) => a + b, 0) : null,
);
const avgScore = computed(() => (stats.value ? stats.value.average : null));
const stdScore = computed(() => (stats.value ? stats.value.std : null));
const scoreDistribution = computed(() => {
  if (!stats.value) return {};
  const counter: { [key: string]: number } = {};
  stats.value.scoreDistribution.forEach(
    (score) => (counter[String(score)] = (counter[String(score)] || 0) + 1),
  );
  return counter;
});
const top10RunTime = computed(() => stats.value?.top10RunTime || []);
const top10MemoryUsage = computed(() => stats.value?.top10MemoryUsage || []);

const pieOption = computed(() => ({
  backgroundColor: "transparent",
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  series: [
    {
      name: "Submission Result",
      type: "pie",
      radius: ["30%", "70%"],
      data: resultCounts.value.filter((item) => item.value > 0),
    },
  ],
  textStyle: {
    fontSize: 13,
  },
}));
const barOption = computed(() => ({
  backgroundColor: "transparent",
  xAxis: {
    type: "category",
    data: Object.keys(scoreDistribution.value),
  },
  yAxis: {
    type: "value",
    minInterval: 1,
  },
  series: [
    {
      data: Object.values(scoreDistribution.value),
      type: "bar",
      label: {
        show: true,
        position: "outside",
      },
    },
  ],
  textStyle: {
    fontSize: 13,
  },
}));
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title md:text-2xl lg:text-3xl">Stats for problem #{{ $route.params.id }}</div>

        <div class="my-2" />

        <data-status-wrapper :error="error" :is-loading="isLoading">
          <template #loading>
            <skeleton-card />
          </template>
          <template #data>
            <div class="stats stats-vertical lg:stats-horizontal">
              <div class="stat place-items-center">
                <div class="stat-title">Num of users tried</div>
                <div class="stat-value">
                  <span v-if="!triedUserCount">-</span>
                  <template v-else>
                    <span>{{ triedUserCount }}</span>
                    <span class="text-sm font-normal">{{ ` / ${acUserRatio[1]}` }}</span>
                  </template>
                </div>
              </div>
              <div class="stat place-items-center">
                <div class="stat-title">Num of AC users</div>
                <div class="stat-value">
                  <span v-if="!acUserRatio[0]">-</span>
                  <template v-else>
                    <span>{{ acUserRatio[0] }}</span>
                    <span class="text-sm font-normal">{{ ` / ${acUserRatio[1]}` }}</span>
                  </template>
                </div>
              </div>
              <div class="stat place-items-center">
                <div class="stat-title">AC Submission Ratio</div>
                <div class="stat-value">
                  <span v-if="!submissionCount || !stats">-</span>
                  <template v-else>
                    <span>{{ stats.statusCount[0] }}</span>
                    <span class="text-sm font-normal">{{ ` / ${submissionCount}` }}</span>
                  </template>
                </div>
              </div>
              <div class="stat place-items-center">
                <div class="stat-title">Average Score</div>
                <div class="stat-value">{{ avgScore?.toFixed(2) || "-" }}</div>
              </div>
              <div class="stat place-items-center">
                <div class="stat-title">Standard Deviation</div>
                <div class="stat-value">{{ stdScore?.toFixed(2) || "-" }}</div>
              </div>
            </div>

            <div class="my-4" />

            <div class="flex">
              <v-chart
                class="mx-auto h-[400px]"
                :theme="theme.isDark ? 'dark' : ''"
                :option="pieOption"
                autoresize
              />
              <v-chart
                class="mx-auto h-[400px]"
                :theme="theme.isDark ? 'dark' : ''"
                :option="barOption"
                autoresize
              />
            </div>
          </template>
        </data-status-wrapper>

        <div class="my-2" />

        <div class="card-title md:text-xl lg:text-2xl">Top 10 Run Time</div>
        <div class="my-1" />
        <skeleton-table v-if="isLoading" :col="4" :row="10" />
        <table v-else class="table-compact table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Run Time</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(subm, index) in top10RunTime" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ subm.user.username }}</td>
              <td>{{ subm.runTime }} ms</td>
              <td>{{ formatTime(subm.timestamp) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="my-5" />

        <div class="card-title md:text-xl lg:text-2xl">Top 10 Memory Usage</div>
        <div class="my-1" />
        <skeleton-table v-if="isLoading" :col="4" :row="10" />
        <table v-else class="table-compact table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Memory Usage</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(subm, index) in top10MemoryUsage" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ subm.user.username }}</td>
              <td>{{ subm.memoryUsage }} KB</td>
              <td>{{ formatTime(subm.timestamp) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="my-5" />
      </div>
    </div>
  </div>
</template>
