import { downObjectPath } from '@/api/bucket'

function isNullOrUndefined(target: any) {
  return target === undefined || target === null
}
export const downloadObject = (
  bucketName: string,
  objectPath: string,
  versionID: null | string,
  callBack?: (objIdentifier: string) => void,
  includeVersionInCallback?: boolean
): void => {
  const anchor = document.createElement("a");
  document.body.appendChild(anchor);
  const xhr = new XMLHttpRequest();

  let path = downObjectPath(bucketName, objectPath)
  if (!isNullOrUndefined(versionID) && versionID !== "null") {
    path = path.concat(`&version_id=${versionID}`)
  }

  xhr.open("GET", path, true);
  xhr.responseType = "blob";

  xhr.onload = function () {
    if (this.status === 200) {
      const blob = new Blob([this.response], {
        type: "octet/stream",
      });
      const blobUrl = window.URL.createObjectURL(blob);

      anchor.href = blobUrl;
      anchor.download = objectPath;

      anchor.click();
      window.URL.revokeObjectURL(blobUrl);
      anchor.remove();

      if (callBack) {
        callBack(
          `${bucketName}/${objectPath}${
            includeVersionInCallback ? `-${versionID}` : ""
          }`
        );
      }
    }
  };
  xhr.send();
}
