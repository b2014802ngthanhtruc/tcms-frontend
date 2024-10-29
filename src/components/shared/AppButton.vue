<script setup lang="ts">
import { ButtonStatus, ButtonType } from '@/enums'
import { defineComponent, onMounted, ref } from 'vue'

const props = defineProps<{
  content: string
  type: ButtonType
  status: ButtonStatus
}>()

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}

const initButton = ref('')

onMounted(() => {
  const data: {
    type: string
    status: string
  } = {
    type: '',
    status: ''
  }
  switch (props.type) {
    case ButtonType.FULL_FILL:
      data.type = 'button-full-fill'
      data.status = 'fill-'
      break
    case ButtonType.OUTLINE:
      data.type = 'button-outline'
      data.status = 'outline-'
      break
    default:
      break
  }
  switch (props.status) {
    case ButtonStatus.PRIMARY:
      data.status = data.status + 'primary'
      break
    case ButtonStatus.SUCCESS:
      data.status = data.status + 'success'
      break
    case ButtonStatus.WARNING:
      data.status = data.status + 'warning'
      break
    case ButtonStatus.DANGER:
      data.status = data.status + 'danger'
      break
    default:
      data.status = data.status + 'disabled'
      break
  }
  initButton.value = data.type + ' ' + data.status
})

defineComponent({ name: 'Button' })
</script>
<template>
  <button :class="initButton" @click="handleClick">
    {{ props.content }}
  </button>
</template>
<style>
.button-full-fill {
  @apply h-full w-full rounded-lg p-2 font-medium text-white sm:text-sm md:text-lg;
}

.button-outline {
  @apply rounded-lg border bg-white p-2 text-lg font-medium;
}

.fill-primary {
  @apply bg-sky-500 hover:bg-sky-600;
}

.outline-primary {
  @apply border-sky-500 text-sky-500 shadow-gray-500 drop-shadow-md hover:drop-shadow-none;
}

.fill-success {
  @apply bg-green-500 hover:bg-green-600;
}

.outline-success {
  @apply border-green-500 text-green-500 shadow-gray-500 drop-shadow-md hover:drop-shadow-none;
}

.fill-warning {
  @apply bg-yellow-500 hover:bg-yellow-600;
}

.outline-warning {
  @apply border-yellow-500 text-yellow-500 shadow-gray-500 drop-shadow-md hover:drop-shadow-none;
}

.fill-danger {
  @apply bg-red-500 hover:bg-red-600;
}

.outline-danger {
  @apply border-red-500 text-red-500 shadow-gray-500 drop-shadow-md hover:drop-shadow-none;
}

.fill-disabled {
  @apply text-gray-500 disabled:bg-gray-300;
}

.outline-disabled {
  @apply text-gray-500 disabled:border-gray-300;
}
</style>
