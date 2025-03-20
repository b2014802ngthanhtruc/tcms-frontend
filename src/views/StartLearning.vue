<script setup lang="ts">
import ClassForm from '@/components/classroom/ClassForm.vue'
import StudentClassroomService from '@/services/classroom/student-classroom.service'
import GeneralTutorService from '@/services/tutor/general-tutor.service'
import type { CreateClassRoom, Schedule, UserLogin } from '@/types'
import type { Tutor } from '@/types/tutor.type'
import type { AxiosError } from 'axios'
import { inject, onMounted, ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const generalTutorService = new GeneralTutorService()
const studentClassroomService = new StudentClassroomService()
const router = useRouter()
const tutor = ref<Tutor | null>(null)
const user = inject<Ref<UserLogin | undefined>>('userLogin')

onMounted(async () => {
  tutor.value = await generalTutorService.getDetail(props.id)
})

const handleStartLearning = async (data: CreateClassRoom) => {
  console.log('data', data)
  try {
    data.schedules = data.schedules.map((schedule: Schedule) => {
      return {
        ...schedule,
        startAt: schedule.startAt.padEnd(8, ':00'),
        endAt: schedule.endAt.padEnd(8, ':00')
      }
    })
    const result = await studentClassroomService.createClassromm(data)
    toast.success('Tạo lớp học với gia sư thành công')
    console.log('result', result)

    router.replace({ name: 'classroom-detail', params: { id: result.id } })
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

watch(
  () => user?.value,
  (newValue) => {
    if (!newValue) {
      router.replace({ name: 'home' })
    }
  }
)
const props = defineProps<{ id: string }>()
</script>
<template>
  <div class="container mx-auto">
    <ClassForm
      v-if="tutor"
      title="Mời gia sư"
      :is-student="true"
      :tutor="tutor"
      :is-start-learning="true"
      @create-class="handleStartLearning"
    />
  </div>
</template>
