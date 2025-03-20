import type { AxiosInstance } from 'axios'
import { ADMIN_DASHBOARD_API, API_URL } from '@/constants/eviroment.constant'
import type {
  ClassDashboardType,
  SubjectDashboardType,
  UserDashboardType
} from '@/types/dashboard.type'
import Http from '../api/api.service'

class AdminDashboardService {
  private http: AxiosInstance
  constructor() {
    this.http = new Http(API_URL).getInstance()
  }

  async getUserDashboard(): Promise<UserDashboardType> {
    const response = await this.http.get(`${ADMIN_DASHBOARD_API}/user-dashboard`)
    return response.data
  }

  async getClassDashboard(): Promise<ClassDashboardType> {
    const response = await this.http.get(`${ADMIN_DASHBOARD_API}/class-dashboard`)
    return response.data
  }

  async getSubjectDashboard(): Promise<SubjectDashboardType[]> {
    const response = await this.http.get(`${ADMIN_DASHBOARD_API}/subject-dashboard`)
    return response.data
  }
}

export default AdminDashboardService
