import { createContext, useCallback, useContext, useState } from 'react';
import { AppAuthContextModel } from '../models/contexts/app-auth-context-model';
import { AuthUserModel } from '../models/data/auth-user-model';
import { v1 as uuid } from 'uuid';
import { Roles } from '../models/enums/roles';

const AppAuthContext = createContext({} as AppAuthContextModel);

function AppAuthContextProvider(props: any) {
  const [refreshStateTag, setRefreshStateTag] = useState<string | undefined>();

  const deserializeAuthUser = useCallback((storedAuthUserStr: string | null) => {
    let deserializedAuthUser: AuthUserModel | null = null;

    if (storedAuthUserStr) {
      const rawData = JSON.parse(storedAuthUserStr);
      if (rawData && rawData.token) {
        deserializedAuthUser = rawData as AuthUserModel;
      }
    }

    return deserializedAuthUser;
  }, []);

  const getAuthUser = useCallback(() => {
    let authUser: AuthUserModel | null = null;
    let storedAuthUserStr = sessionStorage.getItem('currentAuthUser');

    authUser = deserializeAuthUser(storedAuthUserStr);
    if (!authUser) {
      storedAuthUserStr = localStorage.getItem('currentAuthUser');
      authUser = deserializeAuthUser(storedAuthUserStr);
    }

    return authUser;
  }, [deserializeAuthUser]);

  const isAuth = useCallback(() => {

    let storedAuthUserStr = sessionStorage.getItem('currentAuthUser');
    if (deserializeAuthUser(storedAuthUserStr)) {

      return true;
    }

    storedAuthUserStr = localStorage.getItem('currentAuthUser');
    if (deserializeAuthUser(storedAuthUserStr)) {

      return true;
    }

    return false;

  }, [deserializeAuthUser]);

  const signIn = useCallback((authUser: AuthUserModel, rememberMe: boolean) => {
    sessionStorage.removeItem('currentAuthUser');
    localStorage.removeItem('currentAuthUser');

    if (authUser.token) {
      if (rememberMe) {
        localStorage.setItem('currentAuthUser', JSON.stringify(authUser));
      } else {
        sessionStorage.setItem('currentAuthUser', JSON.stringify(authUser));
      }
      setRefreshStateTag(uuid());
    }
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem('currentAuthUser');
    localStorage.removeItem('currentAuthUser');
    setRefreshStateTag(uuid());
  }, []);

  const isUser = useCallback(() => {
    const authUser = getAuthUser();

    return authUser && authUser.roleId === Roles.user;
  }, [getAuthUser]);

  const isAdmin = useCallback(() => {
    const authUser = getAuthUser();

    return authUser && authUser.roleId === Roles.admin;
  }, [getAuthUser]);

  return (
    <AppAuthContext.Provider
      value={{ refreshStateTag, isAuth, signIn, signOut, getAuthUser, isUser, isAdmin }}
      {...props}
    >
      {props.children}
    </AppAuthContext.Provider>
  );
}

const useAppAuthContext = () => useContext(AppAuthContext);

export { AppAuthContextProvider, useAppAuthContext };
