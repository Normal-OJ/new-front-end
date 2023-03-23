<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios";
import { fetcher } from "@/models/api";
import { useSession, UserRole } from "@/stores/session";

useTitle("Courses | Normal OJ");
const { data: courses, error, isLoading } = useAxios<CourseList>("/course", fetcher);

const session = useSession();
const rolesCanCreateCourse = [UserRole.Admin, UserRole.Teacher];
</script>

<template>
  <div class="card mx-auto max-w-5xl shadow-xl">
    <div class="card-body">
      <div class="card-title justify-between">
        {{ $t("courses.index.list") }}
        <router-link
          v-if="rolesCanCreateCourse.includes(session.role)"
          class="btn-success btn"
          to="/courses/new"
        >
          <i-uil-plus-circle class="mr-1 lg:h-5 lg:w-5" /> {{ $t("courses.index.new") }}
        </router-link>
      </div>

      <div class="my-2" />

      <data-status-wrapper :error="error" :is-loading="isLoading">
        <template #loading>
          <skeleton-table :col="2" :row="5" />
        </template>
        <template #data>
          <table class="table w-full">
            <thead>
              <tr>
                <th>{{ $t("courses.index.table.course") }}</th>
                <th>{{ $t("courses.index.table.teacher") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="{ course, teacher } in courses" :key="course" class="hover">
                <td>
                  <router-link :to="`/course/${course}`" class="link-hover link">{{ course }}</router-link>
                </td>
                <td>{{ teacher.username }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </data-status-wrapper>
    </div>
  </div>
</template>
