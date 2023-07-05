import { useCallback, useMemo } from 'react';
import { CorporateAccountActivatorModel } from '../../models/data/corporate-account-activator-model';
import { httpClientBase } from './http-client-base';
import { AuthUserModel } from '../../models/data/auth-user-model';
import { UserRegistrationModel } from '../../models/data/user-registration-model';

export type AppDataContextRegistrationEndpointsModel = {
  getInviteCorporateUserAsync: (activator: CorporateAccountActivatorModel) => Promise<CorporateAccountActivatorModel | null>;

  getConfirmCorporateUserAsync: (query: string) => Promise<AuthUserModel | null>;

  getInviteAsync: (userRegistration: UserRegistrationModel) => Promise<UserRegistrationModel | null>;

  getConfirmAsync: (query: string) => Promise<AuthUserModel | null>;
};

export const useRegistrationData = () => {

  const baseRoute = useMemo<string>(() => {
    return '/registrations';
  }, []);

  const getInviteCorporateUserAsync = useCallback(async (activator: CorporateAccountActivatorModel) => {
    if (activator && activator.email) {
      try {
        const response = await httpClientBase.request({
          method: 'GET',
          url: `${baseRoute}/invite-corporate?email=${activator.email}`
        });

        return response.data as CorporateAccountActivatorModel;
      } catch (ex) {
        return null;
      }
    }
  }, [baseRoute]);

  const getConfirmCorporateUserAsync = useCallback(async (query: string) => {
    if (query) {
      try {
        const response = await httpClientBase.request({
          method: 'GET',
          url: `${baseRoute}/confirm-corporate?${query}`
        });

        return response.data as AuthUserModel | null;
      } catch (ex) {
        return null;
      }
    }
  }, [baseRoute]);

  const getInviteAsync = useCallback(async (userRegistration: UserRegistrationModel) => {
    const encodedComponentUri = Object.keys(userRegistration)
      .map(u => `${u}=${encodeURIComponent(userRegistration[u])}`)
      .reduce((prev, curr) => `${prev}&${curr}`);

    try {
      const response = await httpClientBase.request({
        method: 'GET',
        url: `${baseRoute}/invite?${encodedComponentUri}`
      });

      return response.data as UserRegistrationModel;
    } catch (ex) {
      return null;
    }
  }, [baseRoute]);

  const getConfirmAsync = useCallback(async (query: string) => {
    try {
      const response = await httpClientBase.request({
        method: 'GET',
        url: `${baseRoute}/confirm?${query}`
      });

      return response.data as AuthUserModel;
    } catch (ex) {
      return null;
    }
  }, [baseRoute]);

  return {
    getInviteCorporateUserAsync,
    getConfirmCorporateUserAsync,
    getInviteAsync,
    getConfirmAsync
  };
};