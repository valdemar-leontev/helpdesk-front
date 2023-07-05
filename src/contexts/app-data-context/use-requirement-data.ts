import { useAuthHttpRequest } from './use-auth-http-request';
import { useCallback, useMemo } from 'react';
import { RequirementModel } from '../../models/data/requirement-model';
import { RequirementStageModel } from '../../models/data/requirement-stage-model';
import { RequirementStates } from '../../models/enums/requirement-states';
import { RequirementCommentModel } from '../../models/data/requirement-comment-model';
import { RequirementCommentStateModel } from '../../models/data/requirement-comment-state-model';
import { RequirementCategoryModel } from '../../models/data/requirement-category-model';
import { RequirementCategoryTreeItemModel } from '../../models/data/requirement-category-tree-item-model';
import { ProfileListItemModel } from '../../models/data/profile-list-item-model';
import { RequirementCategoryLinkProfileModel } from '../../models/data/requirement-category-link-profile-model';
import { RequirementLinkProfileModel } from '../../models/data/requirement-link-profile-model';

export type AppDataContextRequirementEndpointsModel = {
  createUserAnswersAgreementAsync: (requirement: RequirementModel) => Promise<RequirementModel>;

  createUserAnswersAsync: (requirement: RequirementModel) => Promise<RequirementModel>;

  getRequirementListAsync: () => Promise<RequirementModel[] | null>;

  deleteRequirementAsync: (requirementId: number) => Promise<RequirementModel | null>;

  getRequirementAsync: (requirementId: number) => Promise<RequirementModel | null>;

  getRequirementStageListAsync: (requirementId: number) => Promise<RequirementStageModel[] | null>;

  postRequirementStateAsync: (requirementId: number, state: RequirementStates, requirementComment: RequirementCommentModel | null) => Promise<RequirementModel | null>;

  getRequirementCategoriesAsync: () => Promise<RequirementCategoryModel[] | null>;

  getRequirementCategoryTreeItemListAsync: () => Promise<RequirementCategoryTreeItemModel[] | null>;

  getRequirementCategoryProfileListAsync: (requirementCategoryId: number) => Promise<ProfileListItemModel[] | null>;

  deleteRequirementCategoryProfileAsync: (profileId: number, requirementCategoryId: number) => Promise<RequirementCategoryLinkProfileModel | null>;

  deleteRequirementCategoryAsync: (requirementCategoryId: number) => Promise<RequirementCategoryModel | null>;

  postRequirementCategoryAsync: (requirementCategory: RequirementCategoryModel) => Promise<RequirementCategoryModel | null>;

  putRequirementCategoryAsync: (requirementCategory: RequirementCategoryModel) => Promise<RequirementCategoryModel | null>;

  postRequirementCategoryProfileAsync: (profileListItem: ProfileListItemModel[], requirementCategoryId: number) => Promise<RequirementCategoryLinkProfileModel[] | null>;

  getRequirementCommentAsync: (requirementStageId: number) => Promise<RequirementCommentModel | null>;

  getRequirementOutgoingNumberAsync: () => Promise<number | null>;

  postRequirementArchiveAsync: (requirementId: number) => Promise<RequirementLinkProfileModel | null>;

  putReassignRequirementAsync: (reassignedProfileList: ProfileListItemModel[], requirementId: number) => Promise<RequirementLinkProfileModel[] | null>;
}

