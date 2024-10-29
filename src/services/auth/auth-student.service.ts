import type { AxiosInstance } from 'axios'
import { API_URL, AUTH_STUDENT_API } from '@/constants/eviroment.constant'
import type { ListStudentProfileItem, StudentCompleteRegisterRequest } from '@/types'
import Http from '../api/api.service'

class AuthStudentService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async login(userId: string, studentId: string) {
    const response = (await this.http.post(`${AUTH_STUDENT_API}/login`, { userId, studentId })).data
    return response
  }

  async register(data: StudentCompleteRegisterRequest) {
    const response = (await this.http.post(`${AUTH_STUDENT_API}/register`, data)).data
    return response
  }

  async createProfile(data: StudentCompleteRegisterRequest) {
    const response = (await this.http.post(`${AUTH_STUDENT_API}/create-profile`, data)).data
    return response
  }

  async listProfiles(userId: string): Promise<ListStudentProfileItem[]> {
    const response = (await this.http.get(`${AUTH_STUDENT_API}/${userId}/list-profiles`)).data
    return response
  }
}

export default AuthStudentService
