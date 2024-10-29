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
import { getQueryParams, toNormalize } from '@/utils'
import { computed, onMounted, ref } from 'vue'
import type { FilterKey } from '@/components/shared/AppFilterTab.vue'
import { ClassLevel, ClassStatus } from '@/enums'
import AppFilterTab from '@/components/shared/AppFilterTab.vue'
import AddressService from '@/services/address/address.service'
import { FilterOperationType } from '@chax-at/prisma-filter-common'
import AppPaginationBar from '@/components/shared/AppPaginationBar.vue'
import { useRouter } from 'vue-router'

const generalClassroomService = new GeneralClassroomService()
const addressService = new AddressService()
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
    mask: 'newest'
  },
  {
    field: 'tuitionFee',
    mask: 'tuition'
  }
]

const cities = ref<CityResponse[]>([])
const twoColumn = computed(() => {
  const result: FilterKey[] = [
    {
      field: 'teachingMode',
      label: 'method',
      items: [
        { value: 'online', mask: 'online' },
        { value: 'offline', mask: 'offline' }
      ]
    },
    {
      field: 'scope',
      label: 'scope',
      items: [
        { value: 'small', mask: 'small', description: '1-2 students' },
        { value: 'medium', mask: 'medium', description: '3-5 students' },
        { value: 'large', mask: 'large', description: '6-10 students' }
      ]
    }
  ]
  console.log('cities', cities.value)
  result.push({
    field: 'location.city',
    label: 'city',
    items: cities.value.map((city) => ({ value: city.name, mask: city.name }))
  })
  console.log(result)
  return result
})
const threeColumn = computed<FilterKey[]>(() => {
  const result: FilterKey[] = []
  result.push({
    field: 'level',
    label: 'level',
    items: Object.values(ClassLevel).map((level) => ({
      value: level,
      mask: toNormalize(level)
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
</script>
<template>
  <div :class="isOpenFilter ? 'grid grid-cols-12' : 'container mx-auto'">
    <div v-if="isOpenFilter" class="col-span-3 pr-2 pt-3">
      <AppFilterTab
        :filterFields="{
          oneColumn: [],
          twoColumn,
          threeColumn
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
          <ClassCard :classroom="classroom" @get-detail="handleGotoDetail" />
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
