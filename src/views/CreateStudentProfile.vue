<script setup lang="ts">
import StudentCompleteProfile from '@/components/auth/StudentCompleteProfile.vue'
import AuthStudentService from '@/services/auth/auth-student.service'
import type { StudentCompleteRegisterRequest } from '@/types'
import type { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { string } from 'yup'

const authStudentService = new AuthStudentService()
const router = useRouter()

const handleStudentCreateProfile = async (value: StudentCompleteRegisterRequest) => {
  console.log('Create profile')
  try {
    await authStudentService.register(value)
    toast.success('Create profile successfully!')
    router.push({ name: 'home' })
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleReturnHome = () => {
  router.push({ name: 'home' })
}
</script>
<template>
  <div class="container mx-auto">
    <button class="absolute ml-3 mt-3 p-3" @click="handleReturnHome">
      <font-awesome-icon :icon="['fas', 'house']" size="xl" />
    </button>
    <div class="mt-3 flex flex-row justify-center p-4">
      <StudentCompleteProfile
        :title="'Create Profile'"
        @completeStudentProfile="handleStudentCreateProfile"
      />
    </div>
  </div>
</template>
