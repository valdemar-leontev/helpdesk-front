import { useCallback, useMemo } from 'react';
import { getFileNameFromContentDisposition } from '../../utils/string-helpers';
import { useAuthHttpRequest } from './use-auth-http-request';
import { FileModel } from '../../models/data/file-model';
import { appConstants } from '../../constants/app-constants';

export type AppDataContextFileEndpointsModel = {
  downloadFileAsync: (uid: string, openAsPdf: boolean) => Promise<void>;

  getRequirementFileListAsync: (requirementId: number | null) => Promise<FileModel[] | null>;

  getRequirementFileListCountAsync: (requirementId: number) => Promise<number | null>;

  deleteFileAsync: (fileId: number) => Promise<FileModel | null>;

  getFileListAsync: (requirementId: number | null) => Promise<FileModel[] | null>;

  replaceFileAsync: (uid: string) => Promise<FileModel | null>;
}

export const useFileData = () => {
  const authHttpRequest = useAuthHttpRequest();

  const baseRoute = useMemo<string>(() => {
    return '/files';
  }, []);

  const downloadFileAsync = useCallback(async (uid: string, open: boolean = false) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/download?uid=${uid}`,
      responseType: 'blob',
    });

    if (!response || !response.data) {

      return;
    }

    const fileName = getFileNameFromContentDisposition(response.headers['content-disposition']);

    if (fileName) {
      const fileNameParts = fileName.split('.');
      const fileExtension = fileNameParts[fileNameParts.length - 1];
      const mimeType = appConstants.extToMime[fileExtension];

      if (open && mimeType) {
        const file = new Blob([response.data], { type: mimeType });
        window.open(URL.createObjectURL(file));

        return;
      }
    }

    const href = URL.createObjectURL(response.data);
    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = fileName !== null ? fileName : uid;
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);

    setTimeout(() => {
      URL.revokeObjectURL(href);
    }, 1000);
  }, [authHttpRequest, baseRoute]);

  const getRequirementFileListAsync = useCallback(async (requirementId: number | null) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/requirement-file-list/${requirementId ? requirementId : ''}`,
    });

    return response ? response.data as FileModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const getRequirementFileListCountAsync = useCallback(async (requirementId: number) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/count/${requirementId}`,
    });

    return response ? response.data as number : null;
  }, [authHttpRequest, baseRoute]);

  const deleteFileAsync = useCallback(async (fileId: number) => {
    const response = await authHttpRequest({
      method: 'DELETE',
      url: `${baseRoute}/${fileId}`,
    });

    return response ? response.data as FileModel : null;
  }, [authHttpRequest, baseRoute]);

  const getFileListAsync = useCallback(async (requirementId: number | null) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/list/${requirementId ? requirementId : ''}`,
    });

    return response ? response.data as FileModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const replaceFileAsync = useCallback(async (uid: string) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: `${baseRoute}/replace/${uid}`,
    });

    return response ? response.data as FileModel : null;
  }, [authHttpRequest, baseRoute]);

  return {
    downloadFileAsync,
    getRequirementFileListAsync,
    getRequirementFileListCountAsync,
    deleteFileAsync,
    getFileListAsync,
    replaceFileAsync
  };
};