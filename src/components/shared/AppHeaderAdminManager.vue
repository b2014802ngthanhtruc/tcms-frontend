<script setup lang="ts">
import type { ChangePasswordRequest, UserLogin } from '@/types'
import { defineComponent, inject, onMounted, ref, type Ref } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useRouter } from 'vue-router'
import AuthAdminService from '@/services/auth/auth-admin.service'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  getUserLoginFromLS,
  saveAccessTokenToLS
} from '@/utils'
import AppDrawer, { type NavigationItem } from './AppDrawer.vue'
import ChangePassword from '../auth/ChangePassword.vue'
import AuthGeneralService from '@/services/auth/auth-general.service'
import type { AxiosError } from 'axios'
import { toast } from 'vue3-toastify'

const props = defineProps<{ isMounted: boolean }>()
const userLogin = inject<Ref<UserLogin | undefined>>('userLogin')
const router = useRouter()
const adminAuthService = new AuthAdminService()
const authService = new AuthGeneralService()
const isOpenDrawer = ref(false)
const isChangePassword = ref(false)
const menuItems: NavigationItem[] = [
  {
    label: 'Tổng quan',
    to: 'admin-manager-dashboard'
  },
  {
    label: 'Quản lý người dùng',
    to: 'admin-manager-users'
  },
  {
    label: 'Quản lý lớp học',
    to: 'admin-manager-classrooms'
  },
  {
    label: 'Quản lý môn học',
    to: 'admin-manager-subjects'
  }
]

onMounted(async () => {
  if (!props.isMounted) return
  if (!userLogin || !userLogin.value || !userLogin.value.isAdmin) {
    router.replace({ name: 'admin-auth' })
  }
  if (userLogin && userLogin.value && userLogin.value.isAdmin) {
    const token = getRefreshTokenFromLS()
    const result = await adminAuthService.refreshToken(token)

    saveAccessTokenToLS(result)
  }
})

const handleLogout = () => {
  clearLS()
  if (userLogin) {
    userLogin.value = undefined
  }
  router.replace({ name: 'admin-auth' })
}

const handleChangePassword = (value: ChangePasswordRequest) => {
  try {
    isChangePassword.value = false
    authService.changePassword(value)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

defineComponent({ name: 'AppHeaderAdminManager' })
</script>
<template>
  <header class="header flex flex-auto border border-b-2 align-middle shadow-lg shadow-gray-400">
    <AppDrawer v-model="isOpenDrawer" :items="menuItems" />
    <ChangePassword v-model="isChangePassword" @change-password="handleChangePassword" />
    <div class="grid grid-flow-col-dense gap-2 p-4">
      <div class="mb-3 cursor-pointer self-end" @click="isOpenDrawer = isOpenDrawer = true">
        <font-awesome-icon :icon="['fas', 'bars']" size="2xl" style="color: #121212" />
      </div>

      <img alt="Vue logo" class="logo object-contain" src="@/assets/images/Logo 1.svg" />
    </div>

    <div class="block w-10/12 self-end p-2">
      <nav class="grid grid-flow-col-dense content-around gap-4">
        <div class="flex flex-auto justify-center gap-2 text-4xl font-bold">
          <h1>Quản lý hệ thống</h1>
        </div>
        <div class="group z-50 flex flex-auto items-center justify-end">
          <div class="flex w-6/12 items-center justify-center gap-3 rounded-full bg-white">
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                  v-slot="{ open }"
                  class="group/button inline-flex w-full flex-auto justify-between gap-1 rounded-full bg-sky-200 align-middle text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 group-hover:justify-between"
                >
                  <div
                    class="inline-flex h-12 w-12 justify-center rounded-full border border-gray-300"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'user']"
                      size="2xl"
                      style="color: #050505"
                      class="self-center"
                    />
                  </div>
                  <font-awesome-icon
                    :icon="['fas', 'chevron-down']"
                    size="xl"
                    style="color: #050505"
                    :class="[
                      open ? 'block' : 'hidden',
                      'mr-1 self-center group-hover/button:block'
                    ]"
                  />
                </MenuButton>
              </div>

              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems
                  class="absolute right-0 mt-2 w-48 origin-center divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                >
                  <div
                    class="grid grid-flow-row-dense justify-items-center px-1 py-1 font-medium capitalize"
                  >
                    <p>
                      {{ userLogin?.username }}
                    </p>
                  </div>
                  <div class="px-1 py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                        :class="[
                          active ? 'bg-sky-500 text-white' : 'text-gray-900',
                          'group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm'
                        ]"
                        @click="isChangePassword = true"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'key']"
                          size="lg"
                          :class="[active ? 'text-white' : 'text-blue-600']"
                        />
                        Đổi mật khẩu
                      </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        :class="[
                          active ? 'bg-sky-500 text-white' : 'text-gray-900',
                          'group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm'
                        ]"
                        @click="handleLogout"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'right-from-bracket']"
                          size="lg"
                          :class="[active ? 'text-white' : 'text-blue-600']"
                        />
                        Đăng xuất
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
