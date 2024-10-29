import axios, { AxiosError, type AxiosInstance, type AxiosResponse, HttpStatusCode } from 'axios'
import type { AuthResponse, RegisterResponse } from '@/types' // Assuming you have a response type defined
import { clearLS, getAccessTokenFromLS, saveAccessTokenToLS, setUserIdToLS } from '@/utils'
import { useToast } from 'vue-toast-notification'

const $toast = useToast()

class Http {
  private instance: AxiosInstance

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
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
  }

  getInstance(): AxiosInstance {
    return this.instance
  }
}

export default Http
