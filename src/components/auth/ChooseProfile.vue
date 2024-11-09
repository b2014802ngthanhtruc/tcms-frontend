<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import bgLogin from '@/assets/images/bg-login.svg'
import logo from '@/assets/images/Logo 1.svg'
import AppButton from '../shared/AppButton.vue'
import { ButtonStatus, ButtonType } from '@/enums'
import type { ChooseProfileResponse } from '@/types'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const emits = defineEmits([
  'choose-student-profile',
  'choose-tutor-profile',
  'student-create-profile'
])

const props = defineProps<{ user: ChooseProfileResponse }>()

const userProfile = ref<ChooseProfileResponse>(props.user)

const handleChooseStudentProfile = (id: string) => {
  console.log('Choose student profile')
  emits('choose-student-profile', id)
}

const handleChooseTutorProfile = (id: string) => {
  console.log('Choose tutor profile')
  emits('choose-tutor-profile', id)
}

const handleStudentCreateProfile = () => {
  emits('student-create-profile')
}
defineComponent({ name: 'ChooseProfile' })
</script>
<template>
  <div
    :style="{
      backgroundImage: `url(${bgLogin})`
    }"
    class="flex h-[700px] w-[500px] items-center justify-center rounded-sm bg-cover bg-center bg-no-repeat p-[35px]"
  >
    <div class="flex h-[600px] w-[400px] flex-col items-center rounded-[4px] bg-[#D9D9D9]/50">
      <div class="mt-[19px] flex justify-center">
        <img :src="logo" alt="Logo" class="w-[200px]" />
      </div>
      <div class="mt-[10px] text-center text-[40px] font-semibold">Chọn hồ sơ của bạn</div>
      <form
        action=""
        method="post"
        class="mt-[60px] flex w-[347px] flex-col items-center justify-center"
      >
        <div class="w-full">
          <label for="student" class="block text-[20px]">Học sinh</label>
          <Listbox
            @update:model-value="handleChooseStudentProfile"
            v-if="userProfile.students.length > 0"
          >
            <div class="relative mt-1">
              <ListboxButton
                class="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
              >
                <span class="block truncate capitalize">{{ 'Select a student' }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>

              <transition
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions
                  class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                >
                  <ListboxOption
                    v-slot="{ active, selected }"
                    v-for="profile in userProfile.students"
                    :key="profile.id"
                    :value="profile.id"
                    as="template"
                  >
                    <li
                      :class="[
                        active ? 'bg-teal-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-10 pr-4 capitalize'
                      ]"
                    >
                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                        profile.fullName
                      }}</span>
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 left-0 flex items-center pl-3"
                        :class="{ 'text-white': active, 'text-teal-600': !active }"
                      >
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
          <div
            v-else
            class="my-4 flex flex-auto justify-center rounded-lg border border-gray-300 bg-gray-200 p-3"
          >
            <button
              :value="userProfile.tutor.id"
              @click="handleStudentCreateProfile"
              type="button"
              class="mt-1 w-full rounded-[10px] bg-white p-3 hover:bg-sky-200"
            >
              <p class="self-start">Không có hồ sơ học sinh nào. Tạo mới</p>
            </button>
          </div>
        </div>
        <div class="w-full pt-5">
          <label for="=tutor" class="block text-[20px]">Gia sư</label>
          <button
            :value="userProfile.tutor.id"
            @click="handleChooseTutorProfile(userProfile.tutor.id)"
            type="button"
            class="mt-1 w-full rounded-[10px] bg-white p-3 hover:bg-sky-200"
          >
            <p class="self-start">{{ userProfile.tutor.fullName }}</p>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped></style>
