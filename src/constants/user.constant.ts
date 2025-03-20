import { Status } from '@/enums'

export const DEFAULT_AVATAR =
  'https://fly.storage.tigris.dev/floral-smoke-5484/1730143483064default-user.png'

export const USERSTATUSMAP: Record<string, string> = {
  [Status.PENDING]: 'Đang chờ',
  [Status.ACTIVE]: 'Hoạt động',
  [Status.BLOCKED]: 'Bị khoá',
  [Status.DELETED]: 'Đã xóa'
}
