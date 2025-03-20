<script setup lang="ts">
import ClassDetailManager from '@/components/classroom/ClassDetailManager.vue'
import ClassStudentsManager from '@/components/classroom/ClassStudentsManager.vue'
import type { NavigationItem } from '@/components/shared/AppDrawer.vue'
import GeneralClassroomService from '@/services/classroom/general-classroom.service'
import type {
  AddClassDocument,
  ClassDocument,
  ClassNotification,
  ClassResponse,
  ClassRoom,
  UserLogin
} from '@/types'
import { computed, inject, onMounted, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppDrawer from '@/components/shared/AppDrawer.vue'
import TutorClassroomService from '@/services/classroom/tutor-classroom.service'
import ClassDetailManagerDocument from '@/components/classroom/ClassDetailManagerDocument.vue'
import type { AxiosError } from 'axios'
import { toast } from 'vue3-toastify'

const userLogin = inject<Ref<UserLogin | undefined>>('userLogin')
const props = defineProps<{ id: string; menuIndex: string }>()
const classroomService = new GeneralClassroomService()
const tutorClassroomService = new TutorClassroomService()
const classRoom = ref<ClassResponse>()
const notification = ref<ClassNotification[]>()
const documents = ref<ClassDocument[]>()
const router = useRouter()
const route = useRoute()

const isManagerOneClassroom = computed(() =>
  route.name?.toString().includes('manager-one-classroom')
)
const allowEdit = computed(() => userLogin?.value?.id === classRoom.value?.createdBy)

const menuItems: NavigationItem[] = [
  {
    label: 'Danh sách lớp học của tôi',
    to: 'tutor-manager'
  },
  {
    label: 'Thông tin lớp học',
    to: 'tutor-manager-one-classroom',
    query: { menuIndex: '1' },
    params: { id: route.params.id }
  },
  {
    label: 'Danh sách học sinh',
    to: 'tutor-manager-one-classroom',
    query: { menuIndex: '2' },
    params: { id: route.params.id }
  },
  {
    label: 'Tài liệu lớp học',
    to: 'tutor-manager-one-classroom',
    query: { menuIndex: '3' },
    params: { id: route.params.id }
  },
  {
    label: 'Bài kiểm tra',
    to: ''
  }
]
const isOpenDrawer = ref(false)
const handleGotoDetailStudent = (id: string) => {
  router.push({
    name: 'tutor-manager-class-detail-student',
    params: { classId: props.id, studentId: id }
  })
}

const handleGotoUpdateClass = () => {
  router.push({ name: 'tutor-manager-update-class', params: { id: props.id } })
}

const handleDeleteDocument = async (id: string) => {
  try {
    await tutorClassroomService.deleteDocument(props.id, id)
    documents.value = await tutorClassroomService.getDocuments(props.id)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleAddDocument = async (data: AddClassDocument) => {
  try {
    await tutorClassroomService.addDocument(props.id, data)
    documents.value = await tutorClassroomService.getDocuments(props.id)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

onMounted(async () => {
  classRoom.value = await classroomService.findOne(props.id)
  notification.value = await tutorClassroomService.getNotification(props.id)
  documents.value = await tutorClassroomService.getDocuments(props.id)
})
</script>
<template>
  <div class="container mx-auto w-screen p-3">
    <AppDrawer :items="menuItems" v-model="isOpenDrawer" />
    <div
      class="mb-3 cursor-pointer self-end"
      @click="isOpenDrawer = true"
      v-if="isManagerOneClassroom"
    >
      <font-awesome-icon :icon="['fas', 'bars']" size="2xl" style="color: #121212" />
    </div>
    <ClassDetailManager
      :classroom="classRoom"
      v-if="classRoom && menuIndex === '1' && notification"
      @update-classroom="handleGotoUpdateClass"
      :enable-edit="allowEdit"
      :notification="notification"
    />
    <ClassStudentsManager
      :students="classRoom.studentOfClasses"
      v-if="classRoom && menuIndex === '2'"
      @select-student="handleGotoDetailStudent"
    />
    <ClassDetailManagerDocument
      :documents="documents"
      v-if="documents && menuIndex === '3'"
      :enable-edit="true"
      @add-document="handleAddDocument"
      @delete-document="handleDeleteDocument"
    />
  </div>
</template>
