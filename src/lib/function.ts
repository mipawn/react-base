import queryString from 'query-string'
import storage from 'local-storage-fallback'

/**
 * @param name  - 要获取的参数名
 * @param query
 * 根据名称获取单个参数
 */
export function getQueryByName(name: string, query: string): string | undefined {
  const reg = new RegExp(`${name}=([^&]+)`)
  const res = query.match(reg) || []
  return res[1]
}

/**
 * @param url
 * @returns queryObj
 */
export function getQueryObj(url: string): Record<string, unknown> {
  return queryString.parse(url)
}

// 设置cookie
export const setCookie = (name: string, val: string): void => {
  const date = new Date()
  const value = val

  // Set it expire in 45 minutes
  date.setTime(date.getTime() + 45 * 60 * 1000)

  // Set it
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`
}

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

export const clearSession = (): void => {
  storage.removeItem('token')
  deleteCookie('token')
}
