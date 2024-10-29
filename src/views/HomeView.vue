<script setup lang="ts">
import ClassCard from '@/components/classroom/ClassCard.vue'
import TutorAvatar from '@/components/tutor/TutorAvatar.vue'
import { ClassStatus, PaymentFrequency, ScopeClass, TeachingMode } from '@/enums'
import GeneralClassroomService from '@/services/classroom/general-classroom.service'
import type { ClassRoom, QueryParams } from '@/types'
import { getQueryParams } from '@/utils/query-param.util'
import { computed, onMounted, ref } from 'vue'

// Định nghĩa props và thiết lập giá trị mặc định
const props = withDefaults(
  defineProps<{
    classrooms?: ClassRoom[]
    tutors?: string[]
  }>(),
  {
    tutors: () => [
      'src/assets/images/tutor1.png',
      'src/assets/images/tutor2.png',
      'src/assets/images/tutor3.png',
      'src/assets/images/tutor4.png',
      'src/assets/images/tutor5.png'
    ]
  }
)

// Khai báo các biến state
const classrooms = ref<ClassRoom[]>([])
const query = ref<QueryParams>({})
const generalClassroomService = new GeneralClassroomService()
const errorMessage = ref<string | null>(null)

// Gọi API lấy danh sách classrooms khi mounted
onMounted(async () => {
  try {
    query.value = {
      limit: 10,
      offset: 0
    }
    const queryString = getQueryParams(query.value)
    const result = await generalClassroomService.findMany(queryString)
    classrooms.value = result.results
  } catch (error) {
    errorMessage.value = 'Failed to load classrooms.'
  }
})

// State để theo dõi chỉ số hiện tại của classrooms
const currentIndex = ref(0)

// Computed property để lấy ra các classrooms hiển thị theo chỉ số hiện tại
const displayedClassrooms = computed(() => {
  return classrooms.value.slice(currentIndex.value, currentIndex.value + 3)
})

// Phương thức để chuyển đến classrooms tiếp theo
const next = () => {
  if (currentIndex.value + 3 < classrooms.value.length) {
    currentIndex.value += 3
  }
}

// Phương thức để chuyển đến classrooms trước đó
const prev = () => {
  if (currentIndex.value - 3 >= 0) {
    currentIndex.value -= 3
  }
}
</script>

<template>
  <main class="container mx-auto my-4 h-fit justify-items-center overflow-hidden bg-white p-3">
    <div
      class="w-full flex-auto space-y-4 rounded-lg bg-white p-6 align-middle text-5xl font-bold drop-shadow-lg"
    >
      <div class="grid grid-flow-row justify-items-center p-3">
        <p>Welcome to Day Break Tutor Center.</p>
      </div>
      <div class="grid grid-flow-row justify-items-center p-3">
        <p>Where knowledge meets opportunity.</p>
      </div>
    </div>

    <div class="mx-8 my-20 grid grid-flow-col-dense justify-between gap-4 p-2">
      <div class="grid grid-flow-row content-around text-2xl">
        <p class="text-justify indent-16">
          We provide personalized tutoring services to help students improve their academic
          performance.
        </p>
        <p class="text-justify indent-16">
          Our goal is to create a nurturing environment where students can grow and achieve their
          educational objectives.
        </p>
      </div>
      <img
        src="@/assets/images/image 2.svg"
        alt=""
        class="rounded-sm object-contain shadow-md shadow-gray-400"
      />
    </div>

    <div class="mt-3 grid grid-flow-row-dense justify-center">
      <div class="flex rounded-lg border border-black p-6 text-2xl font-bold">
        <p class="text-justify">
          The center offers experienced tutors who specialize in various subjects, ensuring quality
          guidance and support.
        </p>
      </div>

      <div class="grid grid-cols-5 gap-6 border-b-2 border-black p-6">
        <TutorAvatar v-for="tutor in props.tutors" :url="tutor" />
      </div>
      <div class="mt-4 flex flex-auto justify-center text-4xl font-medium">
        <h3>New Classrooms</h3>
      </div>
      <div class="mt-4 grid grid-flow-col-dense justify-between">
        <button @click="prev" :disabled="currentIndex === 0" class="previous-button">
          <img src="@/assets/images/previous-button.svg" alt="" />
        </button>

        <div class="col-span-10 grid grid-cols-3 gap-3 py-4" v-if="classrooms.length > 0">
          <ClassCard v-for="(classroom, index) in displayedClassrooms" :classroom="classroom" />
        </div>

        <button @click="next" :disabled="currentIndex + 3 >= classrooms.length" class="next-button">
          <img src="@/assets/images/next-button.svg" alt="" />
        </button>
      </div>
    </div>
  </main>
</template>
<style scoped>
.next-button {
  @apply right-5;
}

.previous-button {
  @apply left-5;
}
</style>
