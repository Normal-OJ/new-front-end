<script setup lang="ts">
import { reactive, toRef } from "vue";
import { useRouter } from "vue-router";
import api from "@/models/api";
import { useSession } from "@/stores/session";
import { useTitle } from "@vueuse/core";
import { required, sameAs, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import axios from "axios";
import { useI18n } from "vue-i18n";

useTitle("Profile | Normal OJ");
const router = useRouter();
const session = useSession();
const ROLE = ["Admin", "Teacher", "Student"];
const { t } = useI18n();

async function logout() {
  await api.Auth.logout();
  router.push("/");
  session.validateSession();
}

const changePasswordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
  isLoading: false,
  errorMsg: "",
  isFinished: false,
});
// TODO: integrate vue-i18n & Vuelidate error message
const rules = {
  newPassword: { required },
  oldPassword: { required },
  confirmPassword: {
    required,
    sameAsRef: helpers.withMessage(
      t("profile.rules.confirmPassword.sameAsRef"),
      sameAs(toRef(changePasswordForm, "newPassword")),
    ),
  },
};
const v$ = useVuelidate(rules, changePasswordForm);

async function changePassword() {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  changePasswordForm.errorMsg = "";
  changePasswordForm.isFinished = false;
  changePasswordForm.isLoading = true;
  try {
    await api.Auth.changePassword({
      oldPassword: changePasswordForm.oldPassword,
      newPassword: changePasswordForm.newPassword,
    });
    clearForm();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.message === "Wrong Password") {
        changePasswordForm.errorMsg = "Wrong Password";
      } else {
        changePasswordForm.errorMsg = "Operation failed, please try again later";
      }
    } else {
      throw error;
    }
  } finally {
    changePasswordForm.isLoading = false;
  }
}

function clearForm() {
  changePasswordForm.oldPassword = "";
  changePasswordForm.newPassword = "";
  changePasswordForm.confirmPassword = "";
  changePasswordForm.isFinished = true;
  v$.value.$reset();
}
</script>

<template>
  <div class="card-container">
    <div class="card">
      <div class="card-body">
        <div class="card-title justify-between">{{ t("profile.title") }}</div>

        <div class="my-2" />
        <table class="table w-full">
          <thead>
            <tr>
              <th>{{ t("profile.username") }}</th>
              <th>{{ t("profile.dispname") }}</th>
              <th>{{ t("profile.email") }}</th>
              <th>{{ t("profile.role") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ session.username }}</td>
              <td>{{ session.displayedName }}</td>
              <td>{{ session.email }}</td>
              <td>{{ ROLE[session.role] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-actions">
        <div class="mx-auto flex max-w-7xl gap-8 p-4">
          <button class="btn btn-outline btn-error" @click="logout">{{ t("profile.signOut") }}</button>
        </div>
      </div>

      <div class="card-body">
        <div class="card-title justify-between">{{ t("profile.pw.change") }}</div>

        <div class="my-2" />

        <div class="alert alert-error shadow-lg" v-if="changePasswordForm.errorMsg">
          <div>
            <i-uil-times-circle />
            <span>{{ changePasswordForm.errorMsg }}</span>
          </div>
        </div>
        <div class="alert alert-success shadow-lg" v-else-if="changePasswordForm.isFinished">
          <div>
            <i-uil-check-circle />
            <span>{{ t("profile.pw.success") }}</span>
          </div>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ t("profile.pw.new") }}</span>
          </label>
          <input
            v-model="v$.newPassword.$model"
            type="password"
            name="password"
            :placeholder="t('profile.pw.placeholder.new')"
            :class="['input input-bordered', v$.newPassword.$error && 'input-error']"
          />
          <label class="label" v-show="v$.newPassword.$error">
            <span class="label-text-alt text-error" v-text="v$.newPassword.$errors[0]?.$message" />
          </label>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ t("profile.pw.confirm") }}</span>
          </label>
          <input
            v-model="v$.confirmPassword.$model"
            type="password"
            name="password"
            :placeholder="t('profile.pw.placeholder.again')"
            :class="['input input-bordered', v$.confirmPassword.$error && 'input-error']"
          />
          <label class="label" v-show="v$.confirmPassword.$error">
            <span class="label-text-alt text-error" v-text="v$.confirmPassword.$errors[0]?.$message" />
          </label>
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ t("profile.pw.current") }}</span>
          </label>
          <input
            v-model="v$.oldPassword.$model"
            type="password"
            name="password"
            :placeholder="t('profile.pw.placeholder.current')"
            :class="['input input-bordered', v$.oldPassword.$error && 'input-error']"
            @keydown.enter="changePassword"
          />
          <label class="label" v-show="v$.oldPassword.$error">
            <span class="label-text-alt text-error" v-text="v$.oldPassword.$errors[0]?.$message" />
          </label>
        </div>
        <div class="form-control mt-6">
          <div
            :class="['btn btn-primary', changePasswordForm.isLoading && 'loading']"
            @click="changePassword"
          >
            {{ t("profile.pw.submit") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
