export type UserDashboardType = {
  totalStudents: number
  totalTutors: number
  totalSubAdmin: number
}

export type ClassDashboardType = {
  totalClassrooms: number
  totalClassOfNew: number
  totalClassOfPending: number
  totalClassOfStarted: number
  totalClassOfPaused: number
  totalClassOfCanceled: number
  totalClassOfFinished: number
}

export type SubjectDashboardType = {
  id: string
  name: string
  totalClasses: number
}
