import axios from 'axios';

interface KrogerAccessJwt {
    aud: string;        // Audience
    exp: number;        // Expiration Time (Unix timestamp)
    iat: number;        // Issued At (Unix timestamp)
    iss: string;        // Issuer
    sub: string;        // Subject
    scope: string;      // Scope
    authAt: number;     // Authentication Time (Unix timestamp with nanoseconds)
    pfcx: string;       // Custom Claim (pfcx)
    azp: string;        // Authorized Party
  }

export const fetchAccessToken = async (authorizationCode: string, redirectUri: string): Promise<KrogerAccessJwt> => {
  try {
    const response = await axios.post<KrogerAccessJwt>(
      "https://api.kroger.com/v1/connect/oauth2/token",
      `grant_type=authorization_code&code=${encodeURIComponent(authorizationCode)}&redirect_uri=${encodeURIComponent(redirectUri)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${process.env.NEXT_PUBLIC_KROGER_API_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken: string, redirectUri: string): Promise<KrogerAccessJwt> => {
  try {
    const response = await axios.post<KrogerAccessJwt>(
      "https://api.kroger.com/v1/connect/oauth2/token",
      `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}&redirect_uri=${encodeURIComponent(redirectUri)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${process.env.NEXT_PUBLIC_KROGER_API_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
