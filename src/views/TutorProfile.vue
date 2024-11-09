<script setup lang="ts">
import TutorAvatar from '@/components/tutor/TutorAvatar.vue'
import TutorForm from '@/components/tutor/TutorForm.vue'
import { DEFAULT_AVATAR } from '@/constants/user.constant'
import TutorService from '@/services/tutor/tutor.service'
import type { TutorUpdateProfileRequest } from '@/types'
import type { Tutor } from '@/types/tutor.type'
import { getUserLoginFromLS } from '@/utils'
import type { AxiosError } from 'axios'
import { computed, onBeforeMount, onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const tutorService = new TutorService()

const tutor = ref<Tutor | null>(null)
const user = computed(() => getUserLoginFromLS())
const router = useRouter()

const updateProfile = async (data: TutorUpdateProfileRequest) => {
  try {
    console.log('data', data)
    await tutorService.updateProfile(data)
    toast.success('Update profile successfully')
    const result = await tutorService.getProfile()
    console.log('Profile', result)
    tutor.value = result
  } catch (error) {
    console.error('Failed to update profile:', error)
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
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

watchEffect(async () => {
  if (!user.value) router.push({ name: 'home' })
})
</script>
<template>
  <div class="container mx-auto mt-4 w-full overflow-y-auto rounded-lg bg-blue-50 px-2">
    <div class="grid w-full grid-flow-col-dense gap-4 divide-x-2 divide-gray-300">
      <div
        class="col-span-1 grid h-96 w-96 grid-flow-row-dense justify-items-center gap-4 py-4 text-lg"
      >
        <TutorAvatar :url="tutor?.avatar ?? DEFAULT_AVATAR" />
        <div class="mt-3 flex flex-auto self-center p-2 text-3xl font-medium italic text-gray-400">
          <h1>{{ tutor?.email }}</h1>
        </div>
        <a href="#" class="flex flex-auto rounded-lg p-2 hover:underline">Change password</a>
        <a href="#" class="flex flex-auto rounded-lg p-2 hover:underline">Logout</a>
      </div>
      <div class="max-h-screen overflow-hidden overflow-y-auto bg-white">
        <TutorForm :profile="tutor" v-if="tutor" @tutor-update-profile="updateProfile" />
      </div>
    </div>
  </div>
</template>
