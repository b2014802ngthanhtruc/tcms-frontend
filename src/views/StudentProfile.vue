<script setup lang="ts">
import ChangePassword from '@/components/auth/ChangePassword.vue'
import StudentAvatar from '@/components/student/StudentAvatar.vue'
import StudentAvatarModal from '@/components/student/StudentAvatarModal.vue'
import StudentForm from '@/components/student/StudentForm.vue'
import { GET_IMG_API } from '@/constants/eviroment.constant'
import { DEFAULT_AVATAR } from '@/constants/user.constant'
import AuthGeneralService from '@/services/auth/auth-general.service'
import StudentService from '@/services/student/student.service'
import type { ChangePasswordRequest, StudentUpdateProfileRequest, UserLogin } from '@/types'
import type { Student } from '@/types/student.type'
import { clearLS } from '@/utils'
import type { AxiosError } from 'axios'
import { defineComponent, inject, onMounted, ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const studentService = new StudentService()
const authService = new AuthGeneralService()

const student = ref<Student | null>(null)
const user = inject<Ref<UserLogin | undefined>>('userLogin')
const router = useRouter()
const isOpenModal = ref(false)
const isChangePassword = ref(false)

const handleOpeneModal = () => {
  isOpenModal.value = true
}

const handleOpenChangePassword = () => {
  isChangePassword.value = true
}

const handleUpdateProfile = async (data: StudentUpdateProfileRequest) => {
  try {
    console.log('data', data)
    await studentService.updateProfile(data)
    toast.success('Cập nhật hồ sơ thành công')
    student.value = await studentService.getProfile()
    if (user && user.value) {
      user.value.username = student.value!.fullName
      user.value.avatar = student.value!.avatar
    }
    isOpenModal.value = false
  } catch (error) {
    console.error('Failed to update profile:', error)
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleChangePassword = async (data: ChangePasswordRequest) => {
  try {
    await authService.changePassword(data)
    toast.success('Đổi mật khẩu thành công')
    isChangePassword.value = false
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleLogout = () => {
  clearLS()
  if (user) {
    user.value = undefined
  }
  router.replace({ name: 'home' })
}

onMounted(async () => {
  try {
    const result = await studentService.getProfile()
    console.log(result)
    student.value = result
  } catch (error) {
    console.log(error)
  }
})

watch(
  () => user?.value,
  (newValue) => {
    if (!newValue) {
      router.replace({ name: 'home' })
    }
  }
)
</script>
<template>
  <div class="container mx-auto mt-4 w-full overflow-y-auto rounded-lg bg-blue-50 px-2">
    <StudentAvatarModal v-model="isOpenModal" @update-avatar="handleUpdateProfile" />
    <ChangePassword v-model="isChangePassword" @change-password="handleChangePassword" />
    <div class="grid w-full grid-flow-col-dense gap-4 divide-x-2 divide-gray-300">
      <div
        class="col-span-1 grid h-full w-96 grid-flow-row-dense justify-items-center gap-4 py-4 text-lg"
      >
        <div class="h-96 w-96">
          <StudentAvatar
            :url="student?.avatar ? `${GET_IMG_API}/${student?.avatar}` : DEFAULT_AVATAR"
            :enable-edit="true"
            @update:url="handleOpeneModal"
          />
        </div>

        <div class="mt-3 flex flex-auto self-center p-2 text-3xl font-medium italic text-gray-400">
          <h1>{{ student?.email }}</h1>
        </div>
        <p
          @click="handleOpenChangePassword"
          class="flex flex-auto cursor-pointer rounded-lg p-2 hover:underline"
        >
          Đổi mật khẩu
        </p>
        <p
          @click="handleLogout"
          class="flex flex-auto cursor-pointer rounded-lg p-2 hover:underline"
        >
          Đăng xuất
        </p>
      </div>
      <div class="max-h-screen overflow-hidden overflow-y-auto bg-white">
        <StudentForm
          :student="student"
          :title="'Cập nhật hồ sơ'"
          v-if="student"
          @complete-student-profile="handleUpdateProfile"
        />
      </div>
    </div>
  </div>
</template>
