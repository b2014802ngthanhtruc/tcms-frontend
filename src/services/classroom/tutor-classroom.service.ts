import type { AxiosInstance } from 'axios'
import { API_URL, TUTOR_CLASSROOM_API } from '@/constants/eviroment.constant'
import type {
  AddClassDocument,
  ClassDocument,
  ClassNotification,
  ClassResponse,
  CreateClassNotification,
  CreateClassRoom,
  UpdateClassNotification,
  UpdateClassRoom
} from '@/types'
import type { Student } from '@/types/student.type'
import Http from '../api/api.service'

class TutorClassroomService {
  private http: AxiosInstance

  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async enroll(classId: string): Promise<void> {
    await this.http.patch(`${TUTOR_CLASSROOM_API}/${classId}/enroll`)
  }

  async getClassroomByToken(classToken: string, tutorToken: string): Promise<ClassResponse> {
    const response = (
      await this.http.post(`${TUTOR_CLASSROOM_API}/get-by-token`, { classToken, tutorToken })
    ).data
    return response as ClassResponse
  }

  async acceptClassroom(classToken: string, tutorToken: string): Promise<void> {
    await this.http.post(`${TUTOR_CLASSROOM_API}/accept-class`, { classToken, tutorToken })
  }

  async createClass(data: CreateClassRoom): Promise<ClassResponse> {
    const response = await this.http.post(`${TUTOR_CLASSROOM_API}/`, data)
    return response.data
  }

  async updateClass(id: string, data: UpdateClassRoom): Promise<ClassResponse> {
    const response = await this.http.patch(`${TUTOR_CLASSROOM_API}/${id}`, data)
    return response.data
  }

  async getNotification(id: string): Promise<ClassNotification[]> {
    const response = await this.http.get(`${TUTOR_CLASSROOM_API}/${id}/notifications`)
    return response.data
  }

  async createClassNotification(classId: string, data: CreateClassNotification): Promise<void> {
    await this.http.post(`${TUTOR_CLASSROOM_API}/${classId}/notifications`, data)
  }

  async updateClassNotification(
    classId: string,
    id: string,
    data: UpdateClassNotification
  ): Promise<void> {
    await this.http.patch(`${TUTOR_CLASSROOM_API}/${classId}/notifications/${id}`, data)
  }

  async deleteClassNotification(classId: string, id: string): Promise<void> {
    await this.http.delete(`${TUTOR_CLASSROOM_API}/${classId}/notifications/${id}`)
  }

  async getStudents(classId: string, studentId: string): Promise<Student> {
    const response = await this.http.get(`${TUTOR_CLASSROOM_API}/${classId}/students/${studentId}`)
    return response.data
  }

  async getDocuments(id: string): Promise<ClassDocument[]> {
    const response = await this.http.get(`${TUTOR_CLASSROOM_API}/${id}/documents`)
    return response.data
  }

  async addDocument(id: string, data: AddClassDocument) {
    const response = await this.http.post(`${TUTOR_CLASSROOM_API}/${id}/documents`, data)
    return response.data
  }

  async deleteDocument(id: string, documentId: string) {
    const response = await this.http.delete(`${TUTOR_CLASSROOM_API}/${id}/documents/${documentId}`)
    return response.data
  }
}

export default TutorClassroomService
