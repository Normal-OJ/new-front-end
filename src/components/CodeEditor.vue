<script setup lang="ts">
import { PrismEditor } from "vue-prism-editor";
import hljs from "highlight.js";

interface Props {
  value?: string;
  readonly?: boolean;
}
withDefaults(defineProps<Props>(), {
  value: "",
  readonly: false,
});

defineEmits(["input"]);

const highlighter = (code: string) => {
  return hljs.highlightAuto(code, ["c", "cpp", "python"]).value;
};
</script>

<template>
  <prism-editor
    class="rounded bg-zinc-800 py-4 px-2 font-mono text-gray-300"
    :value="value"
    :tabSize="4"
    :highlight="highlighter"
    :readonly="readonly"
    line-numbers
    @input="$emit('input', $event)"
  />
</template>

<style>
.prism-editor__editor {
  white-space: pre !important;
  width: 0px !important;
  tab-size: 4 !important;
}
.prism-editor__container {
  overflow-x: scroll !important;
  tab-size: 4;
}
</style>
