<script setup lang="ts">
import { ref, defineEmits, defineComponent, onMounted, computed } from 'vue'
import { useField, Field, Form, ErrorMessage, defineRule } from 'vee-validate'
import { ButtonStatus, ButtonType } from '@/enums'
import AppButton from '../shared/AppButton.vue'
import * as yup from 'yup'
import bgLogin from '@/assets/images/bg-login.svg'
import logo from '@/assets/images/Logo 1.svg'
import type { ResetPasswordRequest } from '@/types'

// Variables
const props = defineProps<{ isAdmin?: boolean }>()
const emit = defineEmits(['submit-code', 'resend-code'])
const codeArray = ref(new Array(6).fill(''))
const codeIndex = ref(0)
const errorMessage = ref('')
const resetPasswordData = ref<ResetPasswordRequest>({
  code: '',
  password: ''
})

// Rules
const ResetPasswordSchema = yup.object({
  code: yup
    .array(
      yup
        .string()
        .trim()
        .max(1, 'Mã xác thực chỉ được nhập 1 ký tự mỗi ô')

        .required('Mã xác thực là bắt buộc')
    )
    .required('Mã xác thực là bắt buộc'),
  password: yup.string().trim().min(8, 'Mật khẩu phải nhất 8 ký tự').required('Hãy nhập mật khẩu')
})

// Computed

const validataCode = (value: string) => {
  console.log('value', value)
  if (value.length === 0) {
    errorMessage.value = 'Verification code is required.'
    return false
  }
  if (value.length > 1) {
    errorMessage.value = 'Verification code must be a single digit.'
    return false
  }
  if (RegExp(/^[0-9]+$/).test(value) === false) {
    errorMessage.value = 'Verification code must be a number character.'
    return false
  }
  const emptyIndex = codeArray.value.findIndex((item) => item === '')
  if (emptyIndex >= 0 && emptyIndex < 5) {
    errorMessage.value = 'Verification code is required.'
    return false
  }
  errorMessage.value = ''
  return true
}

// Methods
function resendCode() {
  emit('resend-code')
}

const handleResetPassword = async (values: any) => {
  const code = codeArray.value as string[]
  const resultCode = code.join('')
  console.log('verify code: ', code)
  console.log('verify code: ', resultCode)
  resetPasswordData.value.code = resultCode
  resetPasswordData.value.password = values.password

  console.log('reset-password', resetPasswordData.value)

  emit('submit-code', resetPasswordData.value)
}

function focusNext(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  console.log('next ', index)
  codeIndex.value = index
  if (input.value && index < codeArray.value.length) {
    const nextInput = document.querySelector<HTMLInputElement>(`input[name='code[${index + 1}]']`)
    if (nextInput) {
      nextInput.focus()
    }
  }
}

function focusPrevious(event: KeyboardEvent, index: number) {
  const input = event.target as HTMLInputElement
  console.log('previous ', index)
  codeIndex.value = index
  if (event.key === 'Backspace' && !input.value && index > 0) {
    const previousInput = document.querySelector<HTMLInputElement>(
      `input[name='code[${index - 1}]']`
    )
    if (previousInput) {
      previousInput.focus()
    }
  }
}

// Lifecycle hook
onMounted(() => {
  const firstInput = document.querySelector<HTMLInputElement>('input[name="code0"]')
  firstInput?.focus()
})

const error = computed(() => {
  return errorMessage.value !== ''
})

defineComponent({ name: 'VerifyEmail' })
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
      <!-- Title -->
      <h2 class="mb-6 text-center text-3xl font-bold text-black">Đặt lại mật khẩu</h2>

      <!-- Subtitle -->
      <p class="mb-6 text-center text-gray-500">Vui lòng nhập mã xác thực</p>

      <!-- Form -->
      <Form
        @submit="handleResetPassword"
        class="space-y-8"
        :validation-schema="ResetPasswordSchema"
        v-slot="{ errors }"
      >
        <!-- Input Fields for Verification Code -->
        <div class="grid w-full grid-flow-row justify-items-center gap-4">
          <div class="grid grid-flow-row-dense justify-center gap-3">
            <div class="grid grid-flow-col-dense space-x-4">
              <Field
                v-for="index in 6"
                v-slot="{ field, meta }"
                :key="index"
                :name="`code[${index - 1}]`"
                v-model="codeArray[index - 1]"
                :validate-on-input="true"
                :validate-on-blur="true"
                :validate-on-change="true"
                class="grid grid-flow-row-dense items-center justify-center"
              >
                <input
                  type="number"
                  v-bind="field"
                  maxlength="1"
                  @input="focusNext($event, index - 1)"
                  @keydown="focusPrevious($event, index - 1)"
                  class="h-12 w-12 border border-gray-300 text-center text-xl focus:border-blue-500 focus:outline-none"
                />
              </Field>
            </div>
            <ErrorMessage :name="`code[${codeIndex}]`" class="text-sm text-red-500" />
            <span class="text-red-500" v-if="errorMessage.length > 0">{{ errorMessage }}</span>
          </div>
          <div class="grid w-full grid-flow-row-dense justify-items-start gap-3 px-3">
            <label for="password" class="text-[20px]">Mật khẩu mới</label>
            <Field
              v-slot="{ field, meta }"
              :validate-on-input="true"
              :validate-on-blur="true"
              name="password"
              class="w-full"
            >
              <input
                v-bind="field"
                type="password"
                class="w-full rounded-lg border border-gray-300 text-xl focus:border-blue-500 focus:outline-none"
              />
            </Field>
            <ErrorMessage name="password" class="text-sm text-red-500" />
          </div>
        </div>

        <!-- Resend Code Link -->
        <div class="mb-6 text-center">
          <p class="text-gray-500">Không nhận được email?</p>
          <button
            type="button"
            @click="resendCode"
            class="mt-2 text-blue-500 hover:underline focus:outline-none"
          >
            Gửi lại mã
          </button>
        </div>

        <!-- Next Button -->
        <div class="grid w-full grid-flow-col-dense content-center">
          <div class="mx-auto w-5/12">
            <AppButton
              :status="ButtonStatus.SUCCESS"
              :type="ButtonType.FULL_FILL"
              :content="'Gửi'"
            />
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<style scoped>
/* You can add specific scoped styles here if necessary */
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
