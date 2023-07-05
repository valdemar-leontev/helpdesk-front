import { useAuthHttpRequest } from './use-auth-http-request';
import { useCallback, useMemo } from 'react';
import { DescriptiveEntityModel } from '../../models/abstracts/descriptive-entity-model';
import { RequirementCategoryModel } from '../../models/data/requirement-category-model';
import { DictionaryBaseModel } from '../../models/abstracts/dictionary-base-model';
import { EntityGetRequest } from '../../models/abstracts/entity-get-request';
import { EntityModel } from '../../models/abstracts/entity-model';
import { EntityPostRequest } from '../../models/abstracts/entity-post-request';

export type AppDataContextEntityEndpointsModel = {
  getDictionaryAsync: (name: string) => Promise<DictionaryBaseModel[] | RequirementCategoryModel[] | null>;

  getDictionaryItemAsync: (name: string, itemId: number) => Promise<DictionaryBaseModel | RequirementCategoryModel | null>;

  putDictionaryItemAsync: (item: DictionaryBaseModel, name: string) => Promise<DictionaryBaseModel | null>;

  getEntitiesCountAsync: (entityGetRequest: EntityGetRequest) => Promise<number | null>;

  postEntityAsync: (entity: EntityModel, entityPostRequest: EntityPostRequest, suppressLoader) => Promise<EntityModel | null>;
}

export const useEntityData = () => {
  const authHttpRequest = useAuthHttpRequest();

  const baseRoute = useMemo<string>(() => {
    
    return '/entities';
  }, []);

  const getDictionaryAsync = useCallback(async (name: string) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/list`,
      params: {
        entityTypeName: name
      }
    });

    return response ? response.data as DescriptiveEntityModel[] | RequirementCategoryModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const putDictionaryItemAsync = useCallback(async (item: DictionaryBaseModel, name: string) => {
    const response = await authHttpRequest({
      method: 'PUT',
      url: baseRoute,
      data: {
        json: JSON.stringify(item),
        entityTypeName: name
      }
    });

    return response ? response.data as DictionaryBaseModel : null;
  }, [authHttpRequest, baseRoute]);

  const getEntitiesCountAsync = useCallback(async (entityGetRequest: EntityGetRequest) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/count`,
      params: entityGetRequest
    });

    return response ? response.data as number : null;
  }, [authHttpRequest, baseRoute]);

  const getDictionaryItemAsync = useCallback(async (name: string, itemId: number) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: baseRoute,
      params: {
        entityTypeName: name,
        filter: `Id==${itemId}`
      } as EntityGetRequest
    });

    return response ? response.data as DictionaryBaseModel | RequirementCategoryModel : null;
  }, [authHttpRequest, baseRoute]);

  const postEntityAsync = useCallback(async (entity: EntityModel, entityPostRequest: EntityPostRequest, suppressLoader: boolean = false) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: baseRoute,
      data: { ...entityPostRequest,  json: JSON.stringify(entity) }
    }, suppressLoader);

    return response ? response.data as EntityModel : null;
  }, [authHttpRequest, baseRoute]);

  return {
    getDictionaryAsync,
    putDictionaryItemAsync,
    getEntitiesCountAsync,
    getDictionaryItemAsync,
    postEntityAsync
  };
};