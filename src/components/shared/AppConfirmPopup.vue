<script setup lang="ts">
import { defineComponent } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import AppButton from './AppButton.vue'
import { ButtonStatus, ButtonType } from '@/enums'

const props = defineProps<{ title: string }>()
const emits = defineEmits(['update:modelValue', 'confirm'])

defineComponent({ name: 'AppConfirmPopup' })
</script>
<template>
  <VueFinalModal
    class="flex h-full w-full items-center justify-center"
    content-class="flex flex-col max-h-[400px] max-w-[600px] space-y-3 mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
    @update:model-value="(val) => emits('update:modelValue', val)"
  >
    <h1 class="text-xl">
      {{ props.title }}
    </h1>

    <div class="ml-auto mt-1">
      <AppButton
        :content="'Xác nhận'"
        :status="ButtonStatus.SUCCESS"
        :type="ButtonType.FULL_FILL"
        @click="emits('confirm')"
      />
    </div>
  </VueFinalModal>
</template>
