<script setup lang="ts">
import AppConfirmPopup from '@/components/shared/AppConfirmPopup.vue'
import StudentDetail from '@/components/student/StudentDetail.vue'
import { Status } from '@/enums'
import AdminStudentService from '@/services/student/admin-student.service'
import type { Student } from '@/types/student.type'
import type { AxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const adminStudentService = new AdminStudentService()

const props = defineProps<{ id: string }>()
const student = ref<Student>()
const isOpenModal = ref<boolean>(false)
const router = useRouter()

const handleChangeStatus = async (status: string) => {
  try {
    await adminStudentService.changeStatus(props.id, status)
    const result = await adminStudentService.getDetail(props.id)
    student.value = result
    toast.success(
      `${status === Status.BLOCKED ? 'Khóa tài khoản học sinh thành công' : 'Mở khóa tài khoản học sinh thành công'}`
    )
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleRequiredConfirm = () => {
  isOpenModal.value = true
}

const handleDelete = async () => {
  isOpenModal.value = false
  try {
    await adminStudentService.delete(props.id)
    router.replace({ name: 'admin-manager-users' }).then(() => {
      toast.success('Xóa học sinh thành công')
    })
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

onMounted(async () => {
  try {
    student.value = await adminStudentService.getDetail(props.id)
    console.log('student', student.value)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
})
</script>
<template>
  <div class="container mx-auto my-4 bg-white shadow-lg shadow-gray-400">
    <AppConfirmPopup
      v-if="isOpenModal"
      v-model="isOpenModal"
      @confirm="handleDelete"
      :title="'Bạn có chắc chắn muốn xóa học sinh này'"
    />
    <StudentDetail
      :student="student"
      v-if="student"
      :enable-edit="true"
      @change-status="handleChangeStatus"
      @delete-student="handleRequiredConfirm"
    />
  </div>
</template>
