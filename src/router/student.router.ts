import type { RouteLocationNormalized } from 'vue-router'

export const StudentRouter = [
  {
    path: '/student/start-learning/:id',
    name: 'start-learning',
    component: () => import('../views/StartLearning.vue'),
    props: true
  },
  {
    path: '/student/profile',
    name: 'student-profile',
    component: () => import('../views/StudentProfile.vue')
  }
]

export const StudentManagerRouter = [
  {
    path: '/student/manager/classes',
    name: 'student-manager',
    component: () => import('../views/StudentManagerClasses.vue')
  },
  {
    path: '/student/manager/classroom',
    name: 'student-manager-create-class',
    component: () => import('../views/StudentCreateClass.vue')
  },
  {
    path: '/student/manager/classroom/:id/update',
    name: 'student-manager-update-class',
    component: () => import('../views/StudentUpdateClass.vue'),
    props: true
  },
  {
    path: '/student/manager/classroom/:id',
    name: 'student-manager-one-classroom',
    component: () => import('../views/StudentManagerOneClass.vue'),
    props: (route: RouteLocationNormalized) => ({
      id: route.params.id,
      menuIndex: route.query.menuIndex || '1' // Cung cấp giá trị mặc định nếu cần
    })
  }
]
