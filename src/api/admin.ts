/**
 * pages 里的 admin模块,并非项目中真正的admin
 */

import http, { AxiosPromise } from '@/utils/http'

export const getUserList = (): AxiosPromise => http({
  url: 'users',
  method: 'GET',
})
