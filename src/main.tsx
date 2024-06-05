import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Account from './pages/Account';
import Home from './pages/Home';
import Ingredients from './pages/Ingredients';
import Layout from './components/Layout'; // Usar Layout
import IngredientDetails from './pages/IngredientDetails';
import IngredientCreate from './pages/IngredientCreate';
import IngredientModify from './pages/IngredientModify';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import RecipeCreate from './pages/RecipeCreate';
import RecipeModify from './pages/RecipeModify';
import RecipesSearchIngredient from './pages/RecipeSearchIngredient';
import Planner from './pages/Planner';
import MenuDetails from './pages/MenuDetails';
import MenuShow from './pages/MenuShow';
import Menus from './pages/Menus';
import GroceryList from './pages/GroceryList';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },

      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "ingredients",
        element: <Ingredients />,
      },
      {
        path: "ingredients/:_id", 
        element: <IngredientDetails />
      },
      {
        path: "ingredients/create", 
        element: <IngredientCreate />
      },
      {
        path: "ingredients/modify/:_id", 
        element: <IngredientModify />
      },
      {
        path: "recipes",
        element: <Recipes />,
      },
      {
        path: "recipes/:_id", 
        element: <RecipeDetails />
      },
      {
        path: "recipes/create", 
        element: <RecipeCreate />
      },
      {
        path: "recipes/modify/:_id", 
        element: <RecipeModify />
      },
      {
        path: "recipesSearch", 
        element: <RecipesSearchIngredient />
      },
      { 
        path: "planner", 
        element: <Planner />
      },
      {
        path: "menuDetails", 
        element: <MenuDetails />
      },
      {
        path: "menus", 
        element: <Menus />
      },
      {
        path: "menus/:_id", 
        element: <MenuShow />
      },
      {
        path: "groceryList", 
        element: <GroceryList />
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);