<script setup lang="ts">
import { defineComponent } from 'vue'
import { useForm, Field, Form, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import type { RegisterRequest } from '@/types'
import AppButton from '../shared/AppButton.vue'
import { ButtonStatus, ButtonType } from '@/enums'

// Tạo Yup schema cho form đăng ký
const registerSchema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  password: yup
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .required('Mật khẩu không được để trống'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu không được để trống')
})

const emit = defineEmits(['register'])
// Xử lý khi submit form
const handleRegisterSubmit = (values: any) => {
  const registerValues = values as RegisterRequest
  console.log('Form Submitted: ', registerValues)
  emit('register', registerValues)
}

defineComponent({ name: 'RegisterForm' })
</script>

<template>
  <Form
    @submit="handleRegisterSubmit"
    :validation-schema="registerSchema"
    class="grid h-full w-full grid-flow-row-dense content-around justify-self-center px-28 shadow-lg shadow-gray-400"
  >
    <div class="form-header">
      <h1>Đăng ký tài khoản</h1>
    </div>

    <div class="form-body">
      <!-- Email Field -->
      <div class="form-field">
        <label for="email" class="form-label">Email</label>
        <Field name="email" id="email" v-slot="{ field, meta }" :validate-on-input="true">
          <input
            v-bind="field"
            type="text"
            :class="[
              'form-input',
              meta.valid && meta.touched
                ? 'border-green-500 focus:caret-inherit'
                : 'border-gray-300',
              !meta.valid && meta.touched ? 'border-red-500' : ''
            ]"
            placeholder="Nhập email của bạn"
          />
        </Field>
        <ErrorMessage name="email" class="text-sm text-red-500" />
      </div>

      <!-- Password Field -->
      <div class="form-field">
        <label for="password" class="form-label">Mật khẩu</label>
        <Field name="password" id="password" v-slot="{ field, meta }" :validate-on-input="true">
          <input
            v-bind="field"
            type="password"
            :class="[
              'form-input',
              meta.valid && meta.touched ? 'border-green-500' : 'border-gray-300',
              !meta.valid && meta.touched ? 'border-red-500' : ''
            ]"
            placeholder="Nhập mật khẩu của bạn"
          />
        </Field>
        <ErrorMessage name="password" class="text-sm text-red-500" />
      </div>

      <!-- Confirm Password Field -->
      <div class="form-field">
        <label for="confirm-password" class="form-label">Xác nhận mật khẩu</label>
        <Field
          name="confirmPassword"
          id="confirm-password"
          v-slot="{ field, meta }"
          :validate-on-input="true"
        >
          <input
            v-bind="field"
            type="password"
            :class="[
              'form-input',
              meta.valid && meta.touched ? 'border-green-500' : 'border-gray-300',
              !meta.valid && meta.touched ? 'border-red-500' : ''
            ]"
            placeholder="Nhập lại mật khẩu"
          />
        </Field>
        <ErrorMessage name="confirmPassword" class="text-sm text-red-500" />
      </div>

      <div class="form-footer">
        <p class="justify-self-end">
          <<<<<<< HEAD Đã có tài khoản? <a href="#" class="text-indigo-500">Đăng nhập</a> =======
          Bạn đã có tài khoản? <a href="#" class="text-indigo-500">Đăng nhập</a>
          >>>>>>> bd982731ff8ff80085225bcf44e272c89dbe07e2
        </p>

        <div class="flex w-8/12 flex-auto justify-center justify-self-center">
          <AppButton
            :status="ButtonStatus.SUCCESS"
            :type="ButtonType.FULL_FILL"
            :content="'Tiếp tục'"
          />
        </div>
      </div>
    </div>
  </Form>
</template>

<style scoped>
.form-header {
  @apply flex flex-auto justify-center pt-4 text-4xl font-bold;
}
.form-body {
  @apply flex flex-auto flex-col gap-6;
}
.form-label {
  @apply text-lg;
}
.form-field {
  @apply grid grid-flow-row-dense gap-2;
}
.form-footer {
  @apply grid grid-flow-row-dense gap-5;
}
.form-input {
  @apply rounded border;
}
</style>
