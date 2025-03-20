<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  type ChartOptions
} from 'chart.js'

// Đăng ký các thành phần của Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

// Props cho component
const props = defineProps<{ data: { labels: string[]; datasets: any[] }; title: string }>()

// Xử lý dữ liệu để loại bỏ `totalClasses` và tạo mảng dữ liệu cho biểu đồ
const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  plugins: {
    title: {
      display: true, // Hiển thị tiêu đề
      text: props.title, // Nội dung tiêu đề
      font: {
        size: 24, // Kích thước chữ
        family: 'Arial', // Font chữ
        weight: 'bold' // Độ đậm của chữ
      },
      color: '#333', // Màu chữ
      padding: {
        top: 10,
        bottom: 20
      }
    },
    legend: {
      position: 'right', // Cụ thể là 'right'
      align: 'center', // Cụ thể là 'center'
      labels: {
        font: {
          size: 20
        },
        boxWidth: 20,
        padding: 10
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
}))

defineComponent({ name: 'AppDoughnutChart' })
</script>

<template>
  <div div class="h-full w-full">
    <Doughnut :data="data" :options="chartOptions" />
  </div>
</template>
