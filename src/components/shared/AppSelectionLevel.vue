<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import type { Selections } from './AppListSelection.vue'

export type ListSelectionLevel = Selections & {
  level2?: ListSelectionLv2[]
}

type ListSelectionLv2 = Selections & {
  level3?: Selections[]
}

const listValues = defineProps<{ list: ListSelectionLevel[] }>()
const localListValues = computed(() => listValues.list)
const emit = defineEmits(['deleteLv1', 'deleteLv2', 'deleteLv3'])

const handleDeleteLv1 = (id: string) => {
  emit('deleteLv1', id)
}

const handleDeleteLv2 = (lv1Id: string, id: string) => {
  emit('deleteLv2', lv1Id, id)
}

const handleDeleteLv3 = (lv1Id: string, lv2Id: string, id: string) => {
  emit('deleteLv3', lv1Id, lv2Id, id)
}

defineComponent({ name: 'AppSelectionLevel' })
</script>
<template>
  <ul
    role="list"
    class="max h-[342px] w-full space-y-2 self-start overflow-hidden overscroll-none rounded-lg bg-white shadow shadow-gray-400 first:rounded-t-lg last:rounded-b-lg hover:overflow-y-auto"
  >
    <li
      v-if="localListValues.length > 0"
      v-for="item in localListValues"
      :key="item.id"
      :value="item.id"
      class="grid w-full grid-flow-row-dense gap-1 bg-white p-2 capitalize shadow-gray-400 drop-shadow-sm first:rounded-t-lg last:rounded-b-lg"
    >
      <div class="grid w-full grid-flow-col justify-between px-1">
        <p class="">{{ item.name }}</p>
        <button
          type="button"
          class="group my-auto flex flex-auto gap-1 rounded-xl px-2 py-1 hover:bg-gray-100"
          @click="handleDeleteLv1(item.id)"
        >
          <p class="invisible text-sm group-hover:visible">Xóa</p>
          <font-awesome-icon :icon="['fas', 'circle-xmark']" style="color: #f20707" />
        </button>
      </div>

      <ul
        role="list"
        class="grid w-10/12 grid-flow-row-dense gap-1 justify-self-end rounded-md bg-sky-200 p-2 shadow-sky-500 drop-shadow-sm"
        v-for="itemLv2 in item.level2"
        :key="itemLv2.id"
      >
        <div class="group grid w-full grid-flow-col justify-between px-1">
          <p class="">{{ itemLv2.name }}</p>
          <button
            type="button"
            class="invisible my-auto flex flex-auto gap-1 rounded-xl px-2 py-1 group-hover:visible"
            @click="handleDeleteLv2(item.id, itemLv2.id)"
          >
            <font-awesome-icon :icon="['fas', 'circle-xmark']" style="color: #f20707" />
          </button>
        </div>
        <li
          v-for="itemLv3 in itemLv2.level3"
          :key="itemLv3.id"
          :value="itemLv3.id"
          class="group grid w-10/12 grid-flow-col justify-between justify-self-end rounded-lg bg-green-200 p-1 shadow-green-500 drop-shadow-sm"
          @click="handleDeleteLv3(item.id, itemLv2.id, itemLv3.id)"
        >
          <p class="">{{ itemLv3.name }}</p>
          <button
            type="button"
            class="invisible my-auto flex flex-auto gap-1 rounded-xl px-2 py-1 group-hover:visible"
          >
            <font-awesome-icon :icon="['fas', 'circle-xmark']" style="color: #f20707" />
          </button>
        </li>
      </ul>
    </li>
    <li
      v-else
      class="group grid w-full grid-flow-row-dense justify-center bg-white p-2 capitalize first:rounded-t-lg last:rounded-b-lg"
    >
      <p class="text-sm text-gray-500">Không có lựa chọn nào.</p>
    </li>
  </ul>
</template>
