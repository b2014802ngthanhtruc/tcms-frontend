<script setup lang="ts">
import { defineComponent } from 'vue'
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits(['close'])

const closeModal = () => emit('close')

defineComponent({ name: 'Modal' })
</script>
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="relative rounded-lg bg-white shadow-lg">
      <!-- Modal Title -->
      <div class="">
        <slot name="title"> </slot>
      </div>

      <!-- Modal Body -->
      <div class="">
        <slot name="body"> </slot>
      </div>

      <!-- Modal Footer -->
      <div class="text-right">
        <slot name="footer"> </slot>
      </div>
    </div>
  </div>
</template>
