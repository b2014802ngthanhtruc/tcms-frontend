<script setup lang="ts">
import { USERSTATUSMAP } from '@/constants/user.constant'
import { Status } from '@/enums'
import type { Tutor } from '@/types/tutor.type'
import { computed, defineComponent, onMounted, ref } from 'vue'
import type { SelectItems } from '../classroom/ClassForm.vue'
import AppListBox from '../shared/AppListBox.vue'
import AddressService from '@/services/address/address.service'
import type { FilterField, QueryParams } from '@/types'
import { FilterOperationType } from '@chax-at/prisma-filter-common'
import { getQueryParams } from '@/utils'

const props = defineProps<{ tutors: Tutor[]; offset: number }>()
const emits = defineEmits(['select-tutor', 'delete-tutor', 'filter-tutor'])

const addressService = new AddressService()

const listStatus = ref<SelectItems[]>()
const selectedStatus = ref<string>('')
const filterStatus = computed<FilterField | undefined>(() => {
  if (selectedStatus.value === 'none') return
  if (listStatus.value && listStatus.value.find((s) => s.value === selectedStatus.value)) {
    return {
      field: 'status',
      type: FilterOperationType.Eq,
      value: selectedStatus.value
    }
  }
})
const listCities = ref<SelectItems[]>()
const selectedCity = ref<string>('')
const filterCity = computed<FilterField | undefined>(() => {
  if (selectedCity.value === 'none') return
  if (listCities.value && listCities.value.find((c) => c.value === selectedCity.value)) {
    return {
      field: 'areaExpects.some.city',
      type: FilterOperationType.Eq,
      value: selectedCity.value
    }
  }
})
const filterQuery = computed<FilterField[]>(() => {
  console.log('filterStatus', filterStatus.value)
  console.log('filterCity', filterCity.value)
  return [
    ...(filterStatus.value ? [filterStatus.value] : []),
    ...(filterCity.value ? [filterCity.value] : [])
  ]
})

const getColor = (status: string) => {
  switch (status) {
    case Status.ACTIVE:
      return 'text-green-500'
    case Status.BLOCKED:
      return 'text-red-500'
    case Status.PENDING:
      return 'text-yellow-500'
    default:
      return 'text-gray-500'
  }
}

const handleFilterCity = (value: string) => {
  console.log('value', value)
  selectedCity.value = value
  emits('filter-tutor', filterQuery.value)
}

const handleFilterStatus = (value: string) => {
  console.log('value', value)
  selectedStatus.value = value
  emits('filter-tutor', filterQuery.value)
}

const handleDeleteTutor = (id: string, event: Event) => {
  event.stopPropagation()
  emits('delete-tutor', id)
}

onMounted(async () => {
  listStatus.value = Object.values(Status).map((s) => ({ value: s, label: USERSTATUSMAP[s] }))

  const query: QueryParams = {
    filter: [
      {
        field: 'isProvided',
        type: FilterOperationType.Eq,
        value: true
      }
    ]
  }
  const queryString = getQueryParams(query)
  const result = await addressService.listCities(queryString)
  listCities.value = result.results.map((c) => ({ value: c.name, label: c.name }))

  console.log('listCities', listCities.value)
  console.log('listStatus', listStatus.value)
})

defineComponent({ name: 'TutorTable' })
</script>
<template>
  <div class="grid w-full grid-flow-row-dense gap-5">
    <div class="grid grid-flow-col-dense justify-end gap-5">
      <AppListBox
        v-if="listStatus"
        :list="listStatus"
        @select-value="handleFilterStatus"
        :list-lable="'Trạng thái'"
      />
      <AppListBox
        v-if="listCities"
        :list="listCities"
        @select-value="handleFilterCity"
        :list-lable="'Tỉnh/Thành phố'"
      />
    </div>

    <div class="relative min-h-96 w-full overflow-x-auto">
      <table class="w-full text-left text-gray-500 rtl:text-right" v-if="props.tutors.length > 0">
        <thead class="bg-gray-50 uppercase text-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3">STT</th>
            <th scope="col" class="px-6 py-3">Họ tên</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Số điện thoại</th>
            <th scope="col" class="px-6 py-3 text-center">Trạng thái</th>
            <th scope="col" class="px-6 py-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="cursor-pointer border-b bg-white hover:bg-cyan-100"
            v-for="(tutor, index) in props.tutors"
            :key="tutor.id"
            @click="emits('select-tutor', tutor.id)"
          >
            <th scope="row" class="whitespace-nowrap px-6 py-4 font-medium">
              {{ offset + index + 1 }}
            </th>
            <td class="px-6 py-4 capitalize">
              {{ tutor.fullName }}
            </td>
            <td class="px-6 py-4">
              {{ tutor.user.email }}
            </td>
            <td class="px-6 py-4">
              {{ tutor.phone }}
            </td>
            <td :class="['px-6 py-4 text-center font-semibold', getColor(tutor.status)]">
              {{ USERSTATUSMAP[tutor.status] }}
            </td>
            <td class="grid grid-flow-col-dense justify-items-center px-6 py-4">
              <button @click="handleDeleteTutor(tutor.id, $event)">
                <font-awesome-icon :icon="['fas', 'trash']" style="color: #e70d0d" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="flex h-full items-center justify-center">
        <p class="text-2xl font-bold text-gray-500">Không có dữ liệu</p>
      </div>
    </div>
  </div>
</template>
