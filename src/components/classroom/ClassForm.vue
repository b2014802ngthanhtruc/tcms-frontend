<script setup lang="ts">
import {
  CLASSLEVELMAP,
  DAYOFWEEKMAP,
  PAYMENTFREQUENCYMAP,
  SCOPEMAP,
  SESSIONMAP
} from '@/constants/class.constant'
import {
  ClassLevel,
  ClassSession,
  DayOfWeek,
  PaymentFrequency,
  ScopeClass,
  TeachingMode
} from '@/enums'
import AddressService from '@/services/address/address.service'
import GeneralClassroomService from '@/services/classroom/general-classroom.service'
import SubjectService from '@/services/subject/subject.service'
import GeneralTutorService from '@/services/tutor/general-tutor.service'
import TutorService from '@/services/tutor/tutor.service'
import type {
  CityResponse,
  ClassResponse,
  CreateClassRoom,
  District,
  QueryParams,
  Subject,
  UpdateClassRoom
} from '@/types'
import type { Tutor } from '@/types/tutor.type'
import { getQueryParams, toCurrency, toFormatNumber } from '@/utils'
import { FilterOperationType } from '@chax-at/prisma-filter-common'
import { after, before, required, type VueformProps } from '@vueform/vueform'
import { capitalize, computed, defineComponent, onMounted, ref } from 'vue'
import en from '@vueform/vueform/locales/en'
import { format } from 'libphonenumber-js'

// en.validation.before = 'Ngày bắt đầu phải trước ngày kết thúc'
// en.validation.after = 'Ngày kết thúc phải sau ngày hiện tại'
// en.parameters = {
//   endedAt: 'ngày kết thúc',
//   today: new Date().toLocaleString('en-GB'),
//   startedAt: 'ngày bắt đầu' // Custom mapping for parameters
// }

const props = defineProps<{
  title: string
  tutor?: Tutor
  classRoom?: ClassResponse
  isStartLearning: boolean
  isStudent: boolean
}>()
const addressService = new AddressService()
const subjectService = new SubjectService()
const generalTutorService = new GeneralTutorService()
const generalClassService = new GeneralClassroomService()

export type SelectItems = { value: string; label: string }

const myForm = ref(null)

const defaultTutor = ref<Tutor | null>(null)
const defaultClassRoom = computed(() => props.classRoom)
const subjects = ref<Subject[]>([])
const cities = ref<CityResponse[]>([])
const selectedCity = ref<string>('')
const filteredDistrict = computed<SelectItems[]>(() => {
  console.log('selectedCity', selectedCity.value)
  const city = cities.value.find((c) => c.name === selectedCity.value)
  if (city) {
    return city.districts.map((d) => ({ value: d.name, label: d.name }))
  }
  return []
})
const districts = computed<District[]>(() => {
  const city = cities.value.find((c) => c.name === selectedCity.value)
  if (city) {
    return city.districts
  }
  return []
})
const selectedDistrict = ref<string>('')
const filteredWard = computed<SelectItems[]>(() => {
  const district = districts.value.find((d) => d.name === selectedDistrict.value)
  if (district) {
    return district.wards.map((w) => ({ value: w.name, label: w.name }))
  }
  return []
})

const listCities = ref<SelectItems[]>([])
const listSubjects = ref<SelectItems[]>([])
const scopes = ref<SelectItems[]>([])
const level = ref<SelectItems[]>([])
const teachingMode = ref<SelectItems[]>([])
const paymentFrequency = ref<SelectItems[]>([])
const dayOfWeeks = ref<SelectItems[]>([])
const sessions = ref<SelectItems[]>([])
const listTutors = ref<SelectItems[]>([])
const defaultTuitionFee = computed<number>(() => {
  if (defaultClassRoom.value) {
    return defaultClassRoom.value.tuitionFee ?? 0
  }
  if (defaultTutor.value) {
    return defaultTutor.value.expectSalary
  }
  return 0
})

