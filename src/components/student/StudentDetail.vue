<script setup lang="ts">
import { CLASSLEVELMAP } from '@/constants/class.constant'
import { GET_IMG_API } from '@/constants/eviroment.constant'
import { GENDERMAP } from '@/constants/gender.constant'
import { DEFAULT_AVATAR, USERSTATUSMAP } from '@/constants/user.constant'
import type { Student } from '@/types/student.type'
import { computed, defineComponent, onMounted, ref } from 'vue'
import AppButton from '../shared/AppButton.vue'
import { ButtonStatus, ButtonType, Status } from '@/enums'

const props = defineProps<{
  student: Student
  enableEdit?: boolean
}>()
const emits = defineEmits(['change-status', 'delete-student'])

const allowEdit = ref(false)
const color = computed(() => {
  switch (props.student.status) {
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
  const status = props.student.status === Status.ACTIVE ? Status.BLOCKED : Status.ACTIVE
  emits('change-status', status)
}

const handleDelete = () => {
  emits('delete-student')
}

onMounted(() => {
  allowEdit.value = props.enableEdit ?? false
  console.log(allowEdit.value)
})
defineComponent({ name: 'StudentDetail' })
</script>
<template>
  <div class="flex flex-col justify-items-center gap-5 p-4">
    <div class="grid grid-flow-col-dense justify-between gap-3" v-if="allowEdit">
      <div class="flex flex-col justify-items-center">
        <p class="text-2xl font-bold">Trạng thái</p>
        <p :class="[color, 'text-lg font-medium']">{{ USERSTATUSMAP[props.student.status] }}</p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <AppButton
          v-if="student.status === Status.BLOCKED"
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
  </div>
  <div class="my-3 grid w-full grid-flow-col-dense p-3">
    <div class="h-80 w-80 rounded-full">
      <img
        :src="student.avatar ? `${GET_IMG_API}/${student.avatar}` : `${DEFAULT_AVATAR}`"
        alt=""
        class="h-full w-full rounded-full object-cover"
      />
    </div>
    <div class="grid grid-flow-row-dense justify-items-center">
      <div class="flex flex-auto">
        <h1 class="text-xl font-bold">{{ student.fullName }}</h1>
      </div>
      <div class="grid grid-cols-2">
        <p><span class="list-title">Số điện thoại: </span>{{ student.phone }}</p>
        <p>
          <span class="list-title">Ngày sinh: </span
          >{{ new Date(student.dob).toLocaleDateString('en-GB') }}
        </p>
        <p><span class="list-title">Giới tính: </span>{{ GENDERMAP[student.gender] }}</p>
        <p><span class="list-title">Địa chỉ: </span>{{ student.address.fullAddress }}</p>
        <p>
          <span class="list-title">Họ tên phụ huynh: </span
          >{{ student.parentName ?? 'Chờ cập nhật' }}
        </p>
        <p><span class="list-title">Lớp: </span>{{ CLASSLEVELMAP[student.class] }}</p>
        <p><span class="list-title col-span-2">Mô tả: </span>{{ student.descrition }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.list-title {
  @apply font-medium;
}
</style>
