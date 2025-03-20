import type { AxiosInstance } from 'axios'
import { API_URL, AUTH_GENERAL_API } from '@/constants/eviroment.constant'
import type { ChangePasswordRequest, GetStartedResponse } from '@/types'
import Http from '../api/api.service'

class AuthGeneralService {
  private http: AxiosInstance

  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async login(email: string, password: string) {
    const response = (await this.http.post(`${AUTH_GENERAL_API}/login`, { email, password })).data
    return response
  }

  async register(email: string, password: string) {
    const response = (await this.http.post(`${AUTH_GENERAL_API}/register`, { email, password }))
      .data
    return response
  }

  async verifyEmail(id: string, code: string) {
    const response = (await this.http.post(`${AUTH_GENERAL_API}/verify-email`, { id, code })).data
    return response
  }

  async getStarted(email: string): Promise<GetStartedResponse> {
    const response = (await this.http.post(`${AUTH_GENERAL_API}/get-started`, { email })).data
    return response
  }

  async resendCode(id: string) {
    const response = (await this.http.post(`${AUTH_GENERAL_API}/resend-code`, { id })).data
    return response
  }

  async forgotPassword(email: string) {
    const response = (await this.http.post(`${AUTH_GENERAL_API}/forgot-password`, { email })).data
    return response
  }

  async resetPassword(email: string, code: string, password: string) {
    const response = (
      await this.http.post(`${AUTH_GENERAL_API}/reset-password`, { email, code, password })
    ).data
    return response
  }

  async changePassword(data: ChangePasswordRequest) {
    await this.http.post(`${AUTH_GENERAL_API}/change-password`, data)
  }
}

export default AuthGeneralService
