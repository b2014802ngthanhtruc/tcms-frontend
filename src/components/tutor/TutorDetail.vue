<script setup lang="ts">
import { DEFAULT_AVATAR, USERSTATUSMAP } from '@/constants/user.constant'
import { ButtonStatus, ButtonType, Status } from '@/enums'
import type { Tutor } from '@/types/tutor.type'
import { computed, defineComponent } from 'vue'
import AppButton from '../shared/AppButton.vue'
import { CLASSLEVELMAP } from '@/constants/class.constant'
import { toCurrency } from '@/utils'
import { GENDERMAP } from '@/constants/gender.constant'
import { GET_IMG_API } from '@/constants/eviroment.constant'

const props = defineProps<{
  tutor: Tutor
}>()
const emits = defineEmits(['change-status', 'delete-tutor'])

const color = computed(() => {
  switch (props.tutor.status) {
    case Status.ACTIVE:
      return 'text-green-500'
    case Status.BLOCKED:
      return 'text-red-500'
    case Status.PENDING:
      return 'text-yellow-500'
    default:
      return 'text-gray-500'
  }
})

const handleChangeStatus = () => {
  const status = props.tutor.status === Status.ACTIVE ? Status.BLOCKED : Status.ACTIVE
  emits('change-status', status)
}

const handleDelete = () => {
  emits('delete-tutor')
}

defineComponent({ name: 'TutorDetail' })
</script>
<template>
  <div class="flex flex-col justify-items-center gap-5 p-4">
    <div class="grid grid-flow-col-dense justify-between gap-3">
      <div class="flex flex-col justify-items-center">
        <p class="text-2xl font-bold">Trạng thái</p>
        <p :class="[color, 'text-lg font-medium']">{{ USERSTATUSMAP[props.tutor.status] }}</p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <AppButton
          v-if="tutor.status === Status.BLOCKED"
          :content="'Mở khóa'"
          :status="ButtonStatus.SUCCESS"
          :type="ButtonType.OUTLINE"
          @click="handleChangeStatus"
        />
        <AppButton
          v-else
          :content="'Khóa'"
          :status="ButtonStatus.DANGER"
          :type="ButtonType.OUTLINE"
          @click="handleChangeStatus"
        />
        <AppButton
          :content="'Xóa'"
          :status="ButtonStatus.DANGER"
          :type="ButtonType.FULL_FILL"
          @click="handleDelete"
        />
      </div>
    </div>
    <div class="flex flex-auto justify-center gap-3 text-xl font-semibold">
      <h1>{{ tutor.fullName }}</h1>
    </div>
    <div class="my-4 flex items-center justify-center gap-20">
      <div class="w-80">
        <div class="h-52 w-52 rounded-full bg-slate-200">
          <img
            :src="tutor.avatar ? `${GET_IMG_API}/${tutor.avatar}` : DEFAULT_AVATAR"
            alt=""
            class="h-full w-full rounded-full object-cover"
          />
        </div>
      </div>
      <div class="grid w-80 grid-flow-row gap-4">
        <p class="mb-2">
          <span class="list-title">Ngày sinh:</span>
          {{ new Date(tutor.dob).toLocaleDateString('en-GB') }}
        </p>
        <p class="mb-2"><span class="list-title">Giới tính:</span> {{ GENDERMAP[tutor.gender] }}</p>
        <p class="mb-2"><span class="list-title">Số điện thoại:</span>{{ tutor.phone }}</p>
        <p class="mb-2"><span class="list-title">Địa chỉ: </span>{{ tutor.address.fullAddress }}</p>
        <p class="mb-2"><span class="list-title">Giới thiệu: </span></p>
      </div>
      <div class="grid w-80 grid-flow-row gap-4">
        <p class="mb-2">
          <span class="list-title">Trình độ: </span>{{ tutor.educationalQualification.degree }}
        </p>
        <p class="mb-2">
          <span class="list-title">Đại học/Cơ quan: </span>
          {{ tutor.educationalQualification.university }}
        </p>
        <p class="mb-2">
          <span class="list-title">Chuyên ngành: </span>{{ tutor.educationalQualification.major }}
        </p>
        <div class="mb-2 flex flex-auto gap-5">
          <p>
            <span class="list-title">Năm bắt đầu: </span
            >{{ tutor.educationalQualification.startYear }}
          </p>
          <p>
            <span class="list-title">Năm kết thúc: </span
            >{{ tutor.educationalQualification.endYear }}
          </p>
        </div>
        <p class="mb-2">
          <span class="list-title">Mức lương: </span>{{ toCurrency(tutor.expectSalary) }}/Buổi
        </p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-10">
      <div class="mx-44 mb-4">
        <h2 class="text-lg font-medium">Các môn học:</h2>
        <div class="ml-8 grid grid-flow-dense gap-4">
          <div v-for="job in tutor.jobReferences">
            <div class="mb-2">{{ CLASSLEVELMAP[job.class] }}</div>
            <div class="ml-8 grid grid-flow-row-dense gap-4">
              <p class="mb-2 capitalize" v-for="subject in job.subjects">{{ subject.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mx-44 mb-4">
        <h2 class="text-lg font-medium">Khu vực:</h2>
        <div class="ml-8 grid grid-flow-dense gap-4">
          <div class="ml-8" v-for="area in tutor.areaExpects">
            <p class="mb-2">{{ area.city }}</p>
            <div class="ml-8 grid grid-flow-row-dense gap-4">
              <p class="mb-2 capitalize" v-for="district in area.districts">{{ district }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.list-title {
  @apply font-medium;
}
</style>
