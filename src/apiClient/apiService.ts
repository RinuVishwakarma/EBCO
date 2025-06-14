// import appConfig from 'appConfig';
import {ApiConfiguration,RequestConfig} from '@/interface/axiosInstancetypes'
import {
  getStoredAuthToken,
  isLocalStorage,
  removeAuthToken,
} from '@/utils/authToken'
import axios,{
  AxiosError,
  AxiosInstance,
  AxiosResponse
} from 'axios'

// import store from '../reducer/reducer'
// import { removeAuthData } from '../reducer/authSlice'

import {baseUrl} from '@/global_config'
import qs from 'qs'
import {toast} from 'react-toastify'
export interface IApiClient {
  post<TRequest, TResponse>(
    path: string,
    object: TRequest,
    config?: RequestConfig,
  ): Promise<TResponse>
  patch<TRequest, TResponse>(path: string, object: TRequest): Promise<TResponse>
  put<TRequest, TResponse>(path: string, object: TRequest): Promise<TResponse>
  get<TResponse>(
    path: string,
    queryParam?: {},
  ): Promise<{ data: TResponse; headers: any }>
  delete<TResponse>(path: string, config?: RequestConfig): Promise<TResponse>
}

class ApiClient implements IApiClient {
  private client: AxiosInstance

  protected createAxiosClient(
    apiConfiguration?: ApiConfiguration,
  ): AxiosInstance {
    return axios.create({
      baseURL: baseUrl,
      responseType: 'json' as const,
      auth: {
        username: process.env.NEXT_PUBLIC_CLIENT_KEY!,
        password: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      // timeout: 60 * 1000
    })
  }

  constructor() {
    this.client = this.createAxiosClient()
    this.client.interceptors.request.use(
      config => {
        if (
          config &&
          config.headers &&
          config?.headers['Authorization'] != null
        ) {
          return config
        }

        const token = isLocalStorage() ? getStoredAuthToken() : null

        if (token != null && token != '') {
          config.headers.Authorization = `Bearer ${token}`
          delete config.auth
        }

        return config
      },
      error => {
        Promise.reject(error)
      },
    )

    this.client.interceptors.response.use(
      //Only works for 200 series.
      value => {
        return value
      },
    )
  }

  async get<TResponse>(
    path: string,
    queryParam?: {},
    config?: RequestConfig,
  ): Promise<{ data: TResponse; headers: any }> {
    try {
      // Check if server-side rendering or user is not authenticated
      if (typeof window === 'undefined' || !getStoredAuthToken()) {
        if (path.includes('/get-cart')) {
          // Return empty cart for unauthenticated users or server-side rendering
          return { data: { items: [] } as any, headers: {} };
        }
        if (path.includes('/clear-cart')) {
          // Return success response for unauthenticated users or server-side rendering
          return { data: { success: true } as any, headers: {} };
        }
      }

      if (queryParam != null) {
        path = `${path}?${qs.stringify(queryParam)}`
      }
      // console.log(config, "config");
      // console.log(
      //   path,
      //   "PATH",
      //   queryParam,
      //   "QUERY",
      //   config,
      //   "CONFIG"
      //   // response.data,
      //   // "RESPONSE"
      // );
      const response: AxiosResponse<TResponse> = config
        ? await this.client.get(path, config)
        : await this.client.get(path)

      return { data: response.data, headers: response.headers }
    } catch (error) {
      handleError(error as AxiosError)
      throw error
    }
  }

  async post<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config?: RequestConfig,
  ): Promise<TResponse> {
    try {
      // Check if server-side rendering or user is not authenticated
      if (typeof window === 'undefined' ||
          (!getStoredAuthToken() && (
            path.includes('/add-to-cart') ||
            path.includes('/remove-cart') ||
            path.includes('/update-cart')
          ))) {
        // Return success response for unauthenticated users or server-side rendering
        // The actual cart operations will be handled by localStorage for client-side
        return { success: true } as unknown as TResponse;
      }

      const response = config
        ? await this.client.post(path, payload, config)
        : await this.client.post(path, payload)

      return response.data
    } catch (error) {
      // handleError(error as AxiosError);

      throw error
    }
  }

  async delete<TResponse>(
    path: string,
    queryParam?: {},
    config?: RequestConfig,
  ): Promise<TResponse> {
    try {
      if (queryParam != null) {
        path = `${path}?${qs.stringify(queryParam)}`
      }

      const response: any = config
        ? await this.client.delete(path, config)
        : this.client.delete(path)

      return response.data
    } catch (error) {
      handleError(error as AxiosError)
      throw error
    }
  }

  async patch<TRequest, TResponse>(
    path: string,
    payload: TRequest,
  ): Promise<TResponse> {
    try {
      const response = await this.client.patch<TResponse>(path, payload)
      return response.data
    } catch (error) {
      handleError(error as AxiosError)
      throw error
    }
  }

  async put<TRequest, TResponse>(
    path: string,
    payload: TRequest,
  ): Promise<TResponse> {
    try {
      const response = await this.client.put<TResponse>(path, payload)
      return response.data
    } catch (error) {
      handleError(error as AxiosError)
      throw error
    }
  }
  SetToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    delete this.client.defaults.auth
  }
}

export const apiClient = new ApiClient()

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotFound = 404,
  NetworkError = 503,
}

export function handleError(error: AxiosError<any, any>) {
  if (typeof window !== 'undefined' && (error as AxiosError).response?.status === 401) {
    removeAuthToken()
    window.location.href = '/login'
  }

  // Handle other error cases if needed
  const status = error.response?.status
  const message = error.response?.data?.message || 'An error occurred'

  if (typeof window !== 'undefined') {
    // Only show toast messages on client-side
    switch (status) {
      case StatusCode.InternalServerError:
      case StatusCode.Forbidden:
      case StatusCode.Unauthorized:
      case StatusCode.TooManyRequests:
      case StatusCode.NotFound:
        toast.error(message)
        break
      default:
        // Silent error or custom handling
        break
    }
  }
}
