<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
router.replace(`/course/${route.params.name}/announcements`);
</script>

<template><span>redirecting...</span></template>
