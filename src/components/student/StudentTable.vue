<script setup lang="ts">
import { CLASSLEVELMAP } from '@/constants/class.constant'
import { USERSTATUSMAP } from '@/constants/user.constant'
import { Status } from '@/enums'
import type { Student } from '@/types/student.type'
import type { Tutor } from '@/types/tutor.type'
import { computed, defineComponent, onMounted, ref } from 'vue'
import AppListBox from '../shared/AppListBox.vue'
import type { SelectItems } from '../classroom/ClassForm.vue'
import type { FilterField } from '@/types'
import { FilterOperationType } from '@chax-at/prisma-filter-common'

const props = defineProps<{ students: Student[]; offset: number; enableEdit: boolean }>()
const emits = defineEmits(['select-student', 'delete-student', 'filter-student'])

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

const listClassLevel = ref<SelectItems[]>()
const selectedClassLevel = ref<string>('')
const filterClassLevel = computed<FilterField | undefined>(() => {
  if (selectedClassLevel.value === 'none') return
  if (
    listClassLevel.value &&
    listClassLevel.value.find((s) => s.value === selectedClassLevel.value)
  ) {
    return {
      field: 'class',
      type: FilterOperationType.Eq,
      value: selectedClassLevel.value
    }
  }
})
const filterQuery = computed<FilterField[]>(() => {
  return [
    ...(filterStatus.value ? [filterStatus.value] : []),
    ...(filterClassLevel.value ? [filterClassLevel.value] : [])
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

const handleFilterStatus = (value: string) => {
  selectedStatus.value = value
  emits('filter-student', filterQuery.value)
}
const handleFilterClassLevel = (value: string) => {
  selectedClassLevel.value = value
  emits('filter-student', filterQuery.value)
}

const handleDeleteStudent = (id: string, event: Event) => {
  event.stopPropagation()
  emits('delete-student', id)
}

onMounted(() => {
  listStatus.value = Object.keys(USERSTATUSMAP).map((key) => {
    return {
      label: USERSTATUSMAP[key],
      value: key
    }
  })
  listClassLevel.value = Object.keys(CLASSLEVELMAP).map((key) => {
    return {
      label: CLASSLEVELMAP[key],
      value: key
    }
  })
})

defineComponent({ name: 'StudentTable' })
</script>
<template>
  <div class="grid w-full grid-flow-row-dense gap-5">
    <div class="grid grid-flow-col-dense justify-end gap-5" v-if="enableEdit">
      <AppListBox
        v-if="listStatus"
        :list="listStatus"
        @select-value="handleFilterStatus"
        :list-lable="'Trạng thái'"
      />
      <AppListBox
        v-if="listClassLevel"
        :list="listClassLevel"
        @select-value="handleFilterClassLevel"
        :list-lable="'Lớp'"
      />
    </div>

    <div class="relative min-h-36 w-full overflow-x-auto">
      <table class="w-full text-left text-gray-500 rtl:text-right" v-if="props.students.length > 0">
        <thead class="bg-gray-50 uppercase text-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3">STT</th>
            <th scope="col" class="px-6 py-3">Họ tên</th>
            <th scope="col" class="px-6 py-3">Số điện thoại</th>
            <th scope="col" class="px-6 py-3">Lớp</th>
            <th scope="col" class="px-6 py-3 text-center">Trạng thái</th>
            <th scope="col" class="px-6 py-3 text-center" v-if="enableEdit">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="cursor-pointer border-b bg-white hover:bg-cyan-100"
            v-for="(student, index) in props.students"
            :key="student.id"
            @click="emits('select-student', student.id)"
          >
            <th scope="row" class="whitespace-nowrap px-6 py-4 font-medium">
              {{ offset + index + 1 }}
            </th>
            <td class="px-6 py-4 capitalize">
              {{ student.fullName }}
            </td>
            <td class="px-6 py-4">
              {{ student.phone }}
            </td>
            <td class="px-6 py-4">
              {{ CLASSLEVELMAP[student.class] }}
            </td>
            <td :class="['px-6 py-4 text-center font-semibold', getColor(student.status)]">
              {{ USERSTATUSMAP[student.status] }}
            </td>
            <td class="grid grid-flow-col-dense justify-items-center px-6 py-4" v-if="enableEdit">
              <button @click="handleDeleteStudent(student.id, $event)">
                <font-awesome-icon :icon="['fas', 'trash']" style="color: #e70d0d" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex h-full items-center justify-center" v-else>
        <p class="text-2xl font-bold text-gray-500">Không có dữ liệu</p>
      </div>
    </div>
  </div>
</template>
