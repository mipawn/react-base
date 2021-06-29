import http, { AxiosPromise } from '@/utils/http'

export interface LoginParams {
  accessKey?: string;
  secretKey?: string;
}
export const login = (data: LoginParams): AxiosPromise => http({
  url: 'login',
  method: 'POST',
  data,
})

export const getSession = (): AxiosPromise => http({
  url: 'session',
  method: 'GET',
})

export const logout = (): AxiosPromise => http({
  url: 'logout',
  method: 'POST',
})

export interface DashboardInfoType {
  buckets: number,
  objects: number,
  usage: number
}
export const getDashboardInfo = (): AxiosPromise<DashboardInfoType> => http({
  url: 'admin/info',
  method: 'GET',
})

export const hasPermission = (data: unknown): AxiosPromise<any> => http({
  url: 'has-permission',
  method: 'POST',
  data,
})
