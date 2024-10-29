import type { AxiosInstance } from 'axios'
import { API_URL, GENERAL_CLASSROOM_API } from '@/constants/eviroment.constant'
import type { ClassResponse, ClassRoom, Pagination } from '@/types'
import Http from '../api/api.service'

class GeneralClassroomService {
  private http: AxiosInstance

  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async findMany(query: string): Promise<Pagination<ClassRoom>> {
    const response = (await this.http.get(`${GENERAL_CLASSROOM_API}${query}`)).data
    return response
  }

  async findOne(id: string): Promise<ClassResponse> {
    const response = (await this.http.get(`${GENERAL_CLASSROOM_API}/${id}`)).data
    return response as ClassResponse
  }
}

export default GeneralClassroomService
