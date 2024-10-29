<script setup lang="ts">
import { defineComponent } from 'vue'

const props = defineProps<{ url: string }>()

defineComponent({ name: 'TutorAvatar' })
</script>
<template>
  <img :src="props.url" class="h-full w-full rounded-full object-cover" />
</template>
