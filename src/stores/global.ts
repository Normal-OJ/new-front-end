import { defineStore } from "pinia";
import { promiseTimeout } from "@vueuse/core";

export const useGlobal = defineStore("global", {
  state: () => {
    return {
      isServerError: false,
    };
  },
  actions: {
    async onServerError() {
      this.$state.isServerError = true;
      await promiseTimeout(2400);
      this.$state.isServerError = false;
    },
  },
});
