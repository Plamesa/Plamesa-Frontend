import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface JwtPayload {
  exp: number; // Campo de expiración en el token JWT
}

function useAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Eliminar el token y redirigir si está caducado
        localStorage.removeItem('token');
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/login');
      } else {
        // Tiempo restante hasta la expiración del token
        const timeRemaining = (decodedToken.exp - currentTime) * 1000;

        // Configurar temporizador para advertir antes de que expire el token
        if (timeRemaining <= 60000) {
          setTimeout(() => {
            alert('Tu sesión expirará en menos de un minuto. Por favor, guarda tu trabajo.');
          }, timeRemaining - 59000); // Aproximadamente 1 minuto antes de la expiración
        }

        // Temporizador para eliminar el token y redirigir después de la expiración
        setTimeout(() => {
          localStorage.removeItem('token');
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          navigate('/login');
        }, timeRemaining);
      }
    }
  }, [navigate]);

  return null; // No necesita devolver ningún JSX
}

export default useAuth;