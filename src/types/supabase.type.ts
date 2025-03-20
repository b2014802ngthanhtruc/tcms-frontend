export type Profile = {
  id: string
  name: string
  created_at: Date
}

export type CreateProfile = Pick<Profile, 'name'>
