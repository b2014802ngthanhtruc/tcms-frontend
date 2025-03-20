export const toNormalize = (str: string): string => {
  return str.replace(/-/g, ' ')
}

export const toCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value)
}

export const toFormatNumber = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value)
}

export const toFormatTime = (time: string): string => {
  const [hours, minutes] = time.split(':') // Tách chuỗi thành mảng
  return `${hours}:${minutes}` // Ghép lại với định dạng hh:mm
}
