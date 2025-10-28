<script setup lang="ts">
import { ref, computed } from "vue";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useRoute } from "vue-router";
import { fetcher } from "@/models/api";
import { useTitle } from "@vueuse/core";
import TestPanel from "@/components/testpanel/TestPanel.vue";

const route = useRoute();
const { id, name } = route.params as { id: string; name: string };

// 取得題目資料
const { data: problem, error, isLoading } = useAxios<any>(
  `/problem/view/${id}`,
  fetcher
);

const p = computed(() => {
  const v: any = problem.value;
  if (!v) return null;
  if (v.data?.description || v.data?.problemName) return v.data;
  if (v.problem?.description || v.problem?.problemName) return v.problem;
  return v;
});

// 題目標題
const problemTitle = computed(
  () => p.value?.problemName ?? p.value?.title ?? name ?? ""
);

// sampleInput / sampleOutput
const examples = computed(() => {
  const si: string[] = p.value?.description?.sampleInput ?? [];
  const so: string[] = p.value?.description?.sampleOutput ?? [];
  const n = Math.max(si.length, so.length);
  return Array.from({ length: n }, (_, i) => ({
    input: si[i] ?? "",
    output: so[i] ?? "",
  }));
});

// <title>
useTitle(computed(() => `Submit - ${id} - ${problemTitle.value} | Normal OJ`));

// 窄螢幕抽屜
const drawerOpen = ref(false);


function onRun(_payload: { mode: "sample" | "custom"; lang: string }) {}
function onSubmit() {}
function onChangeLang(_lang: string) {}
</script>

