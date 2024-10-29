export type Address = {
  id: string

  lat: number
  lng: number
  fullAddress: string
  address: string
  ward: string
  district: string
  city: string
  country: string

  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
}

export type Ward = {
  id: string
  districtId: string
  name: string
}

export type District = {
  id: string
  cityId: string
  name: string
  wards: Ward[]
}

export type CityResponse = {
  id: string
  name: string
  districts: District[]
}
