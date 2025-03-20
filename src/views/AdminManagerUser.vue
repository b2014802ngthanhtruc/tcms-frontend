<script setup lang="ts">
import AppConfirmPopup from '@/components/shared/AppConfirmPopup.vue'
import AppPaginationBar from '@/components/shared/AppPaginationBar.vue'
import AppSearchBar from '@/components/shared/AppSearchBar.vue'
import StudentTable from '@/components/student/StudentTable.vue'
import TutorTable from '@/components/tutor/TutorTable.vue'
import UserTable from '@/components/user/UserTable.vue'
import { USERSTATUSMAP } from '@/constants/user.constant'
import { Status } from '@/enums'
import AdminStudentService from '@/services/student/admin-student.service'
import AdminTutorService from '@/services/tutor/admin-tutor.service'
import AdminUserService from '@/services/user/admin-user.service'
import type { FilterField, OrderField, Pagination, QueryParams, UserResponse } from '@/types'
import type { Student } from '@/types/student.type'
import type { Tutor } from '@/types/tutor.type'
import { getQueryParams } from '@/utils'
import { FilterOperationType } from '@chax-at/prisma-filter-common'
import type { AxiosError } from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const adminUserService = new AdminUserService()
const adminTutorService = new AdminTutorService()
const adminStudentService = new AdminStudentService()
const router = useRouter()

const selectedStatus = ref<string>('')
const search = ref<string>('')
const tab = ref<string>('account')

const isOpenPopupUser = ref(false)
const isOpenPopupTutor = ref(false)
const isOpenPopupStudent = ref(false)
const deletedUserId = ref<string>('')
const deletedTutorId = ref<string>('')
const deletedStudentId = ref<string>('')

const users = ref<UserResponse[]>()
const tutors = ref<Tutor[]>()
const students = ref<Student[]>()

const paginationUser = ref<Pagination<UserResponse>>()
const paginationTutor = ref<Pagination<Tutor>>()
const paginationStudent = ref<Pagination<Student>>()

const pagination = ref<{ limit: number; offset: number }>({
  limit: 10,
  offset: 0
})
const filter = ref<FilterField[] | undefined>(undefined)
const order = ref<OrderField[] | undefined>(undefined)
const queryParams = ref<QueryParams>({})
const queryString = computed(() => {
  queryParams.value = {
    ...pagination.value,
    filter: filter.value,
    order: order.value
  }
  return getQueryParams(queryParams.value)
})
const paginationResult = computed(() => {
  if (tab.value === 'account') {
    return paginationUser.value
  }
  if (tab.value === 'tutor') {
    return paginationTutor.value
  }
  if (tab.value === 'student') {
    return paginationStudent.value
  }
})

const handleSearch = async (value: string) => {
  pagination.value.offset = 0
  if (tab.value === 'account') {
    filter.value = [
      {
        field: 'search',
        type: FilterOperationType.IContains,
        value
      }
    ]
    const result = await adminUserService.findMany(queryString.value)
    paginationUser.value = result
    users.value = result.results
  }
  if (tab.value === 'tutor') {
    filter.value = [
      {
        field: 'search',
        type: FilterOperationType.IContains,
        value
      }
    ]
    const result = await adminTutorService.findMany(queryString.value)
    paginationTutor.value = result
    tutors.value = result.results
  }
  if (tab.value === 'student') {
    filter.value = [
      {
        field: 'search',
        type: FilterOperationType.IContains,
        value
      }
    ]
    const result = await adminStudentService.findMany(queryString.value)
    paginationStudent.value = result
    students.value = result.results
  }
}

const handleGotoPage = async (offset: number) => {
  pagination.value.offset = offset

  if (tab.value === 'account') {
    const result = await adminUserService.findMany(queryString.value)
    paginationUser.value = result
    users.value = result.results
  }
  if (tab.value === 'tutor') {
    const result = await adminTutorService.findMany(queryString.value)
    paginationTutor.value = result
    tutors.value = result.results
  }
  if (tab.value === 'student') {
    const result = await adminStudentService.findMany(queryString.value)
    paginationStudent.value = result
    students.value = result.results
  }
}

