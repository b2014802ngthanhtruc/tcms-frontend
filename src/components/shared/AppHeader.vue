<script setup lang="ts">
import { defineComponent, inject, onMounted, ref, watchEffect, type Ref } from 'vue'
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
import { useRouter } from 'vue-router'
import { watch } from 'vue'
import { GET_IMG_API } from '@/constants/eviroment.constant'

const props = defineProps<{
  isMounted: boolean
}>()

const isOpenModal = ref(false)
const step = ref(1)
const isLogin = ref(false)
const email = ref('')
const userLogin = inject<Ref<UserLogin | undefined>>('userLogin')
const authService = new AuthGeneralService()
const authTutorService = new AuthTutorService()
const authStudentService = new AuthStudentService()
const studentService = new StudentService()
const tutorService = new TutorService()
const user = ref<ChooseProfileResponse>({
  id: '',
  isCompleteSignup: false,
  isVerifiedEmail: false,
  students: [],
  tutor: { id: '', fullName: '' }
})
const student = ref<Student | null>(null)
const tutor = ref<Tutor | null>(null)
const router = useRouter()
const emit = defineEmits(['logout', 'login'])

onMounted(async () => {
  console.log('isMounted', props.isMounted)
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
    }
    if (userLogin?.value.isTutor) {
      await authTutorService.login(userLogin?.value.userId)
      tutor.value = await tutorService.getProfile()
      if (userLogin && userLogin.value) {
        userLogin.value.avatar = tutor.value!.avatar
        userLogin.value.username = tutor.value!.fullName
      }
    }
    if (userLogin && userLogin.value.isAdmin) {
      handleLogout()
    }
  }
})

const handleGotoManager = () => {
  if (userLogin?.value?.isTutor) {
    router.push({ name: 'tutor-manager' })
  }
  if (userLogin?.value?.isStudent) {
    router.push({ name: 'student-manager' })
  }
}

const handleOpenModalLogin = () => {
  isOpenModal.value = true
}

const handleCloseModalLogin = () => {
  isOpenModal.value = false
  step.value = 1
  const isLoggedIn = checkIsLogin()
  if (!isLoggedIn) {
    clearLS()
  }
}

