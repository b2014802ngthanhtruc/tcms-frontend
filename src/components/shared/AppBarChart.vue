<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions
} from 'chart.js'

// Đăng ký các thành phần Chart.js cần thiết
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Định nghĩa các props để nhận dữ liệu từ component cha
const props = defineProps<{ data: { labels: string[]; datasets: any[] }; title: string }>()

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
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
  }
}))

defineComponent({ name: 'AppBarChart' })
</script>

<template>
  <div class="h-full w-full">
    <!-- Hiển thị biểu đồ cột -->
    <Bar :data="data" :options="chartOptions" />
  </div>
</template>
