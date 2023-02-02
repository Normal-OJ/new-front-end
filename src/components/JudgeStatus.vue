<script setup lang="ts">
import { SUBMISSION_STATUS_REPR } from "@/constants";

interface Props {
  status: SubmissionStatusCodes;
}
defineProps<Props>();
</script>

<template>
  <span :style="{ color: SUBMISSION_STATUS_REPR[status].color }">
    {{ SUBMISSION_STATUS_REPR[status].label }}
  </span>
</template>
