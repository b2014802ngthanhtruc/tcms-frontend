<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { FilterKey } from './AppFilterTab.vue'
import type { FilterField } from '@/types'
import { FilterOperationType } from '@chax-at/prisma-filter-common'

const props = defineProps<{
  filterKey: FilterKey
  defaultValue: string
}>()
const selectedValue = ref('')
const emits = defineEmits(['filter-value'])
const handleSelecteValue = (value: string) => {
  selectedValue.value = value
  const filterField: FilterField = {
    field: props.filterKey.field,
    type: FilterOperationType.Eq,
    value
  }

  console.log('filterField', [filterField])

  emits('filter-value', [filterField])
}

onMounted(() => {
  selectedValue.value = props.defaultValue
})
defineComponent({ name: 'AppFilterBar' })
</script>
<template>
  <div
    class="grid w-full grid-flow-col-dense divide-x-2 rounded-md border border-gray-400 shadow-md"
  >
    <button
      v-for="value in props.filterKey.items"
      :value="value.value"
      :key="value.value"
      @click="handleSelecteValue(value.value)"
      :class="[
        selectedValue === value.value
          ? 'bg-sky-400 text-white shadow-md shadow-gray-400'
          : 'bg-white text-black hover:bg-slate-400 hover:text-white hover:shadow-lg hover:shadow-gray-400',
        'p-3 text-lg font-bold capitalize first:rounded-l-md last:rounded-r-md'
      ]"
    >
      {{ value.mask }}
    </button>
  </div>
</template>
