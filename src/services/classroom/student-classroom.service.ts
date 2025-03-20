import type { AxiosInstance } from 'axios'
import { API_URL, STUDENT_CLASSROOM_API } from '@/constants/eviroment.constant'
import type { ClassNotification, ClassResponse, CreateClassRoom, UpdateClassRoom } from '@/types'
import Http from '../api/api.service'

class StudentClassroomService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async enroll(classId: string): Promise<void> {
    await this.http.patch(`${STUDENT_CLASSROOM_API}/${classId}/enroll`)
  }

  async startWithTutor(data: CreateClassRoom): Promise<void> {
    await this.http.post(`${STUDENT_CLASSROOM_API}/`, data)
  }

  async createClassromm(data: CreateClassRoom): Promise<ClassResponse> {
    return (await this.http.post(`${STUDENT_CLASSROOM_API}/`, data)).data
  }

  async updateClassroom(id: string, data: UpdateClassRoom): Promise<ClassResponse> {
    return (await this.http.patch(`${STUDENT_CLASSROOM_API}/${id}`, data)).data
  }

  async getNotification(id: string): Promise<ClassNotification[]> {
    const response = await this.http.get(`${STUDENT_CLASSROOM_API}/${id}/notifications`)
    return response.data
  }

  async getDocuments(id: string) {
    const response = await this.http.get(`${STUDENT_CLASSROOM_API}/${id}/documents`)
    return response.data
  }
}

export default StudentClassroomService
