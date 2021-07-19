import http, { AxiosPromise } from '@/utils/http'

export const getBucketsList = (): AxiosPromise<any> => http({
  url: 'buckets',
  method: 'GET',
})

interface ObjectsParams {
  bucketName?: string,
  extraPath?: string
}
export const getObjectsList = ({ bucketName, extraPath }: ObjectsParams): AxiosPromise<any> => http({
  url: `buckets/${bucketName}/objects${extraPath}`,
  method: 'GET',
})
export const getObjectDetails = ({ bucketName, extraPath }: ObjectsParams): AxiosPromise<any> => http({
  url: `buckets/${bucketName}/objects${extraPath}&with_versions=true`,
  method: 'GET',
})

interface delObjectParams {
  selectedBucket: string,
  selectedObject: string,
  recursive: boolean
}
export const delObject = (
  { selectedBucket, selectedObject, recursive }: delObjectParams,
): AxiosPromise<any> => http({
  url: `buckets/${window.encodeURIComponent(selectedBucket)}/objects?path=${window.encodeURIComponent(selectedObject)}&recursive=${recursive}`,
  method: 'DELETE',
})

export const downObjectPath = (bucketName: string, objectPath: string): string => `${process.env.VUE_APP_BASE_API}/buckets/${bucketName}/objects/download?prefix=${objectPath}`

interface uploadObjectProps {
  url: string;
  data: FormData;
  onProgress: (propgress: any) => void;
}
export const uploadObject = ({ url, data, onProgress }: uploadObjectProps): AxiosPromise => http({
  url,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  method: 'POST',
  data,
  onUploadProgress: onProgress,
  timeout: 1000000,
})

interface ShareParams {
  bucketName: string,
  file: Record<string, unknown>,
  diffDate: number | string | undefined
}
export const shareObject = (
  { bucketName, file, diffDate }: ShareParams,
): AxiosPromise => http({
  url: `/buckets/${bucketName}/objects/share?prefix=${
    file.name
  }&version_id=${file.version_id}${
    diffDate !== '' ? `&expires=${diffDate}ms` : ''
  }`,
  method: 'GET',
})

interface uploadPreCreateData {
  targetPath: string,
  objectName: string,
  size: number,
  preHash?: string,
  bucketName: string
}
export const uploadPreCreate = (
  data: uploadPreCreateData,
): AxiosPromise => http({
  url: `/buckets/${data.bucketName}/objects/upload/precreate`,
  method: 'POST',
  data,
})

interface createUploadChunkParams {
  url: string,
  headers: Record<string, unknown>
  data: FormData,
  onProgress?: (propgress: any) => void
  cancelToken?: any
}
export const createUploadChunk = (
  {
    url, headers, data, onProgress, cancelToken,
  }: createUploadChunkParams,
): AxiosPromise => http({
  url,
  method: 'PUT',
  headers,
  data,
  timeout: 0,
  onUploadProgress: onProgress,
  cancelToken,
})

export interface uploadMergeData {
  bucketName: string,
  uploadID: string,
  targetPath: string,
  objectName: string,
  complMultipartUpload: {
    ETag: string,
    partNumber: number
  }
}
export const uploadMerge = (
  { bucketName, ...data }: uploadMergeData,
): AxiosPromise => http({
  url: `/buckets/${bucketName}/objects/upload/complete`,
  method: 'POST',
  data,
})

export interface renameData {
  bucket: string,
  name: string,
  path: string
}
export const rename = (
  { bucket, ...data }: renameData,
): AxiosPromise => http({
  url: `/buckets/${bucket}/objects/rename`,
  method: 'POST',
  data,
})
