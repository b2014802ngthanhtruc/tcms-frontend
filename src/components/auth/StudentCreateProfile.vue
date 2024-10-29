<script setup lang="ts">
import { ButtonStatus, ButtonType } from '@/enums'
import type { ListStudentProfileItem } from '@/types'
import { defineComponent, onMounted, ref } from 'vue'
import AppButton from '../shared/AppButton.vue'
import AuthStudentService from '@/services/auth/auth-student.service'
import { getUserIdFromLS, toNormalize } from '@/utils'
import type { AxiosError } from 'axios'
import { toast } from 'vue3-toastify'

const authStudentService = new AuthStudentService()

const profiles = ref<ListStudentProfileItem[]>([])

const emit = defineEmits(['createProfile', 'completeProfile'])

const handleCreateProfile = () => {
  emit('createProfile')
}

const handleCompleteProfile = () => {
  emit('completeProfile')
}

onMounted(async () => {
  const userId = getUserIdFromLS()
  try {
    profiles.value = await authStudentService.listProfiles(userId)
    console.log('profiles', profiles.value)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
})

defineComponent({ name: 'StudentCreateProfile' })
</script>
<template>
  <div
    class="grid max-h-full w-full grid-flow-row-dense justify-self-center overflow-y-scroll px-28 py-6 shadow-lg shadow-gray-400"
  >
    <div class="title-create-profile">
      <h1>Create New Profile</h1>
    </div>
    <div class="grid h-full w-full grid-flow-row-dense justify-items-center">
      <div
        v-if="profiles.length === 0"
        class="flex flex-col justify-center gap-6 self-start rounded-lg bg-white p-10 text-2xl shadow-sky-200 drop-shadow-lg"
      >
        <h3 class="text-3xl font-bold">You don't have any profile</h3>
        <div
          class="group flex flex-auto cursor-pointer justify-center gap-4"
          @click="handleCreateProfile"
        >
          <h5>Please create new profile</h5>
          <font-awesome-icon :icon="['fas', 'circle-plus']" size="xl" style="color: #74c0fc" />
        </div>
      </div>
      <div v-else class="grid h-full w-full grid-flow-row-dense gap-4">
        <ul role="list" class="flex flex-auto flex-col gap-2 rounded-md last:border-none">
          <li
            v-for="item in profiles"
            :key="item.id"
            class="grid grid-flow-row-dense gap-4 rounded-md bg-white p-10 text-lg capitalize shadow-sky-400 drop-shadow-lg"
          >
            <p>Name: {{ item.fullName }}</p>
            <p>Gender: {{ item.gender }}</p>
            <p>Class: {{ toNormalize(item.grade) + ' - ' + toNormalize(item.class) }}</p>
          </li>
        </ul>
        <div
          class="group mt-4 flex h-3/5 w-10/12 flex-auto cursor-pointer justify-center gap-6 justify-self-center rounded-3xl bg-white p-2 text-2xl shadow-sky-200 drop-shadow-lg hover:bg-sky-100"
          @click="handleCreateProfile"
        >
          <h5 class="self-center">Create new profile</h5>
          <font-awesome-icon
            :icon="['fas', 'circle-plus']"
            size="2xl"
            style="color: #74c0fc"
            class="self-center"
          />
        </div>
      </div>
    </div>
    <div
      class="mt-5 flex h-16 w-8/12 flex-auto justify-center justify-self-center"
      v-if="profiles.length > 0"
    >
      <AppButton
        :status="ButtonStatus.SUCCESS"
        :type="ButtonType.FULL_FILL"
        :content="'Next'"
        @click="handleCompleteProfile"
      />
    </div>
  </div>
</template>
<style scoped>
.title-create-profile {
  @apply grid w-full grid-flow-row-dense justify-center pt-4 text-4xl font-bold;
}
</style>
