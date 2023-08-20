export interface AccessTokenPayload {
  userId: number;
}

export class AuthEntity {
  accessToken: string;
  accessTokenExpires: number;
}
