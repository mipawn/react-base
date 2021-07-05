export const units = [
  'B',
  'KiB',
  'MiB',
  'GiB',
  'TiB',
  'PiB',
  'EiB',
  'ZiB',
  'YiB',
]
export const k8sUnits = ['Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei']
export const k8sCalcUnits = ['B', ...k8sUnits]

export const niceBytes = (x: string, showK8sUnits = false): string => {
  let l = 0
  let n = parseInt(x, 10) || 0

  // eslint-disable-next-line no-plusplus
  while (n >= 1024 && ++l) {
    n /= 1024
  }
  // include a decimal point and a tenths-place digit if presenting
  // less than ten of KB or greater units
  const k8sUnitsN = ['B', ...k8sUnits]
  return (
    `${n.toFixed(n < 10 && l > 0 ? 1 : 0)
    } ${
      showK8sUnits ? k8sUnitsN[l] : units[l]}`
  )
}

export function dateFormat(dateString: string, fmt = 'YYYY-mm-dd HH:MM'): string {
  let ret
  const date = new Date(dateString)
  if (!date) return ''
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  Object.keys(opt).forEach((k: any) => {
    ret = new RegExp(`(${k})`).exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1)
        ? opt[k as keyof typeof opt]
        : opt[k as keyof typeof opt].padStart(ret[1].length, '0'))
    }
  })
  return fmt
}
