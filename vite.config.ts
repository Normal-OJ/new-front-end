import * as path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pages(),
    Components({
      dts: "./src/auto/components.d.ts",
      resolvers: [IconsResolver()],
    }),
    Icons(),
  ],
  server: {
    proxy: {
      "/api": {
        target: process.env.NODE_ENV === "test" ? "https://dev.noj.tw" : "https://api.noj.tw",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
