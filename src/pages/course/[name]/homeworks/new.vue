<script setup lang="ts">
import dayjs from "dayjs";
import { ref, reactive } from "vue";
import { useTitle } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import api from "@/models/api";
import { useProblemSelection } from "@/composables/useProblemSelection";
import HomeworkForm from "@/components/Homework/HomeworkForm.vue";

const route = useRoute();
const router = useRouter();
useTitle(`New Homework - ${route.params.name} | Normal OJ`);

const formElement = ref<InstanceType<typeof HomeworkForm>>();

const newHomework = reactive<HomeworkForm>({
  name: "",
  markdown: `_Markdown_ & $\\text{katex}$ are supported.\n![](https://64.media.tumblr.com/2e2d5f1e4f0667c181c3afa9ef8cca1b/tumblr_mu4kbwQ0eY1qki7dgo1_500.gifv)`,
  problemIds: [],
  start: dayjs().unix(),
  end: dayjs().add(7, "day").unix(),
});

const {
  problemSelections,
  problemId2Meta,
  error: fetchError,
  isLoading: isFetching,
} = useProblemSelection(route.params.name as string);

function update<K extends keyof HomeworkForm>(key: K, value: HomeworkForm[K]) {
  newHomework[key] = value;
}

const openPreview = ref<boolean>(false);
const mockHomeworkMeta = {
  id: "test id",
  studentStatus: {},
};

async function submit() {
  if (!formElement.value) return;

  formElement.value.isLoading = true;
  try {
    await api.Homework.create({
      ...newHomework,
      courseName: route.params.name as string,
      scoreboardStatus: 0,
    });
    router.push(`/course/${route.params.name}/homeworks`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      formElement.value.errorMsg = error.response.data.message;
    } else {
      formElement.value.errorMsg = "Unknown error occurred :(";
    }
    throw error;
  } finally {
    formElement.value.isLoading = false;
  }
}
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title mb-3 justify-between">New Homework</div>

        <data-status-wrapper :error="fetchError" :is-loading="isFetching">
          <template #loading>
            <skeleton-card />
          </template>
          <template #data>
            <homework-form
              :form="newHomework"
              :problem-selections="problemSelections"
              ref="formElement"
              @update="update"
              @submit="submit"
            />

            <div class="divider" />

            <div class="card-title mb-3">
              Preview
              <input v-model="openPreview" type="checkbox" class="toggle" />
            </div>

            <homework-card
              v-show="openPreview"
              :homework="{ ...mockHomeworkMeta, ...newHomework }"
              :problems="problemId2Meta"
              preview
            />
          </template>
        </data-status-wrapper>
      </div>
    </div>
  </div>
</template>
