import type { Student } from './student.type'
import type { Tutor } from './tutor.type'

export type UserResponse = {
  id: string
  email: string
  username: string
  isStudent: boolean
  isTutor: boolean
  isAdmin: boolean
  isSubAdmin: boolean
  status: string
  students: Student[]
  tutor: Tutor
}
