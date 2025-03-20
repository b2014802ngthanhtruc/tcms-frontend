<script setup lang="ts">
import type { Student } from '@/types/student.type'
import { defineComponent } from 'vue'

const props = defineProps<{
  students: Student[]
}>()

const emit = defineEmits(['select-student'])

defineComponent({ name: 'ClassStudentsManager' })
</script>
<template>
  <div class="relative min-h-96 overflow-x-auto">
    <table class="w-full text-left text-gray-500 rtl:text-right">
      <thead class="bg-gray-50 uppercase text-gray-700">
        <tr>
          <th scope="col" class="px-6 py-3">STT</th>
          <th scope="col" class="px-6 py-3">Họ và tên</th>
          <th scope="col" class="px-6 py-3">Số điện thoại</th>
          <th scope="col" class="px-6 py-3">Ngày sinh</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="cursor-pointer border-b bg-white hover:bg-cyan-100"
          v-for="(student, index) in props.students"
          :key="student.id"
          @click="emit('select-student', student.id)"
        >
          <th scope="row" class="whitespace-nowrap px-6 py-4 font-medium">
            {{ index + 1 }}
          </th>
          <td class="px-6 py-4">
            {{ student.fullName }}
          </td>
          <td class="px-6 py-4">
            {{ student.phone }}
          </td>
          <td class="px-6 py-4">
            {{ new Date(student.dob).toLocaleDateString('en-GB') }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
