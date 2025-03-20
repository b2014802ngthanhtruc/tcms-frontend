export type Subject = {
  id: string

  name: string
  description: string

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export type CreateSubjectType = {
  name: string
  description: string
}

export type UpdateSubjectType = Partial<CreateSubjectType>
