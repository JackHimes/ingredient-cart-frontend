import jwt from 'jsonwebtoken';
import { KrogerAccessJwt } from '../types/KrogerAccessJwt';

// Function to extract query parameters from the URL
export const getQueryParam = (name: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};

// Function to check if a token is expired
export const isTokenExpired = (token: string): boolean => {
    try {
      const decodedToken = jwt.decode(token) as { exp: number };
      if (!decodedToken || typeof decodedToken.exp === 'undefined') {
        throw new Error("Invalid token");
      }
      return decodedToken.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Treat token as expired if it can't be decoded
    }
  };

// Function to get a token from local storage
export const getStoredToken = (): KrogerAccessJwt | null => {
  const storedTokenString = localStorage.getItem("customer_access_token");
  return storedTokenString ? JSON.parse(storedTokenString) : null;
};

// Function to save a token to local storage
export const saveToken = (token: KrogerAccessJwt): void => {
  localStorage.setItem("customer_access_token", JSON.stringify(token));
};