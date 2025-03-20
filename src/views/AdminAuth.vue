<script setup lang="ts">
import ForgotPassword from '@/components/auth/ForgotPassword.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import ResetPassword from '@/components/auth/ResetPassword.vue'
import AuthAdminService from '@/services/auth/auth-admin.service'
import AuthGeneralService from '@/services/auth/auth-general.service'
import type { ResetPasswordRequest, UserLogin } from '@/types'
import { getUserLoginFromLS, saveUserLoginToLS } from '@/utils'
import type { AxiosError } from 'axios'
import { inject, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const adminAuthService = new AuthAdminService()
const authGeneralService = new AuthGeneralService()
const user = inject<Ref<UserLogin | undefined>>('userLogin', ref(undefined))
const emits = defineEmits(['login'])
const step = ref(1)
const router = useRouter()
const email = ref('')

const handleAdminLogin = async (value: any) => {
  try {
    await adminAuthService.login(value.email, value.password)
    const response = await adminAuthService.getProfile()
    console.log('response', response)
    saveUserLoginToLS({
      id: response.id,
      userId: response.id,
      isAdmin: true,
      isStudent: false,
      isTutor: false,
      username: response.username
    })
    user.value = {
      id: response.id,
      userId: response.id,
      isAdmin: true,
      isStudent: false,
      isTutor: false,
      username: response.username
    }
    console.log('user', user.value)
    router.replace({ name: 'admin-manager-dashboard' }).then(() => {
      toast.success('Đăng nhập thành công')
    })
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleForgotPassword = async (value: any) => {
  try {
    await authGeneralService.forgotPassword(value.email)
    email.value = value.email
    toast.success('Mã xác thức đã gửi đến email của bạn. Vui lý kiểm tra email!')
    step.value = 3
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleResendCode = async () => {
  try {
    await authGeneralService.forgotPassword(email.value)
    toast.success('Mã xác thực đã được gửi lại. Vui lý kiểm tra email!')
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleResetPassword = async ({ code, password }: ResetPasswordRequest) => {
  try {
    await authGeneralService.resetPassword(email.value, code, password)
    toast.success('Đặt lại mật khẩu thành công!')
    step.value = 1
    email.value = ''
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}
</script>
<template>
  <div class="auth-body flex w-full flex-col items-center justify-center p-3">
    <div>
      <h1 class="text-5xl font-bold">Quản lý hệ thống</h1>
    </div>
    <div>
      <LoginForm
        :is-admin="true"
        @login="handleAdminLogin"
        @forgot-password="step = 2"
        v-if="step === 1"
      />
      <ForgotPassword
        v-if="step === 2"
        :is-admin="true"
        @return-login="step = 1"
        @forgot-password="handleForgotPassword"
      />
      <ResetPassword
        v-if="step === 3"
        :is-admin="true"
        @resend-code="handleResendCode"
        @submit-code="handleResetPassword"
      />
    </div>
  </div>
</template>
<style scoped>
.auth-body {
  background-image: url('@/assets/images/image 12.svg');
  background-size: cover;
  background-position: 80%;
}
</style>
