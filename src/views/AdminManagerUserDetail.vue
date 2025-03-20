<script setup lang="ts">
import AppConfirmPopup from '@/components/shared/AppConfirmPopup.vue'
import USerDetail from '@/components/user/UserDetail.vue'
import { Status } from '@/enums'
import AdminUserService from '@/services/user/admin-user.service'
import type { UserResponse } from '@/types'
import type { AxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const adminUserService = new AdminUserService()
const props = defineProps<{ id: string }>()
const user = ref<UserResponse>()
const router = useRouter()
const isOpenModal = ref<boolean>(false)

const handleChangeStatus = async (status: string) => {
  console.log('status', status)
  try {
    await adminUserService.changeStatus(props.id, status)
    const result = await adminUserService.getDetail(props.id)
    user.value = result
    toast.success(
      `${status === Status.BLOCKED ? 'Khóa tài khoản thành công' : 'Mở khóa tài khoản thành công'}`
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

const handleDeleteUser = async () => {
  try {
    await adminUserService.deleteUser(props.id)
    isOpenModal.value = false
    router.replace({ name: 'admin-manager-users' }).then(() => {
      toast.success('Xóa tài khoản thành công')
    })
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleGetDetailTutor = async () => {
  router.push({ name: 'admin-manager-tutor-detail', params: { id: user.value?.tutor.id } })
}

const handleGetDetailStudent = async (id: string) => {
  router.push({ name: 'admin-manager-student-detail', params: { id } })
}

onMounted(async () => {
  user.value = await adminUserService.getDetail(props.id)
})
</script>
<template>
  <div class="container mx-auto my-4 bg-white shadow-lg shadow-gray-400">
    <AppConfirmPopup
      :title="'Bạn có chắc chắn muốn xóa tài khoản này'"
      v-model="isOpenModal"
      @confirm="handleDeleteUser"
    />
    <USerDetail
      v-if="user"
      :user="user"
      @change-status="handleChangeStatus"
      @delete-user="handleRequiredConfirm"
      @detail-student="handleGetDetailStudent"
      @detail-tutor="handleGetDetailTutor"
    />
  </div>
</template>
