import axios from 'axios'
import { ElMessage as message } from 'element-plus'

const cancelToken = axios.CancelToken
export const source = cancelToken.source()

export type { AxiosPromise } from 'axios'

/**
 * TODO:
 * 1. 请求取消
 */
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
  cancelToken: source.token,
})

instance.interceptors.request.use(
  // do something before request is sent
  (request) => request,
  (error) => {
    // do something with request error
    console.warn(error) // for debug
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  // 业务code处理
  // 更好的ts 支持和业务处理，直接返回response，而不是返回 response.data
  (response) => response,
  (error) => {
    const loginPath = `${process.env.VUE_APP_PATH_SUFFIX}/login`
    const errorMessage = error?.response?.data?.message
      || error?.response?.statusText
      || 'http error'
    console.warn('http请求失败', error.response)
    if (error?.response?.status === 401) {
      // Refresh the whole page to ensure cache is clear
      // and we dont end on an infinite loop
      localStorage.removeItem('userLoggedIn')
      const path = window.location.pathname

      if (path !== loginPath) {
        window.location.href = loginPath
      }
    }
    if (window.location.pathname === loginPath) {
      message.error(errorMessage)
    }
    if (axios.isCancel(error)) {
      return Promise.reject(new Error('cancel'))
    }
    return Promise.reject(error.response)
  },
)

export default instance
