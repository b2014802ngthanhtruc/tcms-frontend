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
