import { useAuthHttpRequest } from './use-auth-http-request';
import { useCallback, useMemo } from 'react';
import { ProfileModel } from '../../models/data/profile-model';
import { ChangePasswordModel } from '../../models/data/change-password-model';
import { UserModel } from '../../models/data/user-model';
import { ProfileListItemModel } from '../../models/data/profile-list-item-model';

export type AppDataContextProfileEndpointsModel = {
  getProfileAsync: () => Promise<ProfileModel | null>;

  postProfileAsync: (profile: ProfileModel) => Promise<ProfileModel | null>;

  postChangePasswordAsync: (changePassword: ChangePasswordModel) => Promise<UserModel | null>;

  getProfileExistAsync: () => Promise<boolean | null>;

  putProfileAsync: (profile: ProfileModel) => Promise<ProfileModel | null>;

  getProfileListAsync: (subdivisionId: number | null) => Promise<ProfileListItemModel[] | null>;

  postSubdivisionMembersAsync: (updatedProfileList: ProfileListItemModel[] | null) => Promise<ProfileListItemModel[] | null>;

  getCurrentProfileAsync: (userId: number) => Promise<ProfileListItemModel | null>;
}

export const useProfileData = () => {
  const authHttpRequest = useAuthHttpRequest();

  const baseRoute = useMemo<string>(() => {
    return '/profiles';
  }, []);

  const getProfileAsync = useCallback(async () => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}`,
    });

    return response ? response.data as ProfileModel : null;
  }, [authHttpRequest, baseRoute]);

  const postProfileAsync = useCallback(async (profile: ProfileModel) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: `${baseRoute}`,
      data: profile,
    });

    return response ? response.data as ProfileModel : null;
  }, [authHttpRequest, baseRoute]);

  const postChangePasswordAsync = useCallback(async (changePassword: ChangePasswordModel) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: `${baseRoute}/change-password`,
      data: changePassword,
    });

    return response ? response.data as UserModel : null;
  }, [authHttpRequest, baseRoute]);

  const getProfileExistAsync = useCallback(async () => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/profile-exists`,
    });

    return response ? response.data as boolean : null;
  }, [authHttpRequest, baseRoute]);

  const putProfileAsync = useCallback(async (profile: ProfileModel) => {
    const response = await authHttpRequest({
      method: 'PUT',
      url: `${baseRoute}`,
      data: profile
    });

    return response ? response.data as ProfileModel : null;
  }, [authHttpRequest, baseRoute]);

  const getProfileListAsync = useCallback(async (subdivisionId: number | null) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/list${subdivisionId ? `?subdivisionId=${subdivisionId}` : ''}`,
    });

    return response ? response.data as ProfileListItemModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const postSubdivisionMembersAsync = useCallback(async (updatedProfileList: ProfileListItemModel[]) => {
    const response = await authHttpRequest({
      method: 'POST',
      url: `${baseRoute}/subdivision-members`,
      data: updatedProfileList,
    });

    return response ? response.data as ProfileListItemModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const getCurrentProfileAsync = useCallback(async (userId: number) => {
    const response = await authHttpRequest({
      method: 'GET',
      url: `${baseRoute}/${userId}`
    });

    return response ? response.data as ProfileListItemModel : null;
  }, [authHttpRequest, baseRoute]);

  return {
    getProfileAsync,
    postProfileAsync,
    postChangePasswordAsync,
    getProfileExistAsync,
    putProfileAsync,
    getProfileListAsync,
    postSubdivisionMembersAsync,
    getCurrentProfileAsync
  };
};