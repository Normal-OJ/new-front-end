<script setup lang="ts">
import { useSession } from "../stores/session";
import { formatTime } from "../utils/formatTime";
import { useAxios } from "@vueuse/integrations/useAxios";
import { fetcher } from "../models/api";

const session = useSession();

const { data: posts, error, isLoading } = useAxios<PostList>("/ann", fetcher);
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title mb-3">Announcement</div>
        <div class="my-2" />
        <div v-if="error" class="alert alert-error shadow-lg">
          <div>
            <i-uil-times-circle />
            <span>Oops! Something went wrong when loading announcements.</span>
          </div>
        </div>
        <skeleton-table v-else-if="isLoading" :col="3" :row="5" />
        <table v-else class="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Create At</th>
              <th v-if="session.isAdmin"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="{ title, createTime, annId } in posts" :key="annId" class="hover">
              <td>
                <router-link :to="`/announcements/${annId}`" class="link-hover link">
                  {{ title }}
                </router-link>
              </td>
              <td>{{ formatTime(createTime) }}</td>
              <td v-if="session.isAdmin">
                <div class="tooltip" data-tip="Edit">
                  <router-link
                    class="btn-ghost btn-sm btn-circle btn"
                    :to="`/course/Public/announcements/${annId}/edit`"
                  >
                    <i-uil-edit class="lg:h-5 lg:w-5" />
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>