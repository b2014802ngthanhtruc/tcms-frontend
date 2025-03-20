export const getFileNameAndExtension = (
  file: File
): { fileName: string; fileType: string; extension: string } => {
  const fullName = file.name // Lấy tên đầy đủ của file
  const dotIndex = fullName.lastIndexOf('.') // Tìm vị trí của dấu chấm cuối cùng
  const fileName = dotIndex !== -1 ? fullName.substring(0, dotIndex) : fullName // Lấy phần tên file trước dấu chấm
  const extension = dotIndex !== -1 ? fullName.substring(dotIndex + 1) : '' // Lấy phần extension sau dấu chấm
  const fileType = file.type // Lấy loại file (MIME type)

  return {
    fileName,
    fileType,
    extension
  }
}

export const getFileNameAndExtensionFromName = (
  name: string
): { fileName: string; extension: string } => {
  const dotIndex = name.lastIndexOf('.') // Tìm vị trí của dấu chấm cuối cùng
  const fileName = dotIndex !== -1 ? name.substring(0, dotIndex) : name // Lý tên file trước dấu chấm
  const extension = dotIndex !== -1 ? name.substring(dotIndex + 1) : '' // Lý tên extension sau dấu chấm
  return {
    fileName,
    extension
  }
}
