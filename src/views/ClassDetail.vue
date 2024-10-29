<script setup lang="ts">
import AppButton from '@/components/shared/AppButton.vue'
import { DEFAULT_AVATAR } from '@/constants/user.constant'
import { ButtonStatus, ButtonType } from '@/enums'
import GeneralClassroomService from '@/services/classroom/general-classroom.service'
import StudentClassroomService from '@/services/classroom/student-classroom.service'
import TutorClassroomService from '@/services/classroom/tutor-classroom.service'

import type { ClassResponse, ClassRoom, UserLogin } from '@/types'
import { getUserLoginFromLS } from '@/utils'
import type { AxiosError } from 'axios'
import { defineComponent, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'

const generalClassroomService = new GeneralClassroomService()
const studentClassroomService = new StudentClassroomService()
const tutorClassroomService = new TutorClassroomService()

const props = defineProps<{ id: string }>()

const classRoom = ref<ClassResponse | null>(null)
const user = ref<UserLogin>()

onMounted(async () => {
  console.log('id', props.id)
  classRoom.value = await generalClassroomService.findOne(props.id)
  console.log('classRoom', classRoom.value)
  user.value = getUserLoginFromLS()
})

const handleEnroll = async () => {
  if (user.value && user.value.isStudent) {
    try {
      await studentClassroomService.enroll(props.id)
      toast.success('Enroll successfully!')
      classRoom.value = await generalClassroomService.findOne(props.id)
    } catch (error) {
      const err = error as AxiosError
      const data: any = err.response?.data
      toast.error(data.message)
    }
  }
  if (user.value && user.value.isTutor) {
    try {
      await tutorClassroomService.enroll(props.id)
      toast.success('Enroll successfully!')
      classRoom.value = await generalClassroomService.findOne(props.id)
    } catch (error) {
      const err = error as AxiosError
      const data: any = err.response?.data
      toast.error(data.message)
    }
  }
}
</script>
<template>
  <div
    class="container mx-auto my-4 justify-center justify-items-center divide-y-2 divide-gray-200 rounded-lg bg-slate-100 p-3 shadow-lg shadow-gray-400"
  >
    <div class="flex justify-center justify-items-start">
      <h1 class="class-title">{{ classRoom?.className }}</h1>
    </div>
    <div class="grid grid-flow-row-dense self-center">
      <table class="mx-auto grid w-full grid-cols-2 justify-items-center p-3">
        <tbody class="body-table-col">
          <tr class="body-table-col-tr">
            <th>Subject:</th>
            <td>{{ classRoom?.subject.name }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Class:</th>
            <td>{{ classRoom?.level }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Requirement:</th>
            <td>{{ classRoom?.request }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Tuition fee:</th>
            <td>{{ classRoom?.tuitionFee }}/{{ classRoom?.paymentFrequency }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Teaching mode:</th>
            <td>{{ classRoom?.teachingMode }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Scope:</th>
            <td>{{ classRoom?.scope }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Max students:</th>
            <td>{{ classRoom?.quantityStudents }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Description:</th>
            <td>{{ classRoom?.description }}</td>
          </tr>
        </tbody>
        <tbody class="body-table-col">
          <tr class="body-table-col-tr">
            <th>Location:</th>
            <td>{{ classRoom?.location?.fullAddress }}</td>
          </tr>
          <tr>
            <th>Schedules:</th>
            <td v-for="schedule in classRoom?.schedules" class="grid grid-cols-2 gap-3 px-5">
              <p>{{ schedule.dow }}</p>
              <p>{{ schedule.time }}</p>
            </td>
          </tr>
          <tr class="grid grid-flow-col-dense justify-items-start gap-2">
            <th>Start at:</th>
            <td>
              {{ classRoom ? new Date(classRoom.startedAt).toLocaleDateString('en-GB') : '' }}
            </td>
            <th>End at:</th>
            <td>{{ classRoom ? new Date(classRoom!.endedAt).toLocaleDateString('en-GB') : '' }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Total days:</th>
            <td>{{ classRoom?.totalDays }} days</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Enrolled students:</th>
            <td>{{ classRoom?.studentOfClasses.length }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="my-3 grid grid-flow-row-dense self-center p-4" v-if="classRoom?.tutor">
      <div class="flex flex-auto justify-center justify-items-center text-3xl font-bold">
        <h1>Tutor information</h1>
      </div>
      <div class="grid grid-flow-col-dense self-center">
        <img :src="classRoom?.tutor.avatar ?? DEFAULT_AVATAR" alt="" class="h-60 w-60" />
        <table class="mx-auto grid w-full grid-cols-2 justify-items-center p-3">
          <tbody class="body-table-col">
            <tr class="body-table-col-tr">
              <th>Name:</th>
              <td>{{ classRoom?.tutor.fullName }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Phone:</th>
              <td>{{ classRoom?.tutor.phone }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Gender:</th>
              <td>{{ classRoom?.tutor.gender }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Date of birth:</th>
              <td>{{ classRoom?.tutor.dob }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Address:</th>
              <td>{{ classRoom?.tutor.address.fullAddress }}</td>
            </tr>
          </tbody>
          <tbody class="body-table-col">
            <tr class="body-table-col-tr">
              <th>Degree:</th>
              <td>{{ classRoom?.tutor.educationalQualification.degree }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>University:</th>
              <td>{{ classRoom?.tutor.educationalQualification.university }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Major:</th>
              <td>{{ classRoom?.tutor.educationalQualification.major }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Description:</th>
              <td>{{ classRoom?.tutor.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mt-3 flex flex-auto justify-center self-center p-4 text-lg italic" v-else>
      <p>This class is currently unstaffed</p>
    </div>
    <div class="mt-3 grid grid-flow-col p-4" v-if="user?.isStudent || classRoom?.tutorId === null">
      <div class="mx-auto w-6/12">
        <AppButton
          :status="ButtonStatus.SUCCESS"
          :type="ButtonType.FULL_FILL"
          :content="'Enroll'"
          @click="handleEnroll"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.class-title {
  @apply mt-3 p-4 text-3xl font-bold capitalize;
}

.body-table-col {
  @apply grid grid-flow-row gap-3 p-4 capitalize;
}

.body-table-col-tr {
  @apply flex flex-auto gap-2;
}
</style>
