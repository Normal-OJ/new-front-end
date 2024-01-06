<script setup lang="ts">
import { defineProps } from "vue";
interface Props {
  id: number;
  problemName: string;
  unlimitedQuota: boolean;
  quotaRemaining: number;
  quotaLimit: number;
  tags: string[];
  visible: ProblemStatus;
  isAdmin: boolean;
}
defineProps<Props>();
</script>

<template>
  <div class="collapse-arrow rounded-box collapse bg-base-200">
    <input type="checkbox" class="peer" />
    <div class="collapse-title bg-base-200 text-base">
      <div class="flex flex-col">
        <span class="text-lg font-bold">{{ problemName }}</span>
        <span class="text-sm font-light"> ID: {{ id }}</span>
      </div>
    </div>
    <div class="collapse-content flex flex-col gap-2 bg-base-300">
      <div class="mt-3 flex flex-col">
        <div class="flex gap-1">
          <div v-for="tag in tags" :key="tag" class="badge-info badge">
            {{ tag }}
          </div>
        </div>
      </div>
      <div class="stats stats-vertical text-lg shadow">
        <div class="stat">
          <div class="stat-figure text-base-content">
            <i-uil-bolt class="h-6 w-6" />
          </div>
          <div class="stat-title text-sm">Quotas</div>
          <div class="stat-value text-lg">
            <template v-if="unlimitedQuota">
              {{ $t("components.problem.card.unlimited") }}
            </template>
            <template v-else> {{ quotaRemaining }} / {{ quotaLimit }} </template>
          </div>
        </div>
        <div v-if="isAdmin" class="stat">
          <div class="stat-figure text-base-content">
            <i-uil-eye class="h-6 w-6" />
          </div>
          <div class="stat-title text-sm">Visibility</div>
          <div class="stat-value text-lg">
            {{ visible === 0 ? "Public" : "Hidden" }}
          </div>
        </div>
        <div v-if="isAdmin" class="stat">
          <div class="stat-figure text-base-content">
            <i-uil-monitor class="h-6 w-6" />
          </div>
          <div class="stat-title text-sm">Admin Control</div>
          <div class="stat-value text-lg">
            <div class="tooltip" data-tip="Stats">
              <router-link
                class="btn btn-ghost btn-sm btn-circle mr-1"
                :to="`/course/${$route.params.name}/problem/${id}/stats`"
              >
                <i-uil-chart-line class="lg:h-5 lg:w-5" />
              </router-link>
            </div>
            <div class="tooltip" data-tip="Copycat">
              <router-link
                class="btn btn-ghost btn-sm btn-circle mr-1"
                :to="`/course/${$route.params.name}/problem/${id}/copycat`"
              >
                <i-uil-file-exclamation-alt class="lg:h-5 lg:w-5" />
              </router-link>
            </div>
            <div class="tooltip" data-tip="Edit">
              <router-link
                class="btn btn-ghost btn-sm btn-circle"
                :to="`/course/${$route.params.name}/problem/${id}/edit`"
              >
                <i-uil-edit class="lg:h-5 lg:w-5" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="grow">
        <button class="btn btn-primary btn-sm">
          <router-link :to="`/course/${$route.params.name}/problem/${id}`"> View Problem </router-link>
        </button>
      </div>
    </div>
  </div>
</template>
