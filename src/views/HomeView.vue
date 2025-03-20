<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="container mx-auto my-4 h-fit justify-items-center overflow-hidden bg-white p-3">
    <div class="grid h-full w-full grid-flow-col-dense">
      <RouterLink :to="{ name: 'supabase' }" class="third-party-button">
        <img src="@/assets/images/supabase-logo-icon.svg" />
        <p class="text-lg">Supabase</p>
      </RouterLink>
    </div>
  </main>
</template>
<style scoped>
.next-button {
  @apply right-5;
}

.previous-button {
  @apply left-5;
}

.third-party-button {
  @apply grid max-w-36 grid-flow-row-dense justify-items-center rounded-md bg-white p-2 hover:border-gray-300 hover:shadow-gray-300 hover:drop-shadow-md;
}
</style>
