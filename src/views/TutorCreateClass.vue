<script setup lang="ts">
import ClassForm from '@/components/classroom/ClassForm.vue'
import AppButton from '@/components/shared/AppButton.vue'
import AppConfirmPopup from '@/components/shared/AppConfirmPopup.vue'
import { ButtonStatus, ButtonType } from '@/enums'
import TutorClassroomService from '@/services/classroom/tutor-classroom.service'
import TutorService from '@/services/tutor/tutor.service'
import type { CreateClassRoom, Schedule, UserLogin } from '@/types'
import type { Tutor } from '@/types/tutor.type'
import type { AxiosError } from 'axios'
import { inject, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const tutorService = new TutorService()
const tutorClassroomService = new TutorClassroomService()
const tutor = ref<Tutor>()
const router = useRouter()
const isOpenPopup = ref(false)

const handleCancel = () => {
  if (!isOpenPopup.value) {
    isOpenPopup.value = true
    return
  }

  isOpenPopup.value = false
  router.replace({ name: 'tutor-manager' })
}

const handleCreateClass = async (value: CreateClassRoom) => {
  console.log('create value: ', value)
  try {
    value.schedules = value.schedules.map((schedule: Schedule) => {
      return {
        ...schedule,
        startAt: schedule.startAt.padEnd(8, ':00'),
        endAt: schedule.endAt.padEnd(8, ':00')
      }
    })
    const result = await tutorClassroomService.createClass(value)
    console.log('result', result)

    router.replace({ name: 'tutor-manager', params: { id: result.id } }).then(() => {
      toast.success('Tạo lớp học mới thành công!')
    })
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

onMounted(async () => {
  tutor.value = await tutorService.getProfile()
})
</script>
<template>
  <div class="container mx-auto">
    <AppConfirmPopup
      v-model="isOpenPopup"
      :title="'Bạn có chắc chắn muốn hủy bỏ tạo lớp học mới'"
      v-if="isOpenPopup"
      @confirm="handleCancel"
    />
    <div class="mt-3 grid w-full grid-flow-col-dense justify-end">
      <AppButton
        :content="'Hủy bỏ'"
        :status="ButtonStatus.DANGER"
        :type="ButtonType.OUTLINE"
        @click="handleCancel"
      />
    </div>
    <ClassForm
      :title="'Tạo lớp học mới'"
      v-if="tutor"
      :tutor="tutor"
      :is-student="false"
      :is-start-learning="false"
      @create-class="handleCreateClass"
    />
  </div>
</template>
