<script setup lang="ts">
import { reactive } from "vue";

const newProblem = reactive<Problem>({
  problemName: "",
  description: {
    description: "",
    input: "",
    output: "",
    hint: "",
    sampleInput: [""],
    sampleOutput: [""],
  },
  tags: [],
  allowedLanguage: 0,
  quota: 10,
  type: 0,
  status: 0,
  testCase: [],
});

function update<K extends keyof Problem>(key: K, value: Problem[K]) {
  newProblem[key] = value;
}
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title mb-3 justify-between">
          New Problem
          <div class="btn"><i-uil-file-upload-alt class="mr-1 lg:h-5 lg:w-5" /> Submit</div>
        </div>

        <problem-form :value="newProblem" @update="update" />

        <div class="divider" />

        <div class="card-title mb-3">Preview</div>

        <problem-card :problem="newProblem" preview />
      </div>
    </div>
  </div>
</template>