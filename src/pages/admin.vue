<script setup lang="ts">
import { ROLE } from "@/constants";
import api, { fetcher } from "@/models/api";
import { useSession } from "@/stores/session";
import useVuelidate from "@vuelidate/core";
import { required, maxLength, between, integer, minLength } from "@vuelidate/validators";
import { useAxios } from "@vueuse/integrations/useAxios";
import axios from "axios";
import { computed, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const tabs = [{ text: t("admin.tab.user"), value: "user" }];
watchEffect(() => {
  if (!route.query.tab || !tabs.some((d) => d.value === route.query.tab)) {
    router.push("/admin?tab=user");
  }
});
const session = useSession();
watchEffect(() => {
  if (!session.isAdmin) {
    router.replace("/");
  }
});

const {
  data: users,
  error: fetchError,
  isLoading: fetchLoading,
  execute,
} = useAxios<UserInfo[]>("/user", fetcher);
const searchName = ref("");
const searchRole = ref(null);
const filteredUsers = computed(() =>
  users.value
    ?.filter((d) => d.username.includes(searchName.value) || d.displayedName.includes(searchName.value))
    .filter((d) => searchRole.value == null || d.role === searchRole.value),
);

const edittingUsername = ref("");
const isLoading = ref(false);
const errorMsg = ref("");
const initialUserForm = {
  displayedName: "",
  role: 0,
  password: "",
};
const userForm = ref<UserEditionForm>({ ...initialUserForm });
const rules = {
  displayedName: { required, maxLength: maxLength(16) },
  role: { required, between: between(0, 2), integer },
  password: { minLength: minLength(4) },
};
const v$ = useVuelidate(rules, userForm);
function editUser(username: string) {
  const originalData = users.value?.find((d) => d.username === username);
  if (!originalData) return;
  userForm.value = {
    displayedName: originalData.displayedName,
    role: originalData.role,
    password: "",
  };
  edittingUsername.value = username;
}
async function submit() {
  if (!(await v$.value.$validate())) return;

  isLoading.value = true;
  try {
    if (!userForm.value.password) userForm.value.password = null;
    await api.User.modify(edittingUsername.value, { ...userForm.value });
    execute();
    userForm.value = { ...initialUserForm };
    edittingUsername.value = "";
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMsg.value = error.response.data.message;
    } else {
      errorMsg.value = t("admin.unknown-error-occurred");
    }
    throw error;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="tabs">
          <router-link
            v-for="tab in tabs"
            :key="tab.value"
            :class="['tab tab-bordered', $route.query.tab === tab.value && 'tab-active']"
            :to="`/admin?tab=${tab.value}`"
            >{{ tab.text }}</router-link
          >
        </div>

        <div class="my-4" />

        <div class="mb-4 flex items-center gap-x-4">
          <input
            v-model="searchName"
            :placeholder="$t('admin.user.search-name')"
            type="text"
            class="input-bordered input"
          />

          <select v-model="searchRole" class="select-bordered select">
            <option :value="null">{{ $t("admin.user.select-role") }}</option>
            <option :value="0">{{ $t("admin.user.admin") }}</option>
            <option :value="1">{{ $t("admin.user.teacher") }}</option>
            <option :value="2">{{ $t("admin.user.student") }}</option>
          </select>

          <span>{{ $t("admin.user.row-count", { n: filteredUsers?.length }) }}</span>
        </div>

        <data-status-wrapper :error="fetchError" :is-loading="fetchLoading">
          <template #loading>
            <skeleton-table :col="3" :row="5" />
          </template>
          <template #data>
            <table class="table-compact table w-full">
              <thead>
                <tr>
                  <th>{{ $t("admin.user.username") }}</th>
                  <th>{{ $t("admin.user.display-name") }}</th>
                  <th>{{ $t("admin.user.role") }}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="{ username, displayedName, role } in filteredUsers" :key="username" class="hover">
                  <td>{{ username }}</td>
                  <td>{{ displayedName }}</td>
                  <td>{{ ROLE[role] }}</td>
                  <td>
                    <div class="btn-ghost btn-sm btn-circle btn" @click="() => editUser(username)">
                      <i-uil-pen />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </data-status-wrapper>

        <ui-dialog :modelValue="!!edittingUsername">
          <template #title> {{ $t("admin.user.editing", { user: edittingUsername }) }}</template>
          <template #content>
            <div v-if="errorMsg" class="alert alert-error shadow-lg">
              <div>
                <i-uil-times-circle />
                <span>{{ errorMsg }}</span>
              </div>
            </div>

            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">{{ $t("admin.user.username") }}</span>
              </label>
              <input
                :value="edittingUsername"
                type="text"
                disabled
                class="input-bordered input disabled w-full max-w-xs"
              />
            </div>

            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">{{ $t("admin.user.display-name") }}</span>
              </label>
              <input
                v-model="v$.displayedName.$model"
                type="text"
                :class="['input-bordered input w-full max-w-xs', v$.displayedName.$error && 'input-error']"
              />
              <label class="label" v-show="v$.displayedName.$error">
                <span class="label-text-alt text-error" v-text="v$.displayedName.$errors[0]?.$message" />
              </label>
            </div>

            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">{{ $t("admin.user.role") }}</span>
              </label>
              <select v-model="v$.role.$model" class="select-bordered select w-full max-w-xs">
                <option :value="0">{{ $t("admin.user.admin") }}</option>
                <option :value="1">{{ $t("admin.user.teacher") }}</option>
                <option :value="2">{{ $t("admin.user.student") }}</option>
              </select>
            </div>

            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">{{ $t("admin.user.password") }}</span>
              </label>
              <input
                v-model="v$.password.$model"
                type="password"
                :class="['input-bordered input w-full max-w-xs', v$.password.$error && 'input-error']"
              />
              <label class="label">
                <span :class="['label-text-alt', v$.password.$error && 'text-error']">
                  {{ v$.password.$error ? v$.password.$errors[0]?.$message : $t("admin.user.pwHint") }}
                </span>
              </label>
            </div>

            <div class="mt-8 flex justify-between">
              <button :class="['btn-success btn', isLoading && 'loading']" @click="submit">
                <i-uil-file-upload-alt class="mr-1 lg:h-5 lg:w-5" /> {{ $t("admin.user.submit") }}
              </button>
              <button :class="['btn-ghost btn']" @click="edittingUsername = ''">
                {{ $t("admin.user.cancel") }}
              </button>
            </div>
          </template>
        </ui-dialog>
      </div>
    </div>
  </div>
</template>
