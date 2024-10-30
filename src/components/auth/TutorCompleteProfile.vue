<script setup lang="ts">
import * as yup from 'yup'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useForm, Field, Form, ErrorMessage } from 'vee-validate'
import { yupResolver } from '@hookform/resolvers/yup'

import {
  ButtonStatus,
  ButtonType,
  ClassLevel,
  ClassSession,
  DayOfWeek,
  Gender,
  Grade
} from '@/enums'
import AppButton from '../shared/AppButton.vue'
import type {
  CityResponse,
  District,
  RegisterRequest,
  Subject,
  TutorCompleteRegisterRequest,
  Ward
} from '@/types'
import AppListSelection, { type Selections } from '../shared/AppListSelection.vue'
import AppSelectionLevel, { type ListSelectionLevel } from '../shared/AppSelectionLevel.vue'
import AddressService from '@/services/address/address.service'
import SubjectService from '@/services/subject/subject.service'
import { getFileNameAndExtension, getUserIdFromLS } from '@/utils'
import UploadService from '@/services/upload/upload.service'
import AuthTutorService from '@/services/auth/auth-tutor.service'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { GRADEMAP } from '@/constants/class.constanst'
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
// Variables
const emits = defineEmits(['tutorCompleteProfile'])
const addressService = new AddressService()
const subjectService = new SubjectService()
const uploadService = new UploadService()
const authTutorService = new AuthTutorService()

const errors = ref<Record<string, any>>({})
const selectedFile = ref<File | null>(null)
const fileKey = ref<string>('')

const TutorProfileSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup
    .string()
    .required('Phone is required')
    .test((value) => {
      console.log(value)
      return isValidPhoneNumber(value as string)
    }),
  gender: yup.string().required('Gender is required'),
  dob: yup
    .date()
    .required('Date of birth is required')
    .transform((value) => new Date(value)),
  identificationId: yup.string().required('ID document number is required'),
  expectSalary: yup.number().required('Expected salary is required'),
  descritopion: yup.string().optional().nullable(),
  address: yup.object({
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    district: yup.string().required('District is required'),
    ward: yup.string().required('Ward is required')
  }),
  educationalQualification: yup.object({
    degree: yup.string().required('Degree is required'),
    major: yup.string().required('Major is required'),
    university: yup.string().required('University is required'),
    startYear: yup
      .date()
      .required('Start year is required')
      .transform((value) => new Date(value)),
    endYear: yup
      .date()
      .required('End year is required')
      .transform((value) => new Date(value)),
    certificateUrl: yup
      .mixed()
      .required('Certificate image is required')
      .test('fileType', 'File must be an image (jpeg, jpg, png)', (value) => {
        return (
          (value as File) && ['image/jpeg', 'image/png', 'image/jpg'].includes((value as File).type)
        )
      })
      .test('fileSize', 'File size is too large. Maximum size is 2MB', (value) => {
        console.log((value as File).size)
        return (value as File) && (value as File).size <= 2097152 // Giới hạn file 2MB
      })
  }),
  areaExpect: yup.array(
    yup.object({
      city: yup.string().required('City is required'),
      district: yup.string().required('District is required')
    })
  ),
  timeExpect: yup.array(
    yup.object({
      dow: yup.string().required('Day of week is required'),
      time: yup.string().required('Time is required')
    })
  ),
  jobReference: yup.array(
    yup.object({
      class: yup.string().required('Class is required'),
      subjects: yup.array(yup.string()).required('Subjects is required')
    })
  )
})

// Address for personal
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

const selectedCities = ref<string[]>([])
const expectCity = ref<string>('')
const selectedDistricts = ref<string[]>([])
const expectDistricts = computed<District[]>(() => {
  const items: District[] = []
  const city = cities.value.find((c) => c.id === expectCity.value)
  if (city) {
    items.push(...city.districts)
  }
  return items
})
const listViewAddressSelections = ref<ListSelectionLevel[]>([])

