import type { ClassLevel, Gender, Grade } from '@/enums'
import type { Address } from './address.type'
import type { ClassRoom } from './class.type'

export type Student = {
  id: string
  userId: string
  addressId: string | null

  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  avatar: string | null
  parentName: string | null
  dob: Date
  gender: Gender
  grade: string
  class: ClassLevel
  descrition: string
  status: string

  address: Address
  studentOfClasses: ClassRoom[]

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}
