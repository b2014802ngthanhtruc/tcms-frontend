<script setup lang="ts">
import AppModal from '@/components/tutor/TutorAvatarModal.vue'
import TutorAvatar from '@/components/tutor/TutorAvatar.vue'
import TutorForm from '@/components/tutor/TutorForm.vue'
import { GET_IMG_API } from '@/constants/eviroment.constant'
import { DEFAULT_AVATAR } from '@/constants/user.constant'
import TutorService from '@/services/tutor/tutor.service'
import type { ChangePasswordRequest, TutorUpdateProfileRequest, UserLogin } from '@/types'
import type { Tutor } from '@/types/tutor.type'
import { clearLS, getUserLoginFromLS } from '@/utils'
import type { AxiosError } from 'axios'
import { computed, inject, onBeforeMount, onMounted, ref, watch, watchEffect, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import TutorAvatarModal from '@/components/tutor/TutorAvatarModal.vue'
import ChangePassword from '@/components/auth/ChangePassword.vue'
import AuthGeneralService from '@/services/auth/auth-general.service'

const tutorService = new TutorService()
const authService = new AuthGeneralService()

const tutor = ref<Tutor | null>(null)
const user = inject<Ref<UserLogin | undefined>>('userLogin')
const router = useRouter()
const isOpenModal = ref(false)
const isChangePassword = ref(false)

const updateProfile = async (data: TutorUpdateProfileRequest) => {
  try {
    console.log('data', data)
    await tutorService.updateProfile(data)
    toast.success('Cập nhật hồ sơ thành công')
    const result = await tutorService.getProfile()
    console.log('Profile', result)
    tutor.value = result
    if (user && user.value) {
      user.value.username = result.fullName
      user.value.avatar = result.avatar
    }

    console.log('user login: ', user?.value)
    isOpenModal.value = false
  } catch (error) {
    console.error('Failed to update profile:', error)
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleOpenModal = () => {
  console.log('open modal')
  isOpenModal.value = true
}

const handleOpenChangePassword = () => {
  isChangePassword.value = true
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
    const result = await tutorService.getProfile()
    console.log('Profile', result)
    tutor.value = result
  } catch (error) {
    console.error('Failed to fetch profile:', error)
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
    <TutorAvatarModal v-model="isOpenModal" @confirm="updateProfile" />
    <ChangePassword v-model="isChangePassword" @change-password="handleChangePassword" />
    <div class="grid w-full grid-flow-col-dense gap-4 divide-x-2 divide-gray-300">
      <div
        class="col-span-1 grid h-full w-96 grid-flow-row-dense justify-items-center gap-4 py-4 text-lg"
      >
        <div class="h-96 w-96">
          <TutorAvatar
            :url="tutor?.avatar ? `${GET_IMG_API}/${tutor?.avatar}` : DEFAULT_AVATAR"
            :enable-edit="true"
            @update:url="handleOpenModal"
          />
        </div>

        <div class="mt-3 flex flex-auto self-center p-2 text-3xl font-medium italic text-gray-400">
          <h1>{{ tutor?.email }}</h1>
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
        <TutorForm :profile="tutor" v-if="tutor" @tutor-update-profile="updateProfile" />
      </div>
    </div>
  </div>
</template>
