export interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  description?: string;
  url?: string;
  image?: string;
  author?: string;
  category?: string;
  cuisine?: string;
  yields?: string;
  total_time?: number;
  createdBy: string;
}

export type RecipeCreationParams = Omit<Recipe, "_id">;