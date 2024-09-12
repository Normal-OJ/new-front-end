<script setup lang="ts">
import { reactive } from "vue";
import { useTitle } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import useVuelidate from "@vuelidate/core";
import { email } from "@vuelidate/validators";

const rules = {
  email: { email },
};

const form = reactive({
  email: "",
});
const v$ = useVuelidate(rules, form);

const { t } = useI18n();

const handleSubmit = async () => {
  if (!v$.value.$validate()) return;
  // todo
};

useTitle("Forgot Password");
</script>

<template>
  <div class="mx-4 flex max-w-4xl flex-col items-center justify-center gap-4 p-4 md:mx-auto">
    <h1 class="my-12 text-center text-4xl font-bold">{{ t("password_reset.forgot-password") }}</h1>
    <div class="card w-96 max-w-full bg-base-200 shadow-xl">
      <div class="card-body">
        <div class="card-title">
          <span class="text-base font-semibold">
            {{ t("password_reset.description") }}
          </span>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t("password_reset.email") }}</span>
          </label>
          <input
            v-model="v$.email.$model"
            type="email"
            name="Email"
            :placeholder="$t('password_reset.email')"
            :class="['input-bordered input', v$.email.$error && 'input-error']"
          />
          <label class="label" v-show="v$.email.$error">
            <span class="label-text-alt text-error" v-text="v$.email.$errors[0]?.$message" />
          </label>
        </div>
        <div class="card-actions justify-center">
          <button class="btn-primary btn" @click="() => handleSubmit()">
            {{ t("password_reset.submit") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
