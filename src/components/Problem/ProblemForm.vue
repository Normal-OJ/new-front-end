<script setup lang="ts">
import { ref, watch, inject, Ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, maxLength, minValue, between, helpers } from "@vuelidate/validators";
import { ZipReader, BlobReader } from "@zip.js/zip.js";

// TODO: handling error when `problem` or `problem.value` is undefined
// This component only renders when `problem` is not undefined
const problem = inject<Ref<ProblemForm>>("problem") as Ref<ProblemForm>;

const props = defineProps<{
  testdata: File | null;
}>();
const isLoading = ref(false);
const errorMsg = ref("");
defineExpose({ isLoading, errorMsg });
const emits = defineEmits<{
  (e: "update", key: keyof ProblemForm, value: ProblemForm[typeof key]): void;
  (e: "update:testdata", value: File | null): void;
  (e: "submit"): void;
}>();

const rules = {
  problemName: { required, maxLength: maxLength(64) },
  description: {
    description: { maxLength: maxLength(10000) },
    input: { maxLength: maxLength(10000) },
    output: { maxLength: maxLength(10000) },
    hint: { maxLength: maxLength(10000) },
    sampleInput: {
      itemMaxLength: helpers.withMessage("The length of each sample input should <= 1024", (v: string[]) =>
        v.every((d) => d.length <= 1024),
      ),
    },
    sampleOutput: {
      itemMaxLength: helpers.withMessage("The length of each sample input should <= 1024", (v: string[]) =>
        v.every((d) => d.length <= 1024),
      ),
    },
  },
  courses: {},
  tags: { itemMaxLength: (v: string[]) => v.every((d) => d.length <= 16) },
  allowedLanguage: { required, between: between(1, 7) },
  quota: { required, minValue: minValue(-1) },
  type: {},
  status: {},
  testCaseInfo: {},
  canViewStdout: {},
  defaultCode: {},
};
const v$ = useVuelidate(rules, problem.value);

function update(key: keyof ProblemForm, value: ProblemForm[typeof key]) {
  emits("update", key, value);
  v$.value[key].$touch();
}

async function submit() {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    emits("submit");
  }
}

const isDrag = ref(false);
watch(
  () => props.testdata,
  () => {
    isDrag.value = false;
    if (!props.testdata) {
      update("testCaseInfo", { ...problem.value.testCaseInfo, tasks: [] });
      return;
    }
    const reader = new ZipReader(new BlobReader(props.testdata));
    reader.getEntries().then((entries) => {
      const filenames = entries.map(({ filename }) => filename);
      const inputs = filenames.filter((filename) => filename.endsWith(".in"));
      const outputs = filenames.filter((filename) => filename.endsWith(".out"));
      if (inputs.length !== outputs.length) {
        alert(`Input and output files are not matched. (got ${inputs.length} .in, ${outputs.length} .out)`);
        emits("update:testdata", null);
        return;
      }
      let i = 0;
      const testCase = [];
      while (true) {
        const caseCount = inputs.filter((filename) => filename.startsWith(`0${i}`.slice(-2))).length;
        if (caseCount > 0) {
          testCase.push({ caseCount, memoryLimit: 134218, taskScore: 0, timeLimit: 1000 });
          i++;
        } else {
          break;
        }
      }
      if (testCase.length > 0) {
        update("testCaseInfo", { ...problem.value.testCaseInfo, tasks: testCase });
      } else {
        alert("No Test Data found in the zip file! (壓縮檔內只需要測資文字檔，不需要資料夾)");
      }
    });
  },
);
</script>

