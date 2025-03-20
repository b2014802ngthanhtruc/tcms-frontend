<script setup lang="ts">
import { CLASSLEVELMAP } from '@/constants/class.constant'
import { GET_IMG_API } from '@/constants/eviroment.constant'
import { GENDERMAP } from '@/constants/gender.constant'
import { DEFAULT_AVATAR } from '@/constants/user.constant'
import GeneralTutorService from '@/services/tutor/general-tutor.service'
import type { UserLogin } from '@/types'
import type { Tutor } from '@/types/tutor.type'
import { toCurrency } from '@/utils'
import { inject, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const generalTutorService = new GeneralTutorService()
const props = defineProps<{ id: string }>()
const tutor = ref<Tutor | null>(null)
const router = useRouter()
const user = inject<Ref<UserLogin | undefined>>('userLogin')

const handleStartLearning = () => {
  router.push({
    name: 'start-learning',
    params: { id: props.id }
  })
}

onMounted(async () => {
  tutor.value = await generalTutorService.getDetail(props.id)
  console.log('tutor', tutor.value)
})
</script>
<template>
  <div class="container mx-auto bg-white p-6 shadow-md" v-if="tutor">
    <h1 class="text-center text-2xl font-semibold">{{ tutor.fullName }}</h1>
    <div class="my-4 flex items-center justify-center gap-20">
      <div class="w-80">
        <div class="h-52 w-52 rounded-full bg-slate-200">
          <img
            :src="tutor.avatar ? `${GET_IMG_API}/${tutor.avatar}` : DEFAULT_AVATAR"
            alt=""
            class="h-full w-full rounded-full object-cover"
          />
        </div>
      </div>
      <div class="grid w-80 grid-flow-row gap-4">
        <p class="mb-2">
          <span class="list-title">Ngày sinh:</span>
          {{ new Date(tutor.dob).toLocaleDateString('en-GB') }}
        </p>
        <p class="mb-2"><span class="list-title">Giới tính:</span> {{ GENDERMAP[tutor.gender] }}</p>
        <p class="mb-2"><span class="list-title">Số điện thoại:</span>{{ tutor.phone }}</p>
        <p class="mb-2"><span class="list-title">Địa chỉ: </span>{{ tutor.address.fullAddress }}</p>
        <p class="mb-2"><span class="list-title">Giới thiệu: </span></p>
      </div>
      <div class="grid w-80 grid-flow-row gap-4">
        <p class="mb-2">
          <span class="list-title">Trình độ: </span>{{ tutor.educationalQualification.degree }}
        </p>
        <p class="mb-2">
          <span class="list-title">Đại học/Cơ quan: </span>
          {{ tutor.educationalQualification.university }}
        </p>
        <p class="mb-2">
          <span class="list-title">Chuyên ngành: </span>{{ tutor.educationalQualification.major }}
        </p>
        <div class="mb-2 flex flex-auto gap-5">
          <p>
            <span class="list-title">Năm bắt đầu: </span
            >{{ tutor.educationalQualification.startYear }}
          </p>
          <p>
            <span class="list-title">Năm kết thúc: </span
            >{{ tutor.educationalQualification.endYear }}
          </p>
        </div>
        <p class="mb-2">
          <span class="list-title">Mức lương: </span>{{ toCurrency(tutor.expectSalary) }}/Buổi
        </p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-10">
      <div class="mx-44 mb-4">
        <h2 class="text-lg font-medium">Các môn học:</h2>
        <div class="ml-8 grid grid-flow-dense gap-4">
          <div v-for="job in tutor.jobReferences">
            <div class="mb-2">{{ CLASSLEVELMAP[job.class] }}</div>
            <div class="ml-8 grid grid-flow-row-dense gap-4">
              <p class="mb-2 capitalize" v-for="subject in job.subjects">{{ subject.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mx-44 mb-4">
        <h2 class="text-lg font-medium">Khu vực:</h2>
        <div class="ml-8 grid grid-flow-dense gap-4">
          <div class="ml-8" v-for="area in tutor.areaExpects">
            <p class="mb-2">{{ area.city }}</p>
            <div class="ml-8 grid grid-flow-row-dense gap-4">
              <p class="mb-2 capitalize" v-for="district in area.districts">{{ district }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center" v-if="user?.isStudent">
      <button
        class="w-[150px] rounded-md bg-green-500 py-2 text-white hover:bg-green-600"
        @click="handleStartLearning"
      >
        Mời gia sư
      </button>
    </div>
  </div>
</template>
<style scoped>
.list-title {
  @apply font-medium;
}
</style>
