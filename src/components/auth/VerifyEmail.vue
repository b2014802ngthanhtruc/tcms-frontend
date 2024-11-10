<script setup lang="ts">
import { ref, defineEmits, defineComponent, onMounted, computed } from 'vue'
import { useField, Field, Form, ErrorMessage, defineRule } from 'vee-validate'
import { ButtonStatus, ButtonType } from '@/enums'
import AppButton from '../shared/AppButton.vue'
import * as yup from 'yup'

// Variables
const emit = defineEmits(['submit-code', 'resend-code'])
const codeArray = ref(new Array(6).fill(''))
const errorMessage = ref('')
const codeIndex = ref(0)
// Rules
defineRule('validateCode', (value: string) => {
  if (value.length === 0) {
    errorMessage.value = 'Yêu cầu mã xác nhận.'
    return 'Yêu cầu mã xác nhận.'
  }
  if (value.length > 1) {
    errorMessage.value = 'Mã xác minh phải là một chữ số duy nhất.'
    return 'Mã phải là một chữ số duy nhất.'
  }
  if (RegExp(/^[0-9]+$/).test(value) === false) {
    errorMessage.value = 'Mã xác minh phải là ký tự số.'
    return 'Mã phải là ký tự số.'
  }
  const emptyIndex = codeArray.value.findIndex((item) => item === '')
  if (emptyIndex >= 0 && emptyIndex < 5) {
    errorMessage.value = 'Yêu cầu mã xác nhận.'
    return false
  }
  errorMessage.value = ''
  return true
})

// Computed
const error = computed(() => {
  return errorMessage.value !== ''
})
// Methods

// Methods
function resendCode() {
  emit('resend-code')
}

const handleVerify = (values: any) => {
  const code = codeArray.value as string[]
  const resultCode = code.join('')
  console.log('verify code: ', code)
  emit('submit-code', resultCode)
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

defineComponent({ name: 'VerifyEmail' })
</script>
<template>
  <div class="flex h-full w-full flex-auto items-center justify-center bg-gray-100">
    <div
      class="flex h-full w-full flex-col justify-center space-y-10 rounded-lg bg-white p-6 shadow-md"
    >
      <!-- Title -->
      <h2 class="mb-6 text-center text-3xl font-bold text-black">Xác minh tài khoản</h2>

      <!-- Subtitle -->
      <p class="mb-6 text-center text-gray-500">Vui lòng nhập mã xác minh</p>

      <!-- Form -->
      <Form @submit="handleVerify" class="space-y-8" v-slot="{ errors }">
        <!-- Input Fields for Verification Code -->
        <div class="grid grid-flow-row justify-items-center">
          <div class="flex justify-center space-x-4">
            <Field
              v-for="index in 6"
              v-slot="{ field, meta }"
              :key="index"
              :name="`code[${index - 1}]`"
              rules="validateCode"
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
          <!-- Error Message -->
          <span class="text-red-500" v-if="errors">{{ errorMessage }}</span>
        </div>

        <!-- Resend Code Link -->
        <div class="mb-6 text-center">
          <p class="text-gray-500">Không nhận được mã?</p>
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
              v-if="!error"
              :status="ButtonStatus.SUCCESS"
              :type="ButtonType.FULL_FILL"
              :content="'Tiếp theo'"
            />
            <AppButton
              v-else
              :status="ButtonStatus.DISABLED"
              :type="ButtonType.FULL_FILL"
              :content="'Tiếp theo'"
            />
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<style scoped>
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
