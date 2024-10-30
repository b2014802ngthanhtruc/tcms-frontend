import type { AxiosInstance } from 'axios'
import { API_URL, TUTOR_API } from '@/constants/eviroment.constant'
import type { TutorUpdateProfileRequest } from '@/types'
import type { Tutor } from '@/types/tutor.type'
import Http from '../api/api.service'

class TutorService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async getProfile(): Promise<Tutor> {
    const response = (await this.http.get(`${TUTOR_API}/profile`)).data
    return response as Tutor
  }

  async updateProfile(data: TutorUpdateProfileRequest): Promise<Tutor> {
    const response = (await this.http.patch(`${TUTOR_API}/profile`, data)).data
    return response as Tutor
  }
}

export default TutorService
