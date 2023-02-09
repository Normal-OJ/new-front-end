<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogTitle } from "@headlessui/vue";

defineProps<{
  title: string;
  content: string;
  modelValue: boolean;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

function closeModal() {
  emits("update:modelValue", false);
}
</script>

<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" :open="modelValue" @close="closeModal" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="modal-open modal">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <div class="modal-box">
            <DialogTitle as="h3" class="text-xl font-medium text-base-content">
              {{ title }}
            </DialogTitle>
            <div class="mt-2">
              <p class="text-sm text-base-content">
                {{ content }}
              </p>
            </div>

            <div class="mt-4">
              <button type="button" class="btn-info btn-sm btn" @click="closeModal">OK</button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
