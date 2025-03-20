<script setup lang="ts">
import UploadService from '@/services/upload/upload.service'
import type { TutorUpdateProfileRequest } from '@/types'
import { getFileNameAndExtension } from '@/utils'
import type { AxiosError } from 'axios'
import { defineComponent } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { toast } from 'vue3-toastify'

const uploadService = new UploadService()

const handleUpdateAvatar = async (form$: any, data: any) => {
  console.log('data', form$.requestData.avatar)
  const fileData = form$.requestData.avatar as File
  const { fileName, fileType } = getFileNameAndExtension(fileData)
  console.log('file type:', fileType)
  try {
    const { url, key } = await uploadService.presignUrl(fileName, fileType)
    console.log('url', url)
    console.log('key', key)
    await uploadService.uploadFile(url, fileData)
    const requestData: TutorUpdateProfileRequest = {
      avatar: key
    }
    emit('confirm', requestData)
  } catch (error) {
    console.log(error)
  }
}
const emit = defineEmits(['update:modelValue', 'confirm'])

defineComponent({ name: 'TutorAvatarModal' })
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full items-center justify-center"
    content-class="flex flex-col h-[400px] w-[600px] mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <Vueform
      :display-messages="true"
      @submit="async (form$: any, FormData: any) => await handleUpdateAvatar(form$, FormData)"
      :endpoint="false"
      size="lg"
      class="flex h-full w-full flex-col pt-4"
    >
      <StaticElement name="h1" tag="h1" content="Đổi Avatar" />
      <FileElement
        name="avatar"
        accept="image/*"
        view="image"
        :rules="[
          'required',
          'mimetypes:image/jpeg,image/png,image/jpg',
          'max:2048',
          'mimes:jpeg,jpg,png'
        ]"
        :columns="{
          default: {
            container: 9
          },
          lg: {
            container: 12
          }
        }"
        :messages="{
          required: 'Vui lòng chọn ảnh',
          mimetypes: 'Chỉ chấp nhận ảnh jpeg, png, jpg',
          max: 'Ảnh phải nhỏ hơn 2MB'
        }"
        :drop="true"
        :urls="{}"
        field-name="avatar"
        size="lg"
        class="mt-5"
        :upload-temp-endpoint="false"
      />
      <ButtonElement name="submit" button-label="Cập nhật" :submits="true" align="center" />
    </Vueform>
  </VueFinalModal>
</template>
