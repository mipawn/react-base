import http, { AxiosPromise } from '@/utils/http'

export const getBucketsList = (): AxiosPromise<any> => http({
  url: 'buckets',
  method: 'GET'
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
export const delObject = ({ selectedBucket, selectedObject, recursive }: delObjectParams): AxiosPromise<any> => http({
  url: `buckets/${selectedBucket}/objects?path=${selectedObject}&recursive=${recursive}`,
  method: 'DELETE'
})

export const downObjectPath = (bucketName: string, objectPath: string): string => {
  return `${process.env.VUE_APP_BASE_API}/buckets/${bucketName}/objects/download?prefix=${objectPath}`
}

interface uploadObjectProps {
  url: string;
  data: FormData;
  onProgress: (propgress: any) => void;
}
export const uploadObject = ({ url, data, onProgress }: uploadObjectProps): AxiosPromise => http({
  url,
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  method: 'POST',
  data,
  onUploadProgress: onProgress,
})

interface ShareParams {
  bucketName: string,
  file: Record<string, unknown>,
  diffDate: number | string | undefined
}
export const shareObject = ({ bucketName, file, diffDate }: ShareParams): AxiosPromise => http({
  url: `/buckets/${bucketName}/objects/share?prefix=${
    file.name
  }&version_id=${file.version_id}${
    diffDate !== "" ? `&expires=${diffDate}ms` : ""
  }`,
  method: 'GET'
})