export type LoginModel = {
  email: string | null;

  password: string | null;

  rememberMe: boolean;

  isInternal: boolean;

  activateCorporateAccount: boolean;
}
