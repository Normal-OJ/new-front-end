<script setup lang="ts">
import { reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const rules = {
  email: { required },
};

const resetForm = reactive({
  email: "",
  isLoading: false,
});

const v$ = useVuelidate(rules, resetForm);

async function sendResetEmail() {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  console.log("sendResetEmail");
}
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title mb-2">Reset Password</div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            v-model="v$.email.$model"
            type="text"
            name="email"
            placeholder="your email"
            :class="['input-bordered input', v$.email.$error && 'input-error']"
            @keydown.enter="sendResetEmail"
          />
          <label class="label flex-row-reverse">
            <span
              v-show="v$.email.$error"
              class="label-text-alt text-error"
              v-text="v$.email.$errors[0]?.$message"
            />
          </label>
        </div>
        <div class="form-control mt-6">
          <button :class="['btn btn-primary', resetForm.isLoading && 'loading']" @click="sendResetEmail">
            Reset Password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
