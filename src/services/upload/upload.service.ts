import type { AxiosInstance } from 'axios'
import { API_URL, UPLOAD_API } from '@/constants/eviroment.constant'
import type { UploadType } from '@/types'
import Http from '../api/api.service'

class UploadService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async presignUrl(key: string, type: string): Promise<UploadType> {
    return (await this.http.post(`${UPLOAD_API}/presigned-url`, { key, type })).data
  }

  async uploadFile(url: string, file: File) {
    const uploadHttp = new Http(url).getInstance()
    const headers = {
      'Content-Type': file.type // Đảm bảo header này được cấu hình
    }
    return await uploadHttp.put('', file, { headers })
  }
}
export default UploadService
