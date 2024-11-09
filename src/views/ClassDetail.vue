<script setup lang="ts">
import AppButton from '@/components/shared/AppButton.vue'
import {
  CLASSLEVELMAP,
  DAYOFWEEKMAP,
  PAYMENTFREQUENCYMAP,
  SCOPEMAP,
  SESSIONMAP
} from '@/constants/class.constant'
import { GENDERMAP } from '@/constants/gender.constant'
import { DEFAULT_AVATAR } from '@/constants/user.constant'
import { ButtonStatus, ButtonType, PaymentFrequency } from '@/enums'
import GeneralClassroomService from '@/services/classroom/general-classroom.service'
import StudentClassroomService from '@/services/classroom/student-classroom.service'
import TutorClassroomService from '@/services/classroom/tutor-classroom.service'

import type { ClassResponse, ClassRoom, UserLogin } from '@/types'
import { checkIsLogin, getUserLoginFromLS, toCurrency, toNormalize } from '@/utils'
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
  const isLoggedIn = checkIsLogin()
  if (!isLoggedIn) {
    toast.warning('You need to be logged in to enroll in this class!')
    return
  }
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
      <table class="mx-auto grid w-full grid-cols-2 justify-items-center p-3" v-if="classRoom">
        <tbody class="body-table-col">
          <tr class="body-table-col-tr">
            <th>Môn học:</th>
            <td>{{ classRoom.subject.name }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Lớp:</th>
            <td v-if="classRoom.level">{{ CLASSLEVELMAP[classRoom.level] }}</td>
            <td v-else>Chờ cập nhật</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Yêu cầu:</th>
            <td>{{ classRoom.request }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Học phí:</th>
            <td
              v-if="
                classRoom.tuitionFee && classRoom.paymentFrequency !== PaymentFrequency.NEGOTIAL
              "
            >
              {{ toCurrency(classRoom?.tuitionFee) }}/{{
                PAYMENTFREQUENCYMAP[classRoom.paymentFrequency]
              }}
            </td>
            <td v-else>{{ PAYMENTFREQUENCYMAP[classRoom.paymentFrequency] }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Hình thức giảng dạy:</th>
            <td class="capitalize">{{ classRoom.teachingMode }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Quy mô:</th>
            <td class="capitalize">{{ SCOPEMAP[classRoom.scope] }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Tổng số học sinh:</th>
            <td>{{ classRoom.quantityStudents }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Mô tả:</th>
            <td v-if="classRoom.description">{{ toNormalize(classRoom.description) }}</td>
            <td v-else>Không có mô tả</td>
          </tr>
        </tbody>
        <tbody class="body-table-col">
          <tr class="body-table-col-tr">
            <th>Địa điểm:</th>
            <td v-if="classRoom.location?.fullAddress">{{ classRoom.location?.fullAddress }}</td>
            <td v-else>Không có địa điểm</td>
          </tr>
          <tr>
            <th>Lịch học:</th>
            <td
              v-for="schedule in classRoom.schedules"
              class="grid grid-cols-2 gap-3 px-5 capitalize"
            >
              <p>{{ DAYOFWEEKMAP[schedule.dow] }}</p>
              <p>{{ SESSIONMAP[schedule.time] }}</p>
            </td>
          </tr>
          <tr class="grid grid-flow-col-dense justify-items-start gap-2">
            <th>Ngày dự kiến bắt đầu:</th>
            <td>
              {{ classRoom ? new Date(classRoom.startedAt).toLocaleDateString('en-GB') : '' }}
            </td>
            <th>Ngày dự kiến kết thúc:</th>
            <td>{{ classRoom ? new Date(classRoom!.endedAt).toLocaleDateString('en-GB') : '' }}</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Tổng số ngày:</th>
            <td>{{ classRoom.totalDays }} days</td>
          </tr>
          <tr class="body-table-col-tr">
            <th>Số học sinh đã đăng ký:</th>
            <td>{{ classRoom.studentOfClasses.length }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="my-3 grid grid-flow-row-dense self-center p-4" v-if="classRoom && classRoom.tutor">
      <div class="flex flex-auto justify-center justify-items-center text-3xl font-bold">
        <h1>Thông tin gia sư</h1>
      </div>
      <div class="grid grid-flow-col-dense self-center">
        <img :src="classRoom.tutor.avatar ?? DEFAULT_AVATAR" alt="" class="h-60 w-60" />
        <table class="mx-auto grid w-full grid-cols-2 justify-items-center p-3">
          <tbody class="body-table-col">
            <tr class="body-table-col-tr">
              <th>Họ tên:</th>
              <td>{{ classRoom.tutor.fullName }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Số điện thoại:</th>
              <td>{{ classRoom.tutor.phone }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Giới tính:</th>
              <td>{{ GENDERMAP[classRoom.tutor.gender] }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Ngày sinh:</th>
              <td>{{ classRoom.tutor.dob }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Địa chỉ:</th>
              <td>{{ classRoom.tutor.address.fullAddress }}</td>
            </tr>
          </tbody>
          <tbody class="body-table-col">
            <tr class="body-table-col-tr">
              <th>Bằng cấp:</th>
              <td class="capitalize">{{ classRoom.tutor.educationalQualification.degree }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Trường Đại học/Cơ quan:</th>
              <td>{{ classRoom.tutor.educationalQualification.university }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Chuyên ngành:</th>
              <td>{{ classRoom.tutor.educationalQualification.major }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Mô tả:</th>
              <td v-if="classRoom.tutor.description">{{ classRoom.tutor.description }}</td>
              <td v-else>Không có mô tả</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mt-3 flex flex-auto justify-center self-center p-4 text-lg italic" v-else>
      <p>Lớp học này hiện chưa có gia sư đăng ký</p>
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
  @apply grid grid-flow-row gap-3 p-4;
}

.body-table-col-tr {
  @apply flex flex-auto gap-2;
}
</style>
