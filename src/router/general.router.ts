import HomeView from '@/views/HomeView.vue'

export const GeneralRouter = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('../views/Welcome.vue')
  },
  {
    path: '/classrooms',
    name: 'classrooms',
    component: () => import('../views/ClassesView.vue')
  },
  {
    path: '/classroom/:id',
    name: 'classroom-detail',
    component: () => import('../views/ClassDetail.vue'),
    props: true
  },
  {
    path: '/tutors',
    name: 'tutors',
    component: () => import('../views/TutorView.vue')
  }
]
