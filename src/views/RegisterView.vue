<script setup lang="ts">
import RegisterForm from '@/components/auth/RegisterForm.vue'
import StepFlow from '@/components/auth/StepFlow.vue'
import { ref } from 'vue'
import VerifyEmail from '@/components/auth/VerifyEmail.vue'
import ChooseRole from '@/components/auth/ChooseRole.vue'
import TutorCompleteProfile from '@/components/auth/TutorCompleteProfile.vue'
import StudentCompleteProfile from '@/components/auth/StudentCompleteProfile.vue'
import StudentCreateProfile from '@/components/auth/StudentCreateProfile.vue'
import { useRouter } from 'vue-router'
import AuthGeneralService from '@/services/auth/auth-general.service'
import type {
  RegisterRequest,
  StudentCompleteRegisterRequest,
  TutorCompleteRegisterRequest
} from '@/types'
import AuthTutorService from '@/services/auth/auth-tutor.service'
import { getUserIdFromLS, saveUserLoginToLS, setUserIdToLS } from '@/utils'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import type { AxiosError } from 'axios'
import AuthStudentService from '@/services/auth/auth-student.service'
const step = ref(1)
const role = ref('')
const router = useRouter()
const authService = new AuthGeneralService()
const authTutorService = new AuthTutorService()
const authStudentService = new AuthStudentService()
const handleReturnHome = () => {
  router.push({ name: 'home' })
}

const handleRegister = async (value: RegisterRequest) => {
  console.log('Register')

  const user = await authService.getStarted(value.email)
  console.log('user', user)
  setUserIdToLS(user.id)
  if (!user.isVerifiedEmail && user.isRegistered) {
    toast.warning('You have not verified your email! Please verify your email!')
    step.value = 2
    return
  }

  if (!user.isCompleteSignup && user.isRegistered) {
    await authService.resendCode(user.id)
    toast.warning('You have not completed your profile! Please complete your profile!')
    step.value = 3
    return
  }

  try {
    if (!user.isRegistered) {
      const result = await authService.register(value.email, value.password)
      step.value = 2
    } else {
      toast.error('Email already exists!')
    }
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleVerifyEmail = async (code: string) => {
  console.log('Verify email')
  const userId = getUserIdFromLS()
  try {
    await authService.verifyEmail(userId, code)
    step.value = 3
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const hanldeResendCode = async () => {
  console.log('Resend code')
  const userId = getUserIdFromLS()
  try {
    await authService.resendCode(userId)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleChooseRole = (value: string) => {
  console.log('Choose role', value)
  role.value = value
  step.value = value === 'tutor' ? 4 : 3.5
}

const handleCreateProfile = () => {
  console.log('Create profile')

  step.value = 4
}

const handleStudentCompleteProfile = async () => {
  console.log('Complete profile')
  await router.push({ name: 'home' })
  step.value = 5
}

const handleStudentCreateProfile = async (value: StudentCompleteRegisterRequest) => {
  console.log('Create profile')
  try {
    await authStudentService.register(value)
    step.value = 3.5
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleTutorCompleteProfile = async (value: TutorCompleteRegisterRequest) => {
  console.log('Complete profile', value)

  try {
    await authTutorService.register(value)
    const userId = getUserIdFromLS()

    const tutor = await authTutorService.login(userId)
    saveUserLoginToLS({
      id: tutor.id,
      userId: userId,
      isStudent: false,
      isTutor: true
    })
    step.value = 5

    await router.push({ name: 'welcome' })
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}
</script>
<template>
  <div class="h-screen w-full">
    <!-- <button @click="handleReturnHome">Home</button> -->
    <div class="grid h-full w-full grid-cols-2">
      <StepFlow :step="step" @return-home="handleReturnHome" />
      <RegisterForm @register="handleRegister" v-if="step === 1" />
      <VerifyEmail
        v-if="step === 2"
        @submit-code="handleVerifyEmail"
        @resend-code="hanldeResendCode"
      />
      <ChooseRole @choose-role="handleChooseRole" v-if="step === 3" />
      <TutorCompleteProfile
        v-if="step === 4 && role === 'tutor'"
        @tutor-complete-profile="handleTutorCompleteProfile"
      />
      <StudentCompleteProfile
        v-if="step === 4 && role === 'student'"
        :title="'Complete Profile'"
        @complete-student-profile="handleStudentCreateProfile"
      />
      <StudentCreateProfile
        v-if="step === 3.5 && role === 'student'"
        @create-profile="handleCreateProfile"
        @complete-profile="handleStudentCompleteProfile"
      />
    </div>
  </div>
</template>
