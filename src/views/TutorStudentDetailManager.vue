<script setup lang="ts">
import { onMounted, ref } from 'vue'
import StudentDetail from '../components/student/StudentDetail.vue'
import type { Student } from '@/types/student.type'
import TutorClassroomService from '@/services/classroom/tutor-classroom.service'
import type { AxiosError } from 'axios'
import { toast } from 'vue3-toastify'
const props = defineProps<{ classId: string; studentId: string }>()
const student = ref<Student>()
const tutorClassroomSerivce = new TutorClassroomService()

onMounted(async () => {
  try {
    student.value = await tutorClassroomSerivce.getStudents(props.classId, props.studentId)
    console.log('student', student.value)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
})
</script>
<template>
  <div class="container mx-auto my-4 bg-white p-4 shadow-lg shadow-gray-400">
    <StudentDetail :student="student" v-if="student" />
  </div>
</template>
