<script lang="ts" setup>
import { GENDERMAP } from '@/constants/gender.constant'
import { DEFAULT_AVATAR } from '@/constants/user.constant'
import type { ListTutorResponse } from '@/types/tutor.type'
import { toCurrency } from '@/utils'
import { defineComponent } from 'vue'

const props = defineProps<{ tutor: ListTutorResponse }>()
const emist = defineEmits(['get-detail'])

const handleGetDetail = (id: string) => {
  emist('get-detail', id)
}

defineComponent({
  name: 'TutorItem'
})
</script>

<template>
  <div
    class="flex cursor-pointer justify-center justify-items-start gap-4 rounded-lg bg-teal-100 p-2"
    :key="props.tutor.id"
    @click="handleGetDetail(props.tutor.id)"
  >
    <div class="mt-4 h-[134px] w-[134px]">
      <img class="ml-2 h-full w-full rounded-full object-cover" :src="DEFAULT_AVATAR" alt="" />
    </div>
    <div class="grid grid-flow-row-dense justify-items-center gap-2 capitalize">
      <p class="text-lg font-medium">{{ props.tutor.fullName }}</p>
      <div class="grid grid-cols-2">
        <div class="grid grid-rows-3 gap-3">
          <div class="flex flex-auto gap-1">
            <p class="font-medium">Giới tính:</p>
            <p>{{ GENDERMAP[props.tutor.gender] }}</p>
          </div>
          <div class="flex flex-auto gap-1">
            <p class="font-medium">Bằng cấp:</p>
            <p>{{ props.tutor.degree }}</p>
          </div>
          <div class="flex flex-auto gap-1">
            <p class="font-medium">Chuyên ngành:</p>
            <p>{{ props.tutor.major }}</p>
          </div>
        </div>
        <div class="grid grid-rows-3 gap-3">
          <div class="flex flex-auto gap-1">
            <p class="font-medium">Ngày sinh:</p>
            <p>{{ new Date(props.tutor.dob).toLocaleDateString('en-GB') }}</p>
          </div>
          <div class="flex flex-auto gap-1">
            <p class="font-medium">Nơi cấp:</p>
            <p>{{ props.tutor.university }}</p>
          </div>
          <div class="flex flex-auto gap-1">
            <p class="font-medium">Học phí:</p>
            <p>{{ toCurrency(props.tutor.expectSalary) }}/buổi</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
