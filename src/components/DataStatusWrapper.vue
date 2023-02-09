<script setup lang="ts">
import { AxiosError } from "axios";

defineProps<{
  error?: AxiosError;
  isLoading?: boolean;
}>();
</script>

<template>
  <slot v-if="error" name="error">
    <div class="alert alert-error shadow-lg">
      <div>
        <i-uil-times-circle />
        <div class="flex flex-col">
          <span>Oops! Something went wrong, please refresh the page to try again.</span>
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </slot>
  <slot v-else-if="isLoading" name="loading">
    <ui-spinner />
  </slot>
  <slot v-else name="data"> </slot>
</template>
