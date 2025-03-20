import type { AxiosInstance } from 'axios'
import { ADMIN_CLASSROOM_API, API_URL } from '@/constants/eviroment.constant'
import type {
  AddClassDocument,
  ClassNotification,
  ClassResponse,
  CreateClassNotification,
  CreateClassRoom,
  Pagination,
  UpdateClassNotification,
  UpdateClassRoom
} from '@/types'
import Http from '../api/api.service'

class AdminClassroomService {
  private http: AxiosInstance

  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async findAll(query: string): Promise<Pagination<ClassResponse>> {
    const response = await this.http.get(`${ADMIN_CLASSROOM_API}${query}`)
    return response.data
  }

  async create(data: CreateClassRoom) {
    const response = await this.http.post(`${ADMIN_CLASSROOM_API}/`, data)
    return response.data
  }

  async update(id: string, data: UpdateClassRoom) {
    const response = await this.http.patch(`${ADMIN_CLASSROOM_API}/${id}`, data)
    return response.data
  }

  async changeStatus(id: string, status: string) {
    const response = await this.http.patch(`${ADMIN_CLASSROOM_API}/${id}/change-status`, { status })
    return response.data
  }

  async delete(id: string) {
    const response = await this.http.delete(`${ADMIN_CLASSROOM_API}/${id}`)
    return response.data
  }

  async getNotification(id: string): Promise<ClassNotification[]> {
    const response = await this.http.get(`${ADMIN_CLASSROOM_API}/${id}/notifications`)
    return response.data
  }

  async addNotification(id: string, data: CreateClassNotification) {
    const response = await this.http.post(`${ADMIN_CLASSROOM_API}/${id}/notifications`, data)
    return response.data
  }

  async updateNotification(id: string, notificationId: string, data: UpdateClassNotification) {
    const response = await this.http.patch(
      `${ADMIN_CLASSROOM_API}/${id}/notifications/${notificationId}`,
      data
    )
    return response.data
  }

  async deleteNotification(id: string, notificationId: string) {
    const response = await this.http.delete(
      `${ADMIN_CLASSROOM_API}/${id}/notifications/${notificationId}`
    )
    return response.data
  }

  async getDocuments(id: string) {
    const response = await this.http.get(`${ADMIN_CLASSROOM_API}/${id}/documents`)
    return response.data
  }

  async addDocument(id: string, data: AddClassDocument) {
    const response = await this.http.post(`${ADMIN_CLASSROOM_API}/${id}/documents`, data)
    return response.data
  }

  async deleteDocument(id: string, documentId: string) {
    const response = await this.http.delete(`${ADMIN_CLASSROOM_API}/${id}/documents/${documentId}`)
    return response.data
  }
}

export default AdminClassroomService
