import { createRouter, createWebHistory } from 'vue-router'
import { AuthRouter } from './auth.router'
import { GeneralRouter } from './general.router'
import { TutorRouter } from './tutor.router'

const routes = [...AuthRouter, ...GeneralRouter, ...TutorRouter]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