const handleSelectExpectCity = (id: string) => {
  const exitstCity = selectedCities.value.find((c) => c === id)
  const city = cities.value.find((c) => c.id === id)
  if (!exitstCity) {
    selectedCities.value.push(id)
    if (!listViewAddressSelections.value.find((c) => c.id === id)) {
      listViewAddressSelections.value.push({
        id: id,
        name: city?.name || '',
        level2: []
      })
    }
  }
  expectCity.value = id
  console.log('expectCity', expectCity.value)
}

const handleRemoveExpectCity = (id: string) => {
  if (expectCity.value === id) {
    expectCity.value = ''
  }
  const removeCity = selectedCities.value.findIndex((c) => c === id)
  if (removeCity > -1) {
    selectedCities.value.splice(removeCity, 1)
  }
  const removeSelectionCity = listViewAddressSelections.value.findIndex((c) => c.id === id)
  if (removeSelectionCity > -1) {
    listViewAddressSelections.value.splice(removeSelectionCity, 1)
  }
}

const handleRemoveExpectDistrict = (cityId: string, id: string) => {
  const removeDistrict = selectedDistricts.value.findIndex((d) => d === id)
  if (removeDistrict > -1) {
    selectedDistricts.value.splice(removeDistrict, 1)
  }
  listViewAddressSelections.value.map((c) => {
    if (c.id === cityId && c.level2) {
      const removeSelectionDistrict = c.level2.findIndex((d) => d.id === id)
      if (removeSelectionDistrict > -1) {
        c.level2.splice(removeSelectionDistrict, 1)
      }
    }
  })
}

const handleSelectExpectDistrict = (id: string) => {
  const exitstDistrict = selectedDistricts.value.find((d) => d === id)
  const district = expectDistricts.value.find((d) => d.id === id)

  if (!exitstDistrict) {
    selectedDistricts.value.push(id)
    const city = listViewAddressSelections.value.find((c) => c.id === expectCity.value)
    if (city && city.level2 && !city.level2.find((d) => d.id === id)) {
      city.level2.push({
        id: id,
        name: district?.name || '',
        level3: []
      })
    }
  }
}

const handleSelectCity = (id: string) => {
  selectedCityId.value = id
  console.log('city', selectedCityId.value)
}

const handleSelectDistrict = (id: string) => {
  selectedDistrictId.value = id
  console.log('district', selectedDistrictId.value)
}

// Expect schedule
const daysOfWeek = ref(Object.values(DayOfWeek))
const selectedDaysOfWeek = ref<string[]>([])
const selectedDay = ref<string>('')
const sessions = ref(Object.values(ClassSession))
const selectedSessions = ref<string[]>([])
const selectedSchedules = ref<ListSelectionLevel[]>([])

const handleSelectDayOfWeek = (day: string) => {
  selectedDay.value = day
  if (!selectedDaysOfWeek.value.find((d) => d === day)) {
    selectedDaysOfWeek.value.push(day)
  }
  const existedDay = selectedSchedules.value.find((d) => d.id === day)
  if (!existedDay) {
    selectedSchedules.value.push({
      id: day,
      name: day,
      level2: []
    })
  }
}

const handleRemoveDayOfWeek = (day: string) => {
  if (selectedDay.value === day) {
    selectedDay.value = ''
  }
  const removeDay = selectedDaysOfWeek.value.findIndex((d) => d === day)
  if (removeDay > -1) {
    selectedDaysOfWeek.value.splice(removeDay, 1)
  }
  const removeSelectionDay = selectedSchedules.value.findIndex((d) => d.id === day)
  if (removeSelectionDay > -1) {
    selectedSchedules.value.splice(removeSelectionDay, 1)
  }
}

const handleSelectSession = (session: string) => {
  console.log('session', session)
  if (!selectedSessions.value.find((s) => s === session)) {
    selectedSessions.value.push(session)
  }
  const existedDay = selectedSchedules.value.find((d) => d.id === selectedDay.value)
  if (existedDay && existedDay.level2 && !existedDay.level2.find((s) => s.id === session)) {
    existedDay.level2.push({
      id: session,
      name: session
    })
  }
}

