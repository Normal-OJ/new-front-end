import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/router";
import "@/index.css";
import { createI18n } from "vue-i18n";
import { config as i18nConfig } from "@/i18n";
import "vue-prism-editor/dist/prismeditor.min.css";
import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.css";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

const app = createApp(App);
const i18n = createI18n(i18nConfig);

Sentry.init({
  app,
  environment: import.meta.env.MODE,
  dsn: "https://de0e8c6700ff429ba4122b05cc21d520@o876599.ingest.sentry.io/6271638",
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ["localhost", "v2.noj.tw", /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,
});

app.use(i18n).use(createPinia()).use(router).mount("#app");
