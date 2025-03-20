<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { useRoute } from 'vue-router'

export type NavigationItem = {
  label: string
  to: string
  params?: any
  query?: any
}

const props = defineProps<{
  items: NavigationItem[]
}>()
const route = useRoute()
const emit = defineEmits(['update:modelValue', 'confirm'])

const isActive = (item: NavigationItem) => {
  console.log('route', route.fullPath)
  console.log('item', item)
  console.log('check', route.name === item.to && route.query?.menuIndex === item.query?.menuIndex)
  return route.name === item.to && route.query?.menuIndex === item.query?.menuIndex
}

defineComponent({ name: 'AppDrawer' })
onMounted(() => {
  console.log('route', props.items)
})
</script>

<template>
  <VueFinalModal
    content-class="absolute left-0 h-full bg-white dark:bg-gray-900 space-y-2"
    swipe-to-close="left"
    content-transition="vfm-slide-left"
    overlay-transition="vfm-fade"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <div class="grid w-full grid-flow-row-dense gap-5">
      <div class="bg-sky-600 p-4 text-3xl font-bold text-white">
        <h1>Danh mục quản lý</h1>
      </div>
      <RouterLink
        v-for="item in items"
        :key="item.label"
        :to="{
          name: item.to,
          params: item.params,
          query: item.query
        }"
        :class="[
          'p-4 text-lg font-medium',
          isActive(item) ? 'bg-cyan-400 text-white' : 'hover:bg-cyan-300 hover:text-gray-500'
        ]"
      >
        {{ item.label }}
      </RouterLink>
    </div>
  </VueFinalModal>
</template>
