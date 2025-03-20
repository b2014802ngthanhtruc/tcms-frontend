<script setup lang="ts">
import AppHeader from '@/components/shared/AppHeader.vue'
import AppFooter from '@/components/shared/AppFooter.vue'
</script>

<template>
  <AppHeader />
  <RouterView />
</template>

<style scoped>
footer {
  @apply static bottom-0;
}
</style>
