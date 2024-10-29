import type { Address } from './address.type'
import type { Student } from './student.type'
import type { AreExpect, EducationalQuantity, JobReference, TimeExpect, Tutor } from './tutor.type'

export type AuthResponse = {
  accessToken: string
  refreshToken: string
  accessExp: number
  refreshExp: number
}

export type UserLogin = {
  id: string
  userId: string
  isTutor: boolean
  isStudent: boolean
}

export type RegisterResponse = {
  userId: string
}

export type RegisterRequest = {
  email: string
  password: string
}

export type VerifyEmailRequest = {
  id: string
  code: string
}

export type GetStartedResponse = {
  id: string
  email: string
  isRegistered: boolean
  isCompleteSignup: boolean
  isVerifiedEmail: boolean
}

export type TutorCompleteRegisterRequest = Pick<
  Tutor,
  | 'userId'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'description'
  | 'dob'
  | 'gender'
  | 'identificationId'
  | 'expectSalary'
> & {
  address: Pick<Address, 'address' | 'city' | 'country' | 'ward' | 'district'>
  jobReference: (Pick<JobReference, 'class' | 'grade' | 'description'> & { subjects: string[] })[]
  areaExpect: Pick<AreExpect, 'city' | 'district'>[]
  educationalQualification: Pick<
    EducationalQuantity,
    'degree' | 'major' | 'university' | 'startYear' | 'endYear' | 'certificateUrl'
  >
  timeExpect: Pick<TimeExpect, 'time' | 'dow'>[]
}

export type ListStudentProfileItem = {
  id: string
  fullName: string
  gender: string
  class: string
  grade: string
}

export type StudentCompleteRegisterRequest = Pick<
  Student,
  | 'userId'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'dob'
  | 'gender'
  | 'class'
  | 'grade'
  | 'address'
  | 'parentName'
  | 'descrition'
>

export type ChooseProfileResponse = {
  id: string
  isVerifiedEmail: boolean
  isCompleteSignup: boolean

  students: Pick<Student, 'id' | 'fullName'>[]
  tutor: Pick<Tutor, 'id' | 'fullName'>
}

export type ResetPasswordRequest = {
  code: string
  password: string
}
