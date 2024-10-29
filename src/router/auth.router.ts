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
  }
]
