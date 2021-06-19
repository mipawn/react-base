import axios from 'axios'
import { message } from 'antd'
import store from 'store/index'

export type { AxiosPromise } from 'axios'

/**
 * TODO:
 * 1. 请求取消
 */

const instance = axios.create({
  baseURL: process.env.BASE,
  timeout: 10000,
})

instance.interceptors.request.use(
  // do something before request is sent
  request => {
    const state = store.getState()
    const { token } = state.user
    request.headers['x-request-token'] = token
    return request
  },
  error => {
    // do something with request error
    console.warn(error) // for debug
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  response => {
    // 业务code处理
    return response.data
  },
  error => {
    const errorMessage = error.response?.data?.message
    console.warn('http请求失败', error.response)
    if (error.response.status === 401) {
      // Refresh the whole page to ensure cache is clear
      // and we dont end on an infinite loop
      localStorage.removeItem('userLoggedIn')
      window.location.href = '/login'
    }
    message.error(errorMessage)
    return Promise.reject(error.response)
  },
)

export default instance
