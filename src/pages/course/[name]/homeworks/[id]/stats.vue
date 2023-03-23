<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios";
import { computed, watch, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import queryString from "query-string";
import { use } from "echarts/core";
import VChart from "vue-echarts";
import { GridComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { fetcher } from "@/models/api";
import { useTheme } from "@/stores/theme";
import dayjs from "dayjs";

const route = useRoute();
useTitle(`Homework Stats - ${route.params.id} - ${route.params.name} | Normal OJ`);
const theme = useTheme();
use([CanvasRenderer, LabelLayout, GridComponent, BarChart]);

const {
  data: hw,
  error: hwError,
  isLoading: isHWFetching,
} = useAxios<Homework>(`/homework/${route.params.id}`, fetcher);
const pids = ref<number[] | undefined>();
const scoreboardBegin = ref<number>();
const scoreboardEnd = ref<number>();
watchEffect(() => {
  if (!hw.value) return;
  pids.value = hw.value.problemIds;
  scoreboardBegin.value = hw.value.start;
  scoreboardEnd.value = hw.value.end;
});
const startDateTime = computed(
  () => scoreboardBegin.value && dayjs(scoreboardBegin.value * 1000).format("YYYY-MM-DD\THH:mm"),
);
const endDateTime = computed(
  () => scoreboardEnd.value && dayjs(scoreboardEnd.value * 1000).format("YYYY-MM-DD\THH:mm"),
);
function setScoreboardBegin(event: Event) {
  scoreboardBegin.value = dayjs((event.target as HTMLInputElement).value).valueOf() / 1000;
}
function setScoreboardEnd(event: Event) {
  scoreboardEnd.value = dayjs((event.target as HTMLInputElement).value).valueOf() / 1000;
}
const getScoreboardUrl = computed<string>(() => {
  if (!pids.value || !scoreboardBegin.value || !scoreboardEnd.value) return "";
  const qs = queryString.stringify({
    pids: pids.value.join(","),
    start: scoreboardBegin.value,
    end: scoreboardEnd.value,
  });
  return `/course/${route.params.name}/scoreboard?${qs}`;
});
const {
  execute,
  data: scoreboard,
  error: scoreboardError,
  isLoading: isScoreboardFetching,
} = useAxios<Scoreboard>(fetcher);
watch(
  getScoreboardUrl,
  (url) => {
    if (url && !scoreboard.value) {
      execute(url);
    }
  },
  { immediate: true },
);
enum Columns {
  USERNAME = "username",
  SUM_ASC = "sum ascending",
  SUM_DESC = "sum descending",
}
const sortBy = ref<Columns>(Columns.SUM_DESC);
const sortedScoreboard = computed(() => {
  if (!scoreboard.value) return scoreboard.value;
  if (sortBy.value === Columns.SUM_ASC) {
    return scoreboard.value.sort((a: ScoreboardRow, b: ScoreboardRow) => a.sum - b.sum);
  } else if (sortBy.value === Columns.SUM_DESC) {
    return scoreboard.value.sort((a: ScoreboardRow, b: ScoreboardRow) => b.sum - a.sum);
  } else {
    return scoreboard.value.sort((a: ScoreboardRow, b: ScoreboardRow) =>
      a.user.username.localeCompare(b.user.username),
    );
  }
});
function getCellColor(cell: ScoreCell | undefined) {
  if (!cell) return "";
  if (cell.count === 0) return "bg-gray-200";
  if (cell.max < 100) return "bg-red-300 text-neutral";
  return "bg-green-300 text-neutral";
}
const scoreDistribution = computed(() => {
  if (!scoreboard.value) return {};
  const counter: { [key: string]: number } = {};
  scoreboard.value.forEach(
    (row: ScoreboardRow) => (counter[String(row.sum)] = (counter[String(row.sum)] || 0) + 1),
  );
  return counter;
});
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
function exportCSV() {
  if (!sortedScoreboard.value || !pids.value) return;
  const _pids = pids.value;
  const csvHeader: string = ["username", "display name", ...pids.value.map(String), "avg", "sum"].join(",");
  const csvBody: string = sortedScoreboard.value
    .map((row: ScoreboardRow) =>
      [
        row.user.username,
        row.user.displayedName,
        ..._pids.map((pid) => (row[`${pid}`] ? row[`${pid}`].max : 0)),
        row.avg,
        row.sum,
      ].join(","),
    )
    .join("\n");
  const csvData = new Blob([`${csvHeader}\n${csvBody}`], {
    type: "text/csv;charset=utf-8",
  });
  const csvURL = URL.createObjectURL(csvData);
  const link = document.createElement("a");
  link.href = csvURL;
  link.download = `${route.params.name}-${hw.value && hw.value.name}-scoreboard.csv`;
  document.body.appendChild(link);
  link.click();
}
</script>

<template>
  <div class="p-2 pb-40">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title">Stats - {{ hw && hw.name }}</div>

        <div class="flex">
          <v-chart
            class="mx-auto h-[400px]"
            :theme="theme.isDark ? 'dark' : ''"
            :option="barOption"
            autoresize
          />
        </div>

        <div class="card-title">Scoreboard</div>

        <div class="mb-4 flex items-end gap-x-4">
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Sort By</span>
            </label>
            <select v-model="sortBy" class="select-bordered select w-full max-w-xs">
              <option :value="Columns.USERNAME">Username</option>
              <option :value="Columns.SUM_DESC">Sum in descending</option>
              <option :value="Columns.SUM_ASC">Sum in ascending</option>
            </select>
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Begin</span>
            </label>
            <input
              type="datetime-local"
              class="input-bordered input w-full max-w-xs"
              :value="startDateTime"
              @change="setScoreboardBegin"
            />
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">End</span>
            </label>
            <input
              type="datetime-local"
              class="input-bordered input w-full max-w-xs"
              :value="endDateTime"
              @change="setScoreboardEnd"
            />
          </div>
          <button
            :class="['btn', isScoreboardFetching && 'loading']"
            @click="() => execute(getScoreboardUrl)"
          >
            Fetch
          </button>
          <button class="btn" @click="() => exportCSV()">Export</button>
        </div>
        <data-status-wrapper
          :error="hwError || scoreboardError"
          :is-loading="isHWFetching || isScoreboardFetching"
        >
          <template #loading>
            <skeleton-table :col="7" :row="20" />
          </template>
          <template #data>
            <table class="table">
              <thead>
                <tr>
                  <th>user</th>
                  <th class="text-center" v-for="pid in pids" :key="pid">{{ pid }}</th>
                  <th class="text-center">avg</th>
                  <th class="text-center">sum</th>
                </tr>
              </thead>
              <tbody class="font-mono">
                <tr v-for="row in sortedScoreboard" :key="row.user.username">
                  <td>{{ row.user.username }} ({{ row.user.displayedName }})</td>
                  <td v-for="pid in pids" :key="pid" class="p-0">
                    <div
                      v-if="row[`${pid}`]"
                      :class="['flex h-full flex-col py-2 px-4 text-center', getCellColor(row[`${pid}`])]"
                    >
                      <div class="text-md">{{ row[`${pid}`].max }}</div>
                      <div class="text-xs">{{ row[`${pid}`].count }} tries</div>
                    </div>
                  </td>
                  <td class="text-center">{{ row.avg.toFixed(2) }}</td>
                  <td class="text-center">{{ row.sum }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </data-status-wrapper>
      </div>
    </div>
  </div>
</template>
