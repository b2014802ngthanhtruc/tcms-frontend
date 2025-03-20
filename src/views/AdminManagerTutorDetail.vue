<script setup lang="ts">
import AppConfirmPopup from '@/components/shared/AppConfirmPopup.vue'
import TutorDetail from '@/components/tutor/TutorDetail.vue'
import { Status } from '@/enums'
import AdminTutorService from '@/services/tutor/admin-tutor.service'
import GeneralTutorService from '@/services/tutor/general-tutor.service'
import type { Tutor } from '@/types/tutor.type'
import type { AxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const adminTutorService = new AdminTutorService()

const props = defineProps<{
  id: string
}>()
const tutor = ref<Tutor>()
const router = useRouter()
const isOpenModal = ref(false)

const handleChangeStatus = async (status: string) => {
  try {
    await adminTutorService.changeStatus(props.id, status)
    const result = await adminTutorService.findOne(props.id)
    tutor.value = result
    toast.success(
      `${status === Status.BLOCKED ? 'Khóa hồ sơ gia sư công' : 'Mở khóa hồ sơ gia sư thành công'}`
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

const handleDeleteTutor = async () => {
  try {
    await adminTutorService.delete(props.id)
    isOpenModal.value = false
    router.replace({ name: 'admin-manager-users' }).then(() => {
      toast.success('Xóa hồ sơ gia sư công')
    })
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

onMounted(async () => {
  try {
    tutor.value = await adminTutorService.findOne(props.id)
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
      @confirm="handleDeleteTutor"
      :title="'Bạn có chắc chắn muốn xóa hồ sơ gia sư này'"
    />
    <TutorDetail
      v-if="tutor"
      :tutor="tutor"
      @change-status="handleChangeStatus"
      @delete-tutor="handleRequiredConfirm"
    />
  </div>
</template>
