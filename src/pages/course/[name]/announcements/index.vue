<script setup lang="ts">
import { useAxios } from "@vueuse/integrations/useAxios";
import { useRoute } from "vue-router";
import { fetcher } from "@/models/api";
import { formatTime } from "@/utils/formatTime";
import { useSession } from "@/stores/session";
import { useTitle } from "@vueuse/core";

const session = useSession();
const route = useRoute();

useTitle(`Announcements - ${route.params.name} | Normal OJ`);
const {
  data: announcements,
  error,
  isLoading,
} = useAxios<AnnouncementList>(`/course/${route.params.name}/ann`, fetcher);
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title justify-between">
          {{ $t("course.ann.index.title") }}
          <router-link
            v-if="session.isAdmin"
            class="btn-success btn"
            :to="`/course/${$route.params.name}/announcements/new`"
          >
            <i-uil-plus-circle class="mr-1 lg:h-5 lg:w-5" /> {{ $t("course.ann.index.new") }}
          </router-link>
        </div>

        <div class="my-2" />

        <data-status-wrapper :error="error" :is-loading="isLoading">
          <template #loading>
            <skeleton-table :col="3" :row="5" />
          </template>
          <template #data>
            <table class="table w-full">
              <thead>
                <tr>
                  <th>{{ $t("course.ann.index.table.title") }}</th>
                  <th>{{ $t("course.ann.index.table.author") }}</th>
                  <th>{{ $t("course.ann.index.table.time") }}</th>
                  <th v-if="session.isAdmin"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="{ title, creator, createTime, annId } in announcements" :key="annId" class="hover">
                  <td>
                    <router-link
                      :to="`/course/${$route.params.name}/announcements/${annId}`"
                      class="link-hover link"
                    >
                      {{ title }}
                    </router-link>
                  </td>
                  <td>{{ creator.displayedName }}</td>
                  <td>{{ formatTime(createTime) }}</td>
                  <td v-if="session.isAdmin">
                    <div class="tooltip" data-tip="Edit">
                      <router-link
                        class="btn btn-ghost btn-sm btn-circle"
                        :to="`/course/${$route.params.name}/announcements/${annId}/edit`"
                      >
                        <i-uil-edit class="lg:h-5 lg:w-5" />
                      </router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </data-status-wrapper>
      </div>
    </div>
  </div>
</template>
