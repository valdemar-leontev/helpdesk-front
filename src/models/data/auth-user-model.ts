export type AuthUserModel = {
  roleId: number;

  userId: number;

  profileId?: number;

  email: string;

  token: string;

  refreshToken: string;
}