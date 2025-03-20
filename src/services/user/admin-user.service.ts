import type { AxiosInstance } from 'axios'
import { ADMIN_USER_API, API_URL } from '@/constants/eviroment.constant'
import type { Pagination, UserResponse } from '@/types'
import Http from '../api/api.service'

class AdminUserService {
  private http: AxiosInstance

  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async findMany(query: string): Promise<Pagination<UserResponse>> {
    const response = await this.http.get(`${ADMIN_USER_API}${query}`)
    return response.data
  }

  async getDetail(id: string): Promise<UserResponse> {
    const response = await this.http.get(`${ADMIN_USER_API}/${id}`)
    return response.data
  }

  async changeStatus(id: string, status: string) {
    const response = await this.http.patch(`${ADMIN_USER_API}/${id}/change-status`, { status })
    return response.data
  }

  async deleteUser(id: string) {
    await this.http.delete(`${ADMIN_USER_API}/${id}`)
  }
}

export default AdminUserService