const handleNextPage = async () => {
  if (paginationResult.value && paginationResult.value.next) {
    pagination.value.offset = pagination.value.offset + pagination.value.limit
    if (tab.value === 'account') {
      const result = await adminUserService.findMany(queryString.value)
      paginationUser.value = result
      users.value = result.results
    }
    if (tab.value === 'tutor') {
      const result = await adminTutorService.findMany(queryString.value)
      paginationTutor.value = result
      tutors.value = result.results
    }
    if (tab.value === 'student') {
      const result = await adminStudentService.findMany(queryString.value)
      paginationStudent.value = result
      students.value = result.results
    }
  }
}

const handlePreviousPage = async () => {
  if (paginationResult.value && paginationResult.value.previous) {
    pagination.value.offset = pagination.value.offset - pagination.value.limit
    if (tab.value === 'account') {
      const result = await adminUserService.findMany(queryString.value)
      paginationUser.value = result
      users.value = result.results
    }
    if (tab.value === 'tutor') {
      const result = await adminTutorService.findMany(queryString.value)
      paginationTutor.value = result
      tutors.value = result.results
    }
    if (tab.value === 'student') {
      const result = await adminStudentService.findMany(queryString.value)
      paginationStudent.value = result
      students.value = result.results
    }
  }
}

const handleChangeTab = async (value: string) => {
  tab.value = value
  filter.value = undefined
  order.value = undefined
  if (value === 'account' && paginationUser.value) {
    if (pagination.value.offset >= paginationUser.value.count) {
      pagination.value.offset = 0
    }
    const result = await adminUserService.findMany(queryString.value)
    paginationUser.value = result
    users.value = result.results
  }
  if (value === 'tutor' && paginationTutor.value) {
    if (pagination.value.offset >= paginationTutor.value.count) {
      pagination.value.offset = 0
    }
    const result = await adminTutorService.findMany(queryString.value)
    paginationTutor.value = result
    tutors.value = result.results
  }
  if (value === 'student' && paginationStudent.value) {
    if (pagination.value.offset >= paginationStudent.value.count) {
      pagination.value.offset = 0
    }
    const result = await adminStudentService.findMany(queryString.value)
    paginationStudent.value = result
    students.value = result.results
  }
}

const handleFilter = async (filterFields: FilterField[]) => {
  filter.value = filterFields
  if (tab.value === 'account') {
    const result = await adminUserService.findMany(queryString.value)
    paginationUser.value = result
    users.value = result.results
  }
  if (tab.value === 'tutor') {
    const result = await adminTutorService.findMany(queryString.value)
    paginationTutor.value = result
    tutors.value = result.results
  }
  if (tab.value === 'student') {
    const result = await adminStudentService.findMany(queryString.value)
    paginationStudent.value = result
    students.value = result.results
  }
}

const handleSelectUser = (id: string) => {
  if (tab.value === 'account') {
    router.push({ name: 'admin-manager-user-detail', params: { id: id } })
  }
  if (tab.value === 'tutor') {
    router.push({ name: 'admin-manager-tutor-detail', params: { id: id } })
  }
  if (tab.value === 'student') {
    router.push({ name: 'admin-manager-student-detail', params: { id: id } })
  }
}

const handleRequiredConfirmDeleteUser = (id: string) => {
  isOpenPopupUser.value = true
  deletedUserId.value = id
}

const handleRequiredConfirmDeleteTutor = (id: string) => {
  isOpenPopupTutor.value = true
  deletedTutorId.value = id
}

const handleRequiredConfirmDeleteStudent = (id: string) => {
  isOpenPopupStudent.value = true
  deletedStudentId.value = id
}

