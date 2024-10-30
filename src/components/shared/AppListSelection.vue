<script setup lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'

export type Selections = {
  id: string
  name: string
}

const props = defineProps<{
  list: Selections[]
  selected: string[]
}>()

const emit = defineEmits(['select'])

const listValues = computed(() => props.list)
const selectedValues = computed({
  get() {
    return props.selected
  },
  set(value) {
    return value
  }
})

const handleSelect = (id: string) => {
  if (!selectedValues.value.includes(id)) {
    selectedValues.value = [...selectedValues.value, id]
  }
  emit('select', id)
}

defineComponent({ name: 'AppListSelection' })
</script>
<template>
  <ul
    role="list"
    class="max h-full max-h-36 w-full space-y-2 overflow-hidden overscroll-none rounded-lg bg-white shadow shadow-gray-400 hover:overflow-y-auto"
  >
    <li
      v-for="item in listValues"
      :key="item.id"
      :value="item.id"
      @click="handleSelect(item.id)"
      class="group grid w-full grid-flow-col-dense justify-between bg-white p-2 capitalize drop-shadow-sm first:rounded-t-lg last:rounded-b-lg hover:bg-slate-100"
    >
      <p>{{ item.name }}</p>
      <span
        class="invisible justify-self-end group-hover:visible"
        v-if="!selectedValues.includes(item.id)"
        >Select
        <font-awesome-icon :icon="['fas', 'circle-check']" style="color: #7e8ea9" />
      </span>
      <font-awesome-icon
        :icon="['fas', 'circle-check']"
        style="color: #32ec6a"
        v-else
        class="justify-self-end"
      />
    </li>
  </ul>
</template>
