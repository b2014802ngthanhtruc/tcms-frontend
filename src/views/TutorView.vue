<script lang="ts" setup>
import AppFilterTab, { type FilterKey } from '@/components/shared/AppFilterTab.vue'
import AppPaginationBar from '@/components/shared/AppPaginationBar.vue'
import AppSearchBar from '@/components/shared/AppSearchBar.vue'
import AppSortBar from '@/components/shared/AppSortBar.vue'
import TutorItem from '@/components/tutor/TutorItem.vue'
import { ClassLevel } from '@/enums'
import router from '@/router'
import AddressService from '@/services/address/address.service'
import GeneralTutorService from '@/services/tutor/general-tutor.service'
import type { CityResponse, FilterField, OrderField, Pagination, QueryParams } from '@/types'
import type { ListTutorResponse } from '@/types/tutor.type'
import { getQueryParams, toNormalize } from '@/utils'
import { FilterOperationType } from '@chax-at/prisma-filter-common'
import { computed, defineComponent, onMounted, ref } from 'vue'

const generalTutorService = new GeneralTutorService()
const addressService = new AddressService()

const tutors = ref<ListTutorResponse[]>([])
const tutorsPagination = ref<Pagination<ListTutorResponse>>({
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
  return getQueryParams(queryParams.value)
})

const cities = ref<CityResponse[]>([])
const isOpenFilter = ref(false)
const sortFields = [
  {
    field: 'fullName',
    mask: 'A-Z'
  },
  {
    field: 'createdAt',
    mask: 'Mới nhất'
  }
]

const twoColumn = computed(() => {
  const result: FilterKey[] = []
  console.log('cities', cities.value)
  result.push({
    field: 'areaExpects.some.city',
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
      mask: toNormalize(level)
    }))
  })
  return result
})

const totalPage = computed(() => {
  return Math.ceil(tutorsPagination.value.count / pagination.value.limit)
})
const currentPage = ref(1)

const hanldeCloseTab = () => {
  isOpenFilter.value = false
}

const handleSort = async (orderFields: OrderField[]) => {
  queryOrder.value = orderFields
  console.log('query order', queryOrder.value)
  const result = await generalTutorService.findMany(queryString.value)
  tutors.value = result.results
  tutorsPagination.value = result
}

const handleFilter = async (filterFields: FilterField[]) => {
  queryFilter.value = filterFields
  const result = await generalTutorService.findMany(queryString.value)
  tutors.value = result.results
  tutorsPagination.value = result
}

const handleSearch = async (searchValue: string) => {
  const searchParams: FilterField = {
    field: 'fullName',
    type: FilterOperationType.IContains,
    value: searchValue
  }
  queryFilter.value = queryFilter.value ? [...queryFilter.value, searchParams] : [searchParams]
  const result = await generalTutorService.findMany(queryString.value)
  tutors.value = result.results
  tutorsPagination.value = result
}

const handleGotoPage = async (offset: number) => {
  pagination.value.offset = offset
  const result = await generalTutorService.findMany(queryString.value)
  tutors.value = result.results
  tutorsPagination.value = result
  currentPage.value = offset / pagination.value.limit + 1
  console.log('current page', currentPage.value)
}

const handleNextPage = async () => {
  if (currentPage.value < totalPage.value && tutorsPagination.value.next) {
    currentPage.value = currentPage.value + 1
    const result = await generalTutorService.findMany(tutorsPagination.value.next)
    tutors.value = result.results
    tutorsPagination.value = result
  }
}

const handlePreviousPage = async () => {
  if (currentPage.value > 1 && tutorsPagination.value.previous) {
    currentPage.value = currentPage.value - 1
    const result = await generalTutorService.findMany(tutorsPagination.value.previous)
    tutors.value = result.results
    tutorsPagination.value = result
  }
}

const handleGetDetail = async (id: string) => {
  await router.push({ name: 'tutor-detail', params: { id } })
}

onMounted(async () => {
  const result = await generalTutorService.findMany(queryString.value)
  tutors.value = result.results
  tutorsPagination.value = result

  const resultCities = await addressService.listCities()
  console.log('cities response', resultCities)
  cities.value = [...resultCities]
})

defineComponent({ name: 'TutorView' })
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
      <div class="grid grid-cols-2 gap-3">
        <div class="w-full @container" v-for="tutor in tutors">
          <TutorItem :tutor="tutor" @get-detail="handleGetDetail" />
        </div>
      </div>
      <div class="mt-5">
        <AppPaginationBar
          :pagination="{
            next: tutorsPagination.next,
            previous: tutorsPagination.previous,
            count: tutorsPagination.count,
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
