<script setup lang="ts">
import { CLASSLEVELMAP, DAYOFWEEKMAP, SCOPEMAP, SESSIONMAP } from '@/constants/class.constant'
import { ClassStatus } from '@/enums'
import type { ClassResponse, ClassRoom } from '@/types'
import { toCurrency, toFormatTime } from '@/utils'
import { defineComponent } from 'vue'

const props = defineProps<{ classroom: ClassResponse; enableEdit: boolean }>()
const emits = defineEmits(['eidt-class'])

defineComponent({ name: 'ClassInformationCard' })
</script>
<template>
  <div
    class="grid max-h-[700px] max-w-md grid-flow-row-dense gap-3 rounded-md border border-gray-500 p-2"
  >
    <div class="grid w-full grid-flow-col-dense justify-between">
      <p class="list-title">Thông tin cơ bản:</p>
      <button
        @click="emits('eidt-class')"
        v-if="
          (classroom.status === ClassStatus.NEW || classroom.status === ClassStatus.PENDING) &&
          enableEdit
        "
      >
        <font-awesome-icon :icon="['fas', 'pen-to-square']" size="xl" style="color: #0d0d0d" />
      </button>
    </div>
    <ul class="grid grid-flow-row-dense gap-2 indent-2">
      <li class="list-item">
        <p><span class="font-medium">Tên môn học: </span>{{ classroom.subject.name }}</p>
        <p class="font-medium">{{ CLASSLEVELMAP[classroom.level] }}</p>
      </li>
      <li class="list-item">
        <p>
          <span class="font-medium">Học phí: </span
          >{{ classroom.tuitionFee ? toCurrency(classroom.tuitionFee) : 'Chờ cập nhật' }}
        </p>
      </li>
      <li class="list-item">
        <p><span class="font-medium">Phương thức dạy học: </span>{{ classroom.teachingMode }}</p>
        <p><span class="font-medium">Quy mô: </span>{{ SCOPEMAP[classroom.scope] }}</p>
      </li>
      <li class="list-item text-wrap">
        <p>
          <span class="font-medium">Địa điểm: </span
          >{{ classroom.location ? classroom.location?.fullAddress : 'Học online' }}
        </p>
      </li>
      <li class="list-item">
        <p><span class="font-medium">Tổng số học sinh: </span>{{ classroom.quantityStudents }}</p>
      </li>
      <li class="list-item">
        <p>
          <span class="font-medium">Số học sinh đã đăng ký: </span
          >{{ classroom.studentOfClasses.length }}
        </p>
      </li>
      <li class="list-item">
        <p class="font-medium">Ngày bắt đầu:</p>
        <p>{{ new Date(classroom.startedAt).toLocaleDateString('en-GB') }}</p>
      </li>
      <li class="list-item">
        <p class="font-medium">Ngày kết thúc:</p>
        <p>{{ new Date(classroom.endedAt).toLocaleDateString('en-GB') }}</p>
      </li>
      <li class="list-item text-wrap">
        <p>
          <span class="font-medium">Mô tả: </span
          >{{ classroom.description ? classroom.description : 'Không cómô tả' }}
        </p>
      </li>
    </ul>
    <div class="grid grid-flow-row-dense justify-between">
      <p class="list-title">Thời khóa biểu:</p>
    </div>
    <ul class="grid grid-flow-row-dense gap-2 indent-2" v-for="schedule in classroom.schedules">
      <li class="font-medium">{{ DAYOFWEEKMAP[schedule.dow] }}</li>
      <li class="grid w-2/3 grid-cols-2 indent-5">
        <span class="italic">{{ SESSIONMAP[schedule.session] }}: </span
        >{{ toFormatTime(schedule.startAt) }} -
        {{ toFormatTime(schedule.endAt) }}
      </li>
    </ul>
  </div>
</template>
<style scoped>
.list-title {
  @apply text-lg font-medium;
}
.list-item {
  @apply grid w-full max-w-96 grid-flow-col-dense;
}
</style>
