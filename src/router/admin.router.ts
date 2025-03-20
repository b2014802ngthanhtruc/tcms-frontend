export const AdminRouter = [
  {
    path: '/admin/manager/dashboard',
    name: 'admin-manager-dashboard',
    component: () => import('../views/AdminManager.vue')
  },
  {
    path: '/admin/manager/subjects',
    name: 'admin-manager-subjects',
    component: () => import('../views/AdminManagerSubject.vue')
  },
  {
    path: '/admin/manager/users',
    name: 'admin-manager-users',
    component: () => import('../views/AdminManagerUser.vue')
  },
  {
    path: '/admin/manager/users/:id',
    name: 'admin-manager-user-detail',
    component: () => import('../views/AdminManagerUserDetail.vue'),
    props: true
  },
  {
    path: '/admin/manager/tutors/:id',
    name: 'admin-manager-tutor-detail',
    component: () => import('../views/AdminManagerTutorDetail.vue'),
    props: true
  },
  {
    path: '/admin/manager/students/:id',
    name: 'admin-manager-student-detail',
    component: () => import('../views/AdminManagerStudent.vue'),
    props: true
  },
  {
    path: '/admin/manager/classrooms',
    name: 'admin-manager-classrooms',
    component: () => import('../views/AdminManagerClassrooms.vue')
  },
  {
    path: '/admin/manager/classrooms/:id',
    name: 'admin-manager-classroom-detail',
    component: () => import('../views/AdminManagerClassroomDetail.vue'),
    props: true
  },
  {
    path: '/admin/manager/classrooms/create',
    name: 'admin-manager-create-class',
    component: () => import('../views/AdminCreateClassroom.vue')
  },
  {
    path: '/admin/manager/classrooms/:id/update',
    name: 'admin-manager-update-class',
    component: () => import('../views/AdminUpdateClassroom.vue'),
    props: true
  }
]
