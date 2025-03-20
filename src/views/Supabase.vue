<script setup lang="ts">
import AppButton from '@/components/shared/AppButton.vue'
import { ButtonStatus, ButtonType } from '@/enums'
import SupabaseService from '@/services/supabase/supabase.service'
import { SupabaseClient } from '@supabase/supabase-js'
import axios from 'axios'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import * as yup from 'yup'

const supabaseService = new SupabaseService()
const profile = ref<any[]>([])
const supabaseInstance = ref<SupabaseClient | null>(null)
const accessToken = ref<string | null>(null)
const supabaseResponse = ref<any>(null)
const formattedSupabaseResponse = computed(() =>
  supabaseResponse.value ? JSON.stringify(supabaseResponse.value, null, 2) : ''
)

const UserForm = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
  // name: yup.string().required('Hãy nhập tên')
})

const signUp = async (data: any) => {
  const response = await supabaseService.signUp(data.email, data.password)
  supabaseResponse.value = response
  console.log('response: ', response)

  // if (!response.error) {
  //   // const createdProfile = await supabaseService.createProfile({ name: data.name })
  //   console.log(createdProfile)
  // }
}

const signIn = async (data: any) => {
  console.log('signIn', data)
  const userMetadata = await supabaseService.updateMetadata()
  const response = await supabaseService.signIn(data.email, data.password)
  accessToken.value = response.data.session && response.data.session.access_token

  supabaseResponse.value = userMetadata
  // await axios.post('http://localhost:3000/auth/admin/login', response, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${response.data.session!.access_token}`
  //   }
  // })
  console.log('response', response)
}

// const setupRealtime = () => {
//   if (supabaseInstance.value) {
//     const channel = supabaseInstance.value
//       .channel('category')
//       .on('broadcast', { event: '*' }, (payload) => {
//         console.log('Response:', payload)
//         profile.value.push(payload.payload)
//         console.log('profile', profile.value)
//       })
//       .subscribe()

//     return channel
//   }
//   return null
// }

// onMounted(async () => {
//   if (!supabaseInstance.value) {
//     supabaseInstance.value = await supabaseService.getInstance()
//     setupRealtime()
//   }
// })

watchEffect(() => {
  console.log(profile.value)
})
</script>
<template>
  <div class="container mx-auto my-4 h-fit justify-center overflow-hidden bg-white p-3">
    <div class="flex flex-auto gap-5">
      <Form
        :validation-schema="UserForm"
        class="m-4 max-h-80 w-1/4 rounded-xl border border-gray-400 bg-white p-4 shadow-md shadow-gray-400"
        v-slot="{ handleSubmit }"
      >
        <div class="grid w-full grid-flow-dense gap-2">
          <label for="email" class="block text-base">Email</label>
          <Field name="email" v-slot="{ field, meta }" :validate-on-input="true" class="w-full">
            <input
              type="email"
              id="email"
              v-bind="field"
              class="w-full rounded-md border-none text-[#2f2e2e]"
            />
            <ErrorMessage name="email" class="text-sm text-red-500" />
          </Field>
        </div>
        <div class="mt-2 grid w-full grid-flow-row-dense gap-2">
          <label for="password" class="block text-base">Password</label>
          <Field name="password" v-slot="{ field, meta }" :validate-on-input="true" class="w-full">
            <input
              v-bind="field"
              type="text"
              id="password"
              class="mt-1 w-full rounded-md border-none"
            />
            <ErrorMessage name="password" class="text-sm text-red-500" />
          </Field>
        </div>
        <div class="flex w-full flex-col items-center justify-between gap-3 py-8">
          <button
            class="w-full rounded-md bg-[rgb(11,138,155)] py-2 text-white"
            @click="handleSubmit(signUp)"
            type="button"
          >
            Register
          </button>
          <button
            class="w-full rounded-md bg-[rgb(11,138,155)] py-2 text-white"
            @click="handleSubmit(signIn)"
            type="button"
          >
            Login
          </button>
        </div>
      </Form>
      <div class="m-4 flex w-3/4 flex-col gap-3 rounded-md border border-gray-300 p-4">
        <div class="flex flex-col gap-2">
          <p class="text-base font-semibold">Access token</p>
          <p class="break-all">{{ accessToken }}</p>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-base font-semibold">Response</p>
          <pre
            class="whitespace-pre-wrap break-words rounded-md bg-gray-100 p-2 text-sm text-gray-700"
          >
            {{ formattedSupabaseResponse }}
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>
