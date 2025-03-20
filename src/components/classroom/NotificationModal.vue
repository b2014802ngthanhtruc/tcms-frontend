<script setup lang="ts">
import type { ClassNotification, CreateClassNotification, UpdateClassNotification } from '@/types'
import type { min } from '@vueform/vueform'
import { computed, defineComponent } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const emit = defineEmits(['update:modelValue', 'create-noti', 'update-noti'])
const props = defineProps<{ classNoti?: ClassNotification; title: string }>()
const defaultValues = computed(() => {
  if (props.classNoti) {
    return {
      title: props.classNoti.title,
      content: props.classNoti.content
    }
  }
})

const handleSubmit = (form$: any, data: any) => {
  console.log('data', form$.requestData)
  const requestNoti = form$.requestData as CreateClassNotification
  const updateNoti = form$.requestData as UpdateClassNotification
  if (props.classNoti) {
    emit('update-noti', updateNoti, props.classNoti.id)
  } else {
    emit('create-noti', requestNoti)
  }
}

defineComponent({ name: 'NotificationModal' })
</script>
<template>
  <VueFinalModal
    class="flex h-full w-full items-center justify-center"
    content-class="flex flex-col min-w-[400px] mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <Vueform
      :display-errors="false"
      :float-placeholders="false"
      :endpoint="false"
      @submit="(form$: any, data: any) => handleSubmit(form$, data)"
    >
      <StaticElement name="h1" tag="h1" :content="title" align="center" />
      <TextElement
        name="title"
        label="Tiêu đề"
        placeholder="Nhập tiêu đề"
        :floating="false"
        field-name="title"
        :rules="['required', 'min:2']"
        :messages="{
          required: 'Hãy nhập tiêu đề',
          min: 'Tiêu đề phải nhất 2 ký tự'
        }"
        :default="defaultValues && defaultValues.title"
      />
      <TextareaElement
        name="content"
        label="Nội dung"
        :floating="false"
        placeholder="Nhập nội dung"
        :rules="['required', 'min:2']"
        :messages="{
          required: 'Hãy nhập nội dung',
          min: 'Nội dung phải nhất 2 ký tự'
        }"
        field-name="content"
        :default="defaultValues && defaultValues.content"
      />
      <ButtonElement
        name="dangerButton"
        button-label="Hủy bỏ"
        :danger="true"
        :columns="{
          container: 3
        }"
        @click="emit('update:modelValue', false)"
      />
      <ButtonElement
        name="submit"
        :submits="true"
        align="left"
        :columns="{
          container: 4
        }"
        button-label="Gửi"
      />
    </Vueform>
  </VueFinalModal>
</template>
