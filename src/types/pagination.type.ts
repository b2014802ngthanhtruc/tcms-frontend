export type Pagination<T> = {
  next: string | null
  previous: string | null
  count: number
  results: T[]
}
