import type { ClassLevel, ClassSession, DayOfWeek, Gender, Grade } from '@/enums'
import type { Address } from './address.type'
import type { ClassRoom } from './class.type'
import type { Subject } from './subject.type'

export type Tutor = {
  id: string
  userId: string
  addressId: string

  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  dob: Date
  gender: Gender
  avatar: string | null

  identificationId: string
  identificationImageFront: string | null
  identificationImageBack: string | null
  expectSalary: number

  description: string
  status: string

  address: Address
  educationalQualification: EducationalQuantity
  classes: ClassRoom[]
  areaExpects: AreExpect[]
  jobReferences: JobReference[]
  timeExpects: TimeExpect[]

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export type EducationalQuantity = {
  id: string
  tutorId: string

  degree: string
  major: string
  university: string
  startYear: string
  endYear: string
  certificateUrl: string

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export type AreExpect = {
  id: string
  tutorId: string

  city: string
  districts: string[]

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export type JobReference = {
  id: string
  tutorId: string

  grade: string
  class: string
  description: string | null | undefined

  subjects: Subject[]

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export type TimeExpect = {
  id: string
  tutorId: string

  sessions: string[]
  dow: string

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export type ListTutorResponse = {
  id: string
  fullName: string
  gender: Gender
  dob: Date
  expectSalary: number
  degree: string
  major: string
  university: string
}
