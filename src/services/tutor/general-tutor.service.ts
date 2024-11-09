import type { AxiosInstance } from 'axios'
import { API_URL, GENERAL_TUTOR_API } from '@/constants/eviroment.constant'
import type { Pagination, TutorUpdateProfileRequest } from '@/types'
import type { ListTutorResponse, Tutor } from '@/types/tutor.type'
import Http from '../api/api.service'

class GeneralTutorService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async findMany(query: string): Promise<Pagination<ListTutorResponse>> {
    const response = (await this.http.get(`${GENERAL_TUTOR_API}${query}`)).data
    return response
  }

  async getDetail(id: string): Promise<Tutor> {
    const response = (await this.http.get(`${GENERAL_TUTOR_API}/${id}`)).data
    return response
  }
}

export default GeneralTutorService
