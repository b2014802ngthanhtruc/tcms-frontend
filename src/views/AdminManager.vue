<script setup lang="ts">
import AppBarChart from '@/components/shared/AppBarChart.vue'
import AppDoughnutChart from '@/components/shared/AppDoughnutChart.vue'
import AdminDashboardService from '@/services/dashboard/admin-dashboard.service'
import type {
  ClassDashboardType,
  SubjectDashboardType,
  UserDashboardType
} from '@/types/dashboard.type'
import { computed, onMounted, ref } from 'vue'

const adminDashboardService = new AdminDashboardService()
const userDashboard = ref<UserDashboardType>()
const classDashboard = ref<ClassDashboardType>()
const subjectDashboard = ref<SubjectDashboardType[]>()

const dataChartClass = computed(() => {
  if (!classDashboard.value) return undefined
  const { totalClassrooms, ...rest } = classDashboard.value
  console.log(rest)
  return {
    labels: [
      'Lớp mới',
      'Đang chờ duyệt',
      'Đã bắt đầu',
      'Đang tạm ngưng',
      'Bị hủy',
      'Đã hoàn thành'
    ],
    datasets: [
      {
        label: 'Số lượng lớp',
        data: [
          rest.totalClassOfNew,
          rest.totalClassOfPending,
          rest.totalClassOfStarted,
          rest.totalClassOfPaused,
          rest.totalClassOfCanceled,
          rest.totalClassOfFinished
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384AA', '#36A2EBAA', '#FFCE56AA', '#4BC0C0AA', '#9966FFAA']
      }
    ]
  }
})

const dataChartSubject = computed(() => {
  if (!subjectDashboard.value) return undefined
  return {
    labels: subjectDashboard.value.map((item) => item.name),
    datasets: [
      {
        label: 'Số lượng lớp',
        data: subjectDashboard.value.map((item) => item.totalClasses),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384AA', '#36A2EBAA', '#FFCE56AA', '#4BC0C0AA', '#9966FFAA']
      }
    ]
  }
})

onMounted(async () => {
  await Promise.all([
    (userDashboard.value = await adminDashboardService.getUserDashboard()),
    (classDashboard.value = await adminDashboardService.getClassDashboard()),
    (subjectDashboard.value = await adminDashboardService.getSubjectDashboard())
  ])
  console.log('userDashboard', userDashboard.value)
  console.log('classDashboard', classDashboard.value)
  console.log('subjectDashboard', subjectDashboard.value)
})
</script>
<template>
  <div
    class="container mx-auto my-3 justify-center justify-items-center space-y-5 rounded-md bg-slate-50 p-3"
  >
    <div class="flex flex-auto justify-center">
      <h1 class="mb-4 text-4xl font-bold">Tổng quan</h1>
    </div>
    <div
      class="my-4 grid w-full grid-cols-3 justify-items-center gap-3 rounded-lg border border-gray-300 bg-green-100 p-4 text-lg"
      v-if="userDashboard"
    >
      <h2><span class="font-bold">Tổng số gia sư: </span>{{ userDashboard.totalTutors }}</h2>
      <h2><span class="font-bold">Tổng số học sinh: </span>{{ userDashboard.totalStudents }}</h2>
      <h2>
        <span class="font-bold">Tổng số quản trị viên: </span>{{ userDashboard.totalSubAdmin }}
      </h2>
    </div>
    <div class="mt-5 grid w-full grid-flow-row-dense justify-items-center">
      <AppDoughnutChart
        :data="dataChartClass"
        v-if="dataChartClass && classDashboard"
        :title="`Tổng số lớp học (${classDashboard.totalClassrooms} lớp)`"
      />
    </div>
    <div class="mt-5 grid w-full grid-flow-row-dense justify-items-center">
      <AppBarChart
        :data="dataChartSubject"
        v-if="dataChartSubject && subjectDashboard"
        :title="`Tổng số lớp học theo môn học (${subjectDashboard.length} môn học)`"
      />
    </div>
  </div>
</template>
