import type { ClassStatus, DayOfWeek, PaymentFrequency, ScopeClass, TeachingMode } from '@/enums'
import type { Address } from './address.type'
import type { Student } from './student.type'
import type { Subject } from './subject.type'
import type { Tutor } from './tutor.type'

export type ClassRoom = {
  id: string
  subjectId: string
  tutorId: string | null

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

  documents: ClassDocument[]
  subject: Subject
  location: Address | null
  schedules: Schedule[]
  students: Student[]
  notification: ClassNotification[]
  tutor: Tutor
}

export type Schedule = {
  id: string
  classId: string

  dow: DayOfWeek
  session: string
  startAt: string
  endAt: string
  duration: number

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export type ClassNotification = {
  id: string
  classId: string

  title: string
  content: string

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export type ClassDocument = {
  id: string
  classId: string

  name: string
  docUrl: string

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export type AddClassDocument = {
  name: string
  docUrl: string
}

export type ClassResponse = Omit<ClassRoom, 'students'> & {
  studentOfClasses: Student[]
}

export type CreateClassRoom = Omit<
  ClassRoom,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'tutor'
  | 'students'
  | 'subject'
  | 'totalDays'
  | 'status'
>

export type UpdateClassRoom = Partial<CreateClassRoom>

export type CreateClassNotification = Pick<ClassNotification, 'title' | 'content'>

export type UpdateClassNotification = Partial<CreateClassNotification>
