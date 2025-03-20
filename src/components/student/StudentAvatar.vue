<script setup lang="ts">
import { defineComponent } from 'vue'

const props = withDefaults(
  defineProps<{
    url: string
    enableEdit?: boolean
  }>(),
  {
    enableEdit: false
  }
)

const handleUpdateUrl = () => {
  emit('update:url')
}

const emit = defineEmits(['update:url'])

defineComponent({ name: 'StudentAvatar' })
</script>
<template>
  <div class="relative h-full w-full">
    <img :src="props.url" class="h-full w-full rounded-full object-cover" />
    <button @click="handleUpdateUrl" class="absolute bottom-0 right-0" v-if="enableEdit">
      <font-awesome-icon :icon="['fas', 'pen-to-square']" size="2xl" style="color: #000000" />
    </button>
  </div>
</template>
