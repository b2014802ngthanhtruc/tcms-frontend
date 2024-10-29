import type { ClassStatus, DayOfWeek, PaymentFrequency, ScopeClass, TeachingMode } from '@/enums'
import type { Address } from './address.type'
import type { Student } from './student.type'
import type { Subject } from './subject.type'
import type { Tutor } from './tutor.type'

export type ClassRoom = {
  id: string
  subjectId: string
  tutorId: string

  className: string
  scope: ScopeClass
  level: string
  quantityStudents: number
  tuitionFee: number | null
  paymentFrequency: PaymentFrequency
  request: string
  teachingMode: TeachingMode
  status: ClassStatus
  description: string
  startedAt: Date
  endedAt: Date
  totalDays: number

  createdAt: Date
  createdBy: string | null
  updatedAt: Date | null
  deletedAt: Date | null

  subject: Subject
  location: Address | null
  schedules: Schedule[]
  students: Student[]
  tutor: Tutor
}

export type Schedule = {
  id: string
  classId: string

  dow: DayOfWeek
  time: string
  duration: number

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export type ClassResponse = Omit<ClassRoom, 'students'> & {
  studentOfClasses: Student[]
}
