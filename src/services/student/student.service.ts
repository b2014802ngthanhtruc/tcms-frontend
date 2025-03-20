import type { AxiosInstance } from 'axios'
import { API_URL, STUDENT_API } from '@/constants/eviroment.constant'
import type { StudentUpdateProfileRequest } from '@/types'
import Http from '../api/api.service'

class StudentService {
  private http: AxiosInstance

  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async getProfile() {
    return (await this.http.get(`${STUDENT_API}/profile`)).data
  }

  async updateProfile(data: StudentUpdateProfileRequest) {
    return (await this.http.patch(`${STUDENT_API}/profile`, data)).data
  }
}

export default StudentService
