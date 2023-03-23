<script setup lang="ts">
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";

interface Props {
  value: Announcement | AnnouncementForm;
}
const props = defineProps<Props>();
const isLoading = ref(false);
const errorMsg = ref("");
defineExpose({ isLoading, errorMsg });

const rules = {
  title: { required, maxLength: maxLength(64) },
  markdown: { maxLength: maxLength(100000) },
  pinned: { required },
};
const v$ = useVuelidate(rules, props.value);

const emit = defineEmits<{
  (e: "update", key: keyof AnnouncementForm, value: AnnouncementForm[typeof key]): void;
  (e: "submit"): void;
}>();

function updateForm(key: keyof AnnouncementForm, value: AnnouncementForm[typeof key]) {
  emit("update", key, value);
  v$.value[key].$touch();
}
async function submit() {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    emit("submit");
  }
}
</script>

<template>
  <div v-if="errorMsg" class="alert alert-error shadow-lg">
    <div>
      <i-uil-times-circle />
      <span>{{ errorMsg }}</span>
    </div>
  </div>
  <div class="grid grid-cols-1 gap-y-4 lg:grid-cols-2">
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">{{ $t("components.ann.form.titleField") }}</span>
      </label>
      <input
        type="text"
        :class="['input-bordered input w-full max-w-xs', v$.title.$error && 'input-error']"
        :value="value.title"
        @input="updateForm('title', ($event.target as HTMLInputElement).value)"
      />
      <label class="label" v-show="v$.title.$error">
        <span class="label-text-alt text-error" v-text="v$.title.$errors[0]?.$message" />
      </label>
    </div>

    <div class="form-control">
      <label class="label cursor-pointer justify-start gap-x-4">
        <span class="label-text">{{ $t("components.ann.form.pinToggle") }}</span>
        <input
          type="checkbox"
          class="toggle-success toggle"
          :checked="value.pinned"
          @input="updateForm('pinned', ($event.target as HTMLInputElement).checked)"
        />
      </label>
    </div>

    <div class="form-control w-full lg:col-span-2">
      <label class="label">
        <span class="label-text">{{ $t("components.ann.form.descField") }}</span>
      </label>
      <textarea
        :class="['textarea-bordered textarea h-24', v$.markdown.$error && 'textarea-error']"
        :value="value.markdown"
        @input="updateForm('markdown', ($event.target as HTMLTextAreaElement).value)"
      />
      <label class="label" v-show="v$.markdown.$error">
        <span class="label-text-alt text-error" v-text="v$.markdown.$errors[0]?.$message" />
      </label>
    </div>
  </div>
  <div class="mt-4 flex justify-end">
    <button :class="['btn-success btn', isLoading && 'loading']" @click="submit">
      <i-uil-file-upload-alt class="mr-1 lg:h-5 lg:w-5" /> {{ $t("components.ann.form.submit") }}
    </button>
  </div>
</template>
