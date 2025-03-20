<script setup lang="ts">
import ClassAdminManagerDetail from '@/components/classroom/ClassAdminManagerDetail.vue'
import NotificationModal from '@/components/classroom/NotificationModal.vue'
import AppConfirmPopup from '@/components/shared/AppConfirmPopup.vue'
import { Status } from '@/enums'
import AdminClassroomService from '@/services/classroom/admin-classroom.service'
import GeneralClassroomService from '@/services/classroom/general-classroom.service'
import type {
  AddClassDocument,
  ClassDocument,
  ClassNotification,
  ClassResponse,
  CreateClassNotification,
  UpdateClassNotification
} from '@/types'
import type { AxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const classroomService = new GeneralClassroomService()
const adminClassroomService = new AdminClassroomService()
const router = useRouter()

const props = defineProps<{ id: string }>()
const classroom = ref<ClassResponse>()
const isOpenPopup = ref(false)
const isOpenNotiForm = ref(false)
const isOpenNotiCofirm = ref(false)
const notification = ref<ClassNotification[]>([])
const classNotification = ref<ClassNotification>()
const documents = ref<ClassDocument[]>()

const handleGotoTutorDetail = () => {
  router.push({ name: 'admin-manager-tutor-detail', params: { id: classroom.value?.tutorId } })
}

const handleGotoStudentDetail = (id: string) => {
  router.push({ name: 'admin-manager-student-detail', params: { id } })
}

const handleChangeStatus = async (status: string) => {
  try {
    await adminClassroomService.changeStatus(props.id, status)
    const result = await classroomService.findOne(props.id)
    classroom.value = result
    toast.success('Thay đổi trạng thái lớp học thành công')
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleDeleteClassroom = async () => {
  try {
    await adminClassroomService.delete(props.id)
    isOpenPopup.value = false
    router.replace({ name: 'admin-manager-classrooms' }).then(() => {
      toast.success('Xóa lớp học thành công')
    })
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleRequiredConfirm = () => {
  isOpenPopup.value = true
}

const handleEditClassroom = () => {
  router.push({ name: 'admin-manager-update-class', params: { id: props.id } })
}

const handleOpenCreateForm = () => {
  isOpenNotiForm.value = true
}

const handleSelectNotification = (id: string) => {
  classNotification.value = notification.value.find((item) => item.id === id)
  isOpenNotiForm.value = true
}

const handleCreateNotification = async (value: CreateClassNotification) => {
  try {
    await adminClassroomService.addNotification(props.id, value)
    isOpenNotiForm.value = false
    toast.success('Tạo thông báo công công')
    classNotification.value = undefined
    notification.value = await adminClassroomService.getNotification(props.id)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleUpdateNotification = async (value: UpdateClassNotification, id: string) => {
  try {
    await adminClassroomService.updateNotification(props.id, id, value)
    isOpenNotiForm.value = false
    toast.success('Cập nhật thông báo công công')
    classNotification.value = undefined
    notification.value = await adminClassroomService.getNotification(props.id)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleOpenNotiConfirm = (id: string) => {
  classNotification.value = notification.value.find((item) => item.id === id)
  isOpenNotiCofirm.value = true
}

const handleDeleteNotification = async (id: string) => {
  try {
    await adminClassroomService.deleteNotification(props.id, id)
    toast.success('Xóa thông báo thành công')
    classNotification.value = undefined
    notification.value = await adminClassroomService.getNotification(props.id)
    isOpenNotiCofirm.value = false
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleAddDocument = async (data: AddClassDocument) => {
  try {
    await adminClassroomService.addDocument(props.id, data)
    documents.value = await adminClassroomService.getDocuments(props.id)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleDeleteDocument = async (id: string) => {
  try {
    await adminClassroomService.deleteDocument(props.id, id)
    documents.value = await adminClassroomService.getDocuments(props.id)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

onMounted(async () => {
  try {
    classroom.value = await classroomService.findOne(props.id)
    notification.value = await adminClassroomService.getNotification(props.id)
    documents.value = await adminClassroomService.getDocuments(props.id)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
})
</script>
<template>
  <div class="container mx-auto my-4 bg-white p-4 shadow-lg shadow-gray-400">
    <AppConfirmPopup
      v-if="isOpenPopup"
      v-model="isOpenPopup"
      :title="'Bạn có chắc muốn xóa lớp học này?'"
      @confirm="handleDeleteClassroom"
    />
    <AppConfirmPopup
      v-if="isOpenNotiCofirm"
      v-model="isOpenNotiCofirm"
      :title="'Bạn có chắc muốn xóa thông báo này?'"
      @confirm="handleDeleteNotification(classNotification?.id || '')"
    />
    <NotificationModal
      :class-noti="classNotification"
      :title="classNotification ? 'Cập nhật thông báo' : 'Thêm thông báo'"
      v-model="isOpenNotiForm"
      @create-noti="handleCreateNotification"
      @update-noti="handleUpdateNotification"
    />
    <ClassAdminManagerDetail
      :classroom="classroom"
      :notifications="notification"
      :documents="documents"
      v-if="classroom && documents"
      @change-status="handleChangeStatus"
      @delete-class="handleRequiredConfirm"
      @eidt-class="handleEditClassroom"
      @student-detail="handleGotoStudentDetail"
      @tutor-detail="handleGotoTutorDetail"
      @create-notification="handleOpenCreateForm"
      @delete-notification="handleOpenNotiConfirm"
      @update-notification="handleSelectNotification"
      @add-document="handleAddDocument"
      @delete-document="handleDeleteDocument"
    />
  </div>
</template>