const handleDeleteUser = async () => {
  try {
    await adminUserService.deleteUser(deletedUserId.value)
    const userResult = await adminUserService.findMany(queryString.value)
    paginationUser.value = userResult
    users.value = userResult.results

    isOpenPopupUser.value = false
    deletedUserId.value = ''
    toast.success('Xóa tài khoản thông')
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleDeleteTutor = async () => {
  try {
    await adminTutorService.delete(deletedTutorId.value)
    const tutorResult = await adminTutorService.findMany(queryString.value)
    paginationTutor.value = tutorResult
    tutors.value = tutorResult.results

    isOpenPopupTutor.value = false
    deletedTutorId.value = ''
    toast.success('Xóa tài khoản gia su')
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

const handleDeleteStudent = async () => {
  try {
    await adminStudentService.delete(deletedStudentId.value)
    const studentResult = await adminStudentService.findMany(queryString.value)
    paginationStudent.value = studentResult
    students.value = studentResult.results

    isOpenPopupStudent.value = false
    deletedStudentId.value = ''
    toast.success('Xóa tài khoản sinh viên')
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}

onMounted(async () => {
  const userResult = await adminUserService.findMany(queryString.value)
  paginationUser.value = userResult
  users.value = userResult.results

  const tutorResult = await adminTutorService.findMany(queryString.value)
  paginationTutor.value = tutorResult
  tutors.value = tutorResult.results

  const studentResult = await adminStudentService.findMany(queryString.value)
  paginationStudent.value = studentResult
  students.value = studentResult.results
})
</script>
<template>
  <div
    class="container mx-auto my-5 justify-center justify-items-center space-y-5 rounded-lg bg-white p-3 shadow-md"
  >
    <AppConfirmPopup
      :title="'Bạn có chắc chắn muốn xóa tài khoản này?'"
      v-model="isOpenPopupUser"
      @confirm="handleDeleteUser"
    />
    <AppConfirmPopup
      :title="'Bạn có chắc chắn muốn xóa gia sư này?'"
      v-model="isOpenPopupTutor"
      @confirm="handleDeleteTutor"
    />
    <AppConfirmPopup
      :title="'Bạn có chắc chắn muốn xóa học sinh này?'"
      v-model="isOpenPopupStudent"
      @confirm="handleDeleteStudent"
    />
    <div class="grid w-1/2 grid-flow-col-dense items-center">
      <AppSearchBar @search="handleSearch" />
    </div>
    <div
      class="grid w-full grid-cols-3 justify-items-center divide-x-2 rounded-lg border border-gray-300 text-lg font-medium"
    >
      <button
        @click="handleChangeTab('account')"
        :class="['w-full p-4', tab === 'account' ? 'bg-sky-500 text-white' : 'hover:bg-slate-200']"
      >
        Tài khoản ({{ paginationUser?.count }})
      </button>
      <button
        @click="handleChangeTab('tutor')"
        :class="['w-full p-4', tab === 'tutor' ? 'bg-sky-500 text-white' : 'hover:bg-slate-200']"
      >
        Gia sư ({{ paginationTutor?.count }})
      </button>
      <button
        @click="handleChangeTab('student')"
        :class="['w-full p-4', tab === 'student' ? 'bg-sky-500 text-white' : 'hover:bg-slate-200']"
      >
        Học sinh ({{ paginationStudent?.count }})
      </button>
    </div>
    <div class="grid w-full grid-flow-row-dense justify-items-center">
      <UserTable
        v-if="tab === 'account' && users"
        :users="users"
        :offset="pagination.offset"
        @filter-status="handleFilter"
        @select-user="handleSelectUser"
        @delete-user="handleRequiredConfirmDeleteUser"
      />
      <TutorTable
        v-if="tab === 'tutor' && tutors"
        :tutors="tutors"
        :offset="pagination.offset"
        @filter-tutor="handleFilter"
        @select-tutor="handleSelectUser"
        @delete-tutor="handleRequiredConfirmDeleteTutor"
      />
      <StudentTable
        v-if="tab === 'student' && students"
        :students="students"
        :offset="pagination.offset"
        :enable-edit="true"
        @filter-student="handleFilter"
        @select-student="handleSelectUser"
        @delete-student="handleRequiredConfirmDeleteStudent"
      />
    </div>
    <div class="grid w-full grid-flow-row-dense justify-items-center">
      <AppPaginationBar
        :pagination="{
          count: paginationResult.count,
          limit: pagination.limit,
          next: paginationResult.next,
          previous: paginationResult.previous
        }"
        @choose-page="handleGotoPage"
        @next="handleNextPage"
        @previous="handlePreviousPage"
        v-if="paginationResult"
      />
    </div>
  </div>
</template>
