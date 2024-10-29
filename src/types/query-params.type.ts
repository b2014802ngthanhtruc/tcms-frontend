import { FilterBuilder, FilterOperationType, type FilterOrder } from '@chax-at/prisma-filter-common'

export type FilterField = {
  field: string
  type: FilterOperationType
  value: any
}

export type OrderField = {
  field: string
  dir: FilterOrder
}

export type QueryParams = {
  limit?: number
  offset?: number
  filter?: FilterField[]
  order?: OrderField[]
}
