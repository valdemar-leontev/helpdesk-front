import { AxiosError, AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import notify from 'devextreme/ui/notify';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { appConstants } from '../../constants/app-constants';
import { HttpConstants } from '../../constants/http-constants';
import { AuthUserModel } from '../../models/data/auth-user-model';
import { useAppAuthContext } from '../app-auth-context';
import { useAppSharedContext } from '../app-shared-context';
import { httpClientBase } from './http-client-base';

type AxiosWithCredentialsFunc = (config: AxiosRequestConfig, suppressLoader?: boolean) => Promise<AxiosResponse | null | undefined>;

export const useAuthHttpRequest = (): AxiosWithCredentialsFunc => {

  const { getAuthUser, signOut } = useAppAuthContext();
  const navigate = useNavigate();
  const { setIsShowLoadPanel } = useAppSharedContext();

  const postRefreshTokenAsync = useCallback(async () => {
    const authUser = getAuthUser();
    if (!authUser) {
      return null;
    }

    try {
      const response = await httpClientBase.request({
        method: 'POST',
        url: '/login',
        data: authUser,
      });

      return response.data as AuthUserModel;
    } catch (ex) {
      return null;
    }
  }, [getAuthUser]);


  const authHttpRequest = useCallback<AxiosWithCredentialsFunc>(async (config: AxiosRequestConfig<any>, suppressLoader: boolean = false) => {
    let response: AxiosResponse<any, any> | null | undefined = null;
    const authUser = getAuthUser();
    config = config || {};
    config.headers = config.headers || {};
    config.headers = { ...config.headers, ...HttpConstants.Headers.AcceptJson } as RawAxiosRequestHeaders;

    if (authUser) {
      config.headers.Authorization = `Bearer ${authUser.token}`;
    }

    try {
      if (!suppressLoader) {
        setIsShowLoadPanel(true);
      }

      response = await httpClientBase.request(config) as AxiosResponse;
    } catch (error) {
      const errorResponse = (error as AxiosError).response;

      if (errorResponse?.status === HttpConstants.StatusCodes.Unauthorized) {
        if (sessionStorage.getItem('previousRefreshToken') === authUser?.refreshToken) {

          return null;
        }

        if(authUser){
          sessionStorage.setItem('previousRefreshToken', authUser.refreshToken);
        }

        const newAuthUser = await postRefreshTokenAsync();

        if (newAuthUser) {
          if (sessionStorage.getItem('currentAuthUser')) {
            sessionStorage.setItem('currentAuthUser', JSON.stringify(newAuthUser));

            return await authHttpRequest(config);
          }

          if (localStorage.getItem('currentAuthUser')) {
            localStorage.setItem('currentAuthUser', JSON.stringify(newAuthUser));

            return await authHttpRequest(config);
          }
        } else {
          signOut();
          navigate('/login');

          return null;
        }
      }

      notify(
        (errorResponse && errorResponse.data && (errorResponse.data as any).detail
          ? (errorResponse.data as any).detail
          : appConstants.strings.requestFailed),
        'error',
        10000
      );

      response = null;
    } finally {
      if (!suppressLoader) {
        setTimeout(() => {
          setIsShowLoadPanel(false);
        }, 500);
      }
    }

    return response;
  }, [getAuthUser, navigate, postRefreshTokenAsync, setIsShowLoadPanel, signOut]);

  return authHttpRequest;
};

