import {
  ElMessage as message,
} from 'element-plus'

export const error = (err: Error): void => {
  console.log(err)
}

export const errorAndMessage = (err: any): void => {
  console.log(err)
  const errorMessage = err?.data?.message
    || err?.statusText
    || 'http error'
  message.error(errorMessage)
}