const handleRemoveSession = (dayId: string, session: string) => {
  const removeSession = selectedSessions.value.findIndex((s) => s === session)
  if (removeSession > -1) {
    selectedSessions.value.splice(removeSession, 1)
  }
  selectedSchedules.value.map((d) => {
    if (d.id === dayId && d.level2) {
      const removeSelectionSession = d.level2.findIndex((s) => s.id === session)
      if (removeSelectionSession > -1) {
        d.level2.splice(removeSelectionSession, 1)
      }
    }
  })
}

// Expect subject
const classLevels = ref(Object.values(ClassLevel))
const listViewSelectionSubjects = ref<ListSelectionLevel[]>([])
const selectedClassLevels = ref<string>('')
const subjects = ref<Subject[]>([])

const expectSubjects = computed<string[]>(() => {
  return listViewSelectionSubjects.value
    .flatMap((s) => s.level2 || []) // Duyệt qua tất cả level2
    .filter((l) => l.id === selectedClassLevels.value && l.level3) // Lọc level2 có id bằng level2Id và có level3
    .flatMap((l) => l.level3!.map((l3) => l3.id)) // Lấy id từ level3
})
const selectedSubjects = ref<string[]>(expectSubjects.value)

const handleSelectClassLevel = (level: string) => {
  selectedClassLevels.value = level

  // Nếu level không nằm trong gradeMap, trả về Grade.PRESCHOOL
  const grade = GRADEMAP[level] || Grade.PRESCHOOL

  const existedGrade = listViewSelectionSubjects.value.find((d) => d.id === grade)
  if (!existedGrade) {
    listViewSelectionSubjects.value.push({
      id: grade,
      name: grade,
      level2: [
        {
          id: level,
          name: level,
          level3: []
        }
      ]
    })
  }
  listViewSelectionSubjects.value.map((d) => {
    if (d.id === grade && d.level2) {
      const existedLevel = d.level2.find((l) => l.id === level)
      if (!existedLevel) {
        d.level2.push({
          id: level,
          name: level,
          level3: []
        })
      }
    }
  })
}

const handleSelectSubject = (id: string) => {
  if (!selectedSubjects.value.find((s) => s === id)) {
    selectedSubjects.value.push(id)
  }
  const subject = subjects.value.find((s) => s.id === id)

  console.log('expect subject', expectSubjects.value)

  listViewSelectionSubjects.value.map((d) => {
    if (d.level2) {
      d.level2.map((l) => {
        if (
          l.id === selectedClassLevels.value &&
          l.level3 &&
          !l.level3.find((s) => s.id === subject?.id)
        ) {
          l.level3.push({
            id: subject?.id || '',
            name: subject?.name || ''
          })
        }
        console.log('l', l.level3)
      })
    }
  })
}

const handleRemoveGrade = (id: string) => {
  const removeGrade = listViewSelectionSubjects.value.findIndex((s) => s.id === id)
  if (removeGrade > -1) {
    listViewSelectionSubjects.value.splice(removeGrade, 1)
  }
}

const handleRemoveClass = (gradeId: string, id: string) => {
  const grade = listViewSelectionSubjects.value.findIndex((s) => s.id === gradeId)
  if (grade && listViewSelectionSubjects.value[grade].level2) {
    const removeClass = listViewSelectionSubjects.value[grade].level2.findIndex((l) => l.id === id)
    if (removeClass > -1) {
      listViewSelectionSubjects.value[grade].level2.splice(removeClass, 1)
    }
  }
}

