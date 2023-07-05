import { useCallback, useMemo } from 'react';
import { LoginModel } from '../../models/data/login-model';
import { httpClientBase } from './http-client-base';
import { AuthUserModel } from '../../models/data/auth-user-model';

export type AppDataContextLoginEndpointsModel = {
  getLoginAsync: (login: LoginModel) => Promise<AuthUserModel | null>;
}

export const useLoginData = () => {
  const baseRoute = useMemo<string>(() => {
    return '/login';
  }, []);

  const getLoginAsync = useCallback(async (login: LoginModel) => {
    if (login && login.password) {
      const encodedPassword = encodeURIComponent(login.password);

      try {
        const response = await httpClientBase.request({
          method: 'GET',
          url: `${baseRoute}?email=${login.email}&password=${encodedPassword}&isInternal=${login.isInternal}`,
        });
        return response.data as AuthUserModel;
      } catch (ex) {
        return null;
      }
    }
  }, [baseRoute]);

  return {
    getLoginAsync
  };
};