import type { AxiosInstance } from 'axios'
import { API_URL, TUTOR_CLASSROOM_API } from '@/constants/eviroment.constant'
import Http from '../api/api.service'

class TutorClassroomService {
  private http: AxiosInstance

  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async enroll(classId: string): Promise<void> {
    await this.http.patch(`${TUTOR_CLASSROOM_API}/${classId}/enroll`)
  }
}

export default TutorClassroomService
