<script setup lang="ts">
import { ref, provide, Ref } from "vue";
import { useTitle } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import api from "@/models/api";
import ProblemForm from "@/components/Problem/ProblemForm.vue";

const route = useRoute();
const router = useRouter();
useTitle(`New Problem - ${route.params.name} | Normal OJ`);

const formElement = ref<InstanceType<typeof ProblemForm>>();

const newProblem = ref<ProblemForm>({
  problemName: "",
  description: {
    description: "",
    input: "",
    output: "",
    hint: "",
    sampleInput: [""],
    sampleOutput: [""],
  },
  courses: [route.params.name as string],
  defaultCode: "",
  tags: [],
  allowedLanguage: 3,
  quota: 10,
  type: 0,
  status: 1,
  testCaseInfo: {
    language: 0,
    fillInTemplate: "",
    tasks: [],
  },
  canViewStdout: false,
});
function update<K extends keyof ProblemForm>(
  key: K,
  value: ProblemForm[K] | ((arg: ProblemForm[K]) => ProblemForm[K]),
) {
  if (typeof value === "function") {
    newProblem.value[key] = value(newProblem.value[key]);
  } else {
    newProblem.value[key] = value;
  }
}
provide<Ref<ProblemForm>>("problem", newProblem);
const testdata = ref<File | null>(null);

async function submit() {
  if (!formElement.value) return;
  if (!testdata.value) {
    alert("Testdata not provided");
    return;
  }
  formElement.value.isLoading = true;
  try {
    const { problemId } = (
      await api.Problem.create({
        ...newProblem.value,
      })
    ).data;

    const testdataForm = new FormData();
    testdataForm.append("case", testdata.value);
    try {
      await api.Problem.modifyTestdata(problemId, testdataForm);
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Unknown error occurred :(";
      alert(`Problem created, but testdata upload failed: ${errorMsg}`);
      router.push(`/course/${route.params.name}/problem/${problemId}/edit`);
      throw error;
    }
    router.push(`/course/${route.params.name}/problem/${problemId}`);
  } catch (error) {
    formElement.value.errorMsg =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Unknown error occurred :(";
    throw error;
  } finally {
    formElement.value.isLoading = false;
  }
}

const openPreview = ref<boolean>(false);
const mockProblemMeta = {
  owner: "",
  highScore: 0,
  submitCount: 0,
  ACUser: 0,
  submitter: 0,
};

const openJSON = ref<boolean>(false);
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title mb-3 justify-between">{{ $t("course.problem.new.title") }}</div>

        <problem-form ref="formElement" v-model:testdata="testdata" @update="update" @submit="submit" />

        <div class="divider" />

        <div class="card-title mb-3">
          {{ $t("course.problem.new.preview") }}
          <input v-model="openPreview" type="checkbox" class="toggle" />
        </div>

        <problem-card
          v-if="openPreview"
          :problem="{ ...mockProblemMeta, ...newProblem, testCase: newProblem.testCaseInfo.tasks }"
          preview
        />

        <div class="divider my-4" />

        <div class="card-title mb-3">
          {{ $t("course.problem.new.json") }}
          <input v-model="openJSON" type="checkbox" class="toggle" />
        </div>

        <pre v-if="openJSON">{{ JSON.stringify(newProblem, null, 2) }}</pre>

        <div class="mb-[50%]" />
      </div>
    </div>
  </div>
</template>
