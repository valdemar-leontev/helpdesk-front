import { useCallback, useMemo } from 'react';
import { RequirementTemplateModel } from '../../models/data/requirement-templates-model';
import { useAuthHttpRequest } from './use-auth-http-request';

export type AppDataContextRequirementTemplateEndpointsModel = {

  getRequirementTemplateListAsync: () => Promise<RequirementTemplateModel[] | null>;

  getRequirementTemplateAsync: (requirementTemplateId: number) => Promise<RequirementTemplateModel>;

  deleteRequirementTemplateAsync: (requirementTemplateId: number) => Promise<RequirementTemplateModel>;

  renameRequirementTemplateAsync: (requirementTemplateId: number, name: string) => Promise<RequirementTemplateModel>;

  createRequirementTemplateAsync: () => Promise<RequirementTemplateModel>;

  saveRequirementTemplateAsync: (requirementTemplate: RequirementTemplateModel) => Promise<RequirementTemplateModel | null>;
}

export const useRequirementTemplateData = () => {
  const authHttpRequest = useAuthHttpRequest();

  const baseRoute = useMemo<string>(() => {
    return '/requirement-templates';
  }, []);

  const getRequirementTemplateAsync = useCallback(async (requirementTemplateId: number) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/${requirementTemplateId}`,
    });

    return response ? response.data : null;
  }, [authHttpRequest, baseRoute]);

  const getRequirementTemplateListAsync = useCallback(async () => {
    const response = await authHttpRequest({
      url: `${baseRoute}/list`,
      method: 'GET',
    });

    return response ? response.data as RequirementTemplateModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const deleteRequirementTemplateAsync = useCallback(async (requirementTemplateId: number) => {
    const response = await authHttpRequest({
      method: 'DELETE',
      url: `${baseRoute}/${requirementTemplateId}`,
    });

    return response ? response.data : null;
  }, [authHttpRequest, baseRoute]);

  const renameRequirementTemplateAsync = useCallback(async (requirementTemplateId: number, name: string) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: `${baseRoute}/${requirementTemplateId}/rename?name=${name}`,
    });

    return response ? response.data : null;
  }, [authHttpRequest, baseRoute]);

  const createRequirementTemplateAsync = useCallback(async () => {
    const response = await authHttpRequest({
      method: 'PUT',
      url: baseRoute,
    });

    return response ? response.data : null;
  }, [authHttpRequest, baseRoute]);

  const saveRequirementTemplateAsync = useCallback(async (requirementTemplate: RequirementTemplateModel, suppressLoader: boolean = true) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: baseRoute,
      data: requirementTemplate
    }, suppressLoader);

    return response ? response.data as RequirementTemplateModel : null;
  }, [authHttpRequest, baseRoute]);

  return {
    getRequirementTemplateAsync,
    getRequirementTemplateListAsync,
    deleteRequirementTemplateAsync,
    renameRequirementTemplateAsync,
    createRequirementTemplateAsync,
    saveRequirementTemplateAsync
  };
};
