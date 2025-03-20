<script setup lang="ts">
import type { ClassNotification } from '@/types'
import { defineComponent, ref, watch } from 'vue'

const props = defineProps<{ notification: ClassNotification; enableEdit: boolean }>()
const emits = defineEmits(['update-noti', 'delete-noti'])
const deleteNotification = (notificationId: string, event: Event) => {
  event.stopPropagation() // Prevent click event from bubbling to the parent div
  emits('delete-noti', notificationId)
}

defineComponent({ name: 'ClassNotificationCard' })
</script>
<template>
  <div
    class="flex w-full cursor-pointer flex-col gap-3 divide-y-2 rounded-md border border-gray-500"
    @click="emits('update-noti', notification.id)"
  >
    <div class="group flex flex-auto justify-between p-3">
      <p class="font-bold">{{ notification.title }}</p>
      <div class="flex flex-row gap-2">
        <p class="italic text-gray-400">
          {{
            notification.updatedAt
              ? new Date(notification.updatedAt).toLocaleDateString('en-GB')
              : new Date(notification.createdAt).toLocaleDateString('en-GB')
          }}
        </p>
        <button
          @click="deleteNotification(notification.id, $event)"
          class="hidden group-hover:block"
          v-if="enableEdit"
        >
          <font-awesome-icon :icon="['fas', 'trash']" style="color: #ea362a" />
        </button>
      </div>
    </div>
    <div class="flex text-wrap p-3">
      <p>{{ notification.content }}</p>
    </div>
  </div>
</template>
