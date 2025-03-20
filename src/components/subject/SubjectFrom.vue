<script setup lang="ts">
import type { CreateSubjectType, Subject, UpdateSubjectType } from '@/types'
import { computed, defineComponent } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const emit = defineEmits(['update:modelValue', 'create-subject', 'update-subject'])
const props = defineProps<{ subject?: Subject; title: string }>()
const defaultValues = computed(() => {
  if (props.subject) {
    return {
      name: props.subject.name,
      description: props.subject.description
    }
  }
})

const handleSubmit = (form$: any, data: any) => {
  console.log('data', form$.requestData)
  const requestNoti = form$.requestData as CreateSubjectType
  const updateNoti = form$.requestData as UpdateSubjectType
  if (props.subject) {
    emit('update-subject', props.subject.id, updateNoti)
  } else {
    emit('create-subject', requestNoti)
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
      :float-placeholders="false"
      :display-errors="false"
      :endpoint="false"
      @submit="(form$: any, data: any) => handleSubmit(form$, data)"
    >
      <StaticElement name="h1" tag="h1" :content="title" align="center" />
      <TextElement
        name="name"
        label="Tên môn học"
        :default="defaultValues && defaultValues.name"
        :floating="false"
        placeholder="Nhập tên môn học"
        field-name="name"
        :rules="['required']"
      />
      <TextareaElement
        name="description"
        label="Mô tả"
        placeholder="Nhập mô tả"
        :default="defaultValues && defaultValues.description"
        :floating="false"
        :rules="['nullable']"
        field-name="description"
      />
      <ButtonElement
        name="reset"
        :secondary="true"
        :resets="true"
        :columns="{
          lg: {
            container: 3
          }
        }"
        button-label="Đặt lại"
      />
      <ButtonElement
        name="submit"
        :submits="true"
        :columns="{
          lg: {
            container: 5
          }
        }"
        button-label="Gửi"
      />
    </Vueform>
  </VueFinalModal>
</template>
