<script setup lang="ts">
import AppSearchBar from '@/components/shared/AppSearchBar.vue'
import AppSortBar from '@/components/shared/AppSortBar.vue'
import GeneralClassroomService from '@/services/classroom/general-classroom.service'
import ClassCard from '@/components/classroom/ClassCard.vue'
import type {
  OrderField,
  ClassRoom,
  FilterField,
  QueryParams,
  CityResponse,
  Pagination
} from '@/types'
import { checkIsLogin, getQueryParams, getUserLoginFromLS, toNormalize } from '@/utils'
import { computed, onMounted, ref } from 'vue'
import type { FilterKey } from '@/components/shared/AppFilterTab.vue'
import { ClassLevel, ClassStatus } from '@/enums'
import AppFilterTab from '@/components/shared/AppFilterTab.vue'
import AddressService from '@/services/address/address.service'
import { FilterOperationType } from '@chax-at/prisma-filter-common'
import AppPaginationBar from '@/components/shared/AppPaginationBar.vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import StudentClassroomService from '@/services/classroom/student-classroom.service'
import TutorClassroomService from '@/services/classroom/tutor-classroom.service'
import type { AxiosError } from 'axios'
import { CLASSLEVELMAP } from '@/constants/class.constant'

const generalClassroomService = new GeneralClassroomService()
const addressService = new AddressService()
const studentClassroomService = new StudentClassroomService()
const tutorClassroomService = new TutorClassroomService()
const router = useRouter()

const isOpenFilter = ref(false)
const classrooms = ref<ClassRoom[]>([])
const classroomsPagination = ref<Pagination<ClassRoom>>({
  count: 0,
  results: [],
  next: null,
  previous: null
})
const queryFilter = ref<FilterField[] | undefined>(undefined)
const queryOrder = ref<OrderField[] | undefined>(undefined)
const pagination = ref({ limit: 10, offset: 0 })
const queryParams = ref<QueryParams>({})
const queryString = computed(() => {
  queryParams.value = {
    ...pagination.value,
    filter: queryFilter.value,
    order: queryOrder.value
  }
  if (queryParams.value.filter?.findIndex((f) => f.field === 'status') === -1) {
    queryParams.value.filter?.push({
      field: 'status',
      type: FilterOperationType.Eq,
      value: ClassStatus.NEW
    })
  }
  return getQueryParams(queryParams.value)
})
onMounted(async () => {
  const result = await generalClassroomService.findMany(queryString.value)
  classrooms.value = result.results
  classroomsPagination.value = result
  const resultCities = await addressService.listCities()
  console.log('cities response', resultCities)
  cities.value = [...resultCities]
  console.log('cities value ', cities.value)
})

const sortFields = [
  {
    field: 'className',
    mask: 'A-Z'
  },
  {
    field: 'createdAt',
    mask: 'Mới nhất'
  },
  {
    field: 'tuitionFee',
    mask: 'Học phí'
  }
]

const cities = ref<CityResponse[]>([])
const twoColumn = computed(() => {
  const result: FilterKey[] = [
    {
      field: 'teachingMode',
      label: 'Hình thức giảng dạy',
      items: [
        { value: 'online', mask: 'online' },
        { value: 'offline', mask: 'offline' }
      ]
    },
    {
      field: 'scope',
      label: 'Quy mô',
      items: [
        { value: 'small', mask: 'Nhỏ', description: '1-2 học sinh' },
        { value: 'medium', mask: 'Trung bình', description: '3-5 học sinh' },
        { value: 'large', mask: 'Lớn', description: '6-10 học sinh' }
      ]
    }
  ]
  console.log('cities', cities.value)
  result.push({
    field: 'location.city',
    label: 'Tỉnh/Thành phố',
    items: cities.value.map((city) => ({ value: city.name, mask: city.name }))
  })
  console.log(result)
  return result
})
const threeColumn = computed<FilterKey[]>(() => {
  const result: FilterKey[] = []
  result.push({
    field: 'level',
    label: 'Lớp',
    items: Object.values(ClassLevel).map((level) => ({
      value: level,
      mask: toNormalize(CLASSLEVELMAP[level])
    }))
  })
  return result
})

const totalPage = computed(() => {
  return Math.ceil(classroomsPagination.value.count / pagination.value.limit)
})
const currentPage = ref(1)

const hanldeCloseTab = () => {
  isOpenFilter.value = false
}

const handleSort = async (orderFields: OrderField[]) => {
  queryOrder.value = orderFields
  const result = await generalClassroomService.findMany(queryString.value)
  classrooms.value = result.results
  classroomsPagination.value = result
}

