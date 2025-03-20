import type { RouteLocationNormalized } from 'vue-router'
export const TutorRouter = [
  {
    path: '/tutor/profile',
    name: 'tutor-profile',
    component: () => import('../views/TutorProfile.vue')
  },
  {
    path: '/tutor/accept-classroom',
    name: 'accept-classroom',
    component: () => import('../views/TutorAcceptClass.vue'),
    props: (route: RouteLocationNormalized) => ({
      classToken: route.query.classId,
      tutorToken: route.query.tutorId
    })
  }
]

export const TutorManagerRouter = [
  {
    path: '/tutor/manager/classes',
    name: 'tutor-manager',
    component: () => import('../views/TutorManagerClasses.vue')
  },
  {
    path: '/tutor/manager/classroom',
    name: 'tutor-manager-create-class',
    component: () => import('../views/TutorCreateClass.vue')
  },
  {
    path: '/tutor/manager/classroom/:id',
    name: 'tutor-manager-one-classroom',
    component: () => import('../views/TutorManagerOneClassroom.vue'),
    props: (route: RouteLocationNormalized) => ({
      id: route.params.id,
      menuIndex: route.query.menuIndex || '1' // Cung cấp giá trị mặc định nếu cần
    })
  },
  {
    path: '/tutor/manager/classroom/:id/update',
    name: 'tutor-manager-update-class',
    component: () => import('../views/TutorUpdateClass.vue'),
    props: true
  },
  {
    path: '/tutor/manager/classroom/:classId/students/:studentId',
    name: 'tutor-manager-class-detail-student',
    component: () => import('../views/TutorStudentDetailManager.vue'),
    props: true
  }
]
