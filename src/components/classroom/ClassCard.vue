<script setup lang="ts">
import { ButtonStatus, ButtonType, PaymentFrequency, TeachingMode } from '@/enums'
import type { ClassRoom } from '@/types'
import { defineComponent } from 'vue'
import AppButton from '../shared/AppButton.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ classroom: ClassRoom }>()
const router = useRouter()
const emits = defineEmits(['get-detail'])

const handleGetDetail = (id: string) => {
  console.log(id)
  emits('get-detail', id)
}
defineComponent({ name: 'ClassCard' })
</script>
<template>
  <div class="card" :key="props.classroom.id">
    <div class="card-header group relative cursor-pointer">
      <h4 class="mx-auto truncate">
        {{ props.classroom.className }}
      </h4>
      <!-- Tooltip hiển thị đầy đủ nội dung khi hover -->
      <h4
        class="absolute left-0 top-full z-10 hidden w-full whitespace-pre-wrap bg-white p-2 text-sm text-gray-400 shadow-md group-hover:block"
      >
        {{ props.classroom.className }}
      </h4>
    </div>
    <dl class="card-body">
      <div class="card-body-items">
        <dt class="card-body-dt">Subject:</dt>
        <dd class="card-body-dd">{{ props.classroom.subject.name }}</dd>
      </div>

      <div class="card-body-items">
        <dt class="card-body-dt">Tuition:</dt>
        <dd
          class="card-body-dd capitalize"
          v-if="props.classroom.paymentFrequency !== PaymentFrequency.NEGOTIAL"
        >
          {{ props.classroom.tuitionFee }}$/{{ props.classroom.paymentFrequency }}
        </dd>
        <dd class="card-body-dd capitalize" v-else>{{ props.classroom.paymentFrequency }}</dd>
      </div>

      <div class="card-body-items">
        <dt class="card-body-dt">Requirement:</dt>
        <dd class="card-body-dd">{{ props.classroom.request }}</dd>
      </div>

      <div class="card-body-items">
        <dt class="card-body-dt">Teaching method:</dt>
        <dd class="card-body-dd capitalize">{{ props.classroom.teachingMode }}</dd>
      </div>

      <div class="card-body-items" v-if="props.classroom.teachingMode === TeachingMode.OFFLINE">
        <dt class="card-body-dt">Location:</dt>
        <dd class="card-body-dd">{{ props.classroom.location?.fullAddress }}</dd>
      </div>
    </dl>
    <div class="card-footer">
      <AppButton :status="ButtonStatus.SUCCESS" :type="ButtonType.FULL_FILL" :content="'Enroll'" />
      <AppButton
        :status="ButtonStatus.PRIMARY"
        :type="ButtonType.FULL_FILL"
        :content="'View details'"
        @click="handleGetDetail(props.classroom.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.card {
  @apply mx-auto flex w-full flex-shrink flex-col rounded-md shadow-md shadow-gray-400 @container;
}

.card-header {
  @apply flex rounded-b-lg bg-teal-200 p-4 text-lg font-medium shadow-gray-400 drop-shadow-md;
}

.card-body {
  @apply grid h-full list-inside list-none grid-rows-5 gap-2 p-3 @sm:gap-0;
}

.card-body-dt {
  @apply font-medium @sm:col-span-2;
}

.card-body-dd {
  @apply mx-2 pl-2 text-left @sm:col-span-3;
}

.card-body-items {
  @apply flex flex-auto justify-start text-xs @sm:grid @sm:grid-cols-5 @sm:text-base;
}

.card-footer {
  @apply grid grid-flow-row-dense justify-items-center gap-3 p-3;
}
</style>
