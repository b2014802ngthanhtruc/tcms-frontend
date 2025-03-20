<script setup lang="ts">
import ClassDetailManager from '@/components/classroom/ClassDetailManager.vue'
import ClassStudentsManager from '@/components/classroom/ClassStudentsManager.vue'
import type { NavigationItem } from '@/components/shared/AppDrawer.vue'
import GeneralClassroomService from '@/services/classroom/general-classroom.service'
import type { ClassDocument, ClassNotification, ClassResponse, ClassRoom } from '@/types'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppDrawer from '@/components/shared/AppDrawer.vue'
import StudentClassroomService from '@/services/classroom/student-classroom.service'
import { getUserLoginFromLS } from '@/utils'
import type { AxiosError } from 'axios'
import { toast } from 'vue3-toastify'
import ClassDetailManagerDocument from '@/components/classroom/ClassDetailManagerDocument.vue'

const props = defineProps<{ id: string; menuIndex: string }>()
const classroomService = new GeneralClassroomService()
const studentClassroomService = new StudentClassroomService()
const classRoom = ref<ClassResponse>()
const notification = ref<ClassNotification[]>()
const documents = ref<ClassDocument[]>()
const router = useRouter()
const route = useRoute()
const user = getUserLoginFromLS()
const enableEdit = computed(() => user.id === classRoom.value?.createdBy)

const isManagerOneClassroom = computed(() =>
  route.name?.toString().includes('manager-one-classroom')
)

const menuItems: NavigationItem[] = [
  {
    label: 'Danh sách lớp học của tôi',
    to: 'student-manager'
  },
  {
    label: 'Thông tin lớp học',
    to: 'student-manager-one-classroom',
    query: { menuIndex: '1' },
    params: { id: route.params.id }
  },
  {
    label: 'Danh sách học sinh',
    to: 'student-manager-one-classroom',
    query: { menuIndex: '2' },
    params: { id: route.params.id }
  },
  {
    label: 'Tài liệu lớp học',
    to: 'student-manager-one-classroom',
    query: { menuIndex: '3' },
    params: { id: route.params.id }
  },
  {
    label: 'Bài kiểm tra',
    to: ''
  }
]
const isOpenDrawer = ref(false)

const handleGotoUpdateClass = () => {
  router.push({ name: 'student-manager-update-class', params: { id: props.id } })
}

onMounted(async () => {
  try {
    classRoom.value = await classroomService.findOne(props.id)
    notification.value = await studentClassroomService.getNotification(props.id)
    documents.value = await studentClassroomService.getDocuments(props.id)
    console.log('notification', notification.value)
    console.log('classroom', classRoom.value)
    console.log('enbale edit', enableEdit.value)
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
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
      :enable-edit="enableEdit"
      :notification="notification"
    />
    <ClassStudentsManager
      :students="classRoom.studentOfClasses"
      v-if="classRoom && menuIndex === '2'"
    />
    <ClassDetailManagerDocument
      :documents="documents"
      v-if="documents && menuIndex === '3'"
      :enable-edit="false"
    />
  </div>
</template>
