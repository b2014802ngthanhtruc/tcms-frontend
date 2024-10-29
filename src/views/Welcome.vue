<script setup lang="ts">
import { defineComponent } from 'vue'
</script>
<template>
  <div class="welcome-body h-screen">
    <div class="grid h-full grid-flow-row-dense items-center justify-center bg-black bg-opacity-30">
      <!-- Logo -->
      <div class="flex flex-auto">
        <img src="@/assets/images/Logo 1.svg" alt="Day Break Logo" class="w-full object-contain" />
      </div>

      <!-- Welcome Message -->
      <div class="text-center text-white">
        <h1 class="text-4xl font-bold">Welcome to Day Break Tutor Center</h1>
        <p class="mt-4 text-lg">We hope you have a wonderful experience at the center!</p>
      </div>

      <!-- Enter Button -->
      <div class="mt-8 w-7/12 justify-self-center">
        <RouterLink
          to="/"
          class="flex w-full flex-auto cursor-pointer justify-center rounded-lg bg-white px-10 py-2 text-xl font-semibold text-black opacity-70 shadow-lg transition hover:bg-gray-200"
        >
          <p class="opacity-100">Enter</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<style scoped>
.welcome-body {
  background-image: url('@/assets/images/image 12.svg');
  background-size: cover;
  background-position: 80%;
}
</style>
