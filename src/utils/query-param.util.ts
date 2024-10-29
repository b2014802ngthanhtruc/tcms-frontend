import type { QueryParams } from '@/types'
import { FilterBuilder } from '@chax-at/prisma-filter-common'

export const getQueryParams = (query: QueryParams) => {
  const queryString = FilterBuilder.buildFilterQueryString(query)
  return queryString
}
