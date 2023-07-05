import { useAuthHttpRequest } from './use-auth-http-request';
import { useCallback, useMemo } from 'react';
import { OrganizationTreeItemModel } from '../../models/data/organization-tree-item-model';
import { DictionaryBaseModel } from '../../models/abstracts/dictionary-base-model';
import { SubdivisionLinkSubdivisionModel } from '../../models/data/subdivision-link-subdivision-model';
import { ProfileLinkSubdivisionModel } from '../../models/data/profile-link-subdivision-model';

export type AppDataContextOrganizationEndpointsModel = {
  getOrganizationTreeAsync: () => Promise<OrganizationTreeItemModel[] | null>;

  putSubdivisionAsync: (subdivision: DictionaryBaseModel, parentSubdivisionId: number) => Promise<SubdivisionLinkSubdivisionModel | null>;

  deleteSubdivisionAsync: (subdivisionId: number) => Promise<DictionaryBaseModel | null>;

  renameSubdivisionAsync: (subdivisionId: number, subdivisionDescription: string) => Promise<DictionaryBaseModel | null>;

  deleteSubdivisionProfileAsync: (profileId: number) => Promise<ProfileLinkSubdivisionModel | null>;

  postAssignSubdivisionHeadAsync: (profileId: number) => Promise<ProfileLinkSubdivisionModel | null>;
}

export const useOrganizationData = () => {
  const authHttpRequest = useAuthHttpRequest();

  const baseRoute = useMemo<string>(() => {
    return '/organizations';
  }, []);

  const getOrganizationTreeAsync = useCallback(async () => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/tree`
    });

    return response ? response.data as OrganizationTreeItemModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const putSubdivisionAsync = useCallback(async (subdivision: DictionaryBaseModel, parentSubdivisionId: number) => {
    const response = await authHttpRequest({
      method: 'PUT',
      url: `${baseRoute}/${parentSubdivisionId}`,
      data: subdivision
    });

    return response ? response.data as SubdivisionLinkSubdivisionModel : null;
  }, [authHttpRequest, baseRoute]);

  const deleteSubdivisionAsync = useCallback(async (subdivisionId: number) => {
    const response = await authHttpRequest({
      method: 'DELETE',
      url: `${baseRoute}/${subdivisionId}`,
    });

    return response ? response.data as DictionaryBaseModel : null;
  }, [authHttpRequest, baseRoute]);

  const renameSubdivisionAsync = useCallback(async (subdivisionId: number, subdivisionDescription: string) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: `${baseRoute}/${subdivisionId}/rename`,
      params: {
        subdivisionDescription: subdivisionDescription,
      }
    });

    return response ? response.data as DictionaryBaseModel : null;
  }, [authHttpRequest, baseRoute]);

  const deleteSubdivisionProfileAsync = useCallback(async (profileId: number) => {
    const response = await authHttpRequest({
      method: 'DELETE',
      url: `${baseRoute}/delete-from-subdivision/${profileId}`,
    });

    return response ? response.data as ProfileLinkSubdivisionModel : null;
  }, [authHttpRequest, baseRoute]);

  const postAssignSubdivisionHeadAsync = useCallback(async (profileId: number) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: `${baseRoute}/assign-subdivision-head/${profileId}`,
    });

    return response ? response.data as ProfileLinkSubdivisionModel : null;
  }, [authHttpRequest, baseRoute]);

  return {
    getOrganizationTreeAsync,
    putSubdivisionAsync,
    deleteSubdivisionAsync,
    renameSubdivisionAsync,
    deleteSubdivisionProfileAsync,
    postAssignSubdivisionHeadAsync
  };
};