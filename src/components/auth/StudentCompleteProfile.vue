<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { ButtonStatus, ButtonType, ClassLevel, Gender, Grade } from '@/enums'
import AppButton from '../shared/AppButton.vue'
import * as yup from 'yup'
import type { CityResponse, District, StudentCompleteRegisterRequest, Ward } from '@/types'
import { getUserIdFromLS, toNormalize } from '@/utils'
import AddressService from '@/services/address/address.service'
import { isValidPhoneNumber } from 'libphonenumber-js'

import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { CLASSLEVELMAP, GRADEMAP } from '@/constants/class.constant'
import { GENDERMAP } from '@/constants/gender.constant'

const addressService = new AddressService()
const props = defineProps<{
  title: string
}>()

const grades = ref(Object.values(Grade))

const classLevels = ref(Object.values(ClassLevel))
const queryClassLevel = ref<string>('')
const filteredClassLevel = computed(() => {
  return queryClassLevel.value === ''
    ? classLevels.value
    : classLevels.value.filter((level) =>
        level
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(queryClassLevel.value.toLowerCase().replace(/\s+/g, ''))
      )
})
const cities = ref<CityResponse[]>([])
const selectedCityId = ref<string>('')
const selectedCity = computed<CityResponse>(
  () => cities.value.find((c) => c.id === selectedCityId.value)!
)
const queryCityName = ref<string>('')
const filteredCity = computed<CityResponse[]>(() => {
  const result =
    queryCityName.value === ''
      ? cities.value
      : cities.value.filter((city) =>
          city.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(queryCityName.value.toLowerCase().replace(/\s+/g, ''))
        )
  return result
})
const districts = computed<District[]>(() => {
  const items: District[] = []
  const city = cities.value.find((c) => c.id === selectedCityId.value)
  if (city) {
    items.push(...city.districts)
  }
  return items
})

const selectedDistrictId = ref<string>('')
const selectedDistrict = computed<District>(
  () => districts.value.find((c) => c.id === selectedDistrictId.value)!
)
const queryDistrictName = ref<string>('')
const filteredDistrict = computed<District[]>(() => {
  const result =
    queryDistrictName.value === ''
      ? districts.value
      : districts.value.filter((city) =>
          city.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(queryDistrictName.value.toLowerCase().replace(/\s+/g, ''))
        )
  return result
})
const wards = computed<Ward[]>(() => {
  const items: Ward[] = []
  const district = districts.value.find((d) => d.id === selectedDistrictId.value)
  if (district) {
    items.push(...district.wards)
  }
  return items
})
const queryWardName = ref<string>('')
const filteredWard = computed<Ward[]>(() => {
  const result =
    queryWardName.value === ''
      ? wards.value
      : wards.value.filter((city) =>
          city.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(queryWardName.value.toLowerCase().replace(/\s+/g, ''))
        )
  return result
})
const selectedWardId = ref<string>('')
const selectedWard = computed<Ward>(() => wards.value.find((c) => c.id === selectedWardId.value)!)
const emit = defineEmits(['completeStudentProfile'])

const StudentRegisterSchema = yup.object({
  firstName: yup
    .string()
    .required('Yêu cầu tên')
    .test('is-valid-name', 'Tên không hợp lệ', (value) => RegExp(/^[\p{L} \s]+$/u).test(value)),
  lastName: yup
    .string()
    .required('Yêu cầu họ')
    .test('is-valid-name', 'Tên không hợp lệ', (value) => RegExp(/^[\p{L} \s]+$/u).test(value)),
  phone: yup
    .string()
    .required('Yêu cầu số điện thoại')
    .test('is-valid-phone', 'Số điện thoại không hợp lệ', (value) => {
      return isValidPhoneNumber(value as string)
    }),
  gender: yup.string().required('Yêu cầu giới tính'),
  dob: yup
    .date()
    .required('Yêu cầu ngày sinh')
    .transform((value) => new Date(value)),
  parentName: yup
    .string()
    .transform((value) => {
      if (value === '') {
        return undefined
      }
      return value
    })
    .test('is-valid-name', 'Tên không hợp lệ', (value) =>
      value ? RegExp(/^[\p{L} \s]+$/u).test(value) : true
    )
    .optional(),
  class: yup.string().required('Yêu cầu lớp'),
  address: yup.object({
    address: yup.string().required('Yêu cầu địa chỉ'),
    city: yup.string().required('Yêu cầu thành phố'),
    district: yup.string().required('Yêu cầu quận/huyện'),
    ward: yup.string().required('Yêu cầu phường/xã')
  })
})

