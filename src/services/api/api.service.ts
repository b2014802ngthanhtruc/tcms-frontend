import axios, { AxiosError, type AxiosInstance, type AxiosResponse, HttpStatusCode } from 'axios'
import type { AuthResponse, RegisterResponse } from '@/types' // Assuming you have a response type defined
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  getUserLoginFromLS,
  saveAccessTokenToLS,
  setUserIdToLS
} from '@/utils'
import { useToast } from 'vue-toast-notification'
import { API_URL, AUTH_STUDENT_API, AUTH_TUTOR_API } from '@/constants/eviroment.constant'

const $toast = useToast()

class Http {
  private instance: AxiosInstance
  private isRefreshing = false
  private refreshSubscribers: Array<(token: string) => void> = []

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    // Request Interceptor
    this.instance.interceptors.request.use((config) => {
      const accessToken = getAccessTokenFromLS()
      if (accessToken) {
        config.headers.authorization = `Bearer ${accessToken}`
      }
      return config
    })

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { url } = response.config

        // If login or register, save token and profile
        if (url?.includes('/login')) {
          const data = response.data as AuthResponse
          if (data.accessToken) {
            saveAccessTokenToLS(data)
          }
        }
        // If logout, clear token and profile
        // else if (url === '/logout') {
        //   this.accessToken = ''
        //   clearLS()
        // }
        if (url?.includes('general/register')) {
          const data = response.data as RegisterResponse
          setUserIdToLS(data.userId)
        }
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          await this._refreshToken()

          this.isRefreshing = true
          if (!this.isRefreshing) {
            this.isRefreshing = true
            try {
              await this._refreshToken()
              const newToken = getAccessTokenFromLS()
              this.isRefreshing = false
              this.onTokenRefreshed(newToken)

              // Cập nhật lại header và gọi lại yêu cầu ban đầu
              originalRequest!.headers.authorization = `Bearer ${newToken}`
              return this.instance(originalRequest!)
            } catch (refreshError) {
              this.isRefreshing = false
              clearLS()
              window.location.href = '/login'
              return Promise.reject(refreshError)
            }
          }

          // Đợi cho đến khi token được làm mới
          return new Promise((resolve) => {
            this.subscribeTokenRefresh((token: string) => {
              originalRequest!.headers.authorization = `Bearer ${token}`
              resolve(this.instance(originalRequest!))
            })
          })
        }
        return Promise.reject(error)
      }
    )
  }

  private async _refreshToken(): Promise<void> {
    const refreshToken = getRefreshTokenFromLS()
    const userLogin = getUserLoginFromLS()
    if (userLogin.isTutor) {
      const result = await axios.post(`${API_URL}/${AUTH_TUTOR_API}/refresh-token`, {
        refreshToken
      })
      saveAccessTokenToLS(result.data)
    }
    if (userLogin.isStudent) {
      const result = await axios.post(`${API_URL}/${AUTH_STUDENT_API}/refresh-token`, {
        refreshToken
      })
      saveAccessTokenToLS(result.data)
    }
  }

  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback)
  }

  private onTokenRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token))
    this.refreshSubscribers = []
  }

  getInstance(): AxiosInstance {
    return this.instance
  }
}

export default Http
