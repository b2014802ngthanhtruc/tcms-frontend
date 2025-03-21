import './assets/main.css'
import './assets/tailwind.css'

import { createApp } from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import PrimeVue from 'primevue/config'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import en from '@vueform/vueform/locales/en'
import Vueform from '@vueform/vueform'
import vueformConfig from '../vueform.config'
import { createVfm } from 'vue-final-modal'
import 'vue-final-modal/style.css'

import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import App from './App.vue'
import router from './router'

library.add(fas)
library.add(fab)
const app = createApp(App)

const globalOptions = {
  mode: 'international',
  autoFormat: true
}

const vfm = createVfm()

app.use(Vueform, vueformConfig)
app.use(VueTelInput, globalOptions)
app.use(vfm)

app.use(PrimeVue)

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('VueDatePicker', VueDatePicker)

app.use(Vue3Toastify, {
  autoClose: 3000
} as ToastContainerOptions)

app.use(router)

app.mount('#app')
