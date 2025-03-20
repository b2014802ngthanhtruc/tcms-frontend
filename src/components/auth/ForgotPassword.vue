<script setup lang="ts">
import { defineComponent } from 'vue'
import bgLogin from '@/assets/images/bg-login.svg'
import logo from '@/assets/images/Logo 1.svg'
import AppButton from '../shared/AppButton.vue'
import { ButtonStatus, ButtonType } from '@/enums'
import { ErrorMessage, Field, Form } from 'vee-validate'
import * as yup from 'yup'

const props = defineProps<{ isAdmin?: boolean }>()
const emits = defineEmits(['forgot-password', 'return-login'])

const forgotPasswordSchema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email')
})

const forgotPassword = (value: any) => {
  console.log('forgot-password')
  emits('forgot-password', value)
}

const returnLogin = () => {
  console.log('return-login')
  emits('return-login')
}

defineComponent({ name: 'ForgotPassword' })
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
      <div class="mt-[10px] text-center text-[40px] font-semibold">Quên mật khẩu</div>
      <Form
        :validation-schema="forgotPasswordSchema"
        @submit="forgotPassword"
        class="mt-5 flex w-[347px] flex-col items-start justify-center gap-4"
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

        <div class="mt-2 flex w-full items-center justify-between">
          <a @click="returnLogin" href="#" class="text-[13px]">Đăng nhập</a>
          <RouterLink to="/auth/general/register" class="text-[13px] underline" v-if="!isAdmin"
            >Đăng ký</RouterLink
          >
        </div>
        <div class="flex w-full items-center justify-between py-8">
          <AppButton
            :status="ButtonStatus.SUCCESS"
            :type="ButtonType.FULL_FILL"
            :content="'Tiếp tục'"
          />
        </div>
      </Form>
    </div>
  </div>
</template>
<style scoped></style>
