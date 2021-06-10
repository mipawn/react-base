import axios from 'axios'
import { message } from 'antd'
import store from 'store/index'

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
    console.log(error) // for debug
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  response => {
    // 业务code处理
    return response
  },
  error => {
    console.warn('http请求失败', error.response)
    return Promise.reject(error.response || error)
  },
)

export default instance
