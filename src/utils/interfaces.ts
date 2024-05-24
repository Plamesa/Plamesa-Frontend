import { ActivityLevel, Allergen, FoodGroup, Gender, Nutrient } from "./enums";

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