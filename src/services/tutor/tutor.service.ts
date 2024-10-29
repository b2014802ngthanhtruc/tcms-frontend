import type { AxiosInstance } from 'axios'
import { API_URL, TUTOR_API } from '@/constants/eviroment.constant'
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
}

export default TutorService
