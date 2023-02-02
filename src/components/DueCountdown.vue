<script setup lang="ts">
import { ref } from "vue";

interface Props {
  due: number;
}

const props = defineProps<Props>();

const moreThan99Days = ref(false);
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

const updateRemainTime = () => {
  const now = Date.now();
  const remain = props.due * 1000 - now;
  if (remain <= 0) {
    moreThan99Days.value = false;
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
    return;
  }
  days.value = Math.floor(remain / (24 * 60 * 60 * 1000));
  if (days.value > 99) {
    moreThan99Days.value = true;
    days.value = 99;
  } else {
    moreThan99Days.value = false;
  }
  hours.value = Math.floor((remain % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  minutes.value = Math.floor((remain % (60 * 60 * 1000)) / (60 * 1000));
  seconds.value = Math.floor((remain % (60 * 1000)) / 1000);
};

setInterval(updateRemainTime, 1000);
</script>

<template>
  <div class="grid auto-cols-max grid-flow-col gap-3 text-center">
    <div class="flex flex-col">
      <span class="countdown font-mono text-3xl">
        <template v-if="moreThan99Days">{{ ">" }}</template>
        <span :style="`--value: ${days}`"></span>
      </span>
      <span class="text-sm">days</span>
    </div>
    <div class="flex flex-col">
      <span class="countdown font-mono text-3xl">
        <span :style="`--value: ${hours}`"></span>
      </span>
      <span class="text-sm">hours</span>
    </div>
    <div class="flex flex-col">
      <span class="countdown font-mono text-3xl">
        <span :style="`--value: ${minutes}`"></span>
      </span>
      <span class="text-sm">min</span>
    </div>
    <div class="flex flex-col">
      <span class="countdown font-mono text-3xl">
        <span :style="`--value: ${seconds}`"></span>
      </span>
      <span class="text-sm">sec</span>
    </div>
  </div>
</template>
