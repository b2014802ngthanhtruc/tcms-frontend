<script setup lang="ts">
import { USERSTATUSMAP } from '@/constants/user.constant'
import { Status } from '@/enums'
import type { FilterField, UserResponse } from '@/types'
import { computed, defineComponent, onMounted, ref } from 'vue'
import type { SelectItems } from '../classroom/ClassForm.vue'

import { FilterOperationType } from '@chax-at/prisma-filter-common'
import AppListBox from '../shared/AppListBox.vue'

const props = defineProps<{ users: UserResponse[]; offset: number }>()
const emits = defineEmits(['select-user', 'delete-user', 'filter-status'])

const listStatus = ref<SelectItems[]>()
const selectedStatus = ref<string>('')
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

const handleFilter = (value: string) => {
  selectedStatus.value = value
  console.log('selectedStatus', selectedStatus.value)
  const filterQuery: FilterField = {
      field: 'status',
      type: FilterOperationType.Eq,
      value: selectedStatus.value
    },
    filter = selectedStatus.value === 'none' ? [] : [filterQuery]
  emits('filter-status', filter)
}

const handleDeleteUser = (id: string, event: Event) => {
  event.stopPropagation()
  emits('delete-user', id)
}

onMounted(() => {
  listStatus.value = Object.values(Status).map((s) => ({ value: s, label: USERSTATUSMAP[s] }))

  console.log('listStatus', listStatus.value)
  console.log('selectedStatus', selectedStatus.value)
})

defineComponent({ name: 'UserTable' })
</script>
<template>
  <div class="grid w-full grid-flow-row-dense gap-5">
    <div class="w-1/5 justify-self-end">
      <AppListBox
        v-if="listStatus"
        :list="listStatus"
        @select-value="handleFilter"
        :list-lable="'Trạng thái'"
      />
    </div>

    <div class="relative min-h-96 w-full overflow-x-auto">
      <table class="w-full text-left text-gray-500 rtl:text-right" v-if="props.users.length > 0">
        <thead class="bg-gray-50 uppercase text-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3">STT</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3 text-center">Trạng thái</th>
            <th scope="col" class="px-6 py-3 text-center">Quyền admin</th>
            <th scope="col" class="px-6 py-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="cursor-pointer border-b bg-white hover:bg-cyan-100"
            v-for="(user, index) in props.users"
            :key="user.id"
            @click="emits('select-user', user.id)"
          >
            <th scope="row" class="whitespace-nowrap px-6 py-4 font-medium">
              {{ offset + index + 1 }}
            </th>
            <td class="px-6 py-4">
              {{ user.email }}
            </td>
            <td :class="['px-6 py-4 text-center font-semibold', getColor(user.status)]">
              {{ USERSTATUSMAP[user.status] }}
            </td>
            <td class="px-6 py-4 text-center">
              <font-awesome-icon
                :icon="['fas', 'check']"
                style="color: #58b70b"
                v-if="user.isSubAdmin"
              />
              <p v-else>-</p>
            </td>
            <td class="grid grid-flow-col-dense justify-items-center px-6 py-4">
              <button @click="handleDeleteUser(user.id, $event)">
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
