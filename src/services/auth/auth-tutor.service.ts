import type { AxiosInstance } from 'axios'
import { API_URL, AUTH_TUTOR_API } from '@/constants/eviroment.constant'
import type { TutorCompleteRegisterRequest } from '@/types'
import Http from '../api/api.service'

class AuthTutorService {
  private http: AxiosInstance

  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async login(userId: string) {
    const response = (await this.http.post(`${AUTH_TUTOR_API}/login`, { userId })).data
    return response
  }

  async register(data: TutorCompleteRegisterRequest) {
    const response = (await this.http.post(`${AUTH_TUTOR_API}/register`, data)).data
    return response
  }
}

export default AuthTutorService