const handleStudentCompleteProfile = (value: any) => {
  console.log(value)
  const studentRegisterData = value as StudentCompleteRegisterRequest
  const userId = getUserIdFromLS()
  const city = cities.value.find((c) => c.id === selectedCityId.value)
  const district = districts.value.find((d) => d.id === selectedDistrictId.value)
  const ward = wards.value.find((w) => w.id === selectedWardId.value)

  if (city && district && ward) {
    studentRegisterData.address.city = city.name
    studentRegisterData.address.district = district.name
    studentRegisterData.address.ward = ward.name
  }
  studentRegisterData.grade = GRADEMAP[studentRegisterData.class]
  studentRegisterData.userId = userId
  emit('completeStudentProfile', studentRegisterData)
}

const handleSelectCity = (cityId: string) => {
  selectedCityId.value = cityId
}

const handleSelectDistrict = (districtId: string) => {
  selectedDistrictId.value = districtId
}

onMounted(async () => {
  cities.value = await addressService.listCities()
})

defineComponent({ name: 'StudentCompleteProfile' })
</script>
<template>
  <Form
    :validation-schema="StudentRegisterSchema"
    class="grid max-h-full w-full grid-flow-row-dense content-around justify-center justify-self-center overflow-y-scroll px-28 py-6 shadow-lg shadow-gray-400"
    @submit="handleStudentCompleteProfile"
  >
    <div class="form-header">
      <h1>{{ title }}</h1>
    </div>
    <!-- Personal information -->
    <div class="form-body">
      <div class="grid grid-cols-2 gap-5">
        <!-- Firstname -->
        <div class="form-field">
          <label for="firstName" class="form-label">Tên</label>
          <Field name="firstName" v-slot="{ field, meta }" :validate-on-input="true">
            <input
              v-bind="field"
              type="text"
              :class="[
                'form-input',
                meta.valid && meta.touched
                  ? 'border-green-500 focus:caret-inherit'
                  : 'border-gray-300',
                !meta.valid && meta.touched ? 'border-red-500' : ''
              ]"
              placeholder="Tên"
            />
          </Field>
          <ErrorMessage name="firstName" class="text-sm text-red-500" />
        </div>
        <!-- Lastname -->
        <div class="form-field">
          <label for="lastName" class="form-label">Họ</label>
          <Field name="lastName" v-slot="{ field, meta }" :validate-on-input="true">
            <input
              v-bind="field"
              type="text"
              :class="[
                'form-input',
                meta.valid && meta.touched
                  ? 'border-green-500 focus:caret-inherit'
                  : 'border-gray-300',
                !meta.valid && meta.touched ? 'border-red-500' : ''
              ]"
              placeholder="Họ"
            />
          </Field>
          <ErrorMessage name="lastName" class="text-sm text-red-500" />
        </div>
        <!-- Phone -->
        <div class="form-field">
          <label for="phone" class="form-label">Số điện thoại</label>
          <Field name="phone" v-slot="{ field, meta }" :validate-on-input="true">
            <vue-tel-input v-bind="field"></vue-tel-input>
          </Field>
          <ErrorMessage name="phone" class="text-sm text-red-500" />
        </div>
        <!-- Date of birth -->
        <div class="form-field">
          <label for="" class="form-label">Ngày sinh</label>
          <Field name="dob" v-slot="{ field, meta }" :validate-on-input="true">
            <input
              v-bind="field"
              type="date"
              :class="[
                'form-input',
                meta.valid && meta.touched
                  ? 'border-green-500 focus:caret-inherit'
                  : 'border-gray-300',
                !meta.valid && meta.touched ? 'border-red-500' : ''
              ]"
              placeholder="Ngày sinh"
            />
          </Field>
          <ErrorMessage name="dob" class="text-sm text-red-500" />
        </div>
        <!-- Parent name -->
        <div class="form-field">
          <label for="parentName" class="form-label">Họ tên phụ huynh</label>
          <Field name="parentName" v-slot="{ field, meta }" :validate-on-input="true">
            <input
              v-bind="field"
              type="text"
              :class="[
                'form-input',
                meta.valid && meta.touched
                  ? 'border-green-500 focus:caret-inherit'
                  : 'border-gray-300',
                !meta.valid && meta.touched ? 'border-red-500' : ''
              ]"
              placeholder="Họ tên phụ huynh"
            />
          </Field>
          <ErrorMessage name="parentName" class="text-sm text-red-500" />
        </div>
        <!-- Gender -->
        <div class="form-field">
          <label for="gender" class="form-label"> Giới tính </label>
          <Field name="gender" v-slot="{ field, meta }" :validate-on-input="true">
            <Listbox v-bind="field">
              <div class="relative mt-1">
                <ListboxButton
                  class="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                >
                  <span class="block truncate capitalize">{{
                    field.value ?? 'Chọn giới tính'
                  }}</span>
                  <span
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                  >
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
                      :key="Gender.MALE"
                      :value="Gender.MALE"
                      as="template"
                    >
                      <li
                        :class="[
                          active ? 'bg-teal-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-10 pr-4 capitalize'
                        ]"
                      >
                        <span
                          :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']"
                          >{{ GENDERMAP[Gender.MALE] }}</span
                        >
                        <span
                          v-if="selected"
                          class="absolute inset-y-0 left-0 flex items-center pl-3"
                          :class="{ 'text-white': active, 'text-teal-600': !active }"
                        >
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ListboxOption>
                    <ListboxOption
                      v-slot="{ active, selected }"
                      :key="Gender.FEMALE"
                      :value="Gender.FEMALE"
                      as="template"
                    >
                      <li
                        :class="[
                          active ? 'bg-teal-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-10 pr-4 capitalize'
                        ]"
                      >
                        <span
                          :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']"
                          >{{ GENDERMAP[Gender.FEMALE] }}</span
                        >
                        <span
                          v-if="selected"
                          class="absolute inset-y-0 left-0 flex items-center pl-3"
                          :class="{ 'text-white': active, 'text-teal-600': !active }"
                        >
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ListboxOption>
                    <ListboxOption
                      v-slot="{ active, selected }"
                      :key="Gender.OTHER"
                      :value="Gender.OTHER"
                      as="template"
                    >
                      <li
                        :class="[
                          active ? 'bg-teal-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-10 pr-4 capitalize'
                        ]"
                      >
                        <span
                          :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']"
                          >{{ GENDERMAP[Gender.OTHER] }}</span
                        >
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
          </Field>
          <!-- Display error message for gender -->
          <ErrorMessage name="gender" class="mt-2 text-sm text-red-500" />
        </div>
        <!-- Class -->
        <div class="form-field">
          <label for="" class="form-label">Lớp</label>
          <Field
            name="class"
            v-slot="{ field, meta }"
            :validate-on-input="true"
            :validate-on-blur="true"
            :validate-on-change="true"
          >
            <Combobox v-bind="field">
              <div class="relative mt-1">
                <div
                  class="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                >
                  <ComboboxInput
                    class="w-full border-none py-2 pl-3 pr-10 text-sm capitalize leading-5 text-gray-900 focus:ring-0"
                    :display-value="
                      (classLevel) => toNormalize(CLASSLEVELMAP[field.value]) ?? 'Chọn một lớp'
                    "
                    @change="queryClassLevel = $event.target.value"
                  />
                  <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </ComboboxButton>
                </div>
                <TransitionRoot
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  @after-leave="queryClassLevel = ''"
                >
                  <ComboboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                  >
                    <div
                      v-if="filteredClassLevel.length === 0 && queryClassLevel !== ''"
                      class="relative cursor-default select-none px-4 py-2 text-gray-700"
                    >
                      Không tìm thấy
                    </div>

                    <ComboboxOption
                      v-for="classLevel in filteredClassLevel"
                      as="template"
                      :key="classLevel"
                      :value="classLevel"
                      v-slot="{ selected, active }"
                    >
                      <li
                        class="relative cursor-default select-none py-2 pl-10 pr-4"
                        :class="{
                          'bg-teal-600 text-white': active,
                          'text-gray-900': !active
                        }"
                      >
                        <span
                          class="block truncate capitalize"
                          :class="{ 'font-medium': selected, 'font-normal': !selected }"
                        >
                          {{ toNormalize(CLASSLEVELMAP[classLevel]) }}
                        </span>
                        <span
                          v-if="selected"
                          class="absolute inset-y-0 left-0 flex items-center pl-3"
                          :class="{ 'text-white': active, 'text-teal-600': !active }"
                        >
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ComboboxOption>
                  </ComboboxOptions>
                </TransitionRoot>
              </div>
            </Combobox>
          </Field>
          <ErrorMessage name="class" class="text-sm text-red-500" />
        </div>
      </div>
      <div class="grid grid-cols-1">
        <!-- Address (Street) -->
        <div class="form-field">
          <label for="" class="form-label">Địa chỉ</label>
          <Field name="address.address" v-slot="{ field, meta }" :validate-on-input="true">
            <input
              v-bind="field"
              type="text"
              :class="[
                'form-input',
                meta.valid && meta.touched
                  ? 'border-green-500 focus:caret-inherit'
                  : 'border-gray-300',
                !meta.valid && meta.touched ? 'border-red-500' : ''
              ]"
              placeholder="Địa chỉ"
            />
          </Field>
          <ErrorMessage name="address.address" class="text-sm text-red-500" />
        </div>
      </div>
      <div class="grid grid-cols-3 gap-5">
        <!-- City -->
        <div class="form-field">
          <label class="form-label">Tỉnh/Thành phố</label>
          <Field
            name="address.city"
            v-slot="{ field, meta }"
            :validate-on-input="true"
            :validate-on-blur="true"
            :validate-on-change="true"
          >
            <Combobox v-model="selectedCityId" v-bind="field">
              <div class="relative mt-1">
                <div
                  class="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                >
                  <ComboboxInput
                    class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    :display-value="(selectedCityId) => selectedCity?.name || 'Chọn tỉnh/thành phố'"
                    @change="queryCityName = $event.target.value"
                  />
                  <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </ComboboxButton>
                </div>
                <TransitionRoot
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  @after-leave="queryCityName = ''"
                >
                  <ComboboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                  >
                    <div
                      v-if="filteredCity.length === 0 && queryCityName !== ''"
                      class="relative cursor-default select-none px-4 py-2 text-gray-700"
                    >
                      Không tìm thấy
                    </div>

                    <ComboboxOption
                      v-for="city in filteredCity"
                      as="template"
                      :key="city.id"
                      :value="city.id"
                      v-slot="{ selected, active }"
                    >
                      <li
                        class="relative cursor-default select-none py-2 pl-10 pr-4"
                        :class="{
                          'bg-teal-600 text-white': active,
                          'text-gray-900': !active
                        }"
                      >
                        <span
                          class="block truncate"
                          :class="{ 'font-medium': selected, 'font-normal': !selected }"
                        >
                          {{ city.name }}
                        </span>
                        <span
                          v-if="selected"
                          class="absolute inset-y-0 left-0 flex items-center pl-3"
                          :class="{ 'text-white': active, 'text-teal-600': !active }"
                        >
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ComboboxOption>
                  </ComboboxOptions>
                </TransitionRoot>
              </div>
            </Combobox>
          </Field>
          <ErrorMessage name="address.city" class="text-sm text-red-500" />
        </div>
        <!-- District -->
        <div class="form-field">
          <label for="" class="form-label">Quận/Huyện</label>
          <Field
            name="address.district"
            v-slot="{ field, meta }"
            :validate-on-input="true"
            :validate-on-change="true"
            :validate-on-blur="true"
          >
            <Combobox v-model="selectedDistrictId" v-bind="field" v-if="selectedCityId">
              <div class="relative mt-1">
                <div
                  class="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                >
                  <ComboboxInput
                    class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    :display-value="(se) => selectedDistrict?.name || 'Chọn quận/huyện'"
                    @change="queryDistrictName = $event.target.value"
                  />
                  <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </ComboboxButton>
                </div>
                <TransitionRoot
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  @after-leave="queryDistrictName = ''"
                >
                  <ComboboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                  >
                    <div
                      v-if="filteredDistrict.length === 0 && queryDistrictName !== ''"
                      class="relative cursor-default select-none px-4 py-2 text-gray-700"
                    >
                      Không tìm thấy
                    </div>

                    <ComboboxOption
                      v-for="city in filteredDistrict"
                      as="template"
                      :key="city.id"
                      :value="city.id"
                      v-slot="{ selected, active }"
                    >
                      <li
                        class="relative cursor-default select-none py-2 pl-10 pr-4"
                        :class="{
                          'bg-teal-600 text-white': active,
                          'text-gray-900': !active
                        }"
                      >
                        <span
                          class="block truncate"
                          :class="{ 'font-medium': selected, 'font-normal': !selected }"
                        >
                          {{ city.name }}
                        </span>
                        <span
                          v-if="selected"
                          class="absolute inset-y-0 left-0 flex items-center pl-3"
                          :class="{ 'text-white': active, 'text-teal-600': !active }"
                        >
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ComboboxOption>
                  </ComboboxOptions>
                </TransitionRoot>
              </div>
            </Combobox>
            <p v-else>Vui lòng chọn Tỉnh/Thành phố trước</p>
          </Field>
          <ErrorMessage name="address.district" class="text-sm text-red-500" />
        </div>
        <!-- Ward -->
        <div class="form-field">
          <label for="" class="form-label">Xã/Phường</label>
          <Field
            name="address.ward"
            v-slot="{ field, meta }"
            :validate-on-input="true"
            :validate-on-change="true"
            :validate-on-blur="true"
          >
            <Combobox v-bind="field" v-model="selectedWardId" v-if="selectedDistrictId">
              <div class="relative mt-1">
                <div
                  class="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                >
                  <ComboboxInput
                    class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    :display-value="(w) => selectedWard?.name || 'Chọn xã/phường'"
                    @change="queryWardName = $event.target.value"
                  />
                  <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </ComboboxButton>
                </div>
                <TransitionRoot
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  @after-leave="queryWardName = ''"
                >
                  <ComboboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                  >
                    <div
                      v-if="filteredWard.length === 0 && queryWardName !== ''"
                      class="relative cursor-default select-none px-4 py-2 text-gray-700"
                    >
                      Không tìm thấy
                    </div>

                    <ComboboxOption
                      v-for="ward in filteredWard"
                      as="template"
                      :key="ward.id"
                      :value="ward.id"
                      v-slot="{ selected, active }"
                    >
                      <li
                        class="relative cursor-default select-none py-2 pl-10 pr-4"
                        :class="{
                          'bg-teal-600 text-white': active,
                          'text-gray-900': !active
                        }"
                      >
                        <span
                          class="block truncate"
                          :class="{ 'font-medium': selected, 'font-normal': !selected }"
                        >
                          {{ ward.name }}
                        </span>
                        <span
                          v-if="selected"
                          class="absolute inset-y-0 left-0 flex items-center pl-3"
                          :class="{ 'text-white': active, 'text-teal-600': !active }"
                        >
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ComboboxOption>
                  </ComboboxOptions>
                </TransitionRoot>
              </div>
            </Combobox>
            <p v-else>Vui lòng chọn Quận/Huyện trước</p>
          </Field>
          <ErrorMessage name="address.ward" class="text-sm text-red-500" />
        </div>
      </div>
      <div class="form-footer">
        <div class="flex w-8/12 flex-auto justify-center justify-self-center">
          <AppButton
            :status="ButtonStatus.SUCCESS"
            :type="ButtonType.FULL_FILL"
            :content="'Tiếp tục'"
          />
        </div>
      </div>
    </div>
  </Form>
</template>
