<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeMount,
  onMounted,
  provide,
  ref,
  watch,
  type InjectionKey
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/shared/AppHeader.vue'
import AppFooter from '@/components/shared/AppFooter.vue'
import type { UserLogin } from './types'
import { getUserLoginFromLS } from './utils'
import AppHeaderManager from './components/shared/AppHeaderManager.vue'
import AppHeaderAdminManager from './components/shared/AppHeaderAdminManager.vue'

const route = useRoute()
const router = useRouter()
const isRouteReady = ref(false)
router.isReady().then(() => {
  isRouteReady.value = true
  console.log('Route is ready:', router.currentRoute.value.path)
})

const user = ref<UserLogin | undefined>(undefined)
provide('userLogin', user)

onBeforeMount(() => {
  user.value = getUserLoginFromLS()
  console.log('user', user.value)
  console.log('isAuthRoute', isAuthRoute.value)
  console.log('route', route.path)
})

const handleUpdateUser = () => {
  console.log('update user')
  user.value = getUserLoginFromLS()
  console.log('user', user.value)
}

const handleLogout = () => {
  console.log('logout')
  user.value = undefined
}

// Kiểm tra nếu đường dẫn hiện tại chứa /auth
const isAuthRoute = computed(() => isRouteReady.value && route.path.includes('/auth'))
const isWelcome = computed(() => isRouteReady.value && route.path.includes('/welcome'))
const isManager = computed(() => isRouteReady.value && route.path.includes('/manager'))
const isAdminManager = computed(() => isRouteReady.value && route.path.includes('/admin/manager'))
const isGeneral = computed(() => {
  console.log('route', route.path)
  console.log('isAuthRoute', isAuthRoute.value)
  console.log('isWelcome', isWelcome.value)
  console.log('isManager', isManager.value)
  console.log('isAdminManager', isAdminManager.value)
  return (
    isRouteReady.value &&
    !isAuthRoute.value &&
    !isWelcome.value &&
    !isManager.value &&
    !isAdminManager.value
  )
})
</script>

<template>
  <AppHeaderAdminManager v-if="isAdminManager" :is-mounted="isAdminManager" />
  <AppHeaderManager v-if="isManager && !isAdminManager" :is-mounted="isManager" />
  <AppHeader
    v-if="isGeneral"
    :is-mounted="isGeneral ?? false"
    @login="handleUpdateUser"
    @logout="handleLogout"
  />
  <RouterView />
  <AppFooter v-if="isRouteReady && !isAuthRoute && !isWelcome && !isAdminManager" />
</template>

<style scoped>
footer {
  @apply static bottom-0;
}
</style>
