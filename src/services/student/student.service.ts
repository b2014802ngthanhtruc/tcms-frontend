import type { AxiosInstance } from 'axios'
import { API_URL, STUDENT_API } from '@/constants/eviroment.constant'
import Http from '../api/api.service'

class StudentService {
  private http: AxiosInstance

  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async getProfile() {
    return (await this.http.get(`${STUDENT_API}/profile`)).data
  }
}

export default StudentService
