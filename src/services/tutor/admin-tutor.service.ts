import type { AxiosInstance } from 'axios'
import { ADMIN_TUTOR_API, API_URL } from '@/constants/eviroment.constant'
import type { Pagination } from '@/types'
import type { Tutor } from '@/types/tutor.type'
import Http from '../api/api.service'

class AdminTutorService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async findMany(query: string): Promise<Pagination<Tutor>> {
    const response = await this.http.get(`${ADMIN_TUTOR_API}${query}`)
    return response.data
  }

  async findOne(id: string): Promise<Tutor> {
    const response = await this.http.get(`${ADMIN_TUTOR_API}/${id}`)
    return response.data
  }

  async changeStatus(id: string, status: string) {
    const response = await this.http.patch(`${ADMIN_TUTOR_API}/${id}/change-status`, { status })
    return response.data
  }

  async delete(id: string) {
    await this.http.delete(`${ADMIN_TUTOR_API}/${id}`)
  }
}

export default AdminTutorService