const emits = defineEmits(['create-class', 'update-class'])

onMounted(async () => {
  const queryParams: QueryParams = {
    filter: [
      {
        field: 'isProvided',
        type: FilterOperationType.Eq,
        value: true
      }
    ]
  }
  const queryString = getQueryParams(queryParams)
  const citiesResponse = await addressService.listCities(queryString)
  cities.value = citiesResponse.results
  const result = await subjectService.findAll('/')
  if (!props.tutor) {
    const tutors = await generalTutorService.findMany('?limit=20')
    listTutors.value = tutors.results.map((t) => ({ value: t.id, label: capitalize(t.fullName) }))
  } else {
    listTutors.value = [{ value: props.tutor.id, label: capitalize(props.tutor.fullName) }]
  }
  if (props.classRoom && props.classRoom.location) {
    selectedCity.value = props.classRoom.location.city
    selectedDistrict.value = props.classRoom.location.district
    console.log('defaultClassRoom', defaultClassRoom.value)
  }

  subjects.value = result.results
  listCities.value = cities.value.map((c) => ({ value: c.name, label: c.name }))
  listSubjects.value = subjects.value.map((s) => ({ value: s.id, label: capitalize(s.name) }))
  const listScope = Object.values(ScopeClass)
  const listLevel = Object.values(ClassLevel)
  const listPaymentFrequency = Object.values(PaymentFrequency)
  const listTeachingMode = Object.values(TeachingMode)
  const listDayOfWeek = Object.values(DayOfWeek)
  const lisSession = Object.values(ClassSession)
  scopes.value = listScope.map((s) => ({ value: s, label: SCOPEMAP[s] }))
  level.value = listLevel.map((s) => ({ value: s, label: CLASSLEVELMAP[s] }))
  paymentFrequency.value = listPaymentFrequency.map((s) => ({
    value: s,
    label: PAYMENTFREQUENCYMAP[s]
  }))
  teachingMode.value = listTeachingMode.map((s) => ({ value: s, label: capitalize(s) }))
  dayOfWeeks.value = listDayOfWeek.map((s) => ({ value: s, label: DAYOFWEEKMAP[s] }))
  sessions.value = lisSession.map((s) => ({ value: s, label: SESSIONMAP[s] }))
})

const handleSubmitForm = async (form$: any, data: any) => {
  console.log('data', data)
  console.log('form', form$.requestData)
  console.log('startedaAt ', new Date(form$.requestData.startedAt))
  const requestClass = form$.requestData as CreateClassRoom
  if (props.classRoom) {
    emits('update-class', props.classRoom.id, requestClass as UpdateClassRoom)
  } else {
    emits('create-class', requestClass)
  }
}