const handleRemoveSubject = (gradeId: string, classId: string, id: string) => {
  console.log('handleRemoveSubject', gradeId, classId, id)
  const grade = listViewSelectionSubjects.value.findIndex((s) => s.id === gradeId)
  console.log('grade', grade)
  if (listViewSelectionSubjects.value[grade].level2) {
    const classLevel = listViewSelectionSubjects.value[grade].level2.findIndex(
      (l) => l.id === classId
    )
    console.log('classLevel', listViewSelectionSubjects.value[grade].level2[classLevel].level3)
    if (listViewSelectionSubjects.value[grade].level2[classLevel].level3) {
      const removeSubject = listViewSelectionSubjects.value[grade].level2[
        classLevel
      ].level3.findIndex((s) => s.id === id)
      console.log('removeSubject', removeSubject)
      if (removeSubject > -1) {
        listViewSelectionSubjects.value[grade].level2[classLevel].level3.splice(removeSubject, 1)
      }
    }
  }
}

const handleFileChange = (event: Event) => {
  console.log('handleFileChange')
  const target = event.target as HTMLInputElement // Kiểu hóa đối tượng sự kiện
  if (target.files && target.files.length > 0) {
    const file = target.files[0] // Lấy file đầu tiên
    selectedFile.value = file // Lưu file vào biến selectedFile
  }
}
// Methods
const handleTutorCompleteProfile = async (values: any) => {
  const registerValues = values as TutorCompleteRegisterRequest
  console.log('Form Submitted: ', registerValues)

  registerValues.areaExpect = listViewAddressSelections.value.flatMap((item) => {
    return item.level2!.map((itemLv2) => {
      return {
        city: item.name,
        district: itemLv2.name
      }
    })
  })
  registerValues.timeExpect = selectedSchedules.value.flatMap((item) => {
    return item.level2!.map((itemLv2) => {
      return {
        dow: item.name,
        time: itemLv2.name
      }
    })
  })
  registerValues.jobReference = listViewSelectionSubjects.value.flatMap((item) => {
    return item.level2!.map((itemLv2) => {
      return {
        grade: item.name,
        class: itemLv2.name,
        description: '', // Thêm giá trị mô tả nếu cần
        subjects: itemLv2.level3!.map((itemLv3) => itemLv3.id) // Đổi tên thuộc tính từ `subject` thành `subjects`
      }
    })
  })
  registerValues.userId = getUserIdFromLS()

  try {
    console.log('registerValues', registerValues)
    await TutorProfileSchema.validate(registerValues, { abortEarly: false })

    console.log(
      'startYear',
      registerValues.educationalQualification.startYear,
      'endYear',
      registerValues.educationalQualification.endYear
    )
    const startYear = new Date(registerValues.educationalQualification.startYear)
    const endYear = new Date(registerValues.educationalQualification.endYear)
    registerValues.educationalQualification.startYear = startYear.getFullYear().toString()
    registerValues.educationalQualification.endYear = endYear.getFullYear().toString()

    registerValues.address.city = cities.value.find(
      (c) => c.id === registerValues.address.city
    )!.name
    registerValues.address.district = districts.value.find(
      (c) => c.id === registerValues.address.district
    )!.name
    registerValues.address.ward = wards.value.find(
      (c) => c.id === registerValues.address.ward
    )!.name
    errors.value = {}

    if (selectedFile.value) {
      const uploadFileRequest = getFileNameAndExtension(selectedFile.value)
      console.log('uploadFileRequest', uploadFileRequest)
      const presignedUrl = await uploadService.presignUrl(
        uploadFileRequest.fileName,
        uploadFileRequest.fileType
      )
      await uploadService.uploadFile(presignedUrl.url, selectedFile.value)
      selectedFile.value = null
      fileKey.value = presignedUrl.key
    }
    registerValues.educationalQualification.certificateUrl = fileKey.value

    emits('tutorCompleteProfile', registerValues)
  } catch (validationError: any) {
    console.log('validationError', validationError)
    const errorMessage: Record<string, string> = {}
    validationError.inner.forEach((err: { path: string; message: string }) => {
      errorMessage[err.path] = err.message
    })
    errors.value = errorMessage
    console.log('errors', errors.value)
  }
}

