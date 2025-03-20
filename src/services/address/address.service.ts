import type { AxiosInstance } from 'axios'
import { ADDRESS_API, API_URL } from '@/constants/eviroment.constant'
import type { CityResponse, Pagination } from '@/types'
import Http from '../api/api.service'

class AddressService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async listCities(query: string): Promise<Pagination<CityResponse>> {
    return (await this.http.get(`${ADDRESS_API}/cities${query}`)).data
  }
}

export default AddressService
