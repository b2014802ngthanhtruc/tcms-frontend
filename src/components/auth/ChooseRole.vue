<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import { ButtonStatus, ButtonType } from '@/enums'
import AppButton from '../shared/AppButton.vue'
// Variables
const role = ref('student')
const emit = defineEmits(['choose-role'])
// Methods
function handleChooseRole() {
  emit('choose-role', role.value)
}
defineComponent({ name: 'ChooseRole' })
</script>
<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center gap-8 bg-white shadow-md shadow-gray-400"
  >
    <h1 class="mb-6 text-center text-4xl font-bold">Chọn vai trò</h1>
    <p class="mb-8 text-center text-lg text-gray-500">Vui lòng chọn vai trò</p>
    <div class="w-full max-w-md space-y-10">
      <!-- Radio Button for Student -->
      <label
        class="flex cursor-pointer items-center justify-between rounded-lg border bg-blue-50 p-4"
        :class="{ 'border-blue-500': role === 'student' }"
      >
        <font-awesome-icon :icon="['fas', 'graduation-cap']" size="2xl" style="color: #080a0c" />
        <span class="text-lg font-semibold text-gray-700">Học sinh</span>
        <input
          type="radio"
          value="student"
          v-model="role"
          class="form-radio h-5 w-5 text-blue-500"
        />
      </label>
      <!-- Radio Button for Tutor -->
      <label
        class="flex cursor-pointer items-center justify-between rounded-lg border bg-blue-50 p-4"
        :class="{ 'border-blue-500': role === 'tutor' }"
      >
        <font-awesome-icon :icon="['fas', 'chalkboard-user']" size="2xl" style="color: #000000" />
        <span class="text-xl font-semibold text-gray-700">Gia sư</span>
        <input type="radio" value="tutor" v-model="role" class="form-radio h-5 w-5 text-blue-500" />
      </label>
    </div>
    <!-- Next Button -->
    <div class="w-6/12">
      <AppButton
        :status="ButtonStatus.SUCCESS"
        :type="ButtonType.FULL_FILL"
        :content="'Next'"
        v-on:click="handleChooseRole"
      />
    </div>
  </div>
</template>
<style scoped>
.selection-label {
  @apply flex flex-auto justify-between gap-2 text-3xl;
}
</style>
