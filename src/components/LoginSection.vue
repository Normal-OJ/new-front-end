<script setup lang="ts">
import { reactive } from "vue";
import { useSession } from "@/stores/session";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import api from "@/models/api";
import axios from "axios";
import { useI18n } from "vue-i18n";

const router = useRouter();
const session = useSession();
const { t } = useI18n();

const loginForm = reactive({
  username: "",
  password: "",
  isLoading: false,
  errorMsg: "",
});
const rules = {
  username: { required },
  password: { required },
};
const v$ = useVuelidate(rules, loginForm);

async function login() {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  loginForm.isLoading = true;
  const body = {
    username: loginForm.username,
    password: loginForm.password,
  };
  try {
    await api.Auth.login(body);
    await session.validateSession();
    router.go(0);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message === "Login Failed") {
        loginForm.errorMsg = t("errorCode.ERR001");
      } else if (error.response?.data?.message === "Invalid User") {
        loginForm.errorMsg = t("errorCode.ERR002");
      } else {
        loginForm.errorMsg = t("errorCode.UNKNOWN");
      }
    } else {
      loginForm.errorMsg = t("errorCode.UNKNOWN");
      throw error;
    }
  } finally {
    loginForm.isLoading = false;
  }
}
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div v-if="session.isNotValidated" class="flex justify-center">
          <ui-spinner />
        </div>
        <div v-else class="card-title mb-2">
          {{ session.isLogin ? $t("components.loginSection.welcome") : $t("components.loginSection.signin") }}
          {{ session.isLogin ? `${session.displayedName}` : " " }}
        </div>
        <template v-if="session.isNotLogin">
          <div class="alert alert-error shadow-lg" v-if="loginForm.errorMsg">
            <div>
              <i-uil-times-circle />
              <span>{{ loginForm.errorMsg }}</span>
            </div>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ $t("components.loginSection.username") }}</span>
            </label>
            <input
              v-model="v$.username.$model"
              type="text"
              name="username"
              :placeholder="$t('components.loginSection.placeholder.username')"
              :class="['input-bordered input', v$.username.$error && 'input-error']"
            />
            <label class="label" v-show="v$.username.$error">
              <span class="label-text-alt text-error" v-text="v$.username.$errors[0]?.$message" />
            </label>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{ $t("components.loginSection.pw") }}</span>
            </label>
            <input
              v-model="v$.password.$model"
              type="password"
              name="password"
              :placeholder="$t('components.loginSection.placeholder.pw')"
              :class="['input-bordered input', v$.password.$error && 'input-error']"
              @keydown.enter="login"
            />
            <label class="label flex-row-reverse">
              <a href="#" class="link-hover label-text-alt link">{{
                $t("components.loginSection.forgot")
              }}</a>
              <span
                v-show="v$.password.$error"
                class="label-text-alt text-error"
                v-text="v$.password.$errors[0]?.$message"
              />
            </label>
          </div>
          <div class="form-control mt-6">
            <button :class="['btn-primary btn', loginForm.isLoading && 'loading']" @click="login">
              {{ $t("components.loginSection.button") }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
