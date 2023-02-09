<script setup lang="ts">
import dayjs from "dayjs";
import { ref, reactive } from "vue";
import { useTitle } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import api from "@/models/api";
import axios from "axios";
import AnnouncementForm from "@/components/Announcement/AnnouncementForm.vue";

const route = useRoute();
const router = useRouter();
useTitle(`New Announcement - ${route.params.name} | Normal OJ`);

const formElement = ref<InstanceType<typeof AnnouncementForm>>();

const newAnnouncement = reactive<AnnouncementForm>({
  title: "",
  markdown: `_Markdown_ & $\\text{katex}$ are supported.\n![](https://64.media.tumblr.com/2e2d5f1e4f0667c181c3afa9ef8cca1b/tumblr_mu4kbwQ0eY1qki7dgo1_500.gifv)`,
  pinned: false,
});

function update<K extends keyof AnnouncementForm>(key: K, value: AnnouncementForm[K]) {
  newAnnouncement[key] = value;
}

const openPreview = ref<boolean>(false);
const mockAnnouncementMeta = {
  creator: { displayedName: "Ijichi Nijika" },
  createTime: dayjs().unix(),
  updateTime: dayjs().unix(),
};

async function submit() {
  if (!formElement.value) return;

  formElement.value.isLoading = true;
  try {
    const { annId } = (
      await api.Announcement.create({
        ...newAnnouncement,
        courseName: route.params.name as string,
      })
    ).data;
    router.push(`/course/${route.params.name}/announcements/${annId}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      formElement.value.errorMsg = error.response.data.message;
    } else {
      formElement.value.errorMsg = "Unknown error occurred :(";
    }
    throw error;
  } finally {
    formElement.value.isLoading = false;
  }
}
</script>

<template>
  <div class="card-container">
    <div class="card min-w-full">
      <div class="card-body">
        <div class="card-title mb-3">New Announcement</div>

        <announcement-form :value="newAnnouncement" ref="formElement" @update="update" @submit="submit" />

        <div class="divider" />

        <div class="card-title mb-3">
          Preview
          <input v-model="openPreview" type="checkbox" class="toggle" />
        </div>

        <announcement-card
          v-show="openPreview"
          :announcement="{ ...mockAnnouncementMeta, ...newAnnouncement }"
          class="rounded border-2 border-slate-300"
        />
      </div>
    </div>
  </div>
</template>