<template>
  <div class="card-container pb-40">
    <data-status-wrapper :is-loading="isLoading" :error="error">
      <!-- Loading -->
      <template #loading>
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-4">
          <h1 class="text-3xl font-semibold mt-6 mb-2 lg:col-span-2">
            Submit to Problem #{{ id }}
          </h1>
          <div><skeleton-card /></div>
          <div>
            <div class="animate-pulse space-y-3 bg-base-200 rounded-xl p-4 shadow">
              <div class="h-4 bg-gray-300 rounded w-1/3"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3"></div>
              <div class="h-56 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </template>

      <!-- Error -->
      <template #error>
        <div class="bg-base-200 rounded-xl shadow p-8 text-center space-y-2">
          <div class="text-3xl">⚠️</div>
          <h3 class="text-lg font-semibold">載入失敗</h3>
          <p class="opacity-70">請稍後再試，或重新整理頁面。</p>
        </div>
      </template>

      <!-- Empty -->
      <template #empty>
        <div class="bg-base-200 rounded-xl shadow p-8 text-center space-y-2">
          <div class="text-3xl">📭</div>
          <h3 class="text-lg font-semibold">沒有資料</h3>
          <p class="opacity-70">這個題目目前沒有敘述可顯示。</p>
        </div>
      </template>

      <!-- Data -->
      <template #data>
        <div
          v-if="!p"
          class="bg-base-200 rounded-xl shadow p-8 text-center space-y-2"
        >
          <div class="text-3xl">📭</div>
          <h3 class="text-lg font-semibold">沒有資料</h3>
          <p class="opacity-70">這個題目目前沒有敘述可顯示。</p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-4 relative">
          <!-- 頁面標題 -->
          <h1 class="text-3xl font-semibold mt-6 mb-2 ml-4 lg:col-span-2">
            Submit to Problem #{{ id }} - {{ problemTitle }}
          </h1>

          <!-- Problem卡片 -->
          <div class="bg-base-200 rounded-xl shadow p-4">
            <!-- 標題列 + 分隔線 -->
            <div class="flex items-center justify-between mb-3 pb-2 border-b border-base-content/20">
              <h2 class="text-xl font-semibold">Problem</h2>
              <!-- TestPanel 按鈕 -->
              <button class="btn btn-sm btn-primary lg:hidden" @click="drawerOpen = true">
                TestPanel
              </button>
            </div>

            <!-- Description / Input / Output -->
            <div id="problem-scroll" class="overflow-y-auto pr-2 max-h-[50vh] space-y-4">
              <section>
                <h3 class="font-semibold mb-1">Description</h3>
                <p class="opacity-80 whitespace-pre-wrap">
                  {{ p?.description?.description || "—" }}
                </p>
              </section>

              <section>
                <h3 class="font-semibold mb-1">Input</h3>
                <p class="opacity-80 whitespace-pre-wrap">
                  {{ p?.description?.input || "—" }}
                </p>
              </section>

              <section>
                <h3 class="font-semibold mb-1">Output</h3>
                <p class="opacity-80 whitespace-pre-wrap">
                  {{ p?.description?.output || "—" }}
                </p>
              </section>
            </div>

            <!-- 固定區：Examples -->
            <section class="mt-4">
              <h3 class="font-semibold mb-2">
                {{ examples.length > 1 ? 'Examples' : 'Example' }}
              </h3>

              <div v-if="examples.length" class="space-y-4">
                <!-- 每組 Example -->
                <div
                  v-for="(ex, idx) in examples"
                  :key="idx"
                  class="bg-base-100 rounded-xl p-4 shadow"
                >
                  <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
                    <!-- Input -->
                    <div>
                      <div class="text-sm font-semibold mb-1">
                        Input {{ examples.length > 1 ? `#${idx + 1}` : '' }}
                      </div>
                      <pre class="bg-base-200 rounded p-2 text-sm whitespace-pre-wrap min-h-[5rem]">
{{ ex.input || '—' }}
                      </pre>
                    </div>

                    <!-- 分隔線（桌機顯示） -->
                    <div class="hidden md:block w-px bg-base-300/40"></div>

                    <!-- Output -->
                    <div>
                      <div class="text-sm font-semibold mb-1">
                        Output {{ examples.length > 1 ? `#${idx + 1}` : '' }}
                      </div>
                      <pre class="bg-base-200 rounded p-2 text-sm whitespace-pre-wrap min-h-[5rem]">
{{ ex.output || '—' }}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <p v-else class="opacity-60">—</p>
            </section>
          </div>

          <!-- 右：試跑面板 -->
          <div class="hidden lg:block">
            <TestPanel
              @click:run="onRun"
              @click:submit="onSubmit"
              @change:lang="onChangeLang"
            />
          </div>
        </div>

        <!-- 窄螢幕抽屜 -->
        <transition name="fade">
          <div
            v-if="drawerOpen"
            class="fixed inset-0 z-50 lg:hidden"
            aria-modal="true"
            role="dialog"
          >
            <div class="absolute inset-0 bg-black/40" @click="drawerOpen = false"></div>

            <div
              class="absolute right-0 top-0 h-full w-full sm:w-[90vw] md:w-[720px] bg-base-200 shadow-xl
                     flex flex-col transition-transform duration-200 ease-out overflow-y-auto"
            >
              <div class="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200 z-10">
                <h3 class="font-semibold">Test Panel</h3>
                <button class="btn btn-ghost btn-sm" @click="drawerOpen = false">✕</button>
              </div>

              <div class="p-4">
                <TestPanel
                  @click:run="onRun"
                  @click:submit="onSubmit"
                  @change:lang="onChangeLang"
                />
              </div>
            </div>
          </div>
        </transition>
      </template>
    </data-status-wrapper>
  </div>
</template>

<style scoped>
/* Problem 上半段的捲動條 */
#problem-scroll::-webkit-scrollbar { width: 8px; }
#problem-scroll::-webkit-scrollbar-thumb {
  background-color: hsl(var(--bc) / 0.25);
  border-radius: 9999px;
}
#problem-scroll {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in oklab, CanvasText 25%, transparent) transparent;
}

/* 抽屜淡入淡出 */
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
</style>
