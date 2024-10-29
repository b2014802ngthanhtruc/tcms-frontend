<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/shared/AppHeader.vue'
import AppFooter from '@/components/shared/AppFooter.vue'

// Sử dụng useRoute để truy cập thông tin route hiện tại
const route = useRoute()

// Kiểm tra nếu đường dẫn hiện tại chứa /auth
const isAuthRoute = computed(() => route.path.includes('/auth'))
const isWelcome = computed(() => route.path.includes('/welcome'))
</script>

<template>
  <AppHeader v-if="!isAuthRoute && !isWelcome" />
  <RouterView />
  <AppFooter v-if="!isAuthRoute && !isWelcome" />
</template>

<style scoped>
footer {
  @apply static bottom-0;
}
</style>
<!-- <style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style> -->
