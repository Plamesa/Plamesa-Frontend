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
        path: "login",
        element: <LoginPage />,
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);