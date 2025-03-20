<script setup lang="ts">
import AppButton from '@/components/shared/AppButton.vue'
import AppConfirmPopup from '@/components/shared/AppConfirmPopup.vue'
import AppPaginationBar from '@/components/shared/AppPaginationBar.vue'
import SubjectFrom from '@/components/subject/SubjectFrom.vue'
import SubjectTable from '@/components/subject/SubjectTable.vue'
import { ButtonStatus, ButtonType } from '@/enums'
import AdminSubjectService from '@/services/subject/admin-subject.service'
import SubjectService from '@/services/subject/subject.service'
import type {
  CreateSubjectType,
  OrderField,
  Pagination,
  QueryParams,
  Subject,
  UpdateSubjectType
} from '@/types'
import { getQueryParams } from '@/utils'
import type { AxiosError } from 'axios'
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'

const subjectService = new SubjectService()
const adminSubjectService = new AdminSubjectService()
const subjects = ref<Subject[]>()
const paginationSubjects = ref<Pagination<Subject>>()
const isOpenModal = ref(false)
const selectedSubjectId = ref<string>('')
const selectedSubject = computed(() => {
  return subjects.value?.find((subject) => subject.id === selectedSubjectId.value)
})
const pagination = ref<{ limit: number; offset: number }>({
  limit: 10,
  offset: 0
})
const queryParams = ref<QueryParams>({})
const queryString = computed(() => {
  queryParams.value = {
    ...pagination.value
  }
  return getQueryParams(queryParams.value)
})

const confirmPopup = ref({
  isOpen: false,
  title: '',
  deleteSubjectId: ''
})

onMounted(async () => {
  try {
    const result = await subjectService.findAll(queryString.value)
    subjects.value = result.results
    paginationSubjects.value = result
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
})

const handleCreateSubject = async (data: CreateSubjectType) => {
  try {
    await adminSubjectService.create(data)
    const result = await subjectService.findAll(queryString.value)
    subjects.value = result.results
    paginationSubjects.value = result
    toast.success('Tạo mới môn học thành công!')
    isOpenModal.value = false
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleUpdateSubject = async (id: string, data: UpdateSubjectType) => {
  try {
    await adminSubjectService.update(id, data)
    const result = await subjectService.findAll(queryString.value)
    subjects.value = result.results
    paginationSubjects.value = result
    toast.success('Cập nhật môn học thành công!')
    isOpenModal.value = false
    selectedSubjectId.value = ''
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleSelectSubject = (id: string) => {
  console.log(id)
  selectedSubjectId.value = id
  isOpenModal.value = true
}

const handleConfirmDelete = (id: string) => {
  const deleteSubject = subjects.value?.find((subject) => subject.id === id)
  if (deleteSubject) {
    confirmPopup.value = {
      isOpen: true,
      title: `Bạn có chắc chắn muốn xóa môn học ${deleteSubject.name}?`,
      deleteSubjectId: id
    }
  }
}

const handleGotoPage = async (offset: number) => {
  pagination.value.offset = offset
  const result = await subjectService.findAll(queryString.value)
  subjects.value = result.results
  paginationSubjects.value = result
}

const handleNextPage = async () => {
  if (paginationSubjects.value && paginationSubjects.value.next) {
    pagination.value.offset = pagination.value.offset + pagination.value.limit
    const result = await subjectService.findAll(queryString.value)
    subjects.value = result.results
    paginationSubjects.value = result
  }
}

const handlePreviousPage = async () => {
  if (paginationSubjects.value && paginationSubjects.value.previous) {
    pagination.value.offset = pagination.value.offset - pagination.value.limit
    const result = await subjectService.findAll(queryString.value)
    subjects.value = result.results
    paginationSubjects.value = result
  }
}

const handleDeleteSubject = async () => {
  try {
    await adminSubjectService.delete(confirmPopup.value.deleteSubjectId)
    const result = await subjectService.findAll(queryString.value)
    subjects.value = result.results
    confirmPopup.value.isOpen = false
    toast.success('Xóa môn học thành công!')
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}
</script>
<template>
  <div class="container mx-auto mt-3 space-y-5 bg-slate-100 p-3">
    <SubjectFrom
      v-model="isOpenModal"
      @create-subject="handleCreateSubject"
      @update-subject="handleUpdateSubject"
      :title="selectedSubject ? 'Cập nhật môn học' : 'Thêm môn học'"
      :subject="selectedSubject"
    />
    <AppConfirmPopup
      v-model="confirmPopup.isOpen"
      :title="confirmPopup.title"
      @confirm="handleDeleteSubject"
    />
    <div class="relative grid grid-flow-col-dense justify-center text-3xl font-bold">
      <div>
        <h1>Quản lý môn học</h1>
      </div>
      <div class="absolute right-0">
        <AppButton
          :content="'Thêm môn học +'"
          :status="ButtonStatus.PRIMARY"
          :type="ButtonType.OUTLINE"
          @click="isOpenModal = true"
        />
      </div>
    </div>
    <div>
      <SubjectTable
        :subjects="subjects"
        :offset="pagination.offset"
        v-if="subjects"
        @select-subject="handleSelectSubject"
        @delete-subject="handleConfirmDelete"
      />
    </div>
    <div>
      <AppPaginationBar
        :pagination="{
          count: paginationSubjects.count,
          next: paginationSubjects.next,
          previous: paginationSubjects.previous,
          limit: pagination.limit
        }"
        @choose-page="handleGotoPage"
        @next="handleNextPage"
        @previous="handlePreviousPage"
        v-if="paginationSubjects"
      />
    </div>
  </div>
</template>
