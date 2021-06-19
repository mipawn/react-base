import queryString from 'query-string'

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
