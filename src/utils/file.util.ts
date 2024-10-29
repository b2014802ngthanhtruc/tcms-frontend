export const getFileNameAndExtension = (file: File): { fileName: string; fileType: string } => {
  const fullName = file.name // Lấy tên đầy đủ của file
  const dotIndex = fullName.lastIndexOf('.') // Tìm vị trí của dấu chấm cuối cùng
  const fileName = dotIndex !== -1 ? fullName.substring(0, dotIndex) : fullName // Lấy phần tên file trước dấu chấm
  const fileType = file.type // Lấy loại file (MIME type)

  return {
    fileName,
    fileType
  }
}
