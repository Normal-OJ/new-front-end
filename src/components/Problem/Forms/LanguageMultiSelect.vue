<script setup lang="ts">
import { watchEffect } from "vue";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
import { useSourceLang } from "@/composables/useSourceLang";
import { LANGUAGE_OPTIONS } from "@/constants";

interface Props {
  modelValue: number;
}
const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:model-value", newValue: number): void;
}>();

const { selectedLangs, selectedLangNumber, readableLang } = useSourceLang(props.modelValue);

watchEffect(() => {
  emits("update:model-value", selectedLangNumber.value);
});
</script>

<template>
  <Listbox v-model="selectedLangs" multiple>
    <div class="relative mt-1">
      <ListboxButton class="input-bordered input w-full max-w-xs text-left">
        <span class="block truncate">{{ readableLang }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <i-uil-angle-down class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute mt-1 max-h-80 w-full overflow-auto rounded-md bg-base-100 py-1 text-base shadow-lg sm:text-sm"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="{ text, mask } in LANGUAGE_OPTIONS"
            :key="mask"
            :value="mask"
            as="template"
          >
            <li :class="[active && 'bg-base-300', 'cursor- default relative select-none py-2 pl-10 pr-4']">
              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                {{ text }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content"
              >
                <i-uil-check class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