const vueform = computed<VueformProps>(() => ({
  size: 'md',
  displayErrors: false,
  displayMessages: true,
  floatPlaceholders: false,
  type: 'object',
  addClass: 'vf-create-classrom',
  schema: {
    page_title: {
      type: 'static',
      tag: 'h1',
      content: props.title,
      align: 'center'
    },
    divider: {
      type: 'static',
      tag: 'hr'
    },
    basiInformation: {
      type: 'static',
      tag: 'h4',
      content: 'Thông tin cơ bản'
    },
    className: {
      type: 'text',
      label: 'Tên lớp học',
      size: 'md',
      fieldName: 'className',
      default: defaultClassRoom.value?.className,
      rules: ['required', 'min:3'],
      messages: {
        required: 'Vui lòng nhập tên lớp học',
        min: 'Tên lớp học phải nhất 3 ký tự'
      }
    },
    tutorId: {
      type: 'select',
      label: 'Gia sư',
      search: true,
      columns: {
        container: 6
      },
      items: [...listTutors.value],
      disabled: props.tutor ? true : props.isStudent ? true : false,
      default: defaultClassRoom.value?.tutorId ?? props.tutor?.id,
      placeholder: 'Chọn gia sư',
      size: 'md'
      // conditions: [[props.isStudent]]
    },
    level: {
      type: 'select',
      label: 'Lớp',
      search: true,
      columns: {
        container: 6
      },
      items: [...level.value],
      size: 'md',
      fieldName: 'level',
      rules: ['required'],
      messages: {
        required: 'Vui lòng chọn lớp'
      },
      placeholder: 'Chọn cấp lớp',
      default: defaultClassRoom.value?.level
    },
    scope: {
      type: 'select',
      label: 'Quy mô',
      search: true,
      columns: {
        lg: {
          container: 6
        }
      },
      items: [...scopes.value],
      placeholder: 'Chọn quy mô',
      size: 'md',
      fieldName: 'scope',
      rules: ['required'],
      messages: {
        required: 'Vui lòng chọn quy mô'
      },
      default:
        defaultClassRoom.value?.scope ?? (props.isStartLearning ? ScopeClass.SMALL : undefined),
      disabled: props.isStartLearning ? true : false
    },
    teachingMode: {
      type: 'select',
      search: true,
      items: [...teachingMode.value],
      columns: {
        lg: {
          container: 6
        }
      },
      label: 'Phương thức dạy học',
      size: 'md',
      rules: ['required'],
      messages: {
        required: 'Vui lòng chọn phương thức dạy học'
      },
      fieldName: 'teachingMode',
      placeholder: 'Chọn phương thức',
      default: defaultClassRoom.value?.teachingMode
    },
    request: {
      type: 'textarea',
      label: 'Yêu cầu lớp học',
      placeholder: 'Yêu cầu lớp học',
      size: 'md',
      fieldName: 'request',
      rules: ['required'],
      messages: {
        required: 'Vui lòng nhập yêu cầu lớp học'
      },
      default: defaultClassRoom.value?.request
    },
    startedAt: {
      type: 'date',
      label: 'Ngày bắt đầu',
      size: 'md',
      displayFormat: 'DD-MM-YYYY',
      default: defaultClassRoom.value?.startedAt,
      rules: !defaultClassRoom.value ? ['required', 'before:endedAt', 'after:today'] : ['required'],
      messages: !defaultClassRoom.value
        ? {
            required: 'Vui lòng chọn ngày bắt đầu',
            before: 'Ngày bắt đầu phải trước ngày kết thúc',
            after: 'Ngày bắt đầu phải sau ngày hôm nay'
          }
        : {
            required: 'Vui lòng chọn ngày bắt đầu'
          },
      formatData: (n: string, v: string) => {
        return {
          [n]: new Date(v)
        }
      },
      fieldName: 'startedAt',
      info: 'Ngày dự kiến bắt đầu',
      placeholder: 'Chọn ngày',
      columns: {
        container: 6
      },
      floating: false
    },
    endedAt: {
      type: 'date',
      label: 'Ngày kết thúc',
      size: 'md',
      displayFormat: 'DD-MM-YYYY',
      default: defaultClassRoom.value?.endedAt,
      rules: !defaultClassRoom.value
        ? ['required', 'after:startedAt', 'after:today']
        : ['required'],
      messages: !defaultClassRoom.value
        ? {
            required: 'Vui lòng chọn ngày kết thúc',
            after: 'Ngày kết thúc phải sau ngày bắt đàu và hôm nay'
          }
        : {
            required: 'Vui lòng chọn ngày kết thúc'
          },
      formatData: (n: string, v: string) => {
        return {
          [n]: new Date(v)
        }
      },
      fieldName: 'endedAt',
      info: 'Ngày dự kiến kết thúc',
      placeholder: 'Chọn ngày',
      columns: {
        container: 6
      },
      floating: false
    },
    tuitionFee: {
      type: 'text',
      inputType: 'number',
      min: props.tutor?.expectSalary,
      rules: ['nullable', 'numeric'],
      autocomplete: 'off',
      label: 'Học phí',
      columns: {
        lg: {
          container: 6
        }
      },
      placeholder: 'Học phí',
      fieldName: 'tuitionFee',
      default: defaultClassRoom.value?.tuitionFee ?? props.tutor?.expectSalary ?? 0,
      forceNumbers: true,
      valueFormat: true,
      conditions: [['paymentFrequency', 'not_in', [PaymentFrequency.NEGOTIAL]]]
    },
    html: {
      type: 'static',
      label: 'Học phí',
      content: '<b>Học phí sẽ được thỏa thuận trực tiếp với gia sư</b>',
      size: 'sm',
      columns: {
        lg: {
          container: 6
        }
      },
      conditions: [['paymentFrequency', 'in', [PaymentFrequency.NEGOTIAL]]],
      top: '1'
    },
    paymentFrequency: {
      type: 'select',
      search: true,
      items: [...paymentFrequency.value],
      columns: {
        lg: {
          container: 6
        }
      },
      label: 'Định kỳ thanh toán',
      placeholder: 'Chọn định kỳ',
      fieldName: 'paymentFrequency',
      rules: ['required'],
      messages: {
        required: 'Vui lòng chọn định kỳ thanh toán'
      },
      default: defaultClassRoom.value?.paymentFrequency
    },
    quantityStudents: {
      type: 'text',
      inputType: 'number',
      rules: ['required', 'numeric'],
      messages: {
        required: 'Vui lòng nhập số học sinh',
        numeric: 'Số học sinh phải là một số'
      },
      autocomplete: 'off',
      label: 'Tổng số học sinh',
      columns: {
        lg: {
          container: 6
        }
      },
      default: defaultClassRoom.value?.quantityStudents ?? (props.isStartLearning ? 1 : 0),
      size: 'md',
      fieldName: 'quantityStudent',
      forceNumbers: true,
      valueFormat: true,
      disabled: props.isStartLearning ? true : false
    },
    subjectId: {
      type: 'select',
      label: 'Môn học',
      search: true,
      columns: {
        lg: {
          container: 6
        }
      },
      items: [...listSubjects.value],
      placeholder: 'Chọn môn học',
      fieldName: 'subjectId',
      default: defaultClassRoom.value?.subjectId,
      rules: ['required'],
      messages: {
        required: 'Vui lòng chọn một môn học'
      }
    },
    description: {
      type: 'textarea',
      label: 'Mô tả',
      placeholder: 'Mô tả',
      floating: false,
      default: defaultClassRoom.value?.description,
      rules: ['nullable']
    },
    divider_1: {
      type: 'static',
      tag: 'hr'
    },
    address: {
      type: 'static',
      tag: 'h4',
      content: 'Địa chỉ lớp học',
      between: 'Khi phương thức dạy học là Offline'
    },
    location: {
      type: 'object',
      conditions: [['teachingMode', 'in', [TeachingMode.OFFLINE]]],
      schema: {
        address: {
          type: 'text',
          label: 'Địa chỉ',
          placeholder: 'Địa chỉ',
          floating: false,
          default: defaultClassRoom.value?.location?.address,
          size: 'md',
          rules: ['required'],
          messages: {
            required: 'Vui lòng nhập địa chỉ lớp học'
          },
          fieldName: 'address'
        },
        city: {
          type: 'select',
          search: true,
          label: 'Tỉnh/Thành phố',
          items: [...listCities.value],
          default: defaultClassRoom.value?.location?.city,
          columns: {
            lg: {
              container: 4
            }
          },
          onChange: (value: string) => {
            selectedCity.value = value
          },
          model: 'selectedCity',
          placeholder: 'Chọn tỉnh/thành phố',
          floating: false,
          size: 'md',
          rules: ['required'],
          messages: {
            required: 'Hãy chọn một tỉnh/thành phó'
          },
          fieldName: 'city'
        },
        district: {
          type: 'select',
          search: true,
          label: 'Quận/Huyện',
          default: defaultClassRoom.value?.location?.district,
          columns: {
            lg: {
              container: 4
            }
          },
          items: [...filteredDistrict.value],
          onChange: (value: string) => {
            selectedDistrict.value = value
          },
          placeholder: 'Chọn quận/huyện',
          floating: false,
          size: 'md',
          fieldName: 'district',
          rules: ['required'],
          messages: {
            required: 'Hãy chọn một quán/huyện'
          },
          conditions: [['location.city', 'not_empty']]
        },
        ward: {
          type: 'select',
          search: true,
          label: 'Xã/Phường',
          default: defaultClassRoom.value?.location?.ward,
          columns: {
            lg: {
              container: 4
            }
          },
          items: [...filteredWard.value],
          placeholder: 'Chọn xã/phường',
          floating: false,
          size: 'md',
          fieldName: 'ward',
          rules: ['required'],
          messages: {
            required: 'Hãy chọn một xã/phường'
          },
          conditions: [['location.district', 'not_empty']]
        },
        html: {
          type: 'static',
          label: 'Quận/Huyện',
          content: '<b>Vui lòng chọn thành phố trước</b>',
          size: 'sm',
          columns: {
            lg: {
              container: 4
            }
          },
          conditions: [['location.city', 'empty']],
          top: '1'
        },
        html_1: {
          type: 'static',
          label: 'Xã/Phường',
          content: '<b>Vui lòng chọn quận/huyện trước</b>',
          size: 'sm',
          columns: {
            lg: {
              container: 4
            }
          },
          conditions: [
            [
              ['location.district', 'empty'],
              ['location.city', 'empty']
            ]
          ],
          top: '1'
        }
      }
    },
    divider_2: {
      type: 'static',
      tag: 'hr'
    },
    classSchedules: {
      type: 'static',
      tag: 'h4',
      content: 'Lịch học'
    },
    schedules: {
      type: 'matrix',
      inputType: {
        type: 'text'
      },
      default: defaultClassRoom.value?.schedules,
      cols: [
        {
          label: 'Thứ',
          value: 'dow',
          inputType: {
            type: 'select',
            search: true,
            placeholder: 'Chọn thứ'
          },
          items: [...dayOfWeeks.value]
        },
        {
          label: 'Bắt đầu',
          value: 'startAt',
          inputType: {
            type: 'text',
            inputType: 'time',
            hour24: true,
            time: true,
            displayFormat: 'kk:mm',
            timeFormat: 'kk:mm',
            format: '24hr',
            use24HourClock: true,
            ampm: false // Disable AM/PM display
          }
        },
        {
          label: 'Kết thúc',
          value: 'endAt',
          inputType: {
            type: 'text',
            inputType: 'time',
            hour24: true,
            displayFormat: 'HH:mm'
          }
        }
      ],
      rows: defaultClassRoom.value?.schedules?.length || 1,
      size: 'md',
      rules: defaultClassRoom.value ? ['min:1'] : ['required'],
      messages: defaultClassRoom.value
        ? {
            min: 'Phải có ít nhất một lịch học'
          }
        : {
            required: 'Vui lòng nhập lịch học'
          },
      fieldName: 'schedules',
      addText: 'Thêm'
    },
    register: {
      type: 'button',
      submits: true,
      buttonLabel: props.classRoom ? 'Cập nhật' : 'Tạo',
      full: true,
      size: 'lg'
    }
  }
}))

defineComponent({ name: 'ClassForm' })
</script>
<template>
  <div class="container mx-auto my-4 h-fit bg-white shadow-lg shadow-gray-200">
    <div class="grid h-full grid-flow-row-dense justify-items-center gap-20 p-4">
      <div class="w-8/12 p-4">
        <Vueform
          v-bind="vueform"
          ref="myForm"
          @submit="async (form$: any, FormData: any) => await handleSubmitForm(form$, FormData)"
          :endpoint="false"
        ></Vueform>
      </div>
    </div>
  </div>
</template>
