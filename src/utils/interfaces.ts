import { ActivityLevel, Allergen, FoodGroup, FoodType, GETRecipesPerDay, Gender, IngredientRecipe, Nutrient, RecipesPerDay } from "./enums";

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
  ingredients: {amount: number, ingredientID: {name: string, _id: string, unit: string}}[];
  estimatedCost: number;
  allergens: string[];
  nutrients: Nutrient[];
  ownerUser: { _id: string, username: string };
}

export interface MenuInterface {
  title: string;
  numberDays: number;
  numberServices: number;
  recipesPerDay: RecipesPerDay[];
  caloriesTarget: number;
  allergies: Allergen[];
  diet: string;
  excludedIngredients: string[]; 
  avergageEstimatedCost: number;
  ownerUser: string;
}

export interface GETMenuInterface {
  _id: string,
  title: string;
  numberDays: number;
  numberServices: number;
  recipesPerDay: GETRecipesPerDay[];
  caloriesTarget: number;
  allergies: Allergen[];
  diet: string;
  excludedIngredients: string[]; 
  avergageEstimatedCost: number;
  ownerUser: string;
}

export interface NutritionResponse {
  basalMetabolism: number;
  totalKcal: number;
  kcalPerMeal: number;
  macros: {
    proteinMin: {
      amount: number;
      percentage: number;
    };
    proteinMax: {
      amount: number;
      percentage: number;
    };
    carbohydrateMin: {
      amount: number;
      percentage: number;
    };
    carbohydrateMax: {
      amount: number;
      percentage: number;
    };
    fatMin: {
      amount: number;
      percentage: number;
    };
    fatMax: {
      amount: number;
      percentage: number;
    };
  };
}