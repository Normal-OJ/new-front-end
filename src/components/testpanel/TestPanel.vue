<template>
  <div class="flex flex-col h-full bg-base-200 rounded-xl shadow-md overflow-hidden">
    <!-- Header -->
    <div
      class="flex items-center gap-2 md:gap-3 px-4 py-2 bg-base-300 border-b border-base-content/10
             flex-wrap md:flex-nowrap overflow-x-auto"
      @keydown="onTabKeydown"
    >
      <h2 class="font-semibold text-base mr-1 shrink-0">Code</h2>

      <!-- Tabs (Sample / Custom) -->
      <div
        class="inline-flex rounded-lg bg-base-200/60 p-1 shrink-0"
        role="tablist"
        aria-label="Run mode"
      >
        <button
          v-for="(t, i) in tabs"
          :key="t.value"
          ref="tabRefs"
          role="tab"
          type="button"
          class="px-2.5 py-1 text-sm rounded-md focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-300
                 transition-colors"
          :class="t.value === mode
            ? 'bg-primary text-primary-content'
            : 'hover:bg-base-200'"
          :tabindex="i === activeIndex ? 0 : -1"
          :aria-selected="t.value === mode"
          @click="setMode(t.value)"
        >
          {{ t.label }}
        </button>
      </div>

      <!--（Language / RUN / SUBMIT） -->
      <div class="ml-auto flex items-center gap-2 shrink-0">
        <select
          v-model="lang"
          class="select select-sm select-bordered focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-300"
          @change="$emit('change:lang', lang)"
        >
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
        </select>

        <button
          class="btn btn-sm btn-success focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-300"
          :disabled="loading"
          @click="runCode"
        >
          RUN
        </button>

        <button
          class="btn btn-sm btn-warning text-base-100 focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-300"
          :disabled="loading"
          @click="submitCode"
        >
          SUBMIT
        </button>
      </div>
    </div>

    <!-- 編輯區 -->
    <div class="border-b border-base-content/10 bg-base-100">
      <div class="h-80 lg:h-96 overflow-hidden">
        <div class="flex h-full">
          <!-- 行號 -->
          <div
            ref="gutterWrapEl"
            class="bg-base-300/30 text-right px-3 py-2 select-none min-w-[3.25rem]
                   border-r border-base-300 overflow-y-auto"
          >
            <pre class="m-0 leading-6 font-mono text-sm tabular-nums">{{ lineNumbers }}</pre>
          </div>

          <!-- editor -->
          <div class="flex-1">
            <textarea
              ref="editorEl"
              v-model="code"
              @scroll="syncScroll"
              class="textarea textarea-ghost w-full h-full font-mono text-sm leading-6
                     bg-base-100 hover:bg-base-200 transition-colors resize-none
                     focus:outline-none"
              spellcheck="false"
              placeholder="Paste your code here"
              style="tab-size: 2;"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Sample/Custom -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-base-100">
      <div
        class="border border-base-content/10 rounded-lg p-2"
        :class="mode === 'sample' ? 'opacity-50 pointer-events-none' : ''"
        aria-disabled="mode === 'sample'"
      >
        <p class="text-xs font-semibold opacity-70 mb-1">Input</p>
        <textarea
          v-model="input"
          class="w-full min-h-[5rem] p-2 text-xs resize-none bg-transparent outline-none
                 focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          spellcheck="false"
          :placeholder="mode === 'sample' ? 'Sample 模式不需輸入' : '(optional) custom input'"
        ></textarea>
      </div>

      <div class="border border-base-content/10 rounded-lg p-2">
        <p class="text-xs font-semibold opacity-70 mb-1">Output</p>
        <div class="text-xs whitespace-pre-wrap break-words min-h-[5rem] p-2 bg-base-200 rounded">
          {{ output || "—" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'

/** ----- Tabs (Sample / Custom) + A11y ----- */
type Mode = 'sample' | 'custom'
const tabs = [
  { value: 'sample' as Mode, label: 'Sample' },
  { value: 'custom' as Mode, label: 'Custom' },
]
const mode = ref<Mode>('sample')
const activeIndex = computed(() => tabs.findIndex(t => t.value === mode.value))
const tabRefs = ref<HTMLButtonElement[]>([])

function setMode(m: Mode) {
  mode.value = m
  nextTick(() => tabRefs.value[activeIndex.value]?.focus())
}

// Home / End / Tab & Shift+Tab
function onTabKeydown(e: KeyboardEvent) {
  const keys = ['ArrowLeft','ArrowRight','Home','End','Tab']
  if (!keys.includes(e.key)) return
  e.preventDefault()
  const count = tabs.length
  let idx = activeIndex.value
  if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) idx = (idx + 1) % count
  if (e.key === 'ArrowLeft'  || (e.key === 'Tab' && e.shiftKey))  idx = (idx - 1 + count) % count
  if (e.key === 'Home') idx = 0
  if (e.key === 'End')  idx = count - 1
  setMode(tabs[idx].value)
}

/** ----- 語言、編輯器、行號 ----- */
const lang = ref<'c' | 'cpp' | 'py' | 'java'>('cpp')
const code = ref<string>(
`class Solution {
public:
  // your code...
};`
)
const input = ref('')
const output = ref('')
const loading = ref(false)

const editorEl = ref<HTMLTextAreaElement | null>(null)
const gutterWrapEl = ref<HTMLDivElement | null>(null)

const lineCount = computed(() => (code.value.split('\n').length || 1))
const lineNumbers = computed(() =>
  Array.from({ length: lineCount.value }, (_, i) => i + 1).join('\n')
)

function syncScroll() {
  if (editorEl.value && gutterWrapEl.value) {
    gutterWrapEl.value.scrollTop = editorEl.value.scrollTop
  }
}
watch(code, () => requestAnimationFrame(syncScroll))
onMounted(syncScroll)

/** -----  Run / Submit ----- */
function runCode() {
  loading.value = true
  output.value = ''
  setTimeout(() => {
    output.value = mode.value === 'sample'
      ? 'Sample 執行結果\nstdout: ...\nstderr: —'
      : 'Custom 執行結果\nstdout: ...\nstderr: —'
    loading.value = false
  }, 600)
}
function submitCode() {
  alert(`已提交（${mode.value.toUpperCase()}）— 模擬`)
}
</script>

<style scoped>
.textarea.textarea-ghost {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
</style>
