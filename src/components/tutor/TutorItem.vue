<script lang="ts" setup>
import { defineComponent } from 'vue'

defineComponent({
  name: 'TutorItem'
})
</script>

<template>
  <div class="flex items-start justify-between p-2">
    <div class="mt-4 h-[134px] w-[134px]">
      <img
        class="ml-2 h-full w-full rounded-full object-cover"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu6xby7qd-uASpe-SDXLXXZE-OIaczBXQPmA&s"
        alt=""
      />
    </div>
    <div class="mt-2">
      <p class="ml-20">Full name</p>
      <div class="justify-arround flex gap-7">
        <p>Gender: male</p>
        <p>Date of birth: 01/01/2000</p>
      </div>
      <div class="justify-arround mt-2 flex gap-6">
        <p>Degree:</p>
        <p>University:</p>
      </div>
      <div class="justify-arround mt-2 flex gap-6">
        <p>Major: dasdasdas</p>
        <p>Expect salary:</p>
      </div>
    </div>
  </div>
</template>
