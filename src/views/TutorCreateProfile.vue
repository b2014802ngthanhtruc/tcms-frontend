<script setup lang="ts">
import TutorCompleteProfile from '@/components/auth/TutorCompleteProfile.vue'
import AuthTutorService from '@/services/auth/auth-tutor.service'
import type { TutorCompleteRegisterRequest, UserLogin } from '@/types'
import { getUserIdFromLS, getUserLoginFromLS, saveUserLoginToLS } from '@/utils'
import type { AxiosError } from 'axios'
import { ref } from 'vue'
import { inject, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const authTutorService = new AuthTutorService()
const router = useRouter()

const userLogin = inject<Ref<UserLogin | undefined>>('userLogin', ref(undefined))

const handleTutorCompleteProfile = async (value: TutorCompleteRegisterRequest) => {
  console.log('Complete profile', value)

  try {
    await authTutorService.register(value)
    const userId = getUserIdFromLS()

    const tutor = await authTutorService.login(userId)
    saveUserLoginToLS({
      id: tutor.id,
      userId: userId,
      username: `${tutor.firstName} ${tutor.lastName}`,
      isStudent: false,
      isTutor: true,
      isAdmin: false,
      avatar: tutor.avatar
    })
    userLogin.value = getUserLoginFromLS()

    await router.replace({ name: 'welcome' })
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}
</script>
<template>
  <div class="container mx-auto">
    <TutorCompleteProfile @tutor-complete-profile="handleTutorCompleteProfile" />
  </div>
</template>
