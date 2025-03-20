import type { AxiosInstance } from 'axios'
import { API_URL, GENERAL_SUBJECT_API } from '@/constants/eviroment.constant'
import type { Pagination, Subject } from '@/types'
import Http from '../api/api.service'

class SubjectService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async findAll(query: string): Promise<Pagination<Subject>> {
    return (await this.http.get(`${GENERAL_SUBJECT_API}${query}`)).data
  }
}

export default SubjectService
