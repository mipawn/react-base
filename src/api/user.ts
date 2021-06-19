import http, { AxiosPromise } from 'lib/http'

export interface LoginParams {
  accessKey?: string;
  secretKey?: string;
  autoLogin?: boolean;
  type?: string;
}
export const login = (data: LoginParams): AxiosPromise => http({
  url: '/api/v1/login',
  method: 'POST',
  data,
})

export const getSession = (): AxiosPromise => http({
  url: '/api/v1/session',
  method: 'GET',
})

export const logout = (): AxiosPromise => http({
  url: '/api/v1/logout',
  method: 'POST',
})
