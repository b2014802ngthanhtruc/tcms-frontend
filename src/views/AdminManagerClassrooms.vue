<script setup lang="ts">
import ClassTable from '@/components/classroom/ClassTable.vue'
import AppButton from '@/components/shared/AppButton.vue'
import AppConfirmPopup from '@/components/shared/AppConfirmPopup.vue'
import AppPaginationBar from '@/components/shared/AppPaginationBar.vue'
import AppSearchBar from '@/components/shared/AppSearchBar.vue'
import { ButtonStatus, ButtonType } from '@/enums'
import AdminClassroomService from '@/services/classroom/admin-classroom.service'
import type {
  ClassResponse,
  ClassRoom,
  FilterField,
  OrderField,
  Pagination,
  QueryParams
} from '@/types'
import { getQueryParams } from '@/utils'
import { FilterOperationType } from '@chax-at/prisma-filter-common'
import type { AxiosError } from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const adminClassroomService = new AdminClassroomService()
const router = useRouter()

const isOpenButton = ref(false)
const deletedClassroomId = ref<string>('')
const classrooms = ref<ClassResponse[]>()
const pagiantionClassroom = ref<Pagination<ClassResponse>>()
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

const handleFilter = async (filters: FilterField[]) => {
  filter.value = filters
  const result = await adminClassroomService.findAll(queryString.value)
  pagiantionClassroom.value = result
  classrooms.value = result.results
}

const handleSearch = async (searchValue: string) => {
  const searchParams: FilterField = {
    field: 'className',
    type: FilterOperationType.IContains,
    value: searchValue
  }
  filter.value = filter.value ? [...filter.value, searchParams] : [searchParams]
  const result = await adminClassroomService.findAll(queryString.value)
  classrooms.value = result.results
  pagiantionClassroom.value = result
}

const handleGotoPage = async (offset: number) => {
  pagination.value.offset = offset
  const result = await adminClassroomService.findAll(queryString.value)
  classrooms.value = result.results
  pagiantionClassroom.value = result
}

const handleNextPage = async () => {
  if (pagiantionClassroom.value && pagiantionClassroom.value.next) {
    pagination.value.offset = pagination.value.offset + pagination.value.limit
    const result = await adminClassroomService.findAll(queryString.value)
    classrooms.value = result.results
    pagiantionClassroom.value = result
  }
}

const handlePreviousPage = async () => {
  if (pagiantionClassroom.value && pagiantionClassroom.value.previous) {
    pagination.value.offset = pagination.value.offset - pagination.value.limit
    const result = await adminClassroomService.findAll(queryString.value)
    classrooms.value = result.results
    pagiantionClassroom.value = result
  }
}

const handleSelectClassroom = (id: string) => {
  console.log(id)
  router.push({ name: 'admin-manager-classroom-detail', params: { id } })
}

const handleGotoCreateClassroom = () => {
  router.push({ name: 'admin-manager-create-class' })
}

const handleGotoEditClassroom = (id: string) => {
  router.push({ name: 'admin-manager-update-class', params: { id } })
}

const handleRequiredConfirm = (id: string) => {
  isOpenButton.value = true
  deletedClassroomId.value = id
}

const handleDeleteClassroom = async () => {
  try {
    await adminClassroomService.delete(deletedClassroomId.value)
    const result = await adminClassroomService.findAll(queryString.value)
    classrooms.value = result.results
    pagiantionClassroom.value = result
    isOpenButton.value = false
  } catch (error) {
    const err = error as AxiosError
    const data: any = err.response?.data
    toast.error(data.message)
  }
}
onMounted(async () => {
  const result = await adminClassroomService.findAll(queryString.value)
  classrooms.value = result.results
  pagiantionClassroom.value = result
})
</script>
<template>
  <div
    class="container mx-auto my-5 justify-center justify-items-center space-y-5 rounded-lg bg-white p-3 shadow-md"
  >
    <AppConfirmPopup
      v-if="isOpenButton"
      v-model="isOpenButton"
      :title="'Bạn có chắc chắn muốn xóa lớp học này?'"
      @confirm="handleDeleteClassroom"
    />
    <div class="relative grid w-1/2 grid-flow-col-dense items-center">
      <AppSearchBar @search="handleSearch" />
      <div class="absolute left-full ml-5 w-2/6">
        <AppButton
          :status="ButtonStatus.SUCCESS"
          :type="ButtonType.FULL_FILL"
          :content="'Tạo lớp học mới'"
          @click="handleGotoCreateClassroom"
        />
      </div>
    </div>
    <div class="grid w-full grid-flow-row-dense justify-items-center">
      <ClassTable
        v-if="classrooms"
        :classrooms="classrooms"
        :offset="pagination.offset"
        @filter-classroom="handleFilter"
        @select-classroom="handleSelectClassroom"
        @delete-classroom="handleRequiredConfirm"
        @edit-classroom="handleGotoEditClassroom"
      />
    </div>
    <div class="grid w-full grid-flow-row-dense justify-items-center">
      <AppPaginationBar
        :pagination="{
          count: pagiantionClassroom.count,
          limit: pagination.limit,
          next: pagiantionClassroom.next,
          previous: pagiantionClassroom.previous
        }"
        @choose-page="handleGotoPage"
        @next="handleNextPage"
        @previous="handlePreviousPage"
        v-if="pagiantionClassroom"
      />
    </div>
  </div>
</template>
