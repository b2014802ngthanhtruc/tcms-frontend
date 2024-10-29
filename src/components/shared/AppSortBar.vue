<script setup lang="ts">
import type { OrderField } from '@/types'
import { computed, defineComponent, ref } from 'vue'

export type SortFieldType = {
  field: string
  mask: string
  value: string
}

const emit = defineEmits(['sort'])
const props = defineProps<{
  keys: {
    field: string
    mask: string
  }[]
}>()
const keyValues = ref<SortFieldType[]>(
  props.keys.map((key) => ({
    field: key.field,
    mask: key.mask,
    value: 'none'
  }))
)

const handleSort = (key: SortFieldType) => {
  console.log(key)
  switch (key.value) {
    case 'none':
      key.value = 'asc'
      break
    case 'asc':
      key.value = 'desc'
      break
    case 'desc':
      key.value = 'none'
      break
    default:
      key.value = 'none'
      break
  }
  const items = keyValues.value.map((k) => {
    if (k.field === key.field) {
      return key.value === 'none'
        ? null
        : {
            field: key.field,
            dir: key.value
          }
    }
    return {
      field: k.field,
      dir: 'none'
    }
  })
  items.map((item, index) => {
    if (item === null) {
      keyValues.value[index] = {
        ...keyValues.value[index],
        value: 'none'
      }
    } else {
      keyValues.value[index] = {
        ...keyValues.value[index],
        value: item.dir
      }
    }
  })
  const result = items.filter((item) => item !== null && item.dir !== 'none')
  emit('sort', result)
}

defineComponent({ name: 'AppSortBar' })
</script>
<template>
  <div
    class="grid grid-flow-col-dense justify-items-center divide-x-2 divide-gray-300 rounded-lg py-3 shadow-lg shadow-gray-300"
  >
    <div class="w-full" v-for="key in keyValues">
      <button
        class="mx-auto flex flex-auto items-center justify-items-center gap-2 p-2 capitalize"
        :key="key.field"
        @click="handleSort(key)"
      >
        <p>{{ key.mask }}</p>
        <font-awesome-icon
          :icon="['fas', 'sort']"
          style="color: #0d0d0d"
          v-if="key.value === 'none'"
        />
        <font-awesome-icon
          :icon="['fas', 'sort-up']"
          style="color: #000000"
          v-if="key.value === 'asc'"
        />
        <font-awesome-icon
          :icon="['fas', 'sort-down']"
          style="color: #000000"
          v-if="key.value === 'desc'"
        />
      </button>
    </div>
  </div>
</template>
