<script setup lang="ts">
import {
  CLASSLEVELMAP,
  CLASSSTATUSMAP,
  DAYOFWEEKMAP,
  SCOPEMAP,
  SESSIONMAP
} from '@/constants/class.constant'
import { ButtonStatus, ButtonType, ClassStatus } from '@/enums'
import type { AddClassDocument, ClassDocument, ClassNotification, ClassResponse } from '@/types'
import { capitalize, computed, defineComponent, ref, watch } from 'vue'
import AppButton from '../shared/AppButton.vue'
import { toCurrency, toFormatTime } from '@/utils'
import { GET_IMG_API } from '@/constants/eviroment.constant'
import { DEFAULT_AVATAR } from '@/constants/user.constant'
import { GENDERMAP } from '@/constants/gender.constant'
import StudentTable from '../student/StudentTable.vue'
import ClassNotificationCard from './ClassNotificationCard.vue'
import ClassDetailManagerDocument from './ClassDetailManagerDocument.vue'

const props = defineProps<{
  classroom: ClassResponse
  notifications: ClassNotification[]
  documents: ClassDocument[]
}>()
const emits = defineEmits([
  'eidt-class',
  'delete-class',
  'change-status',
  'tutor-detail',
  'student-detail',
  'create-notification',
  'update-notification',
  'delete-notification',
  'add-document',
  'delete-document'
])

const isOpenButton = ref(false)

const color = computed(() => {
  switch (props.classroom.status) {
    case ClassStatus.NEW:
      return 'text-emerald-500'
    case ClassStatus.PENDING:
      return 'text-yellow-500'
    case ClassStatus.STARTED:
      return 'text-blue-500'
    case ClassStatus.CANCELED:
      return 'text-red-500'
    case ClassStatus.PAUSED:
      return 'text-gray-500'
    case ClassStatus.ENDED:
      return 'text-green-500'
    default:
      return 'text-black'
  }
})

const handleDetailTutor = () => {
  emits('tutor-detail')
}

const handleDetailStudent = (id: string) => {
  emits('student-detail', id)
}

const handeleChangeStatus = (status: string) => {
  emits('change-status', status)
}

const handleDeleteClass = () => {
  emits('delete-class')
}

const handleEditClass = () => {
  emits('eidt-class')
}

const handleCreateNotification = () => {
  emits('create-notification')
}

const handleUpdateNotification = (id: string) => {
  emits('update-notification', id)
}

const handleDeleteNotification = (id: string) => {
  emits('delete-notification', id)
}

const handleAddDocument = (data: AddClassDocument) => {
  emits('add-document', data)
}

const handleDeleteDocument = (id: string) => {
  emits('delete-document', id)
}

watch(
  () => props.classroom,
  () => {
    isOpenButton.value = false
  },
  { deep: true }
)

