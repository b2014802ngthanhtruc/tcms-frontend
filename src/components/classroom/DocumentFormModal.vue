<script setup lang="ts">
import UploadService from '@/services/upload/upload.service'
import type { AddClassDocument, TutorUpdateProfileRequest } from '@/types'
import { getFileNameAndExtension } from '@/utils'
import type { AxiosError } from 'axios'
import { defineComponent } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { toast } from 'vue3-toastify'

const uploadService = new UploadService()

const handleAddDocument = async (form$: any, data: any) => {
  console.log('data', form$.requestData.document)
  const fileData = form$.requestData.document as File
  const { fileName, fileType, extension } = getFileNameAndExtension(fileData)
  console.log('file type:', fileType)
  try {
    const { url, key } = await uploadService.presignUrl(fileName, fileType)
    console.log('url', url)
    console.log('key', key)
    await uploadService.uploadFile(url, fileData)
    const requestData: AddClassDocument = {
      docUrl: key,
      name: `${fileName}.${extension}`
    }
    emit('confirm', requestData)
  } catch (error) {
    console.log(error)
  }
}
const emit = defineEmits(['update:modelValue', 'confirm'])

defineComponent({ name: 'DocumentFormModal' })
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full items-center justify-center"
    content-class="flex flex-col h-[400px] w-[600px] mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <Vueform
      :display-messages="true"
      @submit="async (form$: any, FormData: any) => await handleAddDocument(form$, FormData)"
      :endpoint="false"
      size="lg"
      class="flex h-full w-full flex-col pt-4"
    >
      <StaticElement name="h1" tag="h1" content="Thêm tài liệu" />
      <FileElement
        name="document"
        accept=".pdf,.docx,.doc,.xls,.xlsx,.ppt,.pptx"
        :rules="[
          'required',
          'mimetypes:application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.ms-powerpoint,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx'
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
          required: 'Vui lòng chọn tài liệu',
          mimetypes: 'Chỉ chấp nhận ảnh pdf, doc, docx, xlsx, xls, ppt, pptx'
        }"
        :drop="true"
        :urls="{}"
        field-name="document"
        size="lg"
        class="mt-5"
        :upload-temp-endpoint="false"
      />
      <ButtonElement name="submit" button-label="Cập nhật" :submits="true" align="center" />
    </Vueform>
  </VueFinalModal>
</template>
