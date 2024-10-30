<script lang="ts" setup>
import AppFilterTab from '@/components/shared/AppFilterTab.vue'
import AppPaginationBar from '@/components/shared/AppPaginationBar.vue'
import AppSearchBar from '@/components/shared/AppSearchBar.vue'
import AppSortBar from '@/components/shared/AppSortBar.vue'
import TutorItem from '@/components/tutor/TutorItem.vue'
import { defineComponent } from 'vue'

const sortFields = [
  {
    field: 'className',
    mask: 'A-Z'
  },
  {
    field: 'createdAt',
    mask: 'newest'
  },
  {
    field: 'tuitionFee',
    mask: 'tuition'
  }
]

defineComponent({ name: 'TutorView' })
</script>

<template>
  <div class="mt-2 grid grid-cols-12 gap-2 px-10 py-8">
    <div class="col-span-3">
      <AppFilterTab
        class="w-4/5"
        :filterFields="{
          oneColumn: [
            {
              field: 'City',
              label: 'City',
              items: []
            }
          ],
          twoColumn: [
            {
              field: 'class',
              label: 'Class',
              items: [
                { value: 'online', mask: 'class1' },
                { value: 'offline', mask: 'class2' },
                { value: 'offline', mask: 'class3' },
                { value: 'offline', mask: 'class4' }
              ]
            }
          ],
          threeColumn: []
        }"
      />
    </div>
    <div class="col-span-9">
      <div class="ml-[200px] flex items-center justify-between">
        <AppSearchBar class="h-[60px] w-1/2" />
        <AppSortBar :keys="sortFields" />
      </div>
      <div class="mt-8 grid grid-cols-2 gap-4">
        <div class="w-11/12" v-for="number in 10" :key="number">
          <TutorItem class="h-[173px] rounded-md bg-[#CEFBF6]" />
        </div>
      </div>
      <div class="mt-5">
        <AppPaginationBar
          :pagination="{
            next: '1',
            previous: '2',
            count: 3,
            limit: 4
          }"
          :currentPage="1"
          :totalPage="2"
        />
      </div>
    </div>
  </div>
</template>
