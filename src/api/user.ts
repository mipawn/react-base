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

export interface SendCodeParams {
  env: 'register',
  phone: string
}
export const sendCode = (data: SendCodeParams): AxiosPromise => http({
  url: 'sms/send',
  method: 'GET',
  params: {
    env: data.env,
    phone: data.phone,
  },
})

export interface RegistData {
  code: string,
  phone: string,
  username: string,
  password: string
}
export const regist = (data: RegistData): AxiosPromise => http({
  url: 'register',
  method: 'POST',
  data,
})
