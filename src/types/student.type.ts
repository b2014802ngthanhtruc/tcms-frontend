import type { ClassLevel, Gender, Grade } from '@/enums'
import type { Address } from './address.type'

export type Student = {
  id: string
  userId: string
  addressId: string | null

  firstName: string
  lastName: string
  fullName: string
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

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}
