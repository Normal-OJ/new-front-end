<script setup lang="ts"></script>

<template>
  <div>
    <course-top-bar />
    <div class="flex">
      <course-side-bar />
      <div class="flex-1">
        <router-view />
      </div>
    </div>
  </div>
</template>
