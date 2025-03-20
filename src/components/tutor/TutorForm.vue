<script setup lang="ts">
import * as yup from 'yup'
import { computed, defineComponent, onMounted, ref, watch, watchEffect } from 'vue'
import { useForm, Field, Form, ErrorMessage, validate } from 'vee-validate'
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
  QueryParams,
  RegisterRequest,
  Subject,
  TutorCompleteRegisterRequest,
  TutorUpdateProfileRequest,
  Ward
} from '@/types'
import AppListSelection, { type Selections } from '../shared/AppListSelection.vue'
import AppSelectionLevel, { type ListSelectionLevel } from '../shared/AppSelectionLevel.vue'
import AddressService from '@/services/address/address.service'
import SubjectService from '@/services/subject/subject.service'
import { getFileNameAndExtension, getQueryParams, getUserIdFromLS } from '@/utils'
import UploadService from '@/services/upload/upload.service'
import AuthTutorService from '@/services/auth/auth-tutor.service'
import { isValidPhoneNumber } from 'libphonenumber-js'
import {
  CLASSLEVELMAP,
  CONVETGRADEMAP,
  DAYOFWEEKMAP,
  GRADEMAP,
  SESSIONMAP
} from '@/constants/class.constant'
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
import type { Tutor } from '@/types/tutor.type'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { FilterOperationType } from '@chax-at/prisma-filter-common'
import { GENDERMAP } from '@/constants/gender.constant'
// Variables
const emits = defineEmits(['tutor-update-profile'])
const addressService = new AddressService()
const subjectService = new SubjectService()
const uploadService = new UploadService()
const authTutorService = new AuthTutorService()

const errors = ref<Record<string, any>>({})
const selectedFile = ref<File | null>(null)
const fileKey = ref<string>('')
const query = ref<QueryParams>({
  limit: 30,
  offset: 0
})

const props = defineProps<{ profile: Tutor }>()
const tutorProfile = ref({
  firstName: props.profile.firstName,
  lastName: props.profile.lastName,
  phone: props.profile.phone,
  gender: props.profile.gender,
  dob: props.profile.dob,
  identificationId: props.profile.identificationId,
  expectSalary: props.profile.expectSalary || 0,
  description: props.profile.description,
  address: {
    address: props.profile.address?.address,
    city: props.profile.address?.city,
    district: props.profile.address?.district,
    ward: props.profile.address?.ward
  },
  educationalQualification: {
    degree: props.profile.educationalQualification?.degree,
    major: props.profile.educationalQualification?.major,
    university: props.profile.educationalQualification?.university,
    startYear: props.profile.educationalQualification?.startYear,
    endYear: props.profile.educationalQualification?.endYear,
    certificateUrl: props.profile.educationalQualification?.certificateUrl
  }
})

const TutorProfileSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự')
    .optional(),
  lastName: yup
    .string()
    .trim()
    .min(2, 'Họ phải có ít nhất 2 ký tự')
    .max(50, 'Họ không được quá 50 ký tự')
    .optional(),
  phone: yup
    .string()
    .trim()
    .test('', 'Số điện thoại không hợp lệ', (value) => {
      console.log('valid phone:', value)
      if (!!value) return isValidPhoneNumber(value as string)
    })
    .optional(),
  gender: yup.string().trim().optional(),
  dob: yup
    .date()
    .optional()
    .test('is-valid-dob', 'Ngày sinh không hợp lệ', (value) => {
      return value && value < new Date()
    }),
  identificationId: yup.string().trim().optional(),
  expectSalary: yup.number().min(0).optional(),
  description: yup.string().optional().nullable(),
  address: yup
    .object({
      address: yup.string().required('Hãy nhập địa chỉ'),
      city: yup.string().required('Hãy chọn tỉnh/thành phố'),
      district: yup.string().required('Hãy chọn quận/huyện'),
      ward: yup.string().required('Hãy chọn xã/phường')
    })
    .optional(),
  educationalQualification: yup.object({
    degree: yup.string().optional(),
    major: yup.string().optional(),
    university: yup.string().optional(),
    startYear: yup
      .date()
      .optional()
      .transform((value) => new Date(value)),
    endYear: yup
      .date()
      .optional()
      .transform((value) => new Date(value)),
    certificateUrl: yup
      .mixed()
      .optional()
      .test('fileType', 'File không được hỗ trợ', (value) => {
        console.log('file type:', value)
        if (!value) return true
        if (!props.profile.educationalQualification?.certificateUrl)
          return (
            (value as File) &&
            ['image/jpeg', 'image/png', 'image/jpg'].includes((value as File).type)
          )
        return true
      })
      .test('fileSize', 'File quá lớn. Tối đa 2MB', (value) => {
        if (!props.profile.educationalQualification?.certificateUrl)
          return (value as File) && (value as File).size <= 2097152 // Giới hạn file 2MB
        return true
      })
  }),
  areaExpects: yup
    .array(
      yup.object({
        city: yup.string().required('Hãy chọn tỉnh/thành phố'),
        districts: yup.array(yup.string()).required('Hãy chọn quận/huyện')
      })
    )
    .min(1)
    .optional(),
  timeExpects: yup
    .array(
      yup.object({
        dow: yup.string().required('Ngày trong tuần là bắt buộc'),
        sessions: yup.array(yup.string()).required('Buổi là bắt buộc')
      })
    )
    .min(1)
    .optional(),
  jobReferences: yup
    .array(
      yup.object({
        class: yup.string().required('Lớp là bắt buộc'),
        subjects: yup.array(yup.string()).required('Môn học là bắt buộc')
      })
    )
    .min(1)
    .optional()
})
// Sử dụng watch để theo dõi props.profile và cập nhật giá trị ban đầu khi có dữ liệu

// Address for personal
const cities = ref<CityResponse[]>([])
const selectedCityId = ref<string>('')
const selectedCity = computed<CityResponse>(() => {
  const city = cities.value.find((c) => c.id === selectedCityId.value)
  if (!city) {
    const selectFilterCity = filteredCity.value.find((c) => c.id === selectedCityId.value)
    if (selectFilterCity) cities.value.push(selectFilterCity)
    return selectFilterCity!
  }
  return city
})
const queryCityName = ref<string>('')
const filteredCity = ref<CityResponse[]>([])

