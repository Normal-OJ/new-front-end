<script setup lang="ts">
import { watchEffect } from "vue";
import { useStorage } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useTitle } from "@vueuse/core";

useTitle("Test I18n | Normal OJ");
const { t, locale } = useI18n();

const localeInStorate = useStorage("locale", locale);

// initialize with the one in storage
locale.value = localeInStorate.value;

// if user change the value, update the storage
watchEffect(() => {
  localeInStorate.value = locale.value;
});
</script>

<template>
  <div class="card-container">
    <div class="card">
      <div class="card-body">
        <div class="card-title">{{ t("settings.title") }}</div>

        <div class="my-2" />

        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Language:</span>
          </label>
          <select v-model="locale" class="select select-bordered">
            <option value="english">English</option>
            <option value="chinese">繁體中文</option>
            <option value="taiwanese">台灣話</option>
          </select>
          <label class="label">
            <span class="label-text-alt">{{ t("settings.select_lang") }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