export const useRequirementData = () => {
  const authHttpRequest = useAuthHttpRequest();

  const baseRoute = useMemo<string>(() => {
    return '/requirements';
  }, []);

  const createUserAnswersAgreementAsync = useCallback(async (requirement: RequirementModel) => {
    const response = await authHttpRequest({
      method: 'PUT',
      url: `${baseRoute}/with-agreement`,
      data: requirement,
    });

    return response ? response.data as RequirementModel : null;
  }, [authHttpRequest, baseRoute]);

  const createUserAnswersAsync = useCallback(async (requirement: RequirementModel) => {
    const response = await authHttpRequest({
      method: 'PUT',
      url: baseRoute,
      data: requirement,
    });

    return response ? response.data as RequirementModel : null;
  }, [authHttpRequest, baseRoute]);

  const getRequirementListAsync = useCallback(async () => {
    const response = await authHttpRequest({
      method: 'GET',
      url: baseRoute
    });

    return response ? response.data as RequirementModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const deleteRequirementAsync = useCallback(async (requirementId: number) => {
    const response = await authHttpRequest({
      method: 'DELETE',
      url: `${baseRoute}/${requirementId}`,
    });

    return response ? response.data as RequirementModel : null;
  }, [authHttpRequest, baseRoute]);

  const getRequirementAsync = useCallback(async (requirementId: number) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/${requirementId}`,
    });

    return response ? response.data as RequirementModel : null;
  }, [authHttpRequest, baseRoute]);

  const getRequirementStageListAsync = useCallback(async (requirementId: number) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/requirement-stage-list/${requirementId}`,
    });

    return response ? response.data as RequirementStageModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const postRequirementStateAsync = useCallback(async (requirementId: number, state: RequirementStates, requirementComment: RequirementCommentModel | null) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: `${baseRoute}/change-state/${requirementId}`,
      data: {
        requirementComment: requirementComment,
        state: state,
      } as RequirementCommentStateModel,
    });

    return response ? response.data as RequirementModel : null;
  }, [authHttpRequest, baseRoute]);

  const getRequirementCategoriesAsync = useCallback(async () => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/requirement-category-list`,
    });

    return response ? response.data as RequirementCategoryModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const getRequirementCategoryTreeItemListAsync = useCallback(async () => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/requirement-category-tree-item-list`,
    });

    return response ? response.data as RequirementCategoryTreeItemModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const getRequirementCategoryProfileListAsync = useCallback(async (requirementCategoryId: number) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/requirement-category-profile-list/${requirementCategoryId}`,
    });

    return response ? response.data as ProfileListItemModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const deleteRequirementCategoryProfileAsync = useCallback(async (profileId: number, requirementCategoryId: number) => {
    const response = await authHttpRequest({
      method: 'DELETE',
      url: `${baseRoute}/requirement-category-profile-list/${profileId}/${requirementCategoryId}`,
    });

    return response ? response.data as RequirementCategoryLinkProfileModel : null;
  }, [authHttpRequest, baseRoute]);

  const deleteRequirementCategoryAsync = useCallback(async (requirementCategoryId: number) => {
    const response = await authHttpRequest({
      method: 'DELETE',
      url: `${baseRoute}/requirement-category/${requirementCategoryId}`,
    });

    return response ? response.data as RequirementCategoryModel : null;
  }, [authHttpRequest, baseRoute]);

  const postRequirementCategoryAsync = useCallback(async (requirementCategory: RequirementCategoryModel) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: `${baseRoute}/update-requirement-category`,
      data: requirementCategory
    });

    return response ? response.data as RequirementCategoryModel : null;
  }, [authHttpRequest, baseRoute]);

  const putRequirementCategoryAsync = useCallback(async (requirementCategory: RequirementCategoryModel) => {
    const response = await authHttpRequest({
      method: 'PUT',
      url: `${baseRoute}/create-requirement-category`,
      data: requirementCategory
    });

    return response ? response.data as RequirementCategoryModel : null;
  }, [authHttpRequest, baseRoute]);

  const postRequirementCategoryProfileAsync = useCallback(async (profileListItem: ProfileListItemModel[], requirementCategoryId: number) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: `${baseRoute}/update-requirement-category-profile-list/${requirementCategoryId}`,
      data: profileListItem
    });

    return response ? response.data as RequirementCategoryModel : null;
  }, [authHttpRequest, baseRoute]);

  const getRequirementCommentAsync = useCallback(async (requirementStageId: number) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/requirement-comment/${requirementStageId}`,
    });

    return response ? response.data as RequirementCommentModel : null;
  }, [authHttpRequest, baseRoute]);

  const getRequirementOutgoingNumberAsync = useCallback(async (suppressLoader: boolean = true) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/requirement-outgoing-number`,
    }, suppressLoader);

    return response ? response.data as number : null;
  }, [authHttpRequest, baseRoute]);

  const postRequirementArchiveAsync = useCallback(async (requirementId: number) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: `${baseRoute}/archive/${requirementId}`,
    });

    return response ? response.data as RequirementLinkProfileModel : null;
  }, [authHttpRequest, baseRoute]);

  const putReassignRequirementAsync = useCallback(async (reassignedProfileList: ProfileListItemModel[], requirementId: number) => {
    const response = await authHttpRequest({
      method: 'PUT',
      url: `${baseRoute}/reassign-requirement/${requirementId}`,
      data: reassignedProfileList
    });

    return response ? response.data as RequirementLinkProfileModel[] : null;
  }, [authHttpRequest, baseRoute]);

  return {
    createUserAnswersAgreementAsync,
    createUserAnswersAsync,
    getRequirementListAsync,
    deleteRequirementAsync,
    getRequirementAsync,
    getRequirementStageListAsync,
    postRequirementStateAsync,
    getRequirementCategoriesAsync,
    getRequirementCategoryTreeItemListAsync,
    getRequirementCategoryProfileListAsync,
    deleteRequirementCategoryProfileAsync,
    deleteRequirementCategoryAsync,
    postRequirementCategoryAsync,
    putRequirementCategoryAsync,
    postRequirementCategoryProfileAsync,
    getRequirementCommentAsync,
    getRequirementOutgoingNumberAsync,
    postRequirementArchiveAsync,
    putReassignRequirementAsync
  };
};