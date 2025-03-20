<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import type { SelectItems } from '../classroom/ClassForm.vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  ListboxLabel
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{ list: SelectItems[]; listLable: string }>()
const seletedValue = ref<string>('')
const selectedLabel = computed(() => {
  return displayList.value.find((item) => item.value === seletedValue.value)?.label
})
const displayList = ref(props.list)

const emit = defineEmits(['select-value'])

const handleSelect = () => {
  emit('select-value', seletedValue.value)
}

onMounted(() => {
  console.log('displayList', props.list)
  const existItem = displayList.value.find((item) => item.value === 'none')
  if (!existItem) {
    const firstItem: SelectItems = {
      value: 'none',
      label: 'Tất cả'
    }
    displayList.value.unshift(firstItem)
    seletedValue.value = firstItem.value
  }
  seletedValue.value = displayList.value[0].value
})

defineComponent({ name: 'AppListBox' })
</script>
<template>
  <Listbox v-model="seletedValue" @update:model-value="handleSelect">
    <div class="relative z-10 mt-1">
      <ListboxLabel :class="'font-medium'">{{ props.listLable }}</ListboxLabel>
      <ListboxButton
        class="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
      >
        <span class="block truncate capitalize">{{ selectedLabel ?? 'Tất cả' }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="item in displayList"
            :key="item.value"
            :value="item.value"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-teal-600 text-white' : 'text-gray-900',
                'relative cursor-default select-none py-2 pl-10 pr-4 capitalize'
              ]"
            >
              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                item.label
              }}</span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="{ 'text-white': active, 'text-teal-600': !active }"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
