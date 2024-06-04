export interface TokenHandler {
    fetchAccessToken: (authorizationCode: string, redirectUri: string) => Promise<any>;
    refreshAccessToken: (refreshToken: string, redirectUri: string) => Promise<any>;
  }