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

export const niceBytes = (x: string, showK8sUnits = false) => {
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
