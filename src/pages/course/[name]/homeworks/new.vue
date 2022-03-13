<script setup lang="ts">
import dayjs from "dayjs";
import { reactive } from "vue";

const newHomework = reactive<Homework>({
  end: dayjs().add(7, "day").unix(),
  markdown: `_Markdown_ & $\\text{katex}$ are supported.\n![](https://64.media.tumblr.com/2e2d5f1e4f0667c181c3afa9ef8cca1b/tumblr_mu4kbwQ0eY1qki7dgo1_500.gifv)`,
  name: "Example",
  problemIds: [] as number[],
  start: dayjs().unix(),
});
const problems = [
  { problemId: 3, problemName: "A+B" },
  { problemId: 4, problemName: "A+B+C" },
  { problemId: 5, problemName: "A+B+D" },
];

function update<K extends keyof Homework>(key: K, value: Homework[K]) {
  newHomework[key] = value;
}
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title mb-3 justify-between">
          New Homework
          <div class="btn"><i-uil-file-upload-alt class="mr-1 lg:h-5 lg:w-5" /> Submit</div>
        </div>

        <homework-form :value="newHomework" :problems="problems" @update="update" />

        <div class="divider" />

        <div class="card-title mb-3">Preview</div>

        <homework-card :homework="newHomework" preview />
      </div>
    </div>
  </div>
</template>