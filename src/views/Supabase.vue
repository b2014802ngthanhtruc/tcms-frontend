<script setup lang="ts">
import AppButton from '@/components/shared/AppButton.vue'
import { ButtonStatus, ButtonType } from '@/enums'
import SupabaseService from '@/services/supabase/supabase.service'
import { SupabaseClient } from '@supabase/supabase-js'
import axios from 'axios'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import * as yup from 'yup'

const supabaseService = new SupabaseService()
const profile = ref<any[]>([])
const supabaseInstance = ref<SupabaseClient | null>(null)

const UserForm = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Hãy nhập email'),
  password: yup.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').required('Hãy nhập mật khẩu')
  // name: yup.string().required('Hãy nhập tên')
})

const signUp = async (data: any) => {
  const response = await supabaseService.signUp(data.email, data.password)
  console.log('response: ', response)

  // if (!response.error) {
  //   // const createdProfile = await supabaseService.createProfile({ name: data.name })
  //   console.log(createdProfile)
  // }
}

const signIn = async (data: any) => {
  console.log('signIn', data)
  const response = await supabaseService.signIn(data.email, data.password)
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
  <div class="container mx-auto min-h-96">
    <div class="grid grid-flow-col-dense justify-items-center">
      <Form :validation-schema="UserForm" @submit="signIn" class="m-4 rounded-xl bg-blue-100 p-4">
        <div class="grid w-full grid-flow-dense gap-4">
          <label for="email" class="block text-[20px]">Email</label>
          <Field name="email" v-slot="{ field, meta }" :validate-on-input="true" class="w-full">
            <input
              type="email"
              id="email"
              v-bind="field"
              class="w-full rounded-[10px] border-none text-[#2f2e2e]"
            />
            <ErrorMessage name="email" class="text-sm text-red-500" />
          </Field>
        </div>
        <div class="grid w-full grid-flow-row-dense gap-4">
          <label for="password" class="block text-[20px]">Mật khẩu</label>
          <Field name="password" v-slot="{ field, meta }" :validate-on-input="true" class="w-full">
            <input
              v-bind="field"
              type="password"
              id="password"
              class="mt-1 w-full rounded-[10px] border-none"
            />
            <ErrorMessage name="password" class="text-sm text-red-500" />
          </Field>
        </div>
        <!-- <div class="grid w-full grid-flow-row-dense gap-4">
          <label for="name" class="block text-[20px]">Tên</label>
          <Field name="name" v-slot="{ field, meta }" :validate-on-input="true" class="w-full">
            <input
              v-bind="field"
              type="text"
              id="name"
              class="mt-1 w-full rounded-[10px] border-none"
            />
            <ErrorMessage name="name" class="text-sm text-red-500" />
          </Field>
        </div> -->

        <div class="flex w-full items-center justify-between py-8">
          <AppButton :status="ButtonStatus.SUCCESS" :type="ButtonType.FULL_FILL" :content="'Gửi'" />
        </div>
      </Form>
    </div>
    <!-- <div class="grid grid-flow-col-dense">
      <ul class="grid grid-flow-row-dense justify-items-center gap-2" v-if="profile.length > 0">
        <li class="flex flex-auto items-center justify-center" v-for="profile in profile">
          <p><span class="font-bold">Name: </span>{{ profile.name }}</p>
        </li>
      </ul>
      <p v-else>Không có dữ liệu</p>
    </div> -->
  </div>
</template>
