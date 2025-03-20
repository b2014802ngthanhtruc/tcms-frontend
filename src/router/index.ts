import { createRouter, createWebHistory } from 'vue-router'
import { AdminRouter } from './admin.router'
import { AuthRouter } from './auth.router'
import { GeneralRouter } from './general.router'
import { StudentManagerRouter, StudentRouter } from './student.router'
import { SupabaseRouter } from './supabase.router'
import { TutorManagerRouter, TutorRouter } from './tutor.router'

const routes = [
  ...AuthRouter,
  ...GeneralRouter,
  ...TutorRouter,
  ...StudentRouter,
  ...TutorManagerRouter,
  ...StudentManagerRouter,
  ...AdminRouter,
  ...SupabaseRouter
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
