<script setup lang="ts">
import { computed, defineComponent, ref } from 'vue'

const props = defineProps<{
  pagination: {
    next: string | null
    previous: string | null
    count: number
    limit: number
  }
}>()

const emits = defineEmits(['next', 'previous', 'choose-page'])

const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.ceil(props.pagination.count / props.pagination.limit)
})

const visiblePages = computed(() => {
  const maxVisiblePages = 5 // Số trang tối đa muốn hiển thị
  const half = Math.floor(maxVisiblePages / 2)
  let start = Math.max(1, currentPage.value - half)
  let end = Math.min(totalPages.value, currentPage.value + half)

  // Điều chỉnh để đảm bảo hiển thị đúng 5 trang khi gần đầu hoặc cuối danh sách
  if (end - start + 1 < maxVisiblePages) {
    if (currentPage.value <= half) {
      end = Math.min(totalPages.value, start + maxVisiblePages - 1)
    } else {
      start = Math.max(1, end - maxVisiblePages + 1)
    }
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Hàm chuyển đến trang mới
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    const offset = (page - 1) * props.pagination.limit
    emits('choose-page', offset)
  }
}

const next = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    emits('next')
  }
}

const previous = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    emits('previous')
  }
}

defineComponent({ name: 'AppPaginationBar' })
</script>
<template>
  <div class="flex flex-auto justify-center justify-items-center gap-1">
    <button
      @click="previous"
      :class="[
        props.pagination.previous ? 'hover:bg-white hover:shadow-lg hover:shadow-gray-400' : ''
      ]"
      :disabled="!props.pagination.previous"
    >
      <font-awesome-icon
        :icon="['fas', 'angles-left']"
        :style="{ color: props.pagination.previous ? '#000000' : '#787f8c' }"
      />
    </button>
    <button
      v-for="page in visiblePages"
      :key="page"
      @click="goToPage(page)"
      :class="[
        'mx-1 rounded-full border px-3 py-1 hover:bg-white hover:shadow-lg hover:shadow-gray-400',
        { 'bg-blue-500 text-white hover:text-black': page === currentPage }
      ]"
    >
      {{ page }}
    </button>
    <button
      @click="next"
      :class="[
        props.pagination.previous ? 'hover:bg-white hover:shadow-lg hover:shadow-gray-400' : ''
      ]"
      :disabled="!props.pagination.next"
    >
      <font-awesome-icon
        :icon="['fas', 'angles-right']"
        :style="{ color: props.pagination.previous ? '#000000' : '#787f8c' }"
      />
    </button>
  </div>
</template>
