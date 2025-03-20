<script setup lang="ts">
import type { Subject } from '@/types'
import { defineComponent } from 'vue'

const emit = defineEmits(['select-subject', 'delete-subject'])
const props = defineProps<{
  subjects: Subject[],
  offset: number
}>()

defineComponent({ name: 'SubjectTable' })
</script>
<template>
  <div class="relative min-h-96 overflow-x-auto">
    <table class="w-full text-left text-gray-500 rtl:text-right">
      <thead class="bg-gray-50 uppercase text-gray-700">
        <tr>
          <th scope="col" class="px-6 py-3">STT</th>
          <th scope="col" class="px-6 py-3">Tên môn học</th>
          <th scope="col" class="px-6 py-3">Mô tả</th>
          <th scope="col" class="px-6 py-3"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="border-b bg-white hover:bg-cyan-100"
          v-for="(subject, index) in subjects"
          :key="subject.id"
        >
          <th scope="row" class="whitespace-nowrap px-6 py-4 font-medium">
            {{ props.offset + index + 1 }}
          </th>
          <td class="px-6 py-4">
            {{ subject.name }}
          </td>
          <td class="px-6 py-4">
            {{ subject.description ?? 'Không có mô tả' }}
          </td>
          <td class="grid grid-cols-2 gap-2 px-6 py-4">
            <button @click="emit('select-subject', subject.id)">
              <font-awesome-icon :icon="['fas', 'pen']" style="color: #ffd43b" />
            </button>
            <button @click="emit('delete-subject', subject.id)">
              <font-awesome-icon :icon="['fas', 'trash']" style="color: #e70d0d" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
