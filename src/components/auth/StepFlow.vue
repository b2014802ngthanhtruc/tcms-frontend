<script setup lang="ts">
import { computed, defineComponent } from 'vue'

const props = withDefaults(
  defineProps<{
    step: number
  }>(),
  {
    step: 1
  }
)
const currentStep = computed(() => props.step)
const emit = defineEmits(['returnHome'])

const handleReturnHome = () => {
  emit('returnHome')
}

defineComponent({ name: 'StepFlow' })
</script>

<template>
  <div class="grid h-full grid-flow-row justify-center space-y-6 bg-white">
    <div class="absolute ml-3 mt-3" @click="handleReturnHome">
      <font-awesome-icon :icon="['fas', 'house']" size="xl" />
    </div>

    <!-- Logo -->
    <div class="h-1/5">
      <img src="@/assets/images/Logo 1.svg" alt="Daybreak Logo" class="object-cover" />
    </div>

    <!-- Vertical Stepper -->
    <div class="w-full max-w-xs">
      <ul class="space-y-12">
        <!-- Step 1: Register new account -->
        <li class="flex items-center space-x-6">
          <div class="relative">
            <span
              class="block h-6 w-6 rounded-full"
              :class="{
                'bg-green-500': currentStep > 1, // Nếu currentStep > 1, tô màu xanh lá
                'bg-blue-500': currentStep === 1, // Nếu là currentStep hiện tại, tô màu xanh dương
                'bg-gray-300': currentStep < 1 // Nếu là bước chưa tới, tô màu xám
              }"
            ></span>
            <div
              class="absolute -top-12 left-1/2 h-24 w-0.5"
              :class="{
                'bg-green-500': currentStep > 1, // Thanh nối phía trên màu xanh lá nếu bước hiện tại lớn hơn currentStep này
                'bg-gray-300': currentStep < 1, // Thanh màu xám nếu chưa đạt tới currentStep
                'bg-blue-500': currentStep === 1
              }"
            ></div>
          </div>
          <span
            :class="{
              'text-green-500': currentStep > 1, // Text màu xanh lá
              'text-blue-500': currentStep === 1, // Text màu xanh dương
              'text-gray-400': currentStep < 1 // Text màu xám
            }"
            class="text-xl font-semibold"
          >
            Đăng ký tài khoản mới
          </span>
        </li>

        <!-- Step 2: Verify account -->
        <li class="flex items-center space-x-6">
          <div class="relative">
            <span
              class="block h-6 w-6 rounded-full"
              :class="{
                'bg-green-500': currentStep > 2,
                'bg-blue-500': currentStep === 2,
                'bg-gray-300': currentStep < 2
              }"
            ></span>
            <div
              class="absolute -top-12 left-1/2 h-24 w-0.5"
              :class="{
                'bg-green-500': currentStep > 2,
                'bg-gray-300': currentStep < 2,
                'bg-blue-500': currentStep === 2
              }"
            ></div>
          </div>
          <span
            :class="{
              'text-green-500': currentStep > 2,
              'text-blue-500': currentStep === 2,
              'text-gray-400': currentStep < 2
            }"
            class="text-lg"
          >
            Xác thực tài khoản
          </span>
        </li>

        <!-- Step 3: Choose role -->
        <li class="flex items-center space-x-6">
          <div class="relative">
            <span
              class="block h-6 w-6 rounded-full"
              :class="{
                'bg-green-500': currentStep > 3,
                'bg-blue-500': currentStep === 3,
                'bg-gray-300': currentStep < 3
              }"
            ></span>
            <div
              class="absolute -top-12 left-1/2 h-24 w-0.5"
              :class="{
                'bg-green-500': currentStep > 3,
                'bg-gray-300': currentStep < 3,
                'bg-blue-500': currentStep === 3
              }"
            ></div>
          </div>
          <span
            :class="{
              'text-green-500': currentStep > 3,
              'text-blue-500': currentStep === 3,
              'text-gray-400': currentStep < 3
            }"
            class="text-lg"
          >
            Chọn vai trò
          </span>
        </li>

        <!-- Step 4: Complete profile -->
        <li class="flex items-center space-x-6">
          <div class="relative">
            <span
              class="block h-6 w-6 rounded-full"
              :class="{
                'bg-green-500': currentStep > 4,
                'bg-blue-500': currentStep === 4,
                'bg-gray-300': currentStep < 4
              }"
            ></span>
            <div
              class="absolute -top-12 left-1/2 h-24 w-0.5"
              :class="{
                'bg-green-500': currentStep > 4,
                'bg-gray-300': currentStep < 4,
                'bg-blue-500': currentStep === 4
              }"
            ></div>
          </div>
          <span
            :class="{
              'text-green-500': currentStep > 4,
              'text-blue-500': currentStep === 4,
              'text-gray-400': currentStep < 4
            }"
            class="text-lg"
          >
            Hoàn thành đăng ký
          </span>
        </li>

        <!-- Step 5: Welcome -->
        <li class="flex items-center space-x-6">
          <div class="relative">
            <span
              class="block h-6 w-6 rounded-full"
              :class="{
                'bg-green-500': currentStep > 5,
                'bg-blue-500': currentStep === 5,
                'bg-gray-300': currentStep < 5
              }"
            ></span>
            <div
              class="absolute -top-12 left-1/2 h-12 w-0.5"
              :class="{
                'bg-green-500': currentStep > 5,
                'bg-gray-300': currentStep < 5,
                'bg-blue-500': currentStep === 5
              }"
            ></div>
          </div>
          <span
            :class="{
              'text-green-500': currentStep > 5,
              'text-blue-500': currentStep === 5,
              'text-gray-400': currentStep < 5
            }"
            class="text-lg"
          >
            Chào mừng đến với Trung tâm gia sư Day Break
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Căn chỉnh lại khoảng cách giữa các thành phần */

.text-xl {
  font-size: 1.25rem; /* Điều chỉnh font chữ */
}
.text-lg {
  font-size: 1.125rem; /* Điều chỉnh font chữ cho các step còn lại */
}
</style>
