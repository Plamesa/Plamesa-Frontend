import { ActivityLevel, Allergen, FoodGroup, FoodType, Gender, IngredientRecipe, Nutrient } from "./enums";

export interface UserInfoInterface {
  username: string;
  name: string;
  password: string;
  email: string;
  gender: Gender;
  weight: number;
  height: number;
  age: number;
  activityLevel: ActivityLevel;
  allergies: Allergen[];
  diet: string;
  excludedIngredients: { _id: string; name: string }[];
}

export interface IngredientInterface {
  _id: string;
  name: string;
  amount: number;
  unit: string;
  estimatedCost: number;
  foodGroup: FoodGroup;
  allergens: string[];
  nutrients: Nutrient[];
  ownerUser: string;
}

export interface GETIngredientInterface {
  _id: string;
  name: string;
  amount: number;
  unit: string;
  estimatedCost: number;
  foodGroup: FoodGroup;
  allergens: string[];
  nutrients: Nutrient[];
  ownerUser: { _id: string, username: string };
}

export interface CreateIngredientInterface {
  _id: string;
  name: string;
  amount: number;
  unit: string;
  estimatedCost: string;
  foodGroup: FoodGroup;
  allergens: string[];
  nutrients: Nutrient[];
  ownerUser: string;
}

export interface RecipeInterface {
  _id: string;
  name: string;
  numberService: number;
  preparationTime: number;
  foodType: FoodType;
  instructions: string[];
  comments: string;
  cookware: string[];
  ingredients: IngredientRecipe[];
  estimatedCost: number;
  allergens: string[];
  nutrients: Nutrient[];
  ownerUser: string;
}

export interface GETRecipeInterface {
  _id: string;
  name: string;
  numberService: number;
  preparationTime: number;
  foodType: FoodType;
  instructions: string[];
  comments: string;
  cookware: string[];
  ingredients: {amount: number, ingredientID: {name: string, _id: string}}[];
  estimatedCost: number;
  allergens: string[];
  nutrients: Nutrient[];
  ownerUser: { _id: string, username: string };
}