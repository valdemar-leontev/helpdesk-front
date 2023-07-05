export function toCapitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toDecapitalize(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function getFileNameFromContentDisposition(disposition: string | null| undefined): string | null {

  if(!disposition) {
    return null;
  }

  const utf8FilenameRegex = /filename\*=UTF-8''([\w%\-.]+)(?:; ?|$)/i;
  const asciiFilenameRegex = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i;

  let fileName: string | null = null;

  if (utf8FilenameRegex.test(disposition)) {
    fileName = decodeURIComponent(utf8FilenameRegex.exec(disposition)![1]);
  } else {

    const filenameStart = disposition.toLowerCase().indexOf('filename=');
    if (filenameStart >= 0) {
      const partialDisposition = disposition.slice(filenameStart);
      const matches = asciiFilenameRegex.exec(partialDisposition);
      if (matches != null && matches[2]) {
        fileName = matches[2];
      }
    }
  }

  return fileName;
}