const handleFilter = async (filterFields: FilterField[]) => {
  queryFilter.value = filterFields
  const result = await generalClassroomService.findMany(queryString.value)
  classrooms.value = result.results
  classroomsPagination.value = result
}

const handleSearch = async (searchValue: string) => {
  const searchParams: FilterField = {
    field: 'className',
    type: FilterOperationType.IContains,
    value: searchValue
  }
  queryFilter.value = queryFilter.value ? [...queryFilter.value, searchParams] : [searchParams]
  const result = await generalClassroomService.findMany(queryString.value)
  classrooms.value = result.results
  classroomsPagination.value = result
}

const handleGotoPage = async (offset: number) => {
  pagination.value.offset = offset
  const result = await generalClassroomService.findMany(queryString.value)
  classrooms.value = result.results
  classroomsPagination.value = result
  currentPage.value = offset / pagination.value.limit + 1
  console.log('current page', currentPage.value)
}

const handleNextPage = async () => {
  if (currentPage.value < totalPage.value && classroomsPagination.value.next) {
    currentPage.value = currentPage.value + 1
    const result = await generalClassroomService.findMany(classroomsPagination.value.next)
    classrooms.value = result.results
    classroomsPagination.value = result
  }
}

const handlePreviousPage = async () => {
  if (currentPage.value > 1 && classroomsPagination.value.previous) {
    currentPage.value = currentPage.value - 1
    const result = await generalClassroomService.findMany(classroomsPagination.value.previous)
    classrooms.value = result.results
    classroomsPagination.value = result
  }
}

const handleGotoDetail = (id: string) => {
  console.log(id)
  router.push({ name: 'classroom-detail', params: { id } })
}

const handleEnroll = async (id: string) => {
  console.log(id)
  const isLoggedIn = checkIsLogin()
  const user = getUserLoginFromLS()
  if (!isLoggedIn) {
    toast.warning('You need to be logged in to enroll in this class!')
    return
  }
  if (user && user.isStudent) {
    try {
      await studentClassroomService.enroll(id)
      toast.success('Enroll successfully!')
    } catch (error) {
      const err = error as AxiosError
      const data: any = err.response?.data
      toast.error(data.message)
    }
  }
  if (user && user.isTutor) {
    try {
      await tutorClassroomService.enroll(id)
      toast.success('Enroll successfully!')
    } catch (error) {
      const err = error as AxiosError
      const data: any = err.response?.data
      toast.error(data.message)
    }
  }
}
</script>
<template>
  <div :class="isOpenFilter ? 'grid grid-cols-12' : 'container mx-auto'">
    <div v-if="isOpenFilter" class="col-span-3 pr-2 pt-3">
      <AppFilterTab
        :filterFields="{
          oneColumn: [],
          twoColumn,
          threeColumn,
          queryFilter: queryFilter ?? []
        }"
        @closeTab="hanldeCloseTab"
        @filter="handleFilter"
      />
    </div>

    <div
      :class="[
        'container mx-auto my-4 h-fit justify-items-center overflow-hidden bg-white p-3 @container',
        isOpenFilter ? 'col-span-9 col-start-4' : 'w-full'
      ]"
    >
      <div class="m-3 flex items-center justify-center gap-3 p-5">
        <div class="flex flex-auto" v-if="!isOpenFilter">
          <button @click="isOpenFilter = !isOpenFilter">
            <font-awesome-icon :icon="['fas', 'bars']" size="2xl" style="color: #000000" />
          </button>
        </div>
        <div class="w-8/12 px-16">
          <AppSearchBar @search="handleSearch" />
        </div>
        <div class="w-3/12">
          <AppSortBar :keys="sortFields" @sort="handleSort" />
        </div>
      </div>
      <div class="grid grid-cols-4 gap-3 @6xl:grid-cols-5" v-if="classrooms.length > 0">
        <div class="w-full @container" v-for="classroom in classrooms">
          <ClassCard :classroom="classroom" @get-detail="handleGotoDetail" @enroll="handleEnroll" />
        </div>
      </div>
      <p v-else class="mx-auto">No data</p>
      <div class="mt-3 p-3">
        <AppPaginationBar
          :pagination="{
            next: classroomsPagination.next,
            previous: classroomsPagination.previous,
            count: classroomsPagination.count,
            limit: pagination.limit
          }"
          :currentPage="currentPage"
          :totalPage="totalPage"
          @choose-page="handleGotoPage"
          @next="handleNextPage"
          @previous="handlePreviousPage"
        />
      </div>
    </div>
  </div>
</template>
