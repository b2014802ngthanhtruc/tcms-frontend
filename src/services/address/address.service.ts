import type { AxiosInstance } from 'axios'
import { ADDRESS_API, API_URL } from '@/constants/eviroment.constant'
import Http from '../api/api.service'

class AddressService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async listCities() {
    return (await this.http.get(`${ADDRESS_API}/cities`)).data
  }
}

export default AddressService
