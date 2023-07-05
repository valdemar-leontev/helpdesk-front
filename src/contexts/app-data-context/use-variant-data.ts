import { useAuthHttpRequest } from './use-auth-http-request';
import { useCallback, useMemo } from 'react';
import { VariantModel } from '../../models/data/variant-model';

export type AppDataContextVariantEndpointsModel = {
  putVariantAsync: (questionId: number) => Promise<VariantModel>;

  deleteVariantAsync: (variantId: number) => Promise<VariantModel>;
}

export const useVariantData = () => {
  const authHttpRequest = useAuthHttpRequest();

  const baseRoute = useMemo<string>(() => {
    return '/variants';
  }, []);

  const putVariantAsync = useCallback(async (questionId: number) => {
    const response = await authHttpRequest({
      method: 'PUT',
      url: `${baseRoute}?questionId=${questionId}`,
    });

    return response ? response.data as VariantModel : null;
  }, [authHttpRequest, baseRoute]);

  const deleteVariantAsync = useCallback(async (variantId: number) => {
    const response = await authHttpRequest({
      method: 'DELETE',
      url: `${baseRoute}/${variantId}`,
    });

    return response ? response.data as VariantModel : null;
  }, [authHttpRequest, baseRoute]);

  return {
    putVariantAsync,
    deleteVariantAsync
  };
};