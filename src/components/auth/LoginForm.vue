<script setup lang="ts">
import { defineComponent } from 'vue'
import bgLogin from '@/assets/images/bg-login.svg'
import logo from '@/assets/images/Logo 1.svg'
import AppButton from '../shared/AppButton.vue'
import { ButtonStatus, ButtonType } from '@/enums'
import { ErrorMessage, Field, Form } from 'vee-validate'
import * as yup from 'yup'

const props = withDefaults(defineProps<{ isAdmin?: boolean }>(), {
  isAdmin: false
})
const emits = defineEmits(['login', 'forgot-password'])

const loginSchema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Hãy nhập email'),
  password: yup.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').required('Hãy nhập mật khẩu')
})

const login = (value: any) => {
  console.log('login')
  emits('login', value)
}

const forgotPassword = () => {
  console.log('forgot-password')
  emits('forgot-password')
}

defineComponent({ name: 'LoginForm' })
</script>
<template>
  <div
    :style="
      !isAdmin && {
        backgroundImage: `url(${bgLogin})`
      }
    "
    class="flex h-[700px] w-[500px] items-center justify-center rounded-sm bg-cover bg-center bg-no-repeat p-[35px]"
  >
    <div class="flex h-[600px] w-[400px] flex-col items-center rounded-[4px] bg-[#D9D9D9]/50">
      <div class="mt-[19px] flex justify-center">
        <img :src="logo" alt="Logo" class="w-[200px]" />
      </div>
      <div class="mt-[10px] text-center text-[40px] font-semibold">Đăng nhập</div>
      <Form
        :validation-schema="loginSchema"
        @submit="login"
        class="flex w-[347px] flex-col items-start justify-center gap-4"
      >
        <div class="grid w-full grid-flow-dense gap-4">
          <label for="email" class="block text-[20px]">Email</label>
          <Field name="email" v-slot="{ field, meta }" :validate-on-input="true" class="w-full">
            <input
              type="email"
              id="email"
              v-bind="field"
              class="w-full rounded-[10px] border-none text-[#2f2e2e]"
            />
            <ErrorMessage name="email" class="text-sm text-red-500" />
          </Field>
        </div>
        <div class="grid w-full grid-flow-row-dense gap-4">
          <label for="password" class="block text-[20px]">Mật khẩu</label>
          <Field name="password" v-slot="{ field, meta }" :validate-on-input="true" class="w-full">
            <input
              v-bind="field"
              type="password"
              id="password"
              class="mt-1 w-full rounded-[10px] border-none"
            />
            <ErrorMessage name="password" class="text-sm text-red-500" />
          </Field>
        </div>

        <div class="mt-2 flex w-full items-center justify-between">
          <a @click="forgotPassword" href="#" class="text-[13px]">Quên mật khẩu</a>
          <RouterLink to="/auth/general/register" class="text-[13px] underline" v-if="!isAdmin"
            >Đăng ký</RouterLink
          >
        </div>
        <div class="flex w-full items-center justify-between py-8">
          <AppButton :status="ButtonStatus.SUCCESS" :type="ButtonType.FULL_FILL" :content="'Gửi'" />
        </div>
      </Form>
    </div>
  </div>
</template>
<style scoped></style>
