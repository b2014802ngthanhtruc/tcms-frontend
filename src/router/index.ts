import { createRouter, createWebHistory } from 'vue-router'
import { GeneralRouter } from './general.router'
import { SupabaseRouter } from './supabase.router'

const routes = [...GeneralRouter, ...SupabaseRouter]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