const handleLogin = async (value: { email: string; password: string }) => {
  try {
    const result = await authService.getStarted(value.email)
    if (!result.isRegistered) {
      toast.error('Email hoặc mật khẩu không chính xác')
      return
    }
    setUserIdToLS(result.id)
    if (!result.isCompleteSignup) {
      toast.warning('Vui lọc hoàn thành đăng ký hồ sơ!')
      router.push({ name: 'register' })
      return
    }
    user.value = await authService.login(value.email, value.password)
    step.value = 2
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleStudentLogin = async (id: string) => {
  console.log('student login', id)
  try {
    await authStudentService.login(user.value.id, id)
    student.value = await studentService.getProfile()
    saveUserLoginToLS({
      id: student.value!.id,
      userId: student.value!.userId,
      username: student.value!.fullName,
      avatar: student.value!.avatar,
      isStudent: true,
      isTutor: false,
      isAdmin: false
    })
    isOpenModal.value = false
    isLogin.value = true
    emit('login')
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleTutorLogin = async (id: string) => {
  try {
    await authTutorService.login(user.value.id)
    tutor.value = await tutorService.getProfile()
    saveUserLoginToLS({
      id: tutor.value!.id,
      userId: getUserIdFromLS(),
      username: tutor.value!.fullName,
      avatar: tutor.value!.avatar,
      isStudent: false,
      isTutor: true,
      isAdmin: false
    })
    console.log('tutor', tutor.value)
    isOpenModal.value = false
    isLogin.value = true
    emit('login')
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleGotoForgotPassword = () => {
  step.value = 3
}

const handleReturnLogin = () => {
  step.value = 1
}

const handleForgotPassword = async (value: any) => {
  try {
    await authService.forgotPassword(value.email)
    toast.success('Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra lại email!')
    email.value = value.email
    step.value = 4
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleResetPassword = async ({ code, password }: ResetPasswordRequest) => {
  try {
    await authService.resetPassword(email.value, code, password)
    toast.success('Đặt lại mật khẩu thành công!')
    step.value = 1
    email.value = ''
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleResendResetPasswordCode = async () => {
  try {
    await authService.forgotPassword(email.value)
    toast.success('Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra lại email!')
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleLogout = () => {
  isLogin.value = false
  step.value = 1
  clearLS()
  emit('logout')
}

const handleStudentCreateProfile = async () => {
  router.push({ name: 'student-create-profile' })
}

const handleTutorCreateProfile = async () => {
  router.push({ name: 'tutor-create-profile' })
}

const handleGotoProfile = () => {
  if (userLogin && userLogin.value?.isTutor) {
    router.push({ name: 'tutor-profile' })
  }
  if (userLogin && userLogin.value?.isStudent) {
    router.push({ name: 'student-profile' })
  }
}

defineComponent({ name: 'AppHeader' })
</script>
<template>
  <header class="header flex flex-auto align-middle shadow-md shadow-gray-400">
    <div class="p-4">
      <img alt="Vue logo" class="logo object-contain" src="@/assets/images/Logo 1.svg" />
    </div>
    <Modal :isOpen="isOpenModal" @close="handleCloseModalLogin">
      <template #body>
        <LoginForm
          @login="handleLogin"
          v-if="step === 1"
          @forgot-password="handleGotoForgotPassword"
        />
        <ChooseProfile
          v-if="step === 2"
          :user="user"
          @choose-student-profile="handleStudentLogin"
          @choose-tutor-profile="handleTutorLogin"
          @student-create-profile="handleStudentCreateProfile"
          @tutor-create-profile="handleTutorCreateProfile"
        />
        <ForgotPassword
          v-if="step === 3"
          @forgot-password="handleForgotPassword"
          @return-login="handleReturnLogin"
        />
        <ResetPassword
          v-if="step === 4"
          @resend-code="handleResendResetPasswordCode"
          @submit-code="handleResetPassword"
        />
      </template>
    </Modal>
    <div class="block w-10/12 self-end p-2">
      <nav class="grid grid-flow-col-dense content-around gap-4">
        <div class="col-span-7 grid grid-flow-col-dense justify-items-center gap-2">
          <div class="nav-items">
            <RouterLink to="/">Trang chủ</RouterLink>
          </div>
          <div class="nav-items">
            <RouterLink to="/classrooms">Lớp học</RouterLink>
          </div>
          <div class="nav-items">
            <RouterLink to="/tutors">Gia sư</RouterLink>
          </div>
        </div>

        <div class="grid grid-cols-2 justify-items-center gap-2" v-if="!isLogin">
          <div class="nav-authen">
            <button @click="handleOpenModalLogin">Đăng nhập</button>
          </div>
          <div class="nav-authen">
            <RouterLink to="/auth/general/register">Đăng ký</RouterLink>
          </div>
        </div>
        <div v-else class="group z-50 flex flex-auto items-center justify-center">
          <div class="flex w-6/12 items-center justify-center gap-3 rounded-full bg-white p-1">
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                  v-slot="{ open }"
                  class="group/button inline-flex w-full flex-auto justify-between gap-2 rounded-full align-middle text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 group-hover:justify-between"
                >
                  <div class="inline-flex h-12 w-12 justify-center rounded-full">
                    <font-awesome-icon
                      :icon="['fas', 'user']"
                      size="2xl"
                      style="color: #050505"
                      v-if="!userLogin?.avatar"
                      :class="['self-center hover:ml-1', open ? 'ml-1' : '']"
                    />
                    <div v-else>
                      <img
                        :src="`${GET_IMG_API}/${userLogin?.avatar}`"
                        alt="#"
                        :class="[
                          'h-full w-full rounded-full object-cover group-hover/button:ml-1',
                          open ? 'ml-1' : ''
                        ]"
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
                        @click="handleGotoManager"
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
.header {
  background: fixed;
  background-image: url('@/assets/images/background-header.svg');
  background-size: contain;
  background-position: initial 80%;
  height: 30vh;
}

.nav-items {
  @apply m-2 block w-full rounded-md bg-sky-50/40 p-2 text-center font-sans text-xl font-medium drop-shadow-lg hover:bg-sky-100/75 hover:drop-shadow-none;
}

.nav-authen {
  @apply m-2 block w-full rounded-md bg-white p-2 text-center font-sans text-xl font-medium drop-shadow-lg hover:bg-blue-200 hover:drop-shadow-none;
}
</style>
