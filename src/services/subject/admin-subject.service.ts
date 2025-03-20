import type { AxiosInstance } from 'axios'
import { ADMIN_SUBJECT_API, API_URL } from '@/constants/eviroment.constant'
import type { CreateSubjectType, UpdateSubjectType } from '@/types'
import Http from '../api/api.service'

class AdminSubjectService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async create(data: CreateSubjectType) {
    const response = await this.http.post(`${ADMIN_SUBJECT_API}/`, data)
    return response.data
  }

  async update(id: string, data: UpdateSubjectType) {
    const response = await this.http.patch(`${ADMIN_SUBJECT_API}/${id}`, data)
    return response.data
  }

  async delete(id: string) {
    await this.http.delete(`${ADMIN_SUBJECT_API}/${id}`)
  }
}

export default AdminSubjectService
