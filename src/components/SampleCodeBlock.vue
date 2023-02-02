<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

interface Props {
  code?: string;
}
withDefaults(defineProps<Props>(), {
  code: "",
});

const { copy, copied, isSupported } = useClipboard();
</script>

<template>
  <div class="relative">
    <pre class="rounded bg-zinc-800 py-2 px-4 text-white"><code>{{ code }}</code></pre>
    <button v-if="isSupported" class="btn-info btn-xs btn absolute right-1 top-1" @click="copy(code)">
      {{ copied ? "Copied!" : "Copy" }}
    </button>
  </div>
</template>
