<script setup lang="ts">
import DocumentFormModal from '@/components/classroom/DocumentFormModal.vue'
import DocumentItem from '@/components/classroom/DocumentItem.vue'
import AppButton from '@/components/shared/AppButton.vue'
import { ButtonStatus, ButtonType } from '@/enums'
import TutorClassroomService from '@/services/classroom/tutor-classroom.service'
import type { AddClassDocument, ClassDocument } from '@/types'
import { getFileNameAndExtensionFromName, groupByKey } from '@/utils'
import type { AxiosError } from 'axios'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import AppConfirmPopup from '../shared/AppConfirmPopup.vue'

const props = defineProps<{ documents: ClassDocument[]; enableEdit: boolean }>()
const documents = ref<ClassDocument[]>([])
const groupDocuments = ref<Record<string, any[]>>({})
const isOpenModal = ref(false)
const isOpenConfirm = ref(false)
const convertData = computed(() => {
  return documents.value.map((item) => {
    return {
      ...item,
      createdAt: new Date(item.createdAt).toLocaleDateString('en-GB')
    }
  })
})
const deletedDocument = ref('')
const emits = defineEmits(['add-document', 'delete-document'])

const handleDeleteDocument = async () => {
  emits('delete-document', deletedDocument.value)
  isOpenConfirm.value = false
}

const handleRequiredConfirmDeleteDocument = (id: string) => {
  deletedDocument.value = id
  isOpenConfirm.value = true
}

const handleAddDocument = async (data: AddClassDocument) => {
  emits('add-document', data)
  isOpenModal.value = false
}

onMounted(async () => {
  documents.value = props.documents
  const group = groupByKey(convertData.value, 'createdAt')
  groupDocuments.value = group
  console.log('group', group)
})

watch(
  () => props.documents,
  () => {
    documents.value = props.documents
    const group = groupByKey(convertData.value, 'createdAt')
    groupDocuments.value = group
  }
)

defineComponent({ name: 'ClassDetailManagerDocument' })
</script>
<template>
  <div class="container mx-auto my-4 p-3">
    <DocumentFormModal @confirm="handleAddDocument" v-model="isOpenModal" />
    <AppConfirmPopup
      v-model="isOpenConfirm"
      @confirm="handleDeleteDocument"
      :title="'Bạn có chắc chắn muốn xóa tài liệu này'"
    />
    <div class="grid grid-flow-col-dense justify-end" v-if="enableEdit">
      <AppButton
        :status="ButtonStatus.PRIMARY"
        :content="'Thêm tài liệu +'"
        :type="ButtonType.OUTLINE"
        @click="isOpenModal = true"
      />
    </div>
    <div
      v-for="(group, key) in groupDocuments"
      :key="key"
      v-if="documents.length > 0"
      class="grid grid-flow-row-dense gap-3 divide-y-2"
    >
      <h1 class="my-4 text-xl font-bold text-black">
        {{ key }}
      </h1>
      <div class="grid grid-cols-10 gap-4 p-2">
        <div v-for="document in group" :key="document.id">
          <DocumentItem
            :id="document.id"
            :file-extension="getFileNameAndExtensionFromName(document.name).extension"
            :file-name="getFileNameAndExtensionFromName(document.name).fileName"
            :file-url="document.docUrl"
            @delete="handleRequiredConfirmDeleteDocument"
            :enable-edit="enableEdit"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <h1 class="mt-4 text-center text-2xl font-bold text-gray-500">Không có tài liệu</h1>
    </div>
  </div>
</template>
