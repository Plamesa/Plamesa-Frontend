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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);