watch(queryCityName, async () => {
  console.log(queryCityName.value)
  const result =
    queryCityName.value === ''
      ? cities.value
      : cities.value.filter((city) =>
          city.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(queryCityName.value.toLowerCase().replace(/\s+/g, ''))
        )
  filteredCity.value = result
  if (filteredCity.value.length === 0 && queryCityName.value !== '') {
    const searchQuery: QueryParams = {
      ...query.value,
      filter: [{ field: 'name', type: FilterOperationType.IContains, value: queryCityName.value }]
    }
    const searchQueryString = getQueryParams(searchQuery)
    const searchCities = await addressService.listCities(searchQueryString)
    filteredCity.value = searchCities.results
  }
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

const providedCities = ref<CityResponse[]>([])
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
  console.log('handleRemoveExpectDistrict', cityId, id)
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
      name: DAYOFWEEKMAP[day],
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
      name: SESSIONMAP[session]
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
          name: CLASSLEVELMAP[level],
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
          name: CLASSLEVELMAP[level],
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
const format = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}
// Methods
const handleUpdateProfile = async (values: any) => {
  const updatedTutor = values as TutorUpdateProfileRequest
  console.log('Form Submitted: ', updatedTutor)

  updatedTutor.areaExpects = listViewAddressSelections.value.map((item) => ({
    city: item.name,
    districts: item.level2!.map((itemLv2) => itemLv2.name)
  }))
  updatedTutor.timeExpects = selectedSchedules.value.map((item) => ({
    dow: item.id,
    sessions: item.level2!.map((itemLv2) => itemLv2.id)
  }))
  updatedTutor.jobReferences = listViewSelectionSubjects.value.flatMap((item) => {
    return item.level2!.map((itemLv2) => {
      return {
        grade: item.id,
        class: itemLv2.id,
        description: '', // Thêm giá trị mô tả nếu cần
        subjects: itemLv2.level3!.map((itemLv3) => itemLv3.id) // Đổi tên thuộc tính từ `subject` thành `subjects`
      }
    })
  })

  try {
    console.log('updatedTutor', updatedTutor)
    await TutorProfileSchema.validate(updatedTutor, { abortEarly: false })

    console.log(
      'startYear',
      updatedTutor.educationalQualification?.startYear,
      'endYear',
      updatedTutor.educationalQualification?.endYear
    )
    if (updatedTutor.educationalQualification) {
      const startYear = new Date(updatedTutor.educationalQualification.startYear)
      const endYear = new Date(updatedTutor.educationalQualification.endYear)
      updatedTutor.educationalQualification.startYear = startYear.getFullYear().toString()
      updatedTutor.educationalQualification.endYear = endYear.getFullYear().toString()
    }

    if (updatedTutor.address !== undefined) {
      const { address } = updatedTutor
      const updateCity = cities.value.find((c) => c.id === address.city)
      const updateDistrict = districts.value.find((c) => c.id === address.district)
      const updatedWard = wards.value.find((w) => w.id === address.ward)
      updatedTutor.address = {
        ...updatedTutor.address,
        city: updateCity ? updateCity.name : tutorProfile.value.address.city,
        district: updateDistrict ? updateDistrict.name : tutorProfile.value.address.district,
        ward: updatedWard ? updatedWard.name : tutorProfile.value.address.ward
      }
    }

    errors.value = {}

    if (selectedFile.value) {
      console.log('selectedFile', selectedFile.value)
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
    console.log('fileKey', fileKey.value)
    console.log('profile url: ', tutorProfile.value.educationalQualification.certificateUrl)
    updatedTutor.educationalQualification = {
      degree: updatedTutor.educationalQualification
        ? updatedTutor.educationalQualification.degree
        : tutorProfile.value.educationalQualification.degree,
      major: updatedTutor.educationalQualification
        ? updatedTutor.educationalQualification.major
        : tutorProfile.value.educationalQualification.major,
      university: updatedTutor.educationalQualification
        ? updatedTutor.educationalQualification.university
        : tutorProfile.value.educationalQualification.university,
      startYear: updatedTutor.educationalQualification
        ? updatedTutor.educationalQualification.startYear
        : tutorProfile.value.educationalQualification.startYear,
      endYear: updatedTutor.educationalQualification
        ? updatedTutor.educationalQualification.endYear
        : tutorProfile.value.educationalQualification.endYear,
      certificateUrl:
        fileKey.value.length > 0
          ? fileKey.value
          : tutorProfile.value.educationalQualification.certificateUrl
    }
    console.log('before emit: ', updatedTutor)

    emits('tutor-update-profile', updatedTutor)
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
  const result = await subjectService.findAll('/')
  subjects.value = result.results

  const defaultQuery = getQueryParams(query.value)
  const defaultCities = await addressService.listCities(defaultQuery)
  cities.value = defaultCities.results
  filteredCity.value = defaultCities.results

  console.log('student profile', tutorProfile.value)
  const city = filteredCity.value.find((c) => c.name === tutorProfile.value.address.city)
  if (!city) {
    const searchQuery: QueryParams = {
      ...query.value,
      filter: [
        {
          field: 'name',
          type: FilterOperationType.IContains,
          value: tutorProfile.value.address.city
        }
      ]
    }
    const searchQueryString = getQueryParams(searchQuery)
    const searchCities = await addressService.listCities(searchQueryString)
    const city = searchCities.results.find(
      (c: CityResponse) => c.name === tutorProfile.value.address.city
    )
    if (city) {
      filteredCity.value.push(city)
      selectedCityId.value = city.id
    }
  } else {
    selectedCityId.value = city.id
  }
  selectedDistrictId.value = filteredDistrict.value.find(
    (d) => d.name === tutorProfile.value.address.district
  )!.id
  selectedWardId.value = filteredWard.value.find(
    (w) => w.name === tutorProfile.value.address.ward
  )!.id

  const providedQuery: QueryParams = {
    ...query.value,
    filter: [
      {
        field: 'isProvided',
        type: FilterOperationType.Eq,
        value: true
      }
    ]
  }
  const providedQueryString = getQueryParams(providedQuery)
  const providedResponse = await addressService.listCities(providedQueryString)
  providedCities.value = providedResponse.results

  props.profile.areaExpects.map((item) => {
    const city = cities.value.find((c) => c.name === item.city)
    console.log('item', item)
    console.log('city', city)
    if (city) {
      selectedCities.value.push(city.id)
      listViewAddressSelections.value.push({
        id: city.id,
        name: city.name,
        level2: item.districts.map((d) => {
          const district = city.districts.find((c) => c.name === d)
          console.log('district', district)
          if (district) return { id: district.id, name: district.name }
          return { id: '', name: '' }
        })
      })
      if (expectCity.value === '') expectCity.value = city.id
      item.districts.map((district) => {
        const districtId = city.districts.find((d) => d.name === district)
        console.log('district', district)
        console.log('districtId', districtId)
        if (districtId) selectedDistricts.value.push(districtId!.id)
      })
    }
  })

  props.profile.timeExpects.map((item) => {
    selectedSchedules.value.push({
      id: item.dow,
      name: DAYOFWEEKMAP[item.dow],
      level2: item.sessions.map((s) => ({ id: s, name: SESSIONMAP[s] }))
    })
  })

  props.profile.jobReferences.map((item) => {
    const existedGrade = listViewSelectionSubjects.value.findIndex((d) => d.id === item.grade)
    if (existedGrade < 0)
      listViewSelectionSubjects.value.push({
        id: item.grade,
        name: CONVETGRADEMAP[item.grade],
        level2: [
          {
            id: item.class,
            name: CLASSLEVELMAP[item.class],
            level3: item.subjects.map((s) => ({ id: s.id, name: s.name }))
          }
        ]
      })
    else
      listViewSelectionSubjects.value[existedGrade].level2!.push({
        id: item.class,
        name: CLASSLEVELMAP[item.class],
        level3: item.subjects.map((s) => ({ id: s.id, name: s.name }))
      })
    item.subjects.map((subject) => {
      const existedSubject = selectedSubjects.value.findIndex((d) => d === subject.id)
      if (existedSubject < 0) selectedSubjects.value.push(subject.id)
    })
  })
  console.log('tutorProfile', props.profile)
})

watchEffect(() => {
  console.log('watch tutorProfile', tutorProfile.value)
})
defineComponent({ name: 'TutorForm' })
</script>
<template>
  <Form
    @submit="handleUpdateProfile"
    :validation-schema="TutorProfileSchema"
    :initial-values="tutorProfile"
    class="grid max-h-full w-full grid-flow-row-dense content-around justify-center justify-self-center overflow-hidden overflow-y-scroll px-28 py-6 shadow-lg shadow-gray-400"
  >
    <div class="form-header">
      <h1>Hồ sơ</h1>
    </div>
    <!-- Personal information -->
    <div class="mb-5 mt-10 flex flex-auto justify-start gap-5">
      <font-awesome-icon :icon="['fas', 'user']" size="2x" />
      <span class="text-lg">Thông tin cá nhân</span>
    </div>
    <div class="form-body">
      <div class="grid grid-cols-2 gap-5">
        <!-- Firstname -->
        <div class="form-field">
          <label for="" class="form-label">Tên</label>
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
          <label for="" class="form-label">Họ</label>
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
          <label for="" class="form-label">Số điện thoại</label>
          <Field
            name="phone"
            v-slot="{ field, meta }"
            :validate-on-input="true"
            :validate-on-model-update="false"
          >
            <vue-tel-input v-model="field.value" v-bind="field">{{ field.value }}</vue-tel-input>
          </Field>
          <ErrorMessage name="phone" class="text-sm text-red-500" />
        </div>
        <!-- Date of birth -->
        <div class="form-field">
          <label for="dob" class="form-label">Ngày sinh</label>
          <Field name="dob" v-slot="{ field, meta }" :validate-on-input="true">
            <VueDatePicker
              mode="date"
              v-model="field.value"
              v-bind="field"
              :format="format"
              :enable-time-picker="false"
              text-input
              :auto-apply="true"
            />
          </Field>
          <ErrorMessage name="dob" class="text-sm text-red-500" />
        </div>
        <!-- Gender -->
        <div class="form-field">
          <label for="gender" class="form-label">Giới tính</label>
          <Field name="gender" v-slot="{ field, meta }" :validate-on-input="true">
            <Listbox :default-value="tutorProfile.gender" v-bind="field">
              <div class="relative mt-1">
                <ListboxButton
                  class="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                >
                  <span class="block truncate capitalize">{{
                    GENDERMAP[field.value] ?? 'Chọn giới tính'
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
        <!-- ID Document Number -->
        <div class="form-field">
          <label for="" class="form-label">CMND/CCCD</label>
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
          <label for="" class="form-label">Mức lương mong muốn</label>
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
          <label for="address.address" class="form-label">Địa chỉ</label>
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
          <label class="form-label">Tỉnh/Thành phố</label>
          <Field name="address.city" v-slot="{ field, meta }" :validate-on-input="true">
            <Combobox v-bind="field" v-model="selectedCityId">
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
          <label for="address.district" class="form-label">Quận/Huyện</label>
          <Field name="address.district" v-slot="{ field, meta }" :validate-on-input="true">
            <Combobox v-bind="field" v-model="selectedDistrictId" v-if="selectedCityId">
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
                      Không tìm thấy.
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
            <p v-else>Vui lòng chọn thành phố trước</p>
          </Field>
          <ErrorMessage name="address.district" class="text-sm text-red-500" />
        </div>
        <!-- Ward -->
        <div class="form-field">
          <label for="address.ward" class="form-label">Xã/Phường</label>
          <Field name="address.ward" v-slot="{ field, meta }" :validate-on-input="true">
            <Combobox v-bind="field" v-model="selectedWardId" v-if="selectedDistrictId">
              <div class="relative mt-1">
                <div
                  class="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                >
                  <ComboboxInput
                    class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    :display-value="(se) => selectedWard?.name || 'Chọn xã phường'"
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
                      Không tìm thấy.
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
            <p v-else>Vui lòng chọn quận/huyện trước</p>
          </Field>
          <ErrorMessage name="address.ward" class="text-sm text-red-500" />
        </div>
      </div>
      <div class="grid grid-cols-1">
        <div class="form-field">
          <label for="description" class="form-label">Mô tả bản thân</label>
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
              placeholder="Mô tả bản thân"
            ></textarea>
          </Field>
          <ErrorMessage name="description" class="text-sm text-red-500" />
        </div>
      </div>
      <!-- Educational Qualification -->
      <div class="mb-5 mt-10 flex flex-auto justify-start gap-5">
        <font-awesome-icon :icon="['fas', 'graduation-cap']" size="2xl" style="color: #000000" />
        <span class="text-lg">Trình độ học vấn</span>
      </div>
      <div class="grid grid-cols-2 gap-5">
        <!-- Degree -->
        <div class="form-field">
          <label for="educationalQualification.degree" class="form-label">Trình độ</label>
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
              placeholder="Trình độ"
            />
          </Field>
          <ErrorMessage name="educationalQualification.degree" class="text-sm text-red-500" />
        </div>
        <!-- Major -->
        <div class="form-field">
          <label for="educationalQualification.major" class="form-label">Chuyên ngành</label>
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
              placeholder="Chuyên ngành"
            />
          </Field>
          <ErrorMessage name="educationalQualification.major" class="text-sm text-red-500" />
        </div>
      </div>
      <div class="grid grid-cols-3 gap-5">
        <!-- University -->
        <div class="form-field">
          <label for="educationalQualification.university" class="form-label"
            >Đại học/Cơ quan</label
          >
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
              placeholder="Cơ quan/Đại học"
            />
          </Field>
          <ErrorMessage name="educationalQualification.university" class="text-sm text-red-500" />
        </div>
        <!-- Start Date -->
        <div class="form-field">
          <label for="educationalQualification.startYear" class="form-label">Năm bắt đầu</label>
          <Field
            name="educationalQualification.startYear"
            v-slot="{ field, meta }"
            :validate-on-input="true"
          >
            <VueDatePicker
              mode="date"
              year-picker
              v-model="field.value"
              v-bind="field"
              :enable-time-picker="false"
              :auto-apply="true"
            />
          </Field>
          <ErrorMessage name="educationalQualification.startYear" class="text-sm text-red-500" />
        </div>
        <!-- End Date -->
        <div class="form-field">
          <label for="educationalQualification.endYear" class="form-label">Năm kết thúc</label>
          <Field
            name="educationalQualification.endYear"
            v-slot="{ field, meta }"
            :validate-on-input="true"
          >
            <VueDatePicker
              mode="date"
              year-picker
              v-model="field.value"
              v-bind="field"
              :enable-time-picker="false"
              :auto-apply="true"
            />
          </Field>
          <ErrorMessage name="educationalQualification.endYear" class="text-sm text-red-500" />
        </div>
      </div>
      <div class="grid grid-cols-1">
        <!-- Certificate image -->
        <div class="form-field">
          <label for="educationalQualification.certificateUrl" class="form-label"
            >Hình ảnh bằng cấp</label
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
        <span class="text-lg">Khu vực làm việc</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="grid grid-flow-row-dense items-start gap-6">
          <!-- City -->
          <div class="grid grid-flow-row-dense items-start">
            <label for="areaExpect.city" class="form-label">Tỉnh/Thành phố</label>
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
            <label for="areaExpect.district" class="form-label">Quận/Huyện</label>
            <AppListSelection
              v-if="expectDistricts.length > 0"
              :list="expectDistricts"
              :selected="selectedDistricts"
              @select="handleSelectExpectDistrict"
            />
            <p v-else>Vui lòng chọn thành phố trước</p>
            <span v-if="errors.areaExpect && errors.areaExpect[0].district">{{
              errors.areaExpect.district
            }}</span>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="grid grid-flow-row-dense">
            <label for="" class="form-label">Các lựa chọn</label>
            <AppSelectionLevel
              :list="listViewAddressSelections"
              @delete-lv1="handleRemoveExpectCity"
              @delete-lv2="handleRemoveExpectDistrict"
            />
          </div>
        </div>
        <!-- <span v-if="errors.areaExpect" class="text-sm text-red-500">{{
          errors.areaExpect[0]
        }}</span> -->
      </div>
      <!-- Expected Schedules -->
      <div class="mb-5 mt-10 flex flex-auto justify-start gap-5">
        <font-awesome-icon :icon="['fas', 'map-location-dot']" size="2xl" style="color: #0d0d0d" />
        <span class="text-lg">Thời khóa biểu mong muốn</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="grid grid-flow-row-dense items-start gap-2">
          <!-- Day of week -->
          <div class="gird grid-flow-row-dense">
            <label for="timeExpect.dow" class="form-label">Thứ trong tuần</label>
            <div class="grid grid-cols-2 gap-2">
              <li
                v-for="day in daysOfWeek"
                :key="day"
                :value="day"
                :class="[selectedDay === day ? 'active-expected-items' : 'expected-items']"
                @click="handleSelectDayOfWeek(day)"
              >
                <p>{{ DAYOFWEEKMAP[day] }}</p>
              </li>
            </div>
            <span v-if="errors.timeExpect && errors.timeExpect[0].dow">{{
              errors.timeExpect.dow
            }}</span>
          </div>
          <!-- Session -->
          <div class="grid grid-flow-row-dense">
            <label for="" class="form-label">Buổi</label>
            <div class="grid grid-cols-2 gap-2">
              <li
                v-for="session in sessions"
                :key="session"
                :value="session"
                class="expected-items"
                @click="handleSelectSession(session)"
              >
                <p>{{ SESSIONMAP[session] }}</p>
              </li>
            </div>
            <span v-if="errors.timeExpect && errors.timeExpect[0].session">{{
              errors.timeExpect.session
            }}</span>
          </div>
        </div>
        <div class="grid grid-flow-row-dense">
          <label for="" class="form-label">Các lựa chọn</label>
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
        <span class="text-lg">Môn học có thể dạy</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="grid grid-flow-row-dense gap-3">
          <div class="grid grid-flow-row-dense">
            <label for="" class="form-label">Lớp</label>
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
                <p>{{ CLASSLEVELMAP[classLevel] }}</p>
              </li>
            </div>
            <span v-if="errors.jobReference && errors.jobReference[0].class">{{
              errors.jobReference.class
            }}</span>
          </div>
          <div class="grid grid-flow-row-dense">
            <label for="" class="form-label">Môn học</label>
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
          <label for="" class="form-label">Các lựa Chọn</label>
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
          <AppButton :status="ButtonStatus.SUCCESS" :type="ButtonType.FULL_FILL" :content="'Gửi'" />
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
