<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import ClassInformationCard from './ClassInformationCard.vue'
import type {
  ClassNotification,
  ClassResponse,
  ClassRoom,
  CreateClassNotification,
  UpdateClassNotification
} from '@/types'
import AppButton from '../shared/AppButton.vue'
import { CLASSSTATUSMAP } from '@/constants/class.constant'
import { ButtonStatus, ButtonType, ClassStatus } from '@/enums'
import TutorClassroomService from '@/services/classroom/tutor-classroom.service'
import ClassNotificationCard from './ClassNotificationCard.vue'
import NotificationModal from './NotificationModal.vue'
import type { AxiosError } from 'axios'
import { toast } from 'vue3-toastify'
import AppConfirmPopup from '../shared/AppConfirmPopup.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  classroom: ClassResponse
  enableEdit: boolean
  notification: ClassNotification[]
}>()
const tutorClassroomService = new TutorClassroomService()
const router = useRouter()
const notification = ref<ClassNotification[]>([])
const isOpenModal = ref(false)
const seletedNotification = ref<ClassNotification | undefined>(undefined)
const confirmPopup = ref<{ isOpen: boolean; title: string; deleteNotiId: string }>({
  isOpen: false,
  title: '',
  deleteNotiId: ''
})
const statusColor = (status: string): string => {
  switch (status) {
    case ClassStatus.NEW:
      return 'text-emerald-500 border-emerald-500'
    case ClassStatus.PENDING:
      return 'text-yellow-500 border-yellow-500'
    case ClassStatus.STARTED:
      return 'text-blue-500 border-blue-500'
    case ClassStatus.CANCELED:
      return 'text-red-500 border-red-500'
    case ClassStatus.PAUSED:
      return 'text-gray-500 border-gray-500'
    case ClassStatus.ENDED:
      return 'text-green-500 border-green-500'
    default:
      return 'text-black'
  }
}

const emits = defineEmits(['update-noti', 'get-detail', 'delete-noti', 'update-classroom'])

const handleOpenModal = () => {
  isOpenModal.value = true
}

const handleSelectNotification = (id: string) => {
  if (!props.enableEdit) return
  seletedNotification.value = notification.value.find((noti) => noti.id === id)
  isOpenModal.value = true
}

const handleUpdateModalValue = () => {
  seletedNotification.value = undefined
}

const handleCreateNotification = async (data: CreateClassNotification) => {
  console.log('data', data)

  try {
    await tutorClassroomService.createClassNotification(props.classroom.id, data)
    notification.value = await tutorClassroomService.getNotification(props.classroom.id)
    toast.success('Thêm thông báo mới thành công!')
    isOpenModal.value = false
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleUpdateClassNotification = async (data: UpdateClassNotification, id: string) => {
  console.log('data', data)

  try {
    await tutorClassroomService.updateClassNotification(props.classroom.id, id, data)
    notification.value = await tutorClassroomService.getNotification(props.classroom.id)
    toast.success('Cập nhật thông báo thành công!')
    isOpenModal.value = false
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleDeleteNotification = (id: string) => {
  if (!props.enableEdit) return
  confirmPopup.value = {
    isOpen: true,
    title: 'Bạn có chắc chắn muốn xóa thông báo này',
    deleteNotiId: id
  }
}

const handleConfirmDeleteNotification = async () => {
  confirmPopup.value.isOpen = false
  try {
    await tutorClassroomService.deleteClassNotification(
      props.classroom.id,
      confirmPopup.value.deleteNotiId
    )
    notification.value = await tutorClassroomService.getNotification(props.classroom.id)
    toast.success('Xóa thông báo thành công!')
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleGotoEditClass = () => {
  emits('update-classroom')
}

onMounted(async () => {
  console.log('enable-edit', props.enableEdit)
  notification.value = props.notification
  console.log('notification', notification.value)
  console.log('classroom', props.classroom)
})

defineComponent({ name: 'ClassDetailManager' })
</script>
<template>
  <div class="grid w-full grid-flow-col-dense gap-6">
    <NotificationModal
      v-model="isOpenModal"
      @create-noti="handleCreateNotification"
      @update-noti="handleUpdateClassNotification"
      :class-noti="seletedNotification"
      :title="seletedNotification ? 'Cập nhật thông báo' : 'Thêm thông báo'"
      @update:model-value="handleUpdateModalValue"
    />
    <AppConfirmPopup
      :title="confirmPopup.title"
      v-model="confirmPopup.isOpen"
      @confirm="handleConfirmDeleteNotification"
    />
    <ClassInformationCard
      :classroom="classroom"
      @eidt-class="handleGotoEditClass"
      :enable-edit="enableEdit"
    />
    <div class="col-span-8">
      <div class="relative grid grid-flow-col-dense justify-items-center gap-5">
        <div
          :class="[
            statusColor(classroom.status),
            'col-span-2 w-full rounded-lg border p-2 text-center'
          ]"
        >
          <p>{{ CLASSSTATUSMAP[classroom.status] }}</p>
        </div>
        <div class="group col-span-8 max-w-80 cursor-default self-center text-xl font-bold">
          <h1 class="w-full truncate">
            {{ classroom.className }}
          </h1>
          <h1
            class="absolute left-0 top-full z-10 hidden w-full rounded-b-md bg-white p-2 text-center text-gray-400 shadow-md group-hover:block"
          >
            {{ classroom.className }}
          </h1>
        </div>

        <AppButton
          v-if="classroom.status === ClassStatus.STARTED && enableEdit"
          :content="'Thêm thông báo mới +'"
          :status="ButtonStatus.PRIMARY"
          :type="ButtonType.OUTLINE"
          @click="handleOpenModal"
        />
      </div>
      <div class="mt-4 grid w-full grid-flow-row-dense justify-items-center gap-3">
        <ClassNotificationCard
          v-if="notification.length > 0"
          v-for="notificationItem in notification"
          :key="notificationItem.id"
          :notification="notificationItem"
          :enable-edit="props.enableEdit"
          @update-noti="handleSelectNotification"
          @delete-noti="handleDeleteNotification"
        />
        <p v-else>Không có thông báo cho lớp học</p>
      </div>
    </div>
  </div>
</template>
