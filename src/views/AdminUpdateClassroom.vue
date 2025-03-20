<script setup lang="ts">
import ClassForm from '@/components/classroom/ClassForm.vue'
import AppButton from '@/components/shared/AppButton.vue'
import AppConfirmPopup from '@/components/shared/AppConfirmPopup.vue'
import { ButtonStatus, ButtonType } from '@/enums'
import AdminClassroomService from '@/services/classroom/admin-classroom.service'
import GeneralClassroomService from '@/services/classroom/general-classroom.service'
import TutorClassroomService from '@/services/classroom/tutor-classroom.service'
import TutorService from '@/services/tutor/tutor.service'
import type { ClassResponse, CreateClassRoom, Schedule, UpdateClassRoom, UserLogin } from '@/types'
import type { Tutor } from '@/types/tutor.type'
import { getUpdatedValues } from '@/utils'
import type { AxiosError } from 'axios'
import { inject, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const adminClassroomService = new AdminClassroomService()
const classroomService = new GeneralClassroomService()
const router = useRouter()
const isOpenPopup = ref(false)
const classRoom = ref<ClassResponse | null>(null)

const handleCancel = () => {
  if (!isOpenPopup.value) {
    isOpenPopup.value = true
    return
  }

  isOpenPopup.value = false
  router.replace({
    name: 'admin-manager-classrooms'
  })
}

const handleUpdateClass = async (id: string, value: UpdateClassRoom) => {
  console.log('update value: ', value)
  try {
    value.schedules =
      value.schedules &&
      value.schedules.map((schedule: Schedule) => {
        return {
          ...schedule,
          startAt: schedule.startAt.padEnd(8, ':00'),
          endAt: schedule.endAt.padEnd(8, ':00')
        }
      })
    const oldData: UpdateClassRoom = {
      ...classRoom.value,
      startedAt: classRoom.value ? new Date(classRoom.value?.startedAt) : undefined,
      endedAt: classRoom.value ? new Date(classRoom.value?.endedAt) : undefined
    }
    const updateValue = classRoom.value && getUpdatedValues<UpdateClassRoom>(oldData, value)
    const result = await adminClassroomService.update(id, updateValue as UpdateClassRoom)
    console.log('result', result)
    router
      .replace({
        name: 'admin-manager-classroom-detail',
        params: { id: result.id }
      })
      .then(() => {
        toast.success('Cập nhật lớp học thành công!')
      })
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

onMounted(async () => {
  classRoom.value = await classroomService.findOne(router.currentRoute.value.params.id as string)
  console.log('classRoom', classRoom.value)
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
      v-if="classRoom"
      :title="'Cập nhật lớp học mới'"
      :is-student="false"
      :is-start-learning="false"
      :class-room="classRoom"
      @update-class="handleUpdateClass"
    />
  </div>
</template>
