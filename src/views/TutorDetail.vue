<script setup lang="ts">
import { GENDERMAP } from '@/constants/gender.constant'
import GeneralTutorService from '@/services/tutor/general-tutor.service'
import type { Tutor } from '@/types/tutor.type'
import { onMounted, ref } from 'vue'

const generalTutorService = new GeneralTutorService()
const props = defineProps<{ id: string }>()
const tutor = ref<Tutor | null>(null)

onMounted(async () => {
  tutor.value = await generalTutorService.getDetail(props.id)
  console.log('tutor', tutor.value)
})
</script>
<template>
  <div class="container mx-auto bg-white p-6 shadow-md" v-if="tutor">
    <h1 class="text-center text-2xl font-semibold">{{ tutor.fullName }}</h1>
    <div class="mb-4 flex items-center justify-center gap-20">
      <div class="w-80">
        <div class="h-52 w-52 rounded-full bg-slate-200"></div>
      </div>
      <div class="w-80">
        <p class="mb-2">
          <span class="list-title">Ngày sinh:</span>
          {{ new Date(tutor.dob).toLocaleDateString('en-GB') }}
        </p>
        <p class="mb-2"><span class="list-title">Giới tính:</span> {{ GENDERMAP[tutor.gender] }}</p>
        <p class="mb-2"><span class="list-title">Số điện thoại:</span>{{ tutor.phone }}</p>
        <p class="mb-2"><span class="list-title">Địa chỉ: </span>{{ tutor.address.fullAddress }}</p>
        <p class="mb-2"><span class="list-title">Giới thiệu: </span></p>
      </div>
      <div class="w-80">
        <p class="mb-2"><span class="list-title">Bằng cấp: </span></p>
        <p class="mb-2"><span class="list-title">Đại học/Cơ quan: </span></p>
        <p class="mb-2"><span class="list-title">Chuyên ngành: </span></p>
        <div class="mb-2 flex gap-20">
          <p>Start year: <span class="text-gray-700"></span></p>
          <p>End year: <span class="text-gray-700"></span></p>
        </div>
        <p class="mb-2">Expected salary: <span class="text-gray-700"></span></p>
      </div>
    </div>
    <div class="mx-44 mb-4">
      <h2 class="text-lg font-medium">Subjects:</h2>
      <div class="ml-8 grid grid-cols-3 gap-4">
        <div>
          <div class="mb-2">Class 2:</div>
          <div class="ml-8">
            <p class="mb-2">Math</p>
            <p class="mb-2">English</p>
          </div>
        </div>
        <div>
          <div class="mb-2">Class 3:</div>
          <div class="ml-8">
            <p class="mb-2">Math</p>
            <p class="mb-2">English</p>
          </div>
        </div>
        <div class="mb-2">
          <div>Class 6:</div>
          <div class="ml-8">
            <p class="mb-2">Chemistry</p>
          </div>
        </div>
      </div>
    </div>
    <div class="mx-44 mb-4">
      <h2 class="text-lg font-medium">Area:</h2>
      <div class="ml-8">
        <p class="mb-2">City</p>
        <div class="ml-8 flex gap-28">
          <p>District</p>
          <p>District</p>
          <p>District</p>
          <p>District</p>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <button class="w-[150px] rounded-md bg-green-500 py-2 text-white hover:bg-green-600">
        Start learning
      </button>
    </div>
  </div>
</template>
<style scoped>
.list-title {
  @apply font-medium;
}
</style>
