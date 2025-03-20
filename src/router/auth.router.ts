export const AuthRouter = [
  {
    path: '/auth/general/register',
    name: 'user-register',
    component: () => import('@/views/RegisterView.vue')
  },
  {
    path: '/auth/general/student-create-profile',
    name: 'student-create-profile',
    component: () => import('@/views/CreateStudentProfile.vue')
  },
  {
    path: '/auth/general/tutor-create-profile',
    name: 'tutor-create-profile',
    component: () => import('@/views/TutorCreateProfile.vue')
  },
  {
    path: '/auth/admin',
    name: 'admin-auth',
    component: () => import('@/views/AdminAuth.vue')
  }
]
