<script setup lang="ts">
import { defineComponent } from 'vue'

defineComponent({ name: 'AppHeader' })
</script>
<template>
  <header
    class="header flex flex-auto bg-slate-600 align-middle text-white shadow-md shadow-gray-400"
  >
    <div class="grid w-full grid-flow-row-dense justify-items-center p-4 align-middle">
      <h1 class="w-full text-center text-4xl font-bold">NEST CAFE</h1>
      <h3 class="w-full text-center text-2xl font-bold">Shiki Gotaka</h3>
    </div>
  </header>
</template>
<style scoped>
.header {
  height: 20vh;
}

.nav-items {
  @apply m-2 block w-full rounded-md bg-sky-50/40 p-2 text-center font-sans text-xl font-medium drop-shadow-lg hover:bg-sky-100/75 hover:drop-shadow-none;
}

.nav-authen {
  @apply m-2 block w-full rounded-md bg-white p-2 text-center font-sans text-xl font-medium drop-shadow-lg hover:bg-blue-200 hover:drop-shadow-none;
}
</style>
