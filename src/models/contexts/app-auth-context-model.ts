import { AuthUserModel } from '../data/auth-user-model';

export type AppAuthContextModel = {
  refreshStateTag?: string,

  isAuth: () => boolean;

  signIn: (authUser: AuthUserModel, rememberMe: boolean) => void;

  signOut: () => void;

  getAuthUser: () => AuthUserModel | null;

  isUser: () => boolean;

  isAdmin: () => boolean;
}
