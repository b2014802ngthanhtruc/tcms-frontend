<script setup lang="ts">
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
import TutorClassroomService from '@/services/classroom/tutor-classroom.service'
import type { ClassResponse, UserLogin } from '@/types'
import { getUserLoginFromLS, toCurrency, toNormalize } from '@/utils'
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect,
  type Ref
} from 'vue'
import AppButton from '@/components/shared/AppButton.vue'
import type { AxiosError } from 'axios'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import { GET_IMG_API } from '@/constants/eviroment.constant'

const props = defineProps<{ classToken: string; tutorToken: string }>()
const tutorClassroomService = new TutorClassroomService()
const classRoom = ref<ClassResponse | null>(null)
const userLogin = inject<Ref<UserLogin | undefined>>('userLogin')
const router = useRouter()

// Theo dõi sự thay đổi của `localStorage`

onMounted(async () => {
  console.log('isLogin', userLogin?.value)
  if (userLogin?.value?.isTutor) {
    classRoom.value = await tutorClassroomService.getClassroomByToken(
      props.classToken,
      props.tutorToken
    )
  }
})

// Theo dõi sự thay đổi của biến `isLogin`
// Đảm bảo xóa event listener khi component bị hủy

const handleAcceptClass = async () => {
  try {
    await tutorClassroomService.acceptClassroom(props.classToken, props.tutorToken)

    router.push({ name: 'home' }).then(() => {
      toast.success('Nhận lớp thành công!')
    })
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

watchEffect(async () => {
  if (userLogin?.value?.isTutor) {
    classRoom.value = await tutorClassroomService.getClassroomByToken(
      props.classToken,
      props.tutorToken
    )
  }
})
</script>
<template>
  <div
    v-if="userLogin?.isTutor && classRoom"
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
              <p>
                {{ SESSIONMAP[schedule.session] }}: {{ schedule.startAt }} - {{ schedule.endAt }}
              </p>
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
    <div class="my-3 grid grid-flow-row-dense self-center p-4" v-if="classRoom">
      <div class="flex flex-auto justify-center justify-items-center text-3xl font-bold">
        <h1>Thông tin học sinh</h1>
      </div>
      <div
        class="grid grid-flow-col-dense self-center"
        v-for="student in classRoom.studentOfClasses"
      >
        <img
          :src="student.avatar ? `${GET_IMG_API}/${student.avatar}` : DEFAULT_AVATAR"
          alt=""
          class="h-60 w-60 rounded-full"
        />
        <table class="mx-auto flex w-full flex-auto justify-items-center p-3">
          <tbody class="body-table-col">
            <tr class="body-table-col-tr">
              <th>Họ tên:</th>
              <td>{{ student.fullName }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Số điện thoại:</th>
              <td>{{ student.phone }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Giới tính:</th>
              <td>{{ GENDERMAP[student.gender] }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Ngày sinh:</th>
              <td>{{ new Date(student.dob).toLocaleDateString('en-GB') }}</td>
            </tr>
            <tr class="body-table-col-tr">
              <th>Địa chỉ:</th>
              <td>{{ student.address.fullAddress }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mt-3 grid grid-flow-col p-4">
      <div class="mx-auto">
        <AppButton
          :status="ButtonStatus.SUCCESS"
          :type="ButtonType.FULL_FILL"
          :content="'Nhận lớp'"
          @click="handleAcceptClass"
        />
      </div>
    </div>
  </div>
  <div v-else class="container mx-auto h-screen content-center bg-white p-6 text-2xl shadow-md">
    <div class="grid grid-flow-row justify-items-center">
      <p class="mx-auto">
        Vui lọc đăng nhập bằng tài khoản gia sư được mời trước khi thực hiện chức năng này
      </p>
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
