// One of the backend's fixed categories, see GET /ingredients/categories
export type Category = string;

// One of the backend's fixed units, see GET /ingredients/units
export type Unit = string;

export interface Ingredient {
  _id: string;
  name: string;
  normalizedName: string;
  unit?: Unit;
  category?: Category;
}

export interface PantryIngredient {
  _id: string;
  pantryId: string;
  ingredientId: string;
  name: string;
  normalizedName: string;
  quantity: number;
  unit?: Unit;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface PantryIngredientCreationParams {
  ingredientId?: string;
  name?: string;
  quantity: number;
  unit?: Unit;
  category?: Category;
}

export type PantryIngredientUpdateParams = Partial<
  Pick<PantryIngredient, "name" | "quantity" | "unit" | "category">
>;

export type PantrySortField = "name" | "quantity" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface PantryIngredientQueryParams {
  search?: string;
  category?: Category;
  addedAfter?: string;
  sortBy?: PantrySortField;
  order?: SortOrder;
}
