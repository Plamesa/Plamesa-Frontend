import React from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../utils/useAuth';
import Navbar from '../components/Navbar';

function Layout() {
  useAuth(); // Verifica el token JWT al cargar el layout

  return (
    <div>
      <Navbar />
      <Outlet /> {/* Esto permite que las rutas cambien aquí */}
    </div>
  );
};

export default Layout;
