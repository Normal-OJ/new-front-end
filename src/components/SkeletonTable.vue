<script setup lang="ts">
interface Props {
  header?: boolean;
  row?: number;
  col?: number;
}
withDefaults(defineProps<Props>(), {
  header: true,
  row: 3,
  col: 3,
});
</script>

<template>
  <table class="table w-full animate-pulse">
    <thead v-if="header">
      <tr>
        <th class="bg-slate-300" v-for="i in Math.max(col, 1)" />
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in Math.max(row, 1)">
        <td v-for="j in Math.max(col, 1)" class="py-6">
          <div class="h-4 w-1/3 rounded bg-slate-300" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
