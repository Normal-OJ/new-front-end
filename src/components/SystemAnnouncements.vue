<script setup lang="ts">
import { useSession } from "@/stores/session";
import { formatTime } from "@/utils/formatTime";
import { useAxios } from "@vueuse/integrations/useAxios";
import { fetcher } from "@/models/api";
import { useI18n } from "vue-i18n";

const session = useSession();
const { t, locale } = useI18n();

const { data: announcements, error, isLoading } = useAxios<AnnouncementList>("/ann", fetcher);
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title mb-3">{{ t("index.ann") }}</div>
        <div class="my-2" />

        <data-status-wrapper :error="error" :is-loading="isLoading">
          <template #loading>
            <skeleton-table :col="3" :row="5" />
          </template>
          <template #data>
            <table class="table w-full">
              <thead>
                <tr>
                  <th>{{ t("index.title") }}</th>
                  <th>{{ t("index.create_t") }}</th>
                  <th v-if="session.isAdmin"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="{ title, createTime, annId } in announcements" :key="annId" class="hover">
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
          </template>
        </data-status-wrapper>
      </div>
    </div>
  </div>
</template>
