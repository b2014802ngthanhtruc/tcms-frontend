import type { AxiosInstance } from 'axios'
import { API_URL, AUTH_ADMIN_API } from '@/constants/eviroment.constant'
import type { AdminProfile } from '@/types'
import Http from '../api/api.service'

class AuthAdminService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async login(email: string, password: string) {
    const response = (await this.http.post(`${AUTH_ADMIN_API}/login`, { email, password })).data
    return response
  }

  async refreshToken(refreshToken: string) {
    const response = (await this.http.post(`${AUTH_ADMIN_API}/refresh-token`, { refreshToken }))
      .data
    return response
  }

  async getProfile(): Promise<AdminProfile> {
    const response = await this.http.get(`${AUTH_ADMIN_API}/profile`)
    return response.data
  }
}

export default AuthAdminService