defineComponent({ name: 'ClassAdminManagerDetail' })
</script>
<template>
  <div class="grid w-full grid-flow-row-dense gap-5">
    <div class="grid grid-flow-col-dense justify-between gap-3">
      <div class="flex flex-col justify-items-center">
        <p class="text-2xl font-bold">Trạng thái</p>
        <p :class="[color, 'text-lg font-medium']">{{ CLASSSTATUSMAP[props.classroom.status] }}</p>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <div class="flex w-full flex-col justify-items-center gap-3">
          <button
            class="w-full rounded-lg bg-yellow-500 p-2 text-center text-white shadow-md shadow-gray-400"
            @click="handleEditClass"
          >
            Cập nhật
          </button>
        </div>
        <div class="flex w-full flex-col justify-items-center gap-3">
          <button
            class="w-full rounded-lg bg-red-500 p-2 text-center text-white shadow-md shadow-gray-400"
            @click="handleDeleteClass"
          >
            Xóa
          </button>
        </div>
        <div class="relative flex flex-col justify-items-center gap-3">
          <button
            @click="isOpenButton = !isOpenButton"
            class="w-full rounded-lg p-2 text-center text-black shadow-md shadow-gray-400 outline outline-1 outline-black"
          >
            Cập nhật trạng thái
          </button>
          <div
            class="absolute top-full grid w-full grid-flow-row-dense justify-items-center gap-3 rounded-lg border border-black bg-white p-2 shadow-md shadow-gray-400"
            v-if="isOpenButton"
          >
            <button
              :value="ClassStatus.NEW"
              :key="ClassStatus.NEW"
              class="w-full rounded-lg p-2 text-center text-emerald-500 outline outline-1 outline-emerald-500 hover:bg-emerald-500 hover:text-white"
              @click="handeleChangeStatus(ClassStatus.NEW)"
            >
              Mới
            </button>
            <button
              :value="ClassStatus.PENDING"
              :key="ClassStatus.PENDING"
              @click="handeleChangeStatus(ClassStatus.PENDING)"
              class="w-full rounded-lg p-2 text-center text-yellow-500 outline outline-1 outline-yellow-500 hover:bg-yellow-500 hover:text-white"
            >
              Chờ duyệt
            </button>
            <button
              :value="ClassStatus.STARTED"
              :key="ClassStatus.STARTED"
              @click="handeleChangeStatus(ClassStatus.STARTED)"
              class="w-full rounded-lg p-2 text-center text-blue-500 outline outline-1 outline-blue-500 hover:bg-blue-500 hover:text-white"
            >
              Đã bắt đầu
            </button>
            <button
              :value="ClassStatus.CANCELED"
              :key="ClassStatus.CANCELED"
              @click="handeleChangeStatus(ClassStatus.CANCELED)"
              class="w-full rounded-lg p-2 text-center text-red-500 outline outline-1 outline-red-500 hover:bg-red-500 hover:text-white"
            >
              Hủy
            </button>
            <button
              :value="ClassStatus.PAUSED"
              :key="ClassStatus.PAUSED"
              @click="handeleChangeStatus(ClassStatus.PAUSED)"
              class="w-full rounded-lg p-2 text-center text-gray-500 outline outline-1 outline-gray-500 hover:bg-gray-500 hover:text-white"
            >
              Tạm dừng
            </button>
            <button
              :value="ClassStatus.ENDED"
              :key="ClassStatus.ENDED"
              @click="handeleChangeStatus(ClassStatus.ENDED)"
              class="w-full rounded-lg p-2 text-center text-green-500 outline outline-1 outline-green-500 hover:bg-green-500 hover:text-white"
            >
              Đã kết thúc
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-auto justify-center">
      <p class="text-2xl font-bold">{{ capitalize(props.classroom.className) }}</p>
    </div>
    <div class="grid w-full grid-flow-row-dense gap-3">
      <p class="text-xl font-bold">Thông tin cơ bản:</p>
      <ul class="grid grid-cols-2 justify-items-center gap-3">
        <li class="list-item">
          <p><span class="font-medium">Môn học: </span>{{ props.classroom.subject.name }}</p>
        </li>
        <li class="list-item font-medium">{{ CLASSLEVELMAP[props.classroom.level] }}</li>
        <li class="list-item">
          <p>
            <span class="font-medium">Học phí: </span
            >{{ classroom.tuitionFee ? toCurrency(classroom.tuitionFee) : 'Chờ cập nhật' }}
          </p>
        </li>
        <li class="list-item">
          <p><span class="font-medium">Phương thức dạy học: </span>{{ classroom.teachingMode }}</p>
        </li>
        <li class="list-item">
          <p><span class="font-medium">Quy mô: </span>{{ SCOPEMAP[classroom.scope] }}</p>
        </li>
        <li class="list-item text-wrap">
          <p>
            <span class="font-medium">Địa điểm: </span
            >{{ classroom.location ? classroom.location?.fullAddress : 'Học online' }}
          </p>
        </li>
        <li class="list-item">
          <p><span class="font-medium">Tổng số học sinh: </span>{{ classroom.quantityStudents }}</p>
        </li>
        <li class="list-item">
          <p>
            <span class="font-medium">Số học sinh đã đăng ký: </span
            >{{ classroom.studentOfClasses.length }}
          </p>
        </li>
        <li class="list-item">
          <p class="font-medium">Ngày bắt đầu:</p>
          <p>{{ new Date(classroom.startedAt).toLocaleDateString('en-GB') }}</p>
        </li>
        <li class="list-item">
          <p class="font-medium">Ngày kết thúc:</p>
          <p>{{ new Date(classroom.endedAt).toLocaleDateString('en-GB') }}</p>
        </li>
        <li class="list-item text-wrap">
          <p>
            <span class="font-medium">Mô tả: </span
            >{{ classroom.description ? classroom.description : 'Không cómô tả' }}
          </p>
        </li>
      </ul>
      <div class="grid grid-flow-row-dense justify-between">
        <p class="text-xl font-bold">Thời khóa biểu:</p>
      </div>
      <ul class="grid grid-flow-row-dense gap-2 indent-2" v-for="schedule in classroom.schedules">
        <li class="font-medium">{{ DAYOFWEEKMAP[schedule.dow] }}</li>
        <li class="grid w-2/3 grid-cols-2 indent-5">
          <span class="italic">{{ SESSIONMAP[schedule.session] }}: </span
          >{{ toFormatTime(schedule.startAt) }} -
          {{ toFormatTime(schedule.endAt) }}
        </li>
      </ul>
    </div>
    <div class="flex flex-auto gap-3 text-2xl font-semibold">
      <h1>Gia sư đảm nhiệm:</h1>
      <button v-if="classroom.tutor" class="capitalize hover:underline" @click="handleDetailTutor">
        <h1>{{ classroom.tutor.fullName }}</h1>
      </button>
    </div>
    <div class="grid w-full grid-flow-row-dense justify-between gap-3" v-if="classroom.tutor">
      <div class="my-4 flex flex-auto justify-center gap-20">
        <div class="w-80">
          <div class="h-52 w-52 rounded-full bg-slate-200">
            <img
              :src="
                classroom.tutor.avatar ? `${GET_IMG_API}/${classroom.tutor.avatar}` : DEFAULT_AVATAR
              "
              alt=""
              class="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
        <div class="grid w-80 grid-flow-row gap-4">
          <p class="mb-2">
            <span class="list-title">Ngày sinh:</span>
            {{ new Date(classroom.tutor.dob).toLocaleDateString('en-GB') }}
          </p>
          <p class="mb-2">
            <span class="list-title">Giới tính:</span> {{ GENDERMAP[classroom.tutor.gender] }}
          </p>
          <p class="mb-2">
            <span class="list-title">Số điện thoại:</span>{{ classroom.tutor.phone }}
          </p>
          <p class="mb-2">
            <span class="list-title">Địa chỉ: </span>{{ classroom.tutor.address.fullAddress }}
          </p>
          <p class="mb-2"><span class="list-title">Giới thiệu: </span></p>
        </div>
        <div class="grid w-80 grid-flow-row gap-4">
          <p class="mb-2">
            <span class="list-title">Trình độ: </span
            >{{ classroom.tutor.educationalQualification.degree }}
          </p>
          <p class="mb-2">
            <span class="list-title">Đại học/Cơ quan: </span>
            {{ classroom.tutor.educationalQualification.university }}
          </p>
          <p class="mb-2">
            <span class="list-title">Chuyên ngành: </span
            >{{ classroom.tutor.educationalQualification.major }}
          </p>
          <div class="mb-2 flex flex-auto gap-5">
            <p>
              <span class="list-title">Năm bắt đầu: </span
              >{{ classroom.tutor.educationalQualification.startYear }}
            </p>
          </div>
          <div class="mb-2 flex flex-auto gap-5">
            <p>
              <span class="list-title">Năm kết thúc: </span
              >{{ classroom.tutor.educationalQualification.endYear }}
            </p>
          </div>
          <p class="mb-2">
            <span class="list-title">Mức lương: </span
            >{{ toCurrency(classroom.tutor.expectSalary) }}/Buổi
          </p>
        </div>
      </div>
    </div>
    <div v-else class="flex h-full items-center justify-center text-lg">
      <p>Không có dữ liệu</p>
    </div>
    <div class="flex flex-auto gap-3 text-2xl font-semibold">
      <h1>Danh sách học sinh:</h1>
    </div>
    <div class="flex flex-auto gap-20">
      <StudentTable
        :students="props.classroom.studentOfClasses"
        :offset="0"
        :enable-edit="false"
        @select-student="handleDetailStudent"
      />
    </div>
    <div class="grid w-full grid-flow-row-dense gap-3">
      <div class="grid grid-flow-col-dense justify-between">
        <h1 class="text-2xl font-semibold">Thông báo của lớp</h1>
        <AppButton
          :content="'Thêm thông báo +'"
          @click="handleCreateNotification"
          :status="ButtonStatus.PRIMARY"
          :type="ButtonType.FULL_FILL"
        />
      </div>
      <div
        v-if="notifications.length > 0"
        class="flex max-h-96 w-full flex-col gap-3 overflow-y-scroll"
      >
        <ClassNotificationCard
          v-for="notification in notifications"
          :enable-edit="true"
          :notification="notification"
          @update-noti="handleUpdateNotification"
          @delete-noti="handleDeleteNotification"
        />
      </div>

      <div v-else class="flex h-full items-center justify-center text-lg">
        <p>Không có dữ liệu</p>
      </div>
    </div>
    <div class="grid w-full grid-flow-row-dense gap-3">
      <div class="grid grid-flow-col-dense justify-between">
        <h1 class="text-2xl font-semibold">Tài liệu của lớp</h1>
      </div>
      <div
        class="flex max-h-96 w-full flex-col gap-3 overflow-y-scroll"
        v-if="documents.length > 0"
      >
        <ClassDetailManagerDocument
          :documents="documents"
          :enable-edit="true"
          @add-document="handleAddDocument"
          @delete-document="handleDeleteDocument"
        />
      </div>
      <div v-else class="flex h-full items-center justify-center text-lg">
        <p>Không có dữ liệu</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.list-title {
  @apply text-lg font-medium;
}
.list-item {
  @apply grid w-full max-w-96 grid-flow-col-dense;
}
</style>
