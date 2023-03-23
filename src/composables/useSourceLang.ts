import { computed, ref } from "vue";
import { LANGUAGE_OPTIONS } from "@/constants";

function initializeMap(allowedLanguages: number) {
  const m = [];
  for (const lang of LANGUAGE_OPTIONS) {
    if (allowedLanguages & lang.mask) {
      m.push(lang.mask);
    }
  }
  return m;
}

export function useSourceLang(allowedLanguages = 0) {
  const selectedLangs = ref<number[]>(initializeMap(allowedLanguages));
  const readableLang = computed<string>(() => {
    return LANGUAGE_OPTIONS.filter(({ mask }) => selectedLangs.value.includes(mask))
      .map(({ text }) => text)
      .join(", ");
  });
  const selectedLangNumber = computed<number>(() => {
    return LANGUAGE_OPTIONS.filter(({ mask }) => selectedLangs.value.includes(mask))
      .map(({ mask }) => mask)
      .reduce((a, b) => a + b, 0);
  });

  return {
    selectedLangs,
    readableLang,
    selectedLangNumber,
  };
}
