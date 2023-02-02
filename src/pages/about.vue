<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import { useI18n } from "vue-i18n";

useTitle("About | Normal OJ");
const { t, locale } = useI18n();
const teams = [
  {
    title: t("about.maintainer"),
    people: ["AlaRduTP", "as535364", "asef18766", "Bogay", "skps2010", "Uier"],
  },
  {
    title: t("about.service_l_2021"),
    people: [
      "AlaRduTP",
      "Alanasdw",
      "as535364",
      "asef18766",
      "BirkhoffLee",
      "Bogay",
      "eoleedi",
      "jw910731",
      "littlepenguin89106",
      "PoHsien-Liu",
      "QQ1010",
      "RuiRabbit",
      "RUJRSJ",
      "simon5955687",
      "skps2010",
      "sophie8909",
      "toto6038",
      "Uier",
      "YingMuo",
    ],
  },
  {
    title: t("about.swe_2019"),
    people: [
      "aisu-programming",
      "AlaRduTP",
      "as535364",
      "asef18766",
      "Bogay",
      "brianchangtw",
      "Dynzer",
      "fuji37450",
      "hackbabu9033",
      "Ikaros1110",
      "shangchiwu",
      "skps2010",
      "Snowball0409",
      "Uier",
    ],
  },
];
const links = [
  {
    icon: "mdi-facebook",
    url: "https://fb.me/noj.tw",
  },
  {
    icon: "mdi-github",
    url: "https://github.com/Normal-OJ/Normal-OJ",
  },
];
</script>

<template>
  <div class="prose mx-auto mt-10 w-full pb-60 font-mono">
    <div class="flex w-full flex-col items-center">
      <h1 class="uppercase">{{t("about.links")}}</h1>
      <div class="flex gap-12">
        <a href="https://fb.me/noj.tw" class="mx-12">
          <i-uil-facebook class="h-28 w-28" />
        </a>
        <a href="https://github.com/Normal-OJ/Normal-OJ" class="mx-12">
          <i-uil-github class="h-28 w-28" />
        </a>
      </div>
    </div>

    <div class="mt-16 flex w-full flex-col items-center">
      <h1 class="uppercase">{{ t("about.contributor") }}</h1>
      <div v-for="team in teams" class="flex w-full flex-col items-center">
        <h3>{{ team.title }}</h3>
        <div class="w-fix my-4 grid grid-cols-2 gap-x-40 gap-y-8 md:grid-cols-4 lg:grid-cols-6">
          <div v-for="name in team.people" class="not-prose flex flex-col items-center">
            <div class="avatar">
              <div class="mask mask-squircle w-16">
                <img :src="`https://github.com/${name}.png`" :alt="`${name}'s github profile avatar`" />
              </div>
            </div>
            <span class="mt-2 text-sm">{{ name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
