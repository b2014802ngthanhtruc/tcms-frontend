import type { AxiosInstance } from 'axios'
import { ADMIN_STUDENT_API, API_URL } from '@/constants/eviroment.constant'
import type { Pagination } from '@/types'
import type { Student } from '@/types/student.type'
import Http from '../api/api.service'

class AdminStudentService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async findMany(query: string): Promise<Pagination<Student>> {
    const response = await this.http.get(`${ADMIN_STUDENT_API}${query}`)
    return response.data
  }

  async getDetail(id: string): Promise<Student> {
    const response = await this.http.get(`${ADMIN_STUDENT_API}/${id}`)
    return response.data
  }

  async changeStatus(id: string, status: string) {
    const response = await this.http.patch(`${ADMIN_STUDENT_API}/${id}/change-status`, { status })
    return response.data
  }

  async delete(id: string) {
    const response = await this.http.delete(`${ADMIN_STUDENT_API}/${id}`)
    return response.data
  }
}

export default AdminStudentService
