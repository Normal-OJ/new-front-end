<script setup lang="ts">
import { useAxios } from "@vueuse/integrations/useAxios";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api, { fetcher } from "@/models/api";
import { ROLE } from "@/constants";
import { useTitle } from "@vueuse/core";
import { useSession, UserRole } from "@/stores/session";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const session = useSession();
useTitle(`Members - ${route.params.name} | Normal OJ`);
enum MemberTableColumn {
  USERNAME = "username",
  DISPLAYED_NAME = "displayedName",
  ROLE = "role",
}
const sortBy = ref<MemberTableColumn>(
  Object.values(MemberTableColumn).includes(route.query.sort as MemberTableColumn)
    ? (route.query.sort as MemberTableColumn)
    : MemberTableColumn.USERNAME,
);
watch(sortBy, () => {
  router.replace({ query: { sort: sortBy.value || MemberTableColumn.USERNAME } });
});
const { data, error, isLoading } = useAxios<Course>(`/course/${route.params.name}`, fetcher);
const members = computed(() => {
  if (!data.value) return [];
  return [data.value.teacher, ...data.value.students, ...data.value.TAs].sort((a, b) => {
    if (sortBy.value === "username") {
      return a.username.localeCompare(b.username);
    } else if (sortBy.value === "displayedName") {
      return a.displayedName.localeCompare(b.displayedName);
    } else {
      return a.role - b.role;
    }
  });
});

const rolesCanCreateCourse = [UserRole.Admin, UserRole.Teacher];

const isOpen = ref(false);
const newMembers = ref<File | null>();
const newMembersCSVString = ref("");
const forceUpdate = ref(false);
const isProcessingSignup = ref(false);
const errorMsg = ref("");
const previewCSV = ref<{ headers?: string[]; body?: string[][] }>({});
watch(newMembers, () => {
  if (!newMembers.value) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    if (typeof evt.target?.result !== "string") return;
    newMembersCSVString.value = evt.target?.result;
    const rows = newMembersCSVString.value.split("\n");
    previewCSV.value.headers = rows[0].split(",");
    previewCSV.value.body = rows.slice(1).map((r) => r.split(","));
  };
  reader.readAsText(newMembers.value);
});
async function submit() {
  if (!newMembersCSVString.value) return;
  isProcessingSignup.value = true;
  try {
    await api.Auth.batchSignup({
      newUsers: newMembersCSVString.value,
      force: forceUpdate.value,
      course: route.params.name as string,
    });
    router.go(0);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMsg.value = error.response.data.message;
    } else {
      errorMsg.value = "Unknown error occurred :(";
    }
    throw error;
  } finally {
    isProcessingSignup.value = false;
  }
}
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title">
          {{ $t("course.members.title") }}
          <span v-if="data" class="text-sm opacity-70">({{ members.length }})</span>

          <div class="flex-1" />

          <label v-if="rolesCanCreateCourse.includes(session.role)" for="my-modal" class="btn-success btn">
            <i-uil-plus-circle class="mr-1 lg:h-5 lg:w-5" /> {{ $t("course.members.new") }}
          </label>
        </div>

        <div class="mb-4">
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">{{ $t("course.members.sortBy") }}</span>
            </label>
            <select v-model="sortBy" class="select-bordered select w-full max-w-xs">
              <option :value="MemberTableColumn.USERNAME">Username</option>
              <option :value="MemberTableColumn.DISPLAYED_NAME">Display Name</option>
              <option :value="MemberTableColumn.ROLE">Role</option>
            </select>
          </div>
        </div>
        <data-status-wrapper :error="error" :is-loading="isLoading">
          <template #loading>
            <skeleton-table :col="3" :row="5" />
          </template>
          <template #data>
            <table class="table w-full">
              <thead>
                <tr>
                  <th>username</th>
                  <th>display name</th>
                  <th>role</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="{ username, displayedName, role } in members" :key="username" class="hover">
                  <td>{{ username }}</td>
                  <td>{{ displayedName }}</td>
                  <td>{{ ROLE[role] }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </data-status-wrapper>
      </div>
    </div>

    <input v-model="isOpen" type="checkbox" id="my-modal" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box">
        <div>
          {{ $t("course.members.csvUploadHint.header") }}
          <ul class="ml-4 list-disc">
            <li v-for="h in ['username', 'email', 'password']">
              <code>{{ h }}</code>
            </li>
            <li v-for="h in ['displayedName', 'role']">
              <code>{{ h }}</code> (optional)
            </li>
          </ul>
        </div>
        <div>
          {{ $t("course.members.csvUploadHint.content") }}
        </div>

        <div class="mt-2 font-bold">
          {{ $t("course.members.csvUploadHint.caution") }}
        </div>

        <div class="my-4" />

        <div class="alert alert-error shadow-lg" v-if="errorMsg">
          <div>
            <i-uil-times-circle />
            <span>{{ errorMsg }}</span>
          </div>
        </div>

        <div class="form-control my-4">
          <label class="label cursor-pointer">
            <span class="label-text">{{ $t("course.members.forceUpdate") }}</span>
            <input type="checkbox" class="checkbox-primary checkbox" v-model="forceUpdate" />
          </label>
        </div>

        <template v-if="!newMembers">
          <input
            type="file"
            id="file-uploader"
            accept=".csv"
            @change="newMembers = ($event.target as HTMLInputElement).files?.[0]"
          />
        </template>
        <template v-else>
          <table class="table-auto">
            <thead>
              <tr v-if="previewCSV.headers">
                <th v-for="h in previewCSV.headers">{{ h }}</th>
              </tr>
            </thead>
            <tbody v-if="previewCSV.body">
              <tr v-for="r in previewCSV.body">
                <td v-for="c in r">
                  {{ c }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex">
            <button class="btn btn-sm" @click="newMembers = null">
              <i-uil-times />
            </button>
          </div>
        </template>
        <div class="modal-action">
          <label for="my-modal" class="btn btn-ghost">{{ $t("course.members.cancel") }}</label>
          <div :class="['btn-success btn ml-3', isProcessingSignup && 'loading']" @click="submit">
            {{ $t("course.members.submit") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
