<script setup lang="ts">
import { defineComponent } from 'vue'

defineComponent({ name: 'AppFooter' })
</script>

<template>
  <footer class="flex-auto divide-y-2 bg-white py-4 align-middle">
    <div class="grid grid-flow-col-dense justify-around gap-4">
      <ul class="footer-groups">
        <li class="text-lg font-medium"><h5>Shiki</h5></li>
      </ul>
      <ul class="footer-groups">
        <li class="text-lg font-medium"><h5>Jacob</h5></li>
      </ul>
      <ul class="footer-groups">
        <li class="text-lg font-medium"><h5>Jin</h5></li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
.footer-groups {
  @apply grid grid-flow-row-dense content-start gap-2 font-sans;
}

.footer-group-items {
  @apply font-sans text-sm;
}
</style>
