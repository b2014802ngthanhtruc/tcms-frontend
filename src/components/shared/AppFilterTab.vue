<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import { string } from 'yup'
import type { FilterField } from '@/types'
import { FilterOperationType } from '@chax-at/prisma-filter-common'

export type FilterKey = {
  field: string
  label: string
  items: {
    value: string
    mask: string
    description?: string
  }[]
}

export type ListFilterField = {
  oneColumn: FilterKey[]
  twoColumn: FilterKey[]
  threeColumn: FilterKey[]
}

const props = defineProps<{
  filterFields: ListFilterField
}>()

const emit = defineEmits(['filter', 'closeTab'])

const filterValues = ref<FilterField[]>([])

const hanldeCloseTab = () => {
  emit('closeTab')
}

const handleSelectFilter = (field: string, value: string) => {
  console.log('handleSelectFilter', field, value)
  const index = filterValues.value.findIndex((f) => f.field === field)
  if (index !== -1) {
    if (filterValues.value[index].value !== value) {
      filterValues.value.splice(index, 1)
      filterValues.value.push({ field, type: FilterOperationType.Eq, value })
    } else {
      filterValues.value.splice(index, 1)
    }
  } else {
    filterValues.value.push({ field, type: FilterOperationType.Eq, value })
  }
  emit('filter', filterValues.value)
}

const keyValues = ref<ListFilterField>(props.filterFields)

defineComponent({ name: 'AppFilterTab' })
</script>
<template>
  <div class="filter-tab">
    <div class="filter-tab-header">
      <h2>Options</h2>
      <button @click="hanldeCloseTab">
        <font-awesome-icon :icon="['fas', 'xmark']" size="lg" style="color: #000000" />
      </button>
    </div>
    <div class="filter-tab-body">
      <!-- One Column -->
      <div class="filter-tab-body-item" v-for="oneCol in keyValues.oneColumn" :key="oneCol.field">
        <p class="filter-field-label">{{ oneCol.label }}</p>
        <div class="filter-tab-body-col-1">
          <div
            class="group relative grid w-full cursor-pointer grid-flow-col-dense gap-1"
            v-for="item in oneCol.items"
            :key="item.value"
            @click="handleSelectFilter(oneCol.field, item.value)"
          >
            <CheckIcon
              class="h-5 w-5 text-teal-500"
              aria-hidden="true"
              v-if="filterValues.find((f) => f.field === oneCol.field && f.value === item.value)"
            />
            <p>{{ item.mask }}</p>
            <div
              v-if="item.description"
              class="invisible absolute z-10 rounded-md bg-white p-1 text-sm text-gray-400 shadow-lg shadow-gray-300 group-hover:visible"
            >
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column -->
      <div class="filter-tab-body-item" v-for="twoCol in keyValues.twoColumn" :key="twoCol.field">
        <p class="filter-field-label">{{ twoCol.label }}</p>
        <div class="filter-tab-body-col-2">
          <div
            class="group relative flex w-full flex-auto cursor-pointer gap-1"
            v-for="item in twoCol.items"
            :key="item.value"
            @click="handleSelectFilter(twoCol.field, item.value)"
          >
            <CheckIcon
              class="h-5 w-5 text-teal-500"
              aria-hidden="true"
              v-if="filterValues.find((f) => f.field === twoCol.field && f.value === item.value)"
            />
            <p>{{ item.mask }}</p>
            <div
              v-if="item.description"
              class="invisible absolute left-0 top-full z-10 rounded-md bg-white p-1 text-sm text-gray-400 shadow-lg shadow-gray-300 group-hover:visible"
            >
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Three Column -->
      <div
        class="filter-tab-body-item"
        v-for="threeCol in keyValues.threeColumn"
        :key="threeCol.field"
      >
        <p class="filter-field-label">{{ threeCol.label }}</p>
        <div class="filter-tab-body-col-3">
          <div
            class="group relative flex w-full flex-auto cursor-pointer gap-1"
            v-for="item in threeCol.items"
            :key="item.value"
            @click="handleSelectFilter(threeCol.field, item.value)"
          >
            <CheckIcon
              class="h-5 w-5 text-teal-500"
              aria-hidden="true"
              v-if="filterValues.find((f) => f.field === threeCol.field && f.value === item.value)"
            />
            <p>{{ item.mask }}</p>
            <div
              v-if="item.description"
              class="invisible absolute z-10 rounded-md bg-white p-1 text-sm text-gray-400 shadow-lg shadow-gray-300 group-hover:visible"
            >
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-tab {
  @apply flex max-w-sm flex-col gap-3 overflow-y-auto rounded-br-lg bg-white p-3 shadow-lg shadow-gray-400;
}

.filter-tab-header {
  @apply flex w-full flex-auto justify-between p-2 text-4xl font-bold;
}

.filter-tab-body {
  @apply grid grid-flow-row-dense gap-3 p-4;
}

.filter-tab-body-item {
  @apply grid grid-flow-row-dense gap-3 capitalize;
}

.filter-tab-body-col-1 {
  @apply grid grid-cols-1 gap-3 px-4;
}

.filter-tab-body-col-2 {
  @apply grid grid-cols-2 gap-3 px-4;
}

.filter-tab-body-col-3 {
  @apply grid grid-cols-3 gap-3 text-sm;
}

.filter-field-label {
  @apply text-lg font-medium;
}
</style>
