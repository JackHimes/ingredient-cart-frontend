import axios from 'axios';
import { KrogerAccessJwt } from '../types/KrogerAccessJwt';

export const fetchAccessToken = async (authorizationCode: string, redirectUri: string): Promise<any> => {
  try {
    const response = await axios.post<any>(
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
