<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useRoute } from "vue-router";

// FIXME: this sucks
const route = useRoute();
const announcementsPage = { path: `/course/${route.params.name}/announcements`, text: "Announcements" };
const homeworksPage = { path: `/course/${route.params.name}/homeworks`, text: "Homeworks" };
const problemsPage = { path: `/course/${route.params.name}/problems`, text: "Problems" };
const submissionsPage = { path: `/course/${route.params.name}/submissions`, text: "Submissions" };
const membersPage = { path: `/course/${route.params.name}/members`, text: "Members" };
const items: ComputedRef<{ [k: string | symbol]: { path: null | string; text: string }[] }> = computed(
  () => ({
    "course-name-announcements": [{ path: null, text: "Announcements" }],
    "course-name-announcements-new": [announcementsPage, { path: null, text: "New" }],
    "course-name-announcements-id": [announcementsPage, { path: null, text: `${route.params.id}` }],
    "course-name-announcements-id-edit": [announcementsPage, { path: null, text: `Edit ${route.params.id}` }],
    "course-name-homeworks": [{ path: null, text: "Homeworks" }],
    "course-name-homeworks-new": [homeworksPage, { path: null, text: "New" }],
    "course-name-homeworks-id-edit": [homeworksPage, { path: null, text: `Edit ${route.params.id}` }],
    "course-name-homeworks-id-stats": [homeworksPage, { path: null, text: `Stats of ${route.params.id}` }],
    "course-name-problems": [{ path: null, text: "Problems" }],
    "course-name-problems-new": [problemsPage, { path: null, text: "New Problem" }],
    "course-name-problem-id": [problemsPage, { path: null, text: `${route.params.id}` }],
    "course-name-problem-id-edit": [problemsPage, { path: null, text: `Edit ${route.params.id}` }],
    "course-name-problem-id-stats": [
      problemsPage,
      {
        path: `/course/${route.params.name}/problem/${route.params.id}`,
        text: `${route.params.id}`,
      },
      { path: null, text: "Stats" },
    ],
    "course-name-problem-id-submit": [
      problemsPage,
      {
        path: `/course/${route.params.name}/problem/${route.params.id}`,
        text: `${route.params.id}`,
      },
      { path: null, text: "Submit" },
    ],
    "course-name-submissions": [{ path: null, text: "Submissions" }],
    "course-name-submission-id": [submissionsPage, { path: null, text: `${route.params.id}` }],
    "course-name-members": [{ path: null, text: "Members" }],
  }),
);
</script>

<template>
  <div class="navbar min-h-[2rem] border-b border-gray-600 px-6">
    <div class="breadcrumbs flex-1 text-sm">
      <ul>
        <li>
          <router-link :to="`/course/${route.params.name}`">{{ route.params.name }}</router-link>
        </li>
        <template v-if="route.name">
          <li v-for="{ path, text } in items[route.name]" :key="text">
            <a v-if="path" :href="path">{{ text }}</a>
            <span v-else>{{ text }}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