<template>
  <div v-if="errorMsg" class="alert alert-error shadow-lg">
    <div>
      <i-uil-times-circle />
      <span>{{ errorMsg }}</span>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-y-4">
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Name</span>
      </label>
      <input
        type="text"
        :class="['input-bordered input w-full max-w-xs', v$.problemName.$error && 'input-error']"
        :value="problem.problemName"
        @input="update('problemName', ($event.target as HTMLInputElement).value)"
      />
      <label class="label" v-show="v$.problemName.$error">
        <span class="label-text-alt text-error" v-text="v$.problemName.$errors[0]?.$message" />
      </label>
    </div>

    <div class="form-control">
      <label class="label cursor-pointer justify-start gap-x-4">
        <span class="label-text">Hidden</span>
        <input
          type="checkbox"
          class="toggle-success toggle"
          :true-value="1"
          :false-value="0"
          :value="problem.status"
          @change="update('status', (problem.status ^ 1) as 0 | 1)"
        />
      </label>
    </div>

    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Quota</span>
      </label>
      <input
        type="text"
        :class="['input-bordered input w-full max-w-xs', v$.quota.$error && 'input-error']"
        :value="problem.quota"
        @input="update('quota', Number(($event.target as HTMLInputElement).value))"
      />
      <label class="label">
        <span class="label-text-alt">
          {{ v$.quota.$error ? v$.quota.$errors[0]?.$message : "Set -1 for unlimited quota" }}
        </span>
      </label>
    </div>

    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Tags</span>
      </label>
      <input
        type="text"
        :class="['input-bordered input w-full max-w-xs', v$.tags.$error && 'input-error']"
        :value="problem.tags.join(',')"
        @input="update('tags', ($event.target as HTMLInputElement).value.split(','))"
      />
      <label class="label">
        <span class="label-text-alt">
          {{ v$.tags.$error ? v$.tags.$errors[0]?.$message : "Separate with COMMA, e.g. HW1,HW2" }}
        </span>
      </label>
    </div>

    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Type</span>
      </label>
      <select
        class="select-bordered select w-full max-w-xs"
        :value="problem.type"
        @input="update('type', Number(($event.target as HTMLSelectElement).value) as 0 | 1 | 2)"
      >
        <option value="0">Programming</option>
        <option value="2">File Upload</option>
      </select>
    </div>

    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Allowed Languages</span>
      </label>
      <language-multi-select
        :model-value="problem.allowedLanguage"
        @update:model-value="(newValue) => update('allowedLanguage', newValue)"
      />
      <label class="label" v-show="v$.allowedLanguage.$error">
        <span class="label-text-alt text-error" v-text="v$.allowedLanguage.$errors[0]?.$message" />
      </label>
    </div>

    <ProblemDescriptionForm :v$="v$" @update="(...args) => update(...args)" />

    <template v-if="problem.type !== 2">
      <div class="form-control col-span-2 w-full">
        <label class="label justify-start">
          <span class="label-text">Testdata</span>
          <label for="testdata-description" class="modal-button btn-xs btn ml-3">How to pack testdata</label>
        </label>
        <div
          :class="['textarea-bordered textarea w-full p-4', isDrag ? 'border-accent' : '']"
          @drop.prevent="$emit('update:testdata', $event.dataTransfer?.files?.[0])"
          @dragover.prevent="isDrag = true"
          @dragleave="isDrag = false"
        >
          <template v-if="!testdata">
            <span class="mb-6 mr-6 text-sm">Drop File here or Choose File to upload</span>
            <input
              type="file"
              id="file-uploader"
              accept=".zip"
              @change="$emit('update:testdata', ($event.target as HTMLInputElement).files?.[0])"
            />
          </template>
          <template v-else>
            <div class="flex">
              <span class="mr-3">{{ testdata.name }}</span>
              <button class="btn-sm btn" @click="$emit('update:testdata', null)">
                <i-uil-times />
              </button>
            </div>
          </template>
        </div>
      </div>

      <template v-for="(no, i) in problem.testCaseInfo.tasks.length">
        <div class="col-span-2">
          <div class="font-semibold">Subtask {{ no }}</div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">The number of testcases</span>
              </label>
              <input
                type="text"
                class="input-bordered input w-full max-w-xs"
                :value="problem.testCaseInfo.tasks[i].caseCount"
                readonly
              />
            </div>

            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Score</span>
              </label>
              <input
                type="text"
                class="input-bordered input w-full max-w-xs"
                :value="problem.testCaseInfo.tasks[i].taskScore"
                @input="update('testCaseInfo', { ...problem.testCaseInfo, tasks: [
                ...problem.testCaseInfo.tasks.slice(0, i),
                {
                  ...problem.testCaseInfo.tasks[i],
                  taskScore: Number(($event.target as HTMLInputElement).value),
                },
                ...problem.testCaseInfo.tasks.slice(i + 1),
              ]})"
              />
            </div>

            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Memory Limit (KB)</span>
              </label>
              <input
                type="text"
                class="input-bordered input w-full max-w-xs"
                :value="problem.testCaseInfo.tasks[i].memoryLimit"
                @input="update('testCaseInfo', { ...problem.testCaseInfo, tasks: [
                ...problem.testCaseInfo.tasks.slice(0, i),
                {
                  ...problem.testCaseInfo.tasks[i],
                  memoryLimit: Number(($event.target as HTMLInputElement).value),
                },
                ...problem.testCaseInfo.tasks.slice(i + 1),
              ]})"
              />
            </div>

            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Time Limit (ms)</span>
              </label>
              <input
                type="text"
                class="input-bordered input w-full max-w-xs"
                :value="problem.testCaseInfo.tasks[i].timeLimit"
                @input="update('testCaseInfo', { ...problem.testCaseInfo, tasks: [
                ...problem.testCaseInfo.tasks.slice(0, i),
                {
                  ...problem.testCaseInfo.tasks[i],
                  timeLimit: Number(($event.target as HTMLInputElement).value),
                },
                ...problem.testCaseInfo.tasks.slice(i + 1),
              ]})"
              />
            </div>
          </div>
        </div>
      </template>
    </template>

    <ProblemTestdataDescriptionModal />
  </div>
  <div class="mt-4 flex justify-end">
    <button :class="['btn-success btn', isLoading && 'loading']" @click="submit">
      <i-uil-file-upload-alt class="mr-1 lg:h-5 lg:w-5" /> Submit
    </button>
  </div>
</template>