onMounted(async () => {
  cities.value = await addressService.listCities()
  const result = await subjectService.findAll()
  subjects.value = result.results
  console.log('subjects', subjects.value)
})
defineComponent({ name: 'TutorCompleteProfile' })
</script>
<template>
  <Form
    @submit="handleTutorCompleteProfile"
    :validation-schema="TutorProfileSchema"
    class="grid max-h-full w-full grid-flow-row-dense content-around justify-center justify-self-center overflow-y-scroll px-28 py-6 shadow-lg shadow-gray-400"
  >
    <div class="form-header">
      <h1>Complete Profile</h1>
    </div>
    <!-- Personal information -->
    <div class="mb-5 mt-10 flex flex-auto justify-start gap-5">
      <font-awesome-icon :icon="['fas', 'user']" size="2x" />
      <span class="text-lg"> Personal Information</span>
    </div>
    <div class="form-body">
      <div class="grid grid-cols-2 gap-5">
        <!-- Firstname -->
        <div class="form-field">
          <label for="" class="form-label">First Name</label>
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
              placeholder="First name"
            />
          </Field>
          <ErrorMessage name="firstName" class="text-sm text-red-500" />
        </div>
        <!-- Lastname -->
        <div class="form-field">
          <label for="" class="form-label">Last Name</label>
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
              placeholder="Last name"
            />
          </Field>
          <ErrorMessage name="lastName" class="text-sm text-red-500" />
        </div>
        <!-- Phone -->
        <div class="form-field">
          <label for="" class="form-label">Phone</label>
          <Field name="phone" v-slot="{ field, meta }" :validate-on-input="true">
            <vue-tel-input v-bind="field"></vue-tel-input>
          </Field>
          <ErrorMessage name="phone" class="text-sm text-red-500" />
        </div>
        <!-- Date of birth -->
        <div class="form-field">
          <label for="dob" class="form-label">Date of Birth</label>
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
              placeholder="Date of Birth"
            />
          </Field>
          <ErrorMessage name="dob" class="text-sm text-red-500" />
        </div>
        <!-- Gender -->
        <div class="form-field">
          <label for="gender" class="form-label"> Select Gender </label>
          <Field name="gender" v-slot="{ field, meta }" :validate-on-input="true">
            <Listbox v-bind="field">
              <div class="relative mt-1">
                <ListboxButton
                  class="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                >
                  <span class="block truncate capitalize">{{
                    field.value ?? 'Select a gender'
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
                          >{{ Gender.MALE }}</span
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
                          >{{ Gender.FEMALE }}</span
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
                          >{{ Gender.OTHER }}</span
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
        <!-- ID Document Number -->
        <div class="form-field">
          <label for="" class="form-label">ID Document Number</label>
          <Field name="identificationId" v-slot="{ field, meta }" :validate-on-input="true">
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
              placeholder="ID Document Number"
            />
          </Field>
          <ErrorMessage name="identificationId" class="text-sm text-red-500" />
        </div>
        <!-- Expected Salary -->
        <div class="form-field">
          <label for="" class="form-label">Expected Salary</label>
          <Field name="expectSalary" v-slot="{ field, meta }" :validate-on-input="true">
            <input
              v-bind="field"
              type="number"
              :class="[
                'form-input',
                meta.valid && meta.touched
                  ? 'border-green-500 focus:caret-inherit'
                  : 'border-gray-300',
                !meta.valid && meta.touched ? 'border-red-500' : ''
              ]"
              placeholder="Expected Salary"
            />
          </Field>
          <ErrorMessage name="expectSalary" class="text-sm text-red-500" />
        </div>
      </div>
      <div class="grid grid-cols-1">
        <!-- Address (Street) -->
        <div class="form-field">
          <label for="address.address" class="form-label">Address</label>
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
              placeholder="Address"
            />
          </Field>
          <ErrorMessage name="address.address" class="text-sm text-red-500" />
        </div>
      </div>
      <div class="grid grid-cols-3 gap-5">
        <!-- City -->
        <div class="form-field">
          <label class="form-label">City</label>
          <Field name="address.city" v-slot="{ field, meta }" :validate-on-input="true">
            <Combobox v-bind="field" v-model="selectedCityId">
              <div class="relative mt-1">
                <div
                  class="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                >
                  <ComboboxInput
                    class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    :display-value="(selectedCityId) => selectedCity?.name || 'Select a city'"
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
                      Nothing found.
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
          <label for="address.district" class="form-label">District</label>
          <Field name="address.district" v-slot="{ field, meta }" :validate-on-input="true">
            <Combobox v-bind="field" v-model="selectedDistrictId" v-if="selectedCityId">
              <div class="relative mt-1">
                <div
                  class="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                >
                  <ComboboxInput
                    class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    :display-value="(se) => selectedDistrict?.name || 'Select a district'"
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
                      Nothing found.
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
            <p v-else>Please select a city</p>
          </Field>
          <ErrorMessage name="address.district" class="text-sm text-red-500" />
        </div>
        <!-- Ward -->
        <div class="form-field">
          <label for="address.ward" class="form-label">Ward</label>
          <Field name="address.ward" v-slot="{ field, meta }" :validate-on-input="true">
            <Combobox v-bind="field" v-model="selectedWardId" v-if="selectedDistrictId">
              <div class="relative mt-1">
                <div
                  class="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                >
                  <ComboboxInput
                    class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    :display-value="(se) => selectedWard?.name || 'Select a ward'"
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
                      v-if="filteredDistrict.length === 0 && queryWardName !== ''"
                      class="relative cursor-default select-none px-4 py-2 text-gray-700"
                    >
                      Nothing found.
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
            <p v-else>Please select a district</p>
          </Field>
          <ErrorMessage name="address.ward" class="text-sm text-red-500" />
        </div>
      </div>
      <div class="grid grid-cols-1">
        <div class="form-field">
          <label for="description" class="form-label">Description</label>
          <Field name="description" v-slot="{ field, meta }" :validate-on-input="true">
            <textarea
              v-bind="field"
              type="text"
              :class="[
                'form-input',
                meta.valid && meta.touched
                  ? 'border-green-500 focus:caret-inherit'
                  : 'border-gray-300',
                !meta.valid && meta.touched ? 'border-red-500' : ''
              ]"
              placeholder="Description"
            ></textarea>
          </Field>
          <ErrorMessage name="description" class="text-sm text-red-500" />
        </div>
      </div>
      <!-- Educational Qualification -->
      <div class="mb-5 mt-10 flex flex-auto justify-start gap-5">
        <font-awesome-icon :icon="['fas', 'graduation-cap']" size="2xl" style="color: #000000" />
        <span class="text-lg"> Educational Qualification</span>
      </div>
      <div class="grid grid-cols-2 gap-5">
        <!-- Degree -->
        <div class="form-field">
          <label for="educationalQualification.degree" class="form-label">Degree</label>
          <Field
            name="educationalQualification.degree"
            v-slot="{ field, meta }"
            :validate-on-input="true"
          >
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
              placeholder="Degree"
            />
          </Field>
          <ErrorMessage name="educationalQualification.degree" class="text-sm text-red-500" />
        </div>
        <!-- Major -->
        <div class="form-field">
          <label for="educationalQualification.major" class="form-label">Major</label>
          <Field
            name="educationalQualification.major"
            v-slot="{ field, meta }"
            :validate-on-input="true"
          >
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
              placeholder="Major"
            />
          </Field>
          <ErrorMessage name="educationalQualification.major" class="text-sm text-red-500" />
        </div>
      </div>
      <div class="grid grid-cols-3 gap-5">
        <!-- University -->
        <div class="form-field">
          <label for="educationalQualification.university" class="form-label">University</label>
          <Field
            name="educationalQualification.university"
            v-slot="{ field, meta }"
            :validate-on-input="true"
          >
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
              placeholder="University"
            />
          </Field>
          <ErrorMessage name="educationalQualification.university" class="text-sm text-red-500" />
        </div>
        <!-- Start Date -->
        <div class="form-field">
          <label for="educationalQualification.startYear" class="form-label">Start Year</label>
          <Field
            name="educationalQualification.startYear"
            v-slot="{ field, meta }"
            :validate-on-input="true"
          >
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
              placeholder="Start Year"
            />
          </Field>
          <ErrorMessage name="educationalQualification.startYear" class="text-sm text-red-500" />
        </div>
        <!-- End Date -->
        <div class="form-field">
          <label for="educationalQualification.endYear" class="form-label">End Year</label>
          <Field
            name="educationalQualification.endYear"
            v-slot="{ field, meta }"
            :validate-on-input="true"
          >
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
              placeholder="End Year"
            />
          </Field>
          <ErrorMessage name="educationalQualification.endYear" class="text-sm text-red-500" />
        </div>
      </div>
      <div class="grid grid-cols-1">
        <!-- Certificate image -->
        <div class="form-field">
          <label for="educationalQualification.certificateUrl" class="form-label"
            >Certificate image</label
          >
          <Field
            name="educationalQualification.certificateUrl"
            v-slot="{ handleChange, handleBlur }"
            :validate-on-input="true"
            :validate-on-change="true"
          >
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              class="block w-7/12 text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-sky-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sky-700 hover:file:bg-sky-100"
              @change="
                (event) => {
                  handleChange(event)
                  handleFileChange(event)
                }
              "
              @blur="handleBlur"
            />
          </Field>
          <ErrorMessage
            name="educationalQualification.certificateUrl"
            class="text-sm text-red-500"
          />
        </div>
      </div>
      <!-- Area Expected-->
      <div class="mb-5 mt-10 flex flex-auto justify-start gap-5">
        <font-awesome-icon :icon="['fas', 'map-location-dot']" size="2xl" style="color: #0d0d0d" />
        <span class="text-lg"> Area</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="grid grid-flow-row-dense items-start gap-6">
          <!-- City -->
          <div class="grid grid-flow-row-dense items-start">
            <label for="areaExpect.city" class="form-label">City</label>
            <AppListSelection
              :list="cities"
              :selected="selectedCities"
              @select="handleSelectExpectCity"
            />
            <span v-if="errors.areaExpect && errors.areaExpect.city" class="text-sm text-red-500">{{
              errors.areaExpect[0].city
            }}</span>
          </div>
          <!-- District -->
          <div class="grid grid-flow-row-dense items-start">
            <label for="areaExpect.district" class="form-label">District</label>
            <AppListSelection
              v-if="expectDistricts.length > 0"
              :list="expectDistricts"
              :selected="selectedDistricts"
              @select="handleSelectExpectDistrict"
            />
            <p v-else>Please select city first</p>
            <span v-if="errors.areaExpect && errors.areaExpect[0].district">{{
              errors.areaExpect.district
            }}</span>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="grid grid-flow-row-dense">
            <label for="" class="form-label">Selections</label>
            <AppSelectionLevel
              :list="listViewAddressSelections"
              @delete-lv1="handleRemoveExpectCity"
              @delete-lv2="handleRemoveExpectDistrict"
            />
          </div>
        </div>
      </div>
      <!-- Expected Schedules -->
      <div class="mb-5 mt-10 flex flex-auto justify-start gap-5">
        <font-awesome-icon :icon="['fas', 'map-location-dot']" size="2xl" style="color: #0d0d0d" />
        <span class="text-lg"> Expected schedules</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="grid grid-flow-row-dense items-start gap-2">
          <!-- Day of week -->
          <div class="gird grid-flow-row-dense">
            <label for="timeExpect.dow" class="form-label">Day of week</label>
            <div class="grid grid-cols-2 gap-2">
              <li
                v-for="day in daysOfWeek"
                :key="day"
                :value="day"
                :class="[selectedDay === day ? 'active-expected-items' : 'expected-items']"
                @click="handleSelectDayOfWeek(day)"
              >
                <p>{{ day }}</p>
              </li>
            </div>
            <span v-if="errors.timeExpect && errors.timeExpect[0].dow">{{
              errors.timeExpect.dow
            }}</span>
          </div>
          <!-- Session -->
          <div class="grid grid-flow-row-dense">
            <label for="" class="form-label">Session</label>
            <div class="grid grid-cols-2 gap-2">
              <li
                v-for="session in sessions"
                :key="session"
                :value="session"
                class="expected-items"
                @click="handleSelectSession(session)"
              >
                <p>{{ session }}</p>
              </li>
            </div>
            <span v-if="errors.timeExpect && errors.timeExpect[0].session">{{
              errors.timeExpect.session
            }}</span>
          </div>
        </div>
        <div class="grid grid-flow-row-dense">
          <label for="" class="form-label">Selections</label>
          <AppSelectionLevel
            :list="selectedSchedules"
            @delete-lv1="handleRemoveDayOfWeek"
            @delete-lv2="handleRemoveSession"
          />
        </div>
      </div>
      <!-- Expected Subject -->
      <div class="mb-5 mt-10 flex flex-auto justify-start gap-5">
        <font-awesome-icon :icon="['fas', 'book']" size="2xl" style="color: #0d0d0d" />
        <span class="text-lg"> Expected Subject</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="grid grid-flow-row-dense gap-3">
          <div class="grid grid-flow-row-dense">
            <label for="" class="form-label">Class</label>
            <div class="grid grid-cols-2 gap-2">
              <li
                v-for="classLevel in classLevels"
                :key="classLevel"
                :value="classLevel"
                :class="[
                  selectedClassLevels === classLevel ? 'active-expected-items' : 'expected-items'
                ]"
                @click="handleSelectClassLevel(classLevel)"
              >
                <p>{{ classLevel }}</p>
              </li>
            </div>
            <span v-if="errors.jobReference && errors.jobReference[0].class">{{
              errors.jobReference.class
            }}</span>
          </div>
          <div class="grid grid-flow-row-dense">
            <label for="" class="form-label">Subject</label>
            <AppListSelection
              :list="subjects"
              :selected="expectSubjects"
              @select="handleSelectSubject"
            />
            <span v-if="errors.jobReference && errors.jobReference[0].subjects">{{
              errors.jobReference.subjects
            }}</span>
          </div>
        </div>
        <div class="grid grid-flow-row-dense self-start">
          <label for="" class="form-label">Selections</label>
          <AppSelectionLevel
            :list="listViewSelectionSubjects"
            @delete-lv1="handleRemoveGrade"
            @delete-lv2="handleRemoveClass"
            @delete-lv3="handleRemoveSubject"
          />
        </div>
      </div>
      <div class="form-footer">
        <div class="flex w-8/12 flex-auto justify-center justify-self-center">
          <AppButton
            :status="ButtonStatus.SUCCESS"
            :type="ButtonType.FULL_FILL"
            :content="'Next'"
          />
        </div>
      </div>
    </div>
  </Form>
</template>
<style>
.form-header {
  @apply flex flex-auto justify-center pt-4 text-4xl font-bold;
}
.form-body {
  @apply mt-5 flex flex-auto flex-col gap-3 py-4;
}
.form-label {
  @apply text-lg;
}
.form-field {
  @apply grid grid-rows-3;
}
.form-footer {
  @apply grid grid-flow-row-dense gap-5 py-6;
}
.form-input {
  @apply w-full rounded border;
}
.expected-items {
  @apply flex w-full flex-auto cursor-pointer justify-center rounded-lg border border-blue-500 bg-white capitalize hover:bg-sky-500 hover:text-white;
}
.active-expected-items {
  @apply flex w-full flex-auto cursor-pointer justify-center rounded-lg border border-blue-500 bg-sky-500 capitalize text-white;
}
</style>
