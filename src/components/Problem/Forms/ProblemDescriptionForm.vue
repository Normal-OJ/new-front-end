<script setup lang="ts">
import { inject, Ref } from "vue";

defineProps<{
  // TODO: hard to type validator, does vuelidate have child component validation?
  v$: any;
}>();
defineEmits<{
  (e: "update", key: keyof ProblemForm, value: ProblemForm[typeof key]): void;
}>();

// TODO: handling error when `problem` or `problem.value` is undefined
// This component only renders when `problem` is not undefined
const problem = inject<Ref<ProblemForm>>("problem") as Ref<ProblemForm>;
</script>

<template>
  <div class="form-control col-span-2 w-full">
    <label class="label">
      <span class="label-text">Description</span>
    </label>
    <textarea
      :class="['textarea-bordered textarea h-24', v$.description.description.$error && 'textarea-error']"
      :value="problem.description.description"
      @input="$emit('update', 'description', {
          ...problem.description,
          description: ($event.target as HTMLTextAreaElement).value
        })"
    />
    <label class="label" v-show="v$.description.description.$error">
      <span class="label-text-alt text-error" v-text="v$.description.description.$errors[0]?.$message" />
    </label>
  </div>

  <div class="form-control col-span-2 w-full">
    <label class="label">
      <span class="label-text">Input</span>
    </label>
    <textarea
      :class="['textarea-bordered textarea h-24', v$.description.input.$error && 'textarea-error']"
      :value="problem.description.input"
      @input="$emit('update', 'description', {
          ...problem.description,
          input: ($event.target as HTMLTextAreaElement).value
        })"
    />
    <label class="label" v-show="v$.description.input.$error">
      <span class="label-text-alt text-error" v-text="v$.description.input.$errors[0]?.$message" />
    </label>
  </div>

  <div class="form-control col-span-2 w-full">
    <label class="label">
      <span class="label-text">Output</span>
    </label>
    <textarea
      :class="['textarea-bordered textarea h-24', v$.description.output.$error && 'textarea-error']"
      :value="problem.description.output"
      @input="$emit('update', 'description', {
          ...problem.description,
          output: ($event.target as HTMLTextAreaElement).value
        })"
    />
    <label class="label" v-show="v$.description.output.$error">
      <span class="label-text-alt text-error" v-text="v$.description.output.$errors[0]?.$message" />
    </label>
  </div>

  <div class="form-control col-span-2 w-full">
    <label class="label">
      <span class="label-text">Hint</span>
    </label>
    <textarea
      :class="['textarea-bordered textarea h-24', v$.description.hint.$error && 'textarea-error']"
      :value="problem.description.hint"
      @input="$emit('update', 'description', {
          ...problem.description,
          hint: ($event.target as HTMLTextAreaElement).value
        })"
    />
    <label class="label" v-show="v$.description.hint.$error">
      <span class="label-text-alt text-error" v-text="v$.description.hint.$errors[0]?.$message" />
    </label>
  </div>

  <div class="col-span-2 flex w-full">
    <div class="rounded border border-error p-4" v-show="v$.description.sampleInput.$invalid">
      Sample Input Error: {{ v$.description.sampleInput.$silentErrors[0]?.$message }}
    </div>
    <div class="rounded border border-error p-4" v-show="v$.description.sampleOutput.$invalid">
      Sample Output Error: {{ v$.description.sampleOutput.$silentErrors[0]?.$message }}
    </div>
  </div>

  <template v-for="(no, i) in problem.description.sampleInput.length">
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Sample Input {{ no }}</span>
      </label>
      <textarea
        class="textarea-bordered textarea h-24"
        :value="problem.description.sampleInput[i]"
        @input="
            $emit('update', 'description', {
              ...problem.description,
              sampleInput: [
                ...problem.description.sampleInput.slice(0, i),
                ($event.target as HTMLInputElement).value,
                ...problem.description.sampleInput.slice(i + 1),
              ],
            })
          "
      />
    </div>

    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Sample Output {{ no }}</span>
      </label>
      <textarea
        class="textarea-bordered textarea h-24"
        :value="problem.description.sampleOutput[i]"
        @input="
            $emit('update', 'description', {
              ...problem.description,
              sampleOutput: [
                ...problem.description.sampleOutput.slice(0, i),
                ($event.target as HTMLInputElement).value,
                ...problem.description.sampleOutput.slice(i + 1),
              ],
            })
          "
      />
    </div>
  </template>

  <div class="col-span-2 mx-auto">
    <div class="tooltip" data-tip="append new sample">
      <div
        class="btn-sm btn mr-3"
        @click="
          $emit('update', 'description', {
            ...problem.description,
            sampleInput: [...problem.description.sampleInput, ''],
            sampleOutput: [...problem.description.sampleOutput, ''],
          })
        "
      >
        <i-uil-plus class="mr-1" />
      </div>
    </div>
    <div class="tooltip" data-tip="remove last sample">
      <div
        class="btn-sm btn"
        @click="
          $emit('update', 'description', {
            ...problem.description,
            sampleInput: problem.description.sampleInput.slice(0, -1),
            sampleOutput: problem.description.sampleOutput.slice(0, -1),
          })
        "
      >
        <i-uil-minus class="mr-1" />
      </div>
    </div>
  </div>
</template>
