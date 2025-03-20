import { FileExtension } from '@/enums'

export const FILEICONMAP: Record<string, string> = {
  [FileExtension.DOC]: 'doc.png',
  [FileExtension.DOCX]: 'doc.png',
  [FileExtension.PDF]: 'pdf.png',
  [FileExtension.XLS]: 'xls.png',
  [FileExtension.XLSX]: 'xls.png',
  [FileExtension.PPT]: 'ppt.png',
  [FileExtension.PPTX]: 'ppt.png'
}
