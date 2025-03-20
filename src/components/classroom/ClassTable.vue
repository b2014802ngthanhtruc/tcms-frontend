<script setup lang="ts">
import { ClassStatus, ScopeClass, Status, TeachingMode } from '@/enums'
import { capitalize, computed, defineComponent, onMounted, ref } from 'vue'
import type { SelectItems } from './ClassForm.vue'
import type { ClassResponse, FilterField } from '@/types'
import { FilterOperationType } from '@chax-at/prisma-filter-common'
import AppListBox from '../shared/AppListBox.vue'
import { CLASSSTATUSMAP, SCOPEMAP } from '@/constants/class.constant'

const props = defineProps<{ classrooms: ClassResponse[]; offset: number }>()
const emits = defineEmits([
  'select-classroom',
  'delete-classroom',
  'filter-classroom',
  'edit-classroom'
])

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

const listScope = ref<SelectItems[]>()
const selectedScope = ref<string>('')
const filterScope = computed<FilterField | undefined>(() => {
  if (selectedScope.value === 'none') return
  if (listScope.value && listScope.value.find((s) => s.value === selectedScope.value)) {
    return {
      field: 'scope',
      type: FilterOperationType.Eq,
      value: selectedScope.value
    }
  }
})

const listTeachingMode = ref<SelectItems[]>()
const selectedTeachingMode = ref<string>('')
const filterTeachingMode = computed<FilterField | undefined>(() => {
  if (selectedTeachingMode.value === 'none') return
  if (
    listTeachingMode.value &&
    listTeachingMode.value.find((s) => s.value === selectedTeachingMode.value)
  ) {
    return {
      field: 'teachingMode',
      type: FilterOperationType.Eq,
      value: selectedTeachingMode.value
    }
  }
})

const filterQuery = computed<FilterField[]>(() => {
  return [
    ...(filterStatus.value ? [filterStatus.value] : []),
    ...(filterScope.value ? [filterScope.value] : []),
    ...(filterTeachingMode.value ? [filterTeachingMode.value] : [])
  ]
})
const getColor = (status: string) => {
  switch (status) {
    case ClassStatus.NEW:
      return 'text-emerald-500'
    case ClassStatus.PENDING:
      return 'text-yellow-500'
    case ClassStatus.STARTED:
      return 'text-blue-500'
    case ClassStatus.CANCELED:
      return 'text-red-500'
    case ClassStatus.PAUSED:
      return 'text-gray-500'
    case ClassStatus.ENDED:
      return 'text-green-500'
    default:
      return 'text-black'
  }
}

const handleFilterStatus = (status: string) => {
  console.log('status', status)
  selectedStatus.value = status
  emits('filter-classroom', filterQuery.value)
}
const handleFilterScope = (scope: string) => {
  selectedScope.value = scope
  emits('filter-classroom', filterQuery.value)
}

const handleFilterTeachingMode = (teachingMode: string) => {
  selectedTeachingMode.value = teachingMode
  emits('filter-classroom', filterQuery.value)
}

const handleEditClassroom = (id: string, event: Event) => {
  event.stopPropagation()
  emits('edit-classroom', id)
}

const handleDeleteClassroom = (id: string, event: Event) => {
  event.stopPropagation()
  emits('delete-classroom', id)
}

onMounted(() => {
  listStatus.value = Object.values(ClassStatus).map((s) => ({ value: s, label: CLASSSTATUSMAP[s] }))
  listScope.value = Object.values(ScopeClass).map((s) => ({ value: s, label: SCOPEMAP[s] }))
  listTeachingMode.value = Object.values(TeachingMode).map((s) => ({
    value: s,
    label: capitalize(s)
  }))
})

defineComponent({ name: 'ClassTable' })
</script>
<template>
  <div class="grid w-full grid-flow-row-dense gap-5">
    <div class="grid grid-flow-col-dense justify-end gap-5">
      <AppListBox
        v-if="listStatus"
        :list="listStatus"
        :list-lable="'Trạng thái'"
        @select-value="handleFilterStatus"
      />
      <AppListBox
        v-if="listScope"
        :list="listScope"
        :list-lable="'Quy mô'"
        @select-value="handleFilterScope"
      />
      <AppListBox
        v-if="listTeachingMode"
        :list="listTeachingMode"
        :list-lable="'Hình thức học'"
        @select-value="handleFilterTeachingMode"
      />
    </div>

    <div class="relative min-h-96 w-full overflow-x-auto">
      <table
        class="w-full text-left text-gray-500 rtl:text-right"
        v-if="props.classrooms.length > 0"
      >
        <thead class="bg-gray-50 uppercase text-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3">STT</th>
            <th scope="col" class="px-6 py-3">Tên lớp</th>
            <th scope="col" class="px-6 py-3">Môn học</th>
            <th scope="col" class="px-6 py-3">Hình thức</th>
            <th scope="col" class="px-6 py-3">Quy mô</th>
            <th scope="col" class="px-6 py-3 text-center">Trạng thái</th>
            <th scope="col" class="px-6 py-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="cursor-pointer border-b bg-white hover:bg-cyan-100"
            v-for="(classroom, index) in props.classrooms"
            :key="classroom.id"
            @click="emits('select-classroom', classroom.id)"
          >
            <th scope="row" class="whitespace-nowrap px-6 py-4 font-medium">
              {{ offset + index + 1 }}
            </th>
            <td class="px-6 py-4">
              {{ classroom.className }}
            </td>
            <td class="px-6 py-4">
              {{ classroom.subject.name }}
            </td>
            <td class="px-6 py-4 capitalize">
              {{ classroom.teachingMode }}
            </td>
            <td class="px-6 py-4">
              {{ SCOPEMAP[classroom.scope] }}
            </td>
            <td :class="['px-6 py-4 text-center font-semibold', getColor(classroom.status)]">
              {{ CLASSSTATUSMAP[classroom.status] }}
            </td>
            <td class="grid grid-flow-col-dense justify-items-center px-6 py-4">
              <button @click="handleEditClassroom(classroom.id, $event)">
                <font-awesome-icon :icon="['fas', 'pen']" style="color: #ffd43b" />
              </button>
              <button @click="handleDeleteClassroom(classroom.id, $event)">
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
