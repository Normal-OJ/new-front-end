<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: number;
  maxPage: number;
  radius?: number;
}
const props = withDefaults(defineProps<Props>(), {
  radius: 2,
});
const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const leftTruncated = computed(() => {
  return props.modelValue - props.radius - 1 > 2;
});
const rightTruncated = computed(() => {
  return props.maxPage - (props.modelValue + props.radius) > 2;
});
const pages = computed(() => {
  const l = leftTruncated.value ? props.modelValue - props.radius : 1;
  const r = rightTruncated.value ? props.modelValue + props.radius : props.maxPage;
  return Array.from({ length: r - l + 1 }, (_, i) => i + l);
});

function navigateTo(page: number) {
  emit("update:modelValue", page);
}
</script>

<template>
  <div class="btn-group">
    <button :class="['btn', { 'btn-disabled': modelValue === 1 }]" @click="navigateTo(modelValue - 1)">
      «
    </button>
    <template v-if="leftTruncated">
      <button class="btn" @click="navigateTo(1)">1</button>
      <button class="btn-disabled btn">...</button>
    </template>

    <template v-for="p in pages">
      <button :class="['btn', modelValue === p && 'btn-info']" @click="navigateTo(p)">
        {{ p }}
      </button>
    </template>

    <template v-if="rightTruncated">
      <button class="btn-disabled btn">...</button>
      <button class="btn" @click="navigateTo(maxPage)">{{ maxPage }}</button>
    </template>
    <button
      :class="['btn', { 'btn-disabled': modelValue === maxPage }]"
      @click="navigateTo(props.modelValue + 1)"
    >
      »
    </button>
  </div>
</template>
