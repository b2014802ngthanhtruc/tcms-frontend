<script setup lang="ts">
import ClassItem from '@/components/classroom/ClassItem.vue'
import AppButton from '@/components/shared/AppButton.vue'
import type { NavigationItem } from '@/components/shared/AppDrawer.vue'
import AppFilterBar from '@/components/shared/AppFilterBar.vue'
import type { FilterKey } from '@/components/shared/AppFilterTab.vue'
import AppPaginationBar from '@/components/shared/AppPaginationBar.vue'
import AppSearchBar from '@/components/shared/AppSearchBar.vue'
import { ButtonStatus, ButtonType, ClassStatus } from '@/enums'
import GeneralClassroomService from '@/services/classroom/general-classroom.service'
import type {
  ClassResponse,
  ClassRoom,
  FilterField,
  Pagination,
  QueryParams,
  UserLogin
} from '@/types'
import { getQueryParams } from '@/utils'
import { FilterOperationType } from '@chax-at/prisma-filter-common'
import { computed, inject, onMounted, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import AppDrawer from '@/components/shared/AppDrawer.vue'

const classService = new GeneralClassroomService()
const user = inject<Ref<UserLogin | undefined>>('userLogin')
const router = useRouter()
const route = useRoute()

const defaultQueryParams = ref<QueryParams>({
  limit: 20,
  offset: 0,
  filter: [
    {
      field: 'studentOfClasses.some.studentId',
      type: FilterOperationType.Eq,
      value: user?.value?.id
    }
  ],
  order: [{ field: 'createdAt', dir: 'desc' }]
})
const filterKey = ref<FilterKey>({
  field: 'status',
  label: 'Trạng thái',
  items: [
    {
      value: 'All',
      mask: 'Tất cả'
    },
    {
      value: ClassStatus.NEW,
      mask: 'Mới'
    },
    {
      value: ClassStatus.PENDING,
      mask: 'Chờ duyệt'
    },
    {
      value: ClassStatus.STARTED,
      mask: 'Đã bắt đầu'
    },
    {
      value: ClassStatus.CANCELED,
      mask: 'Bị hủy'
    },
    {
      value: ClassStatus.PAUSED,
      mask: 'Tạm ngưng'
    },
    {
      value: ClassStatus.ENDED,
      mask: 'Hoàn thành'
    }
  ]
})
const filterValue = ref<FilterField[] | undefined>(undefined)
const paginate = ref({ limit: 20, offset: 0 })
const currentPage = ref(1)
const totalPage = computed(() => Math.ceil(pagination.value.count / paginate.value.limit))
const searchValue = ref<string>('')

const queryString = computed(() => {
  const queryParams: QueryParams = {
    ...paginate.value,
    filter: defaultQueryParams.value.filter && [
      ...defaultQueryParams.value.filter,
      ...(filterValue.value || [])
    ],
    order: [{ field: 'createdAt', dir: 'desc' }]
  }
  return getQueryParams(queryParams)
})
const pagination = ref<Pagination<ClassRoom>>({
  count: 0,
  results: [],
  next: null,
  previous: null
})
const classes = computed<ClassRoom[]>(() => {
  return pagination.value.results
})

const handleFilter = async (filterFields: FilterField[]) => {
  console.log('filterFields', filterFields)
  const allIndex = filterFields.findIndex((f) => f.value === 'All')
  if (allIndex > -1) {
    filterFields.splice(allIndex, 1)
  }
  filterValue.value = filterFields
  const result = await classService.findMany(queryString.value)
  pagination.value = result
}

const handleSearch = async (searchValue: string) => {
  const searchParams: FilterField = {
    field: 'className',
    type: FilterOperationType.IContains,
    value: searchValue
  }
  filterValue.value = filterValue.value ? [...filterValue.value, searchParams] : [searchParams]
  console.log('searchValue', filterValue.value)
  const result = await classService.findMany(queryString.value)
  pagination.value = result
}

const handleGotoPage = async (offset: number) => {
  paginate.value.offset = offset
  const result = await classService.findMany(queryString.value)
  pagination.value = result
}

const handleNextPage = async () => {
  if (currentPage.value < totalPage.value && pagination.value.next) {
    currentPage.value = currentPage.value + 1
    paginate.value.offset = (currentPage.value - 1) * paginate.value.limit
    const result = await classService.findMany(queryString.value)
    pagination.value = result
  }
}

const handlePreviousPage = async () => {
  if (currentPage.value > 1 && pagination.value.previous) {
    currentPage.value = currentPage.value - 1
    paginate.value.offset = (currentPage.value - 1) * paginate.value.limit
    const result = await classService.findMany(queryString.value)
    pagination.value = result
  }
}

const handleGotoCreateClass = () => {
  router.push({ name: 'student-manager-create-class' })
}

const handleGotoDetail = (id: string) => {
  console.log(id)
  router.push({ name: 'student-manager-one-classroom', params: { id }, query: { menuIndex: '1' } })
}

onMounted(async () => {
  if (!user) {
    toast.warning('Bạn cần đăng nhập trước khi thực hiện chức năng này')
    router.push('/home')
    return
  }
  const queryString = getQueryParams(defaultQueryParams.value)
  const result = await classService.findMany(queryString)
  console.log(result)
  pagination.value = result
})
</script>
<template>
  <div class="container mx-auto my-4 justify-center justify-items-center space-y-5">
    <div class="grid w-full grid-flow-col-dense justify-items-center gap-5">
      <div class="col-span-10 w-3/6">
        <AppSearchBar @search="handleSearch" />
      </div>
      <div class="flex flex-auto justify-end">
        <AppButton
          :content="'Tạo lớp học +'"
          :status="ButtonStatus.PRIMARY"
          :type="ButtonType.OUTLINE"
          @click="handleGotoCreateClass"
        />
      </div>
    </div>
    <div class="w-full">
      <AppFilterBar :filter-key="filterKey" @filter-value="handleFilter" :default-value="'All'" />
    </div>
    <div class="grid min-h-80 w-full grid-cols-4 gap-4" v-if="classes.length > 0">
      <ClassItem
        v-for="classItem in classes"
        :key="classItem.id"
        :classroom="classItem"
        @get-detail="handleGotoDetail"
      />
    </div>
    <div v-if="classes.length > 0">
      <AppPaginationBar
        :pagination="{
          previous: pagination.previous,
          next: pagination.next,
          count: pagination.count,
          limit: paginate.limit
        }"
        :current-page="currentPage"
        :total-page="totalPage"
        @choose-page="handleGotoPage"
        @next="handleNextPage"
        @previous="handlePreviousPage"
      />
    </div>
    <div v-else class="h-80">
      <p class="mx-auto text-lg">Không tìm thấy lớp học</p>
    </div>
  </div>
</template>
