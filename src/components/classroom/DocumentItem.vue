<script setup lang="ts">
import { GET_IMG_API } from '@/constants/eviroment.constant'
import { FILEICONMAP } from '@/constants/file.constant'
import { computed, defineComponent, onMounted } from 'vue'
import docImg from '@/assets/images/doc.png'
import pdfImg from '@/assets/images/pdf.png'
import pptImg from '@/assets/images/ppt.png'
import xlsxImg from '@/assets/images/xls.png'
import { FileExtension } from '@/enums'

const props = defineProps<{
  id: string
  fileName: string
  fileUrl: string
  fileExtension: string
  enableEdit: boolean
}>()
const emits = defineEmits(['delete'])

const handleDelete = () => {
  emits('delete', props.id)
}

const fileIcon = computed(() => {
  switch (props.fileExtension) {
    case FileExtension.DOC:
    case FileExtension.DOCX:
      return docImg
    case FileExtension.PDF:
      return pdfImg
    case FileExtension.PPT:
    case FileExtension.PPTX:
      return pptImg
    case FileExtension.XLSX:
    case FileExtension.XLS:
      return xlsxImg
  }
})

onMounted(() => {
  console.log('icon: ', FILEICONMAP[props.fileExtension])
})

defineComponent({ name: 'DocumentItem' })
</script>
<template>
  <div
    class="group relative max-h-96 w-full max-w-96 rounded-lg p-2 hover:border hover:border-gray-500 hover:shadow-md"
  >
    <button
      @click="handleDelete"
      class="invisible absolute right-1 top-1 flex group-hover:visible"
      v-if="enableEdit"
    >
      <font-awesome-icon :icon="['fas', 'circle-xmark']" style="color: #df2020" />
    </button>
    <a :href="`${GET_IMG_API}/${props.fileUrl}`" class="flex w-full flex-col">
      <img class="h-full w-full object-cover" :src="fileIcon" />
      <p class="w-full truncate">{{ fileName }}</p>
    </a>
    <p
      class="absolute left-0 top-full z-10 mt-1 hidden w-full text-wrap rounded-md bg-white p-1 shadow-lg group-hover:block"
    >
      {{ fileName }}
    </p>
  </div>
</template>
