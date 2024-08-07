import axios from 'axios';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

let storedToken = ''; // Token storage

const isTokenExpired = (token: string | null): boolean => {
  if (!token || typeof token !== 'string') {
    console.error("Invalid token:", token);
    return true; // Consider invalid tokens as expired
  }

  try {
    const decoded = jwtDecode(token) as { exp: number };
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

const ensureToken = async (userEmail: string) => {
  const localStoredToken = localStorage.getItem("customer_access_token");
  if (localStoredToken) {
    try {
      const parsedToken = JSON.parse(localStoredToken);
      if (typeof parsedToken !== 'string') {
        console.error("Stored token is not a string:", parsedToken);
        return await fetchTokenFromBackend(userEmail);
      }
      if (isTokenExpired(parsedToken)) {
        return await fetchTokenFromBackend(userEmail);
      } else {
        storedToken = parsedToken;
        return parsedToken;
      }
    } catch (error) {
      console.error("Error parsing stored token:", error);
      return await fetchTokenFromBackend(userEmail);
    }
  } else {
    return await fetchTokenFromBackend(userEmail);
  }
};

const fetchTokenFromBackend = async (userEmail: string) => {
  const endpoint = "http://localhost:3333/users/getToken";
  try {
    const response = await axios.get(endpoint, {
      params: {
        email: userEmail,
      },
      headers: {
        accept: "application/json",
      },
    });
    const responseData = response.data;
    if (responseData && typeof responseData === 'string') {
      localStorage.setItem("customer_access_token", JSON.stringify(responseData));
      storedToken = responseData;
      return responseData;
    } else {
      console.error("Invalid token received from backend:", responseData);
      return null;
    }
  } catch (error) {
    console.error("Error fetching token from backend:", error);
  }
  return null;
};
const waitForToken = async (): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (storedToken) {
      resolve();
    } else {
      console.log("waiting for token to be set");
      const checkTokenInterval = setInterval(() => {
        if (storedToken) {
          clearInterval(checkTokenInterval);
          resolve();
        }
      }, 100); // Check every 100ms
    }
  });
};

const useToken = (user: any) => {
  const [token, setToken] = useState(storedToken);

  useEffect(() => {
    if (storedToken) {
      console.log("useState Token has been updated");
    }
  }, [storedToken]);

  useEffect(() => {
    const fetchAndStoreToken = async () => {
      if (user) {
        const token = await ensureToken(user.emailAddresses[0].emailAddress);
        if (token) {
          setToken(token);
        }
      }
    };

    fetchAndStoreToken();
  }, [user]);

  return token;
};

export { ensureToken, useToken, isTokenExpired, waitForToken };