<script setup lang="ts">
import { defineComponent, ref } from 'vue'

const emits = defineEmits(['search'])
const searchValue = ref<string>('')

const handleSearch = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emits('search', searchValue)
  }
}

defineComponent({ name: 'AppSearchBar' })
</script>
<template>
  <div class="w-full">
    <div
      class="relative flex h-12 w-full items-center overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-none focus-within:shadow-lg"
    >
      <div class="grid h-full w-12 place-items-center border-r-2 border-gray-300 text-gray-300">
        <svg
          xmlns="@assets/images/Search.svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        class="peer h-full w-full border-none pr-2 text-sm text-gray-700 outline-none focus:outline-none focus:ring-0"
        type="text"
        id="search"
        v-model="searchValue"
        placeholder="Tìm kiếm..."
        required
        @keydown="handleSearch($event)"
      />
    </div>
  </div>
</template>
