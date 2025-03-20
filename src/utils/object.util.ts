export const getUpdatedValues = <T extends Record<string, any>>(obj1: T, obj2: T): Partial<T> => {
  const updatedValues: Partial<T> = {}

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      const value1 = obj1[key]
      const value2 = obj2[key]

      if (Array.isArray(value1) && Array.isArray(value2)) {
        // Nếu là mảng, so sánh từng phần tử
        const arrayDiff = value1.filter(
          (item: any, index: string | number) =>
            JSON.stringify(item) !== JSON.stringify(value2[index])
        )
        if (arrayDiff.length > 0) {
          updatedValues[key] = value2 // Chỉ lấy giá trị mới
        }
      } else if (
        typeof value1 === 'object' &&
        typeof value2 === 'object' &&
        value1 !== null &&
        value2 !== null
      ) {
        // Nếu là object, gọi đệ quy
        const nestedDiff = getUpdatedValues(value1, value2)
        if (Object.keys(nestedDiff).length > 0) {
          updatedValues[key] = nestedDiff as T[typeof key]
        }
      } else if (value1 !== value2) {
        // Nếu khác giá trị, thêm vào updatedValues
        updatedValues[key] = value2
      }
    }
  }

  return updatedValues
}

export const groupByKey = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((acc: Record<string, T[]>, obj: T) => {
    const value = obj[key]
    if (!acc[value]) {
      acc[value] = []
    }
    acc[value].push(obj)
    return acc
  }, {})
}
