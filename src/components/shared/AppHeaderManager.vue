<script setup lang="ts">
import { computed, defineComponent, inject, onMounted, ref, watchEffect, type Ref } from 'vue'
import Modal from '../auth/Modal.vue'
import LoginForm from '../auth/LoginForm.vue'
import ChooseProfile from '../auth/ChooseProfile.vue'
import AuthGeneralService from '@/services/auth/auth-general.service'
import type { ChooseProfileResponse, ResetPasswordRequest, UserLogin } from '@/types'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import type { AxiosError } from 'axios'
import AuthTutorService from '@/services/auth/auth-tutor.service'
import {
  checkIsLogin,
  clearLS,
  getAccessTokenFromLS,
  getUserIdFromLS,
  getUserLoginFromLS,
  saveUserLoginToLS,
  setUserIdToLS
} from '@/utils'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import AuthStudentService from '@/services/auth/auth-student.service'
import ForgotPassword from '../auth/ForgotPassword.vue'
import ResetPassword from '../auth/ResetPassword.vue'
import type { Student } from '@/types/student.type'
import StudentService from '@/services/student/student.service'
import type { Tutor } from '@/types/tutor.type'
import TutorService from '@/services/tutor/tutor.service'
import VerifyEmail from '../auth/VerifyEmail.vue'
import { useRoute, useRouter } from 'vue-router'
import { watch } from 'vue'
import { GET_IMG_API } from '@/constants/eviroment.constant'
import type { NavigationItem } from './AppDrawer.vue'
import AppDrawer from './AppDrawer.vue'

const props = defineProps<{
  isMounted: boolean
}>()
const isLogin = ref(false)
const isOpenDrawer = ref(false)
const route = useRoute()
const isManagerOneClassroom = computed(() =>
  route.name?.toString().includes('manager-one-classroom')
)
const userLogin = inject<Ref<UserLogin | undefined>>('userLogin')
const authTutorService = new AuthTutorService()
const authStudentService = new AuthStudentService()
const studentService = new StudentService()
const tutorService = new TutorService()
const student = ref<Student | null>(null)
const tutor = ref<Tutor | null>(null)
const router = useRouter()
const emit = defineEmits(['logout', 'login'])

onMounted(async () => {
  if (!props.isMounted) return
  isLogin.value = checkIsLogin()
  if (isLogin.value && userLogin?.value) {
    console.log('userLogin', userLogin?.value)
    if (userLogin?.value.isStudent) {
      await authStudentService.login(userLogin?.value.userId, userLogin?.value.id)
      student.value = await studentService.getProfile()
      if (userLogin && userLogin.value) {
        userLogin.value.avatar = student.value!.avatar
        userLogin.value.username = student.value!.fullName
      }
    } else {
      await authTutorService.login(userLogin?.value.userId)
      tutor.value = await tutorService.getProfile()
      if (userLogin && userLogin.value) {
        userLogin.value.avatar = tutor.value!.avatar
        userLogin.value.username = tutor.value!.fullName
      }
    }
  }
})

const handleLogout = () => {
  isLogin.value = false
  clearLS()
  emit('logout')
  router.replace({ name: 'home' })
}

const handleGotoProfile = () => {
  if (userLogin && userLogin.value?.isTutor) {
    router.push({ name: 'tutor-profile' })
  }
  if (userLogin && userLogin.value?.isStudent) {
    router.push({ name: 'student-profile' })
  }
}

watch(isManagerOneClassroom, () => {
  if (!isManagerOneClassroom.value) {
    isOpenDrawer.value = false
  }
})

defineComponent({ name: 'AppHeaderManager' })
</script>
<template>
  <header class="header flex flex-auto border border-b-2 align-middle shadow-lg shadow-gray-400">
    <div class="grid grid-flow-col-dense gap-2 p-4">
      <RouterLink to="/" :replace="true" class="mb-3 self-end">
        <font-awesome-icon :icon="['fas', 'house']" size="2xl" style="color: #000000" />
      </RouterLink>

      <img alt="Vue logo" class="logo object-contain" src="@/assets/images/Logo 1.svg" />
    </div>

    <div class="block w-10/12 self-end p-2">
      <nav class="grid grid-flow-col-dense content-around gap-4">
        <div class="flex flex-auto justify-center gap-2 text-2xl font-bold">
          <h1>Quản lý lớp học của tôi</h1>
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
                      v-if="!userLogin?.avatar"
                      class="self-center"
                    />
                    <div v-else>
                      <img
                        :src="`${GET_IMG_API}/${userLogin?.avatar}`"
                        alt="#"
                        class="h-full w-full rounded-full object-cover"
                      />
                    </div>
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
                      {{
                        userLogin
                          ? userLogin.username
                          : student
                            ? student.fullName
                            : tutor?.fullName
                      }}
                    </p>
                  </div>
                  <div class="px-1 py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="handleGotoProfile"
                        :class="[
                          active ? 'bg-sky-500 text-white' : 'text-gray-900',
                          'group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm'
                        ]"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'address-card']"
                          size="lg"
                          :class="[active ? 'text-white' : 'text-blue-600']"
                        />
                        Trang cá nhân
                      </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        :class="[
                          active ? 'bg-sky-500 text-white' : 'text-gray-900',
                          'group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm'
                        ]"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'graduation-cap']"
                          size="lg"
                          :class="[active ? 'text-white' : 'text-blue-600']"
                        />
                        Các lớp học của tôi
                      </button>
                    </MenuItem>
                  </div>
                  <div class="px-1 py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                        :class="[
                          active ? 'bg-sky-500 text-white' : 'text-gray-900',
                          'group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm'
                        ]"
                        @click="handleLogout"
                        type="button"
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
<style scoped>
.nav-items {
  @apply m-2 block w-full rounded-md bg-sky-50/40 p-2 text-center font-sans text-xl font-medium drop-shadow-lg hover:bg-sky-100/75 hover:drop-shadow-none;
}

.nav-authen {
  @apply m-2 block w-full rounded-md bg-white p-2 text-center font-sans text-xl font-medium drop-shadow-lg hover:bg-blue-200 hover:drop-shadow-none;
}
</style>
