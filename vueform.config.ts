// You might place these anywhere else in your project
import '@vueform/vueform/dist/vueform.css'

import { defineConfig } from '@vueform/vueform'
import vueform from '@vueform/vueform/dist/vueform'
import en from '@vueform/vueform/locales/en'

export default defineConfig({
  theme: vueform,
  locales: { en },
  locale: 'en',
  endpoints: undefined
})
