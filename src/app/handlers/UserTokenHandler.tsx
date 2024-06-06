import axios from "axios";
import { KrogerAccessJwt } from '../types/KrogerAccessJwt';

async function fetchUserToken(email: string): Promise<string | null> {
  try {
    const response = await axios.get(`/users/getToken`, { params: { email } });
    return response.data;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}

export async function handleToken(email: string): Promise<string | null> {
  const token = await fetchUserToken(email);

  if (token) {
    localStorage.setItem("customer_access_token", token);
    return token;
  } else {
    console.error("Failed to get new token");
    return null;
  }
}

export const fetchKrogerAccessToken = async (authorizationCode: string, redirectUri: string): Promise<KrogerAccessJwt> => {
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
  
