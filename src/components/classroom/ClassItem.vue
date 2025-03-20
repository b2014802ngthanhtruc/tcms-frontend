<script setup lang="ts">
import { CLASSSTATUSMAP } from '@/constants/class.constant'
import { ClassStatus } from '@/enums'
import type { ClassRoom } from '@/types'
import { capitalize, defineComponent, onMounted } from 'vue'

const props = defineProps<{
  classroom: ClassRoom
}>()
const emits = defineEmits(['get-detail'])

const statusColor = (status: string): string => {
  switch (status) {
    case ClassStatus.NEW:
      return 'text-emerald-500'
    case ClassStatus.PENDING:
      return 'text-yellow-500'
    case ClassStatus.STARTED:
      return 'text-blue-500'
    case ClassStatus.CANCELED:
      return 'text-red-500'
    case ClassStatus.PAUSED:
      return 'text-gray-500'
    case ClassStatus.ENDED:
      return 'text-green-500'
    default:
      return 'text-black'
  }
}

const handleSelected = () => {
  emits('get-detail', props.classroom.id)
}
onMounted(() => {
  console.log('class: ', props.classroom)
})
defineComponent({ name: 'ClassItem' })
</script>
<template>
  <div
    class="broder-black group flex max-h-40 w-full min-w-40 max-w-60 cursor-pointer flex-col justify-items-center gap-3 divide-y-2 rounded-lg border p-4 hover:shadow hover:shadow-gray-400"
    @click="handleSelected"
  >
    <div class="flex w-full min-w-40 flex-col items-center gap-4">
      <p class="w-full truncate text-center text-lg font-medium">
        {{ capitalize(props.classroom.className) }}
      </p>
      <p class="w-full truncate text-center">
        {{ capitalize(props.classroom.subject.name) }}
      </p>
    </div>
    <div class="mt-2 flex w-full flex-col items-center gap-4 pt-2 font-bold">
      <p :class="statusColor(props.classroom.status)">
        {{ capitalize(CLASSSTATUSMAP[props.classroom.status]) }}
      </p>
    </div>
  </div>
</template>
