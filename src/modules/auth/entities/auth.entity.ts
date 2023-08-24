export interface IAccessTokenPayload {
  userId: number;
}

export class AuthEntity {
  accessToken: string;
  accessTokenExpires: number;
}
