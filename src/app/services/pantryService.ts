import axios from 'axios';
import {
  Category,
  Ingredient,
  PantryIngredient,
  PantryIngredientCreationParams,
  PantryIngredientQueryParams,
  PantryIngredientUpdateParams,
  Unit,
} from '../types/Pantry';

// Set in .env. NEXT_PUBLIC_ so Next.js inlines it into the browser bundle.
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PANTRY_URL = `${API_URL}/pantry`;

// Pantry routes act on whoever the Clerk session token belongs to, so every call sends it
const authConfig = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchPantryIngredients = async (
  token: string,
  params: PantryIngredientQueryParams
): Promise<PantryIngredient[]> => {
  const response = await axios.get(`${PANTRY_URL}/ingredients`, { ...authConfig(token), params });
  return response.data;
};

// Categories used in the signed-in user's pantry, for the filter dropdown
export const fetchPantryCategories = async (token: string): Promise<Category[]> => {
  const response = await axios.get(`${PANTRY_URL}/categories`, authConfig(token));
  return response.data;
};

export const addPantryIngredient = async (
  token: string,
  ingredient: PantryIngredientCreationParams
): Promise<PantryIngredient> => {
  const response = await axios.post(`${PANTRY_URL}/ingredients`, ingredient, authConfig(token));
  return response.data;
};

export const updatePantryIngredient = async (
  token: string,
  pantryIngredientId: string,
  updates: PantryIngredientUpdateParams
): Promise<PantryIngredient> => {
  const response = await axios.patch(`${PANTRY_URL}/ingredients/${pantryIngredientId}`, updates, authConfig(token));
  return response.data;
};

export const removePantryIngredient = async (
  token: string,
  pantryIngredientId: string
): Promise<void> => {
  await axios.delete(`${PANTRY_URL}/ingredients/${pantryIngredientId}`, authConfig(token));
};

export const searchIngredientCatalog = async (name: string): Promise<Ingredient[]> => {
  const response = await axios.get(`${API_URL}/ingredients`, { params: { name, limit: 10 } });
  return response.data;
};

// The full fixed list of categories, for choosing one when adding an ingredient
export const fetchCategoryOptions = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_URL}/ingredients/categories`);
  return response.data;
};

// The full fixed list of units, for choosing one when adding an ingredient
export const fetchUnitOptions = async (): Promise<Unit[]> => {
  const response = await axios.get(`${API_URL}/ingredients/units`);
  return response.data;
};

// Pulls the backend's ApiError message out of a failed request
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return fallback;
};
