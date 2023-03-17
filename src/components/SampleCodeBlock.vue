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
  <div class="relative group">
    <pre class="rounded bg-zinc-800 py-2 px-4 text-white"><code>{{ code }}</code></pre>
    <button v-if="isSupported" class="btn btn-info btn-xs absolute right-1 top-1 hidden group-hover:inline-block" @click="copy(code)">
      {{ copied ? "Copied!" : "Copy" }}
    </button>
  </div>
</template>
