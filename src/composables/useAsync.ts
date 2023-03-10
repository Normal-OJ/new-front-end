import { useAsyncState } from "@vueuse/core";
import axios from "axios";
import { computed } from "vue";

export function useAsync<T>(promise: Promise<T> | ((...args: any[]) => Promise<T>)) {
  const { state, isLoading, execute, error } = useAsyncState(promise, null, {
    immediate: false,
  });

  const errorMsg = computed(() => {
    if (!error.value) return null;
    else if (axios.isAxiosError(error.value) && error.value.response?.data?.message) {
      return error.value.response.data.message;
    } else {
      return "Unknown error occurred :(";
    }
  });

  return {
    state,
    isLoading,
    execute,
    errorMsg,
  };
}
