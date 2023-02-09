import { defineStore } from "pinia";

export const useTheme = defineStore("theme", {
  state: () => {
    return {
      isDark: false,
    };
  },
  actions: {
    setIsDark(val: boolean) {
      this.isDark = val;
    },
  },
});
