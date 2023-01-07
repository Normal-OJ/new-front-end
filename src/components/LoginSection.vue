<script setup lang="ts">
import { reactive } from "vue";
import { useSession } from "../stores/session";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import api from "../models/api";
import axios from "axios";

const router = useRouter();
const session = useSession();

const loginForm = reactive({
  username: "",
  password: "",
  isLoading: false,
  isError: false,
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
      loginForm.isError = true;
    } else {
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
          {{ session.isLogin ? `Welcome back, ${session.displayedName}` : "Sign in" }}
        </div>
        <template v-if="session.isNotLogin">
          <div class="alert alert-error shadow-lg" v-if="loginForm.isError">
            <div>
              <i-uil-times-circle />
              <span>Login Failed: Your username/email or password is incorrect</span>
            </div>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Username / Email</span>
            </label>
            <input
              v-model="v$.username.$model"
              type="text"
              name="username"
              placeholder="username or email"
              :class="['input-bordered input', v$.username.$error && 'input-error']"
            />
            <label class="label" v-show="v$.username.$error">
              <span class="label-text-alt text-error" v-text="v$.username.$errors[0]?.$message" />
            </label>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              v-model="v$.password.$model"
              type="password"
              name="password"
              placeholder="password"
              :class="['input-bordered input', v$.password.$error && 'input-error']"
              @keydown.enter="login"
            />
            <label class="label flex-row-reverse">
              <a href="#" class="link-hover label-text-alt link">Forgot password?</a>
              <span
                v-show="v$.password.$error"
                class="label-text-alt text-error"
                v-text="v$.password.$errors[0]?.$message"
              />
            </label>
          </div>
          <div class="form-control mt-6">
            <button :class="['btn-primary btn', loginForm.isLoading && 'loading']" @click="login">
              Sign In
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>