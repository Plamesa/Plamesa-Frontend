import React from 'react';
import './Ingredients.css'; // Archivo CSS para animaciones

function Ingredients() {
  return (
    <div className="home" style={{height: '100vh', textAlign: 'center' }}>
      <div className="content" style={{ padding: '20px' }}>  
        <h1 className="animated-text">¡Bienvenido a Plamesa!</h1>
        <p className="animated-subtext">Planificador de menús saludables, adaptado al usuario para una opción nutritiva variada y adaptada al coste de cada uno </p>
      </div>
    </div>
  );
};

export default Ingredients;