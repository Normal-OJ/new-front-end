<script setup lang="ts">
import { reactive, ref } from "vue";
import { useTitle } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { email } from "@vuelidate/validators";
import api from "@/models/api";

const router = useRouter();

const rules = {
  email: { email },
};

const form = reactive({
  email: "",
});
const v$ = useVuelidate(rules, form);

const { t } = useI18n();

const showError = ref(false);
const success = ref(false);

const handleSubmit = async () => {
  if (!v$.value.$validate()) return;

  const checkEmail = await api.Auth.checkEmail({ email: form.email });
  if (checkEmail.data.valid === 1) {
    showError.value = true;
    return;
  }

  const res = await api.Auth.sendRecoveryEmail({ email: form.email });
  if (res.statusText === "OK") {
    success.value = true;
  }
};

useTitle("Forgot Password");
</script>

<template>
  <div class="mx-4 flex max-w-4xl flex-col items-center justify-center gap-4 p-4 md:mx-auto">
    <h1 class="my-12 text-center text-4xl font-bold">{{ t("password_reset.forgot-password") }}</h1>
    <div class="card w-96 max-w-full bg-base-200 shadow-xl">
      <div v-if="!success" class="card-body">
        <div class="card-title flex-col">
          <div v-if="showError" class="alert alert-error text-base">
            {{ t("password_reset.status.error") }}
            <div class="flex-none">
              <button @click="showError = false" class="btn btn-circle btn-ghost btn-sm">X</button>
            </div>
          </div>
          <span class="text-base font-semibold">
            {{ t("password_reset.description") }}
          </span>
        </div>
        <div class="form-control">
          <input
            v-model="v$.email.$model"
            type="email"
            name="Email"
            :placeholder="$t('password_reset.email')"
            :class="['input input-bordered', v$.email.$error && 'input-error']"
          />
          <label class="label" v-show="v$.email.$error">
            <span class="label-text-alt text-error" v-text="v$.email.$errors[0]?.$message" />
          </label>
        </div>
        <div class="card-actions justify-center">
          <button class="btn btn-primary" @click="() => handleSubmit()">
            {{ t("password_reset.submit") }}
          </button>
        </div>
      </div>
      <div v-else class="card-body">
        {{ t("password_reset.status.success") }}
        <div class="card-actions justify-center">
          <button class="btn btn-primary" @click="() => router.push('/')">
            {{ t("password_reset.return-home") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
