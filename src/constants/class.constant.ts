import {
  ClassLevel,
  ClassSession,
  ClassStatus,
  DayOfWeek,
  Grade,
  PaymentFrequency,
  ScopeClass
} from '@/enums'

export const GRADEMAP: Record<string, string> = {
  [ClassLevel.CLASS_1]: Grade.PRIMARYSCHOOL,
  [ClassLevel.CLASS_2]: Grade.PRIMARYSCHOOL,
  [ClassLevel.CLASS_3]: Grade.PRIMARYSCHOOL,
  [ClassLevel.CLASS_4]: Grade.PRIMARYSCHOOL,
  [ClassLevel.CLASS_5]: Grade.PRIMARYSCHOOL,
  [ClassLevel.CLASS_6]: Grade.JUNIORHIGHSCHOOL,
  [ClassLevel.CLASS_7]: Grade.JUNIORHIGHSCHOOL,
  [ClassLevel.CLASS_8]: Grade.JUNIORHIGHSCHOOL,
  [ClassLevel.CLASS_9]: Grade.JUNIORHIGHSCHOOL,
  [ClassLevel.CLASS_10]: Grade.HIGHSCHOOL,
  [ClassLevel.CLASS_11]: Grade.HIGHSCHOOL,
  [ClassLevel.CLASS_12]: Grade.HIGHSCHOOL
}

export const SCOPEMAP: Record<string, string> = {
  [ScopeClass.SMALL]: 'Nhỏ',
  [ScopeClass.MEDIUM]: 'Trung bình',
  [ScopeClass.LARGE]: 'Lớn'
}

export const PAYMENTFREQUENCYMAP: Record<string, string> = {
  [PaymentFrequency.DAILY]: 'Hàng buổi',
  [PaymentFrequency.WEEKLY]: 'Hàng tuần',
  [PaymentFrequency.MONTHLY]: 'Hàng tháng',
  [PaymentFrequency.NEGOTIAL]: 'Thương lượng'
}

export const CLASSSTATUSMAP: Record<string, string> = {
  [ClassStatus.NEW]: 'Mới',
  [ClassStatus.PENDING]: 'Chờ duyệt',
  [ClassStatus.STARTED]: 'Đã bắt đầu',
  [ClassStatus.CANCELED]: 'Bị hủy',
  [ClassStatus.PAUSED]: 'Tạm ngưng',
  [ClassStatus.ENDED]: 'Kết thúc'
}

export const CLASSLEVELMAP: Record<string, string> = {
  [ClassLevel.CLASS_1]: 'Lớp 1',
  [ClassLevel.CLASS_2]: 'Lớp 2',
  [ClassLevel.CLASS_3]: 'Lớp 3',
  [ClassLevel.CLASS_4]: 'Lớp 4',
  [ClassLevel.CLASS_5]: 'Lớp 5',
  [ClassLevel.CLASS_6]: 'Lớp 6',
  [ClassLevel.CLASS_7]: 'Lớp 7',
  [ClassLevel.CLASS_8]: 'Lớp 8',
  [ClassLevel.CLASS_9]: 'Lớp 9',
  [ClassLevel.CLASS_10]: 'Lớp 10',
  [ClassLevel.CLASS_11]: 'Lớp 11',
  [ClassLevel.CLASS_12]: 'Lớp 12',
  [ClassLevel.FRESHSCHOOL]: 'Mẫu giáo'
}

export const SESSIONMAP: Record<string, string> = {
  [ClassSession.MORNING]: 'Buổi sáng',
  [ClassSession.AFTERNOON]: 'Buổi chiều',
  [ClassSession.EVENING]: 'Buổi tối'
}

export const DAYOFWEEKMAP: Record<string, string> = {
  [DayOfWeek.MONDAY]: 'Thứ hai',
  [DayOfWeek.TUESDAY]: 'Thứ ba',
  [DayOfWeek.WEDNESDAY]: 'Thứ tư',
  [DayOfWeek.THURSDAY]: 'Thứ năm',
  [DayOfWeek.FRIDAY]: 'Thứ sáu',
  [DayOfWeek.SATURDAY]: 'Thứ bảy',
  [DayOfWeek.SUNDAY]: 'Chủ nhật'
}
