<script setup lang="ts">
import { DEFAULT_AVATAR, USERSTATUSMAP } from '@/constants/user.constant'
import { ButtonStatus, ButtonType, Status } from '@/enums'
import type { UserResponse } from '@/types'
import { computed, defineComponent, onMounted, ref } from 'vue'
import AppButton from '../shared/AppButton.vue'
import { GET_IMG_API } from '@/constants/eviroment.constant'
import { GENDERMAP } from '@/constants/gender.constant'
import { toCurrency } from '@/utils'
import { CLASSLEVELMAP } from '@/constants/class.constant'
import StudentTable from '../student/StudentTable.vue'

const props = defineProps<{ user: UserResponse }>()
const emits = defineEmits(['change-status', 'delete-user', 'detail-tutor', 'detail-student'])
const color = computed(() => {
  switch (props.user.status) {
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
  const status = props.user.status === Status.ACTIVE ? Status.BLOCKED : Status.ACTIVE
  emits('change-status', status)
}

const handleDeleteUser = () => {
  emits('delete-user')
}

const handleDetailTutor = () => {
  emits('detail-tutor')
}

const handleDetailStudent = (id: string) => {
  emits('detail-student', id)
}

defineComponent({ name: 'USerDetail' })
</script>
<template>
  <div class="flex flex-col justify-items-center gap-5 p-4">
    <div class="grid grid-flow-col-dense justify-between gap-3">
      <div class="flex flex-col justify-items-center">
        <p class="text-2xl font-bold">Trạng thái</p>
        <p :class="[color, 'text-lg font-medium']">{{ USERSTATUSMAP[props.user.status] }}</p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <AppButton
          v-if="user.status === Status.BLOCKED"
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
          @click="handleDeleteUser"
        />
      </div>
    </div>
    <div class="grid grid-flow-col-dense justify-between gap-3 text-2xl">
      <p><span class="font-semibold">Email: </span>{{ props.user.email }}</p>
      <p><span class="font-semibold">Username: </span>{{ props.user.username ?? '-' }}</p>
    </div>
    <div class="flex flex-auto gap-3 text-2xl font-semibold">
      <h1>Hồ sơ gia sư:</h1>
      <button v-if="props.user.tutor" class="hover:underline" @click="handleDetailTutor">
        <h1>{{ props.user.tutor.fullName }}</h1>
      </button>
    </div>
    <div class="grid w-full grid-flow-row-dense justify-between gap-3" v-if="props.user.tutor">
      <div class="my-4 flex flex-auto justify-center gap-20">
        <div class="w-80">
          <div class="h-52 w-52 rounded-full bg-slate-200">
            <img
              :src="
                props.user.tutor.avatar
                  ? `${GET_IMG_API}/${props.user.tutor.avatar}`
                  : DEFAULT_AVATAR
              "
              alt=""
              class="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
        <div class="grid w-80 grid-flow-row gap-4">
          <p class="mb-2">
            <span class="list-title">Ngày sinh:</span>
            {{ new Date(props.user.tutor.dob).toLocaleDateString('en-GB') }}
          </p>
          <p class="mb-2">
            <span class="list-title">Giới tính:</span> {{ GENDERMAP[props.user.tutor.gender] }}
          </p>
          <p class="mb-2">
            <span class="list-title">Số điện thoại:</span>{{ props.user.tutor.phone }}
          </p>
          <p class="mb-2">
            <span class="list-title">Địa chỉ: </span>{{ props.user.tutor.address.fullAddress }}
          </p>
          <p class="mb-2"><span class="list-title">Giới thiệu: </span></p>
        </div>
        <div class="grid w-80 grid-flow-row gap-4">
          <p class="mb-2">
            <span class="list-title">Trình độ: </span
            >{{ props.user.tutor.educationalQualification.degree }}
          </p>
          <p class="mb-2">
            <span class="list-title">Đại học/Cơ quan: </span>
            {{ props.user.tutor.educationalQualification.university }}
          </p>
          <p class="mb-2">
            <span class="list-title">Chuyên ngành: </span
            >{{ props.user.tutor.educationalQualification.major }}
          </p>
          <div class="mb-2 flex flex-auto gap-5">
            <p>
              <span class="list-title">Năm bắt đầu: </span
              >{{ props.user.tutor.educationalQualification.startYear }}
            </p>
            <p>
              <span class="list-title">Năm kết thúc: </span
              >{{ props.user.tutor.educationalQualification.endYear }}
            </p>
          </div>
          <p class="mb-2">
            <span class="list-title">Mức lương: </span
            >{{ toCurrency(props.user.tutor.expectSalary) }}/Buổi
          </p>
        </div>
      </div>
    </div>
    <div v-else class="flex h-full items-center justify-center text-lg">
      <p>Không có dữ liệu</p>
    </div>
    <div class="flex flex-auto gap-3 text-2xl font-semibold">
      <h1>Hồ sơ học sinh:</h1>
    </div>
    <div class="flex flex-auto gap-20">
      <StudentTable
        :students="props.user.students"
        :offset="0"
        :enable-edit="false"
        @select-student="handleDetailStudent"
      />
    </div>
  </div>
</template>
<style scoped>
.list-title {
  @apply font-medium;
}
</style>
