<script setup lang="ts">
import type { ChangePasswordRequest } from '@/types'
import { defineComponent } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const emits = defineEmits(['update:modelValue', 'change-password'])

const handleChangePassword = (form$: any, data: any) => {
  console.log('data', form$.requestData)
  const formData = form$.requestData
  const requestData: ChangePasswordRequest = {
    oldPassword: formData.oldPassword,
    newPassword: formData.newPassword
  }
  console.log('requestData', requestData)

  emits('change-password', requestData)
  return requestData
}

defineComponent({ name: 'ChangePassword' })
</script>
<template>
  <VueFinalModal
    class="flex h-full w-full items-center justify-center"
    content-class="flex flex-col  mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
    @update:model-value="(val) => emits('update:modelValue', val)"
  >
    <Vueform
      size="lg"
      :display-errors="true"
      :endpoint="false"
      @submit="(form$: any, data: any) => handleChangePassword(form$, data)"
    >
      <StaticElement name="h1" tag="h1" content="Đổi mật khẩu" />
      <TextElement
        name="oldPassword"
        input-type="password"
        label="Mật khẩu cũ"
        placeholder="Nhập mật khẩu cũ"
        :floating="false"
        size="md"
        field-name="oldPassword"
        :rules="['required', 'min:8']"
        :messages="{
          required: 'Vui lồng nhập mật khẩu cũ',
          min: 'Mật khẩu cũ phải nhất 8 ký tự'
        }"
      />
      <TextElement
        name="newPassword"
        input-type="password"
        label="Mật khẩu mới"
        :floating="false"
        placeholder="Nhập mật khẩu mới"
        size="md"
        field-name="newPassword"
        :rules="['required', 'min:8']"
        :messages="{
          required: 'Vui lồng nhập mật khẩu mới',
          min: 'Mật khẩu mới phải nhất 8 ký tự'
        }"
      />
      <TextElement
        name="confirmPassword"
        input-type="password"
        label="Xác nhận mật khẩu"
        placeholder="Xác nhận mật khẩu"
        :floating="false"
        size="md"
        field-name="confirmPassword"
        :rules="['required', 'same:newPassword']"
        :messages="{
          required: 'Vui lồng xác nhận lại mật khẩu',
          same: 'Mật khẩu không khớp'
        }"
      />
      <ButtonElement
        name="reset"
        button-label="Đặt lại"
        :secondary="true"
        :resets="true"
        :columns="{
          lg: {
            container: 10
          }
        }"
        align="right"
      />
      <ButtonElement
        name="primaryButton"
        button-label="Gửi"
        :submits="true"
        :columns="{
          lg: {
            container: 2
          }
        }"
        align="right"
      />
    </Vueform>
  </VueFinalModal>
</template>
