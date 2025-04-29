import { AxiosProgressEvent } from 'axios'

export type HttpHeaders = {
  [key: string]: string
}

export interface RequestConfig {
  headers: HttpHeaders
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
}
export class ApiConfiguration {
  accessToken?: string
}
