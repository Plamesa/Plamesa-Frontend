import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa Axios para realizar solicitudes HTTP

function Acount() {
  const [user, setUser] = useState();
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '');


  useEffect(() => {
    const fetchFoods = async () => {
      try {
        // Envía el token en el encabezado de la solicitud
        const response = await axios.get('http://localhost:3000/user/ivalas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
        console.log('Error :', user);

      } catch (error) {
        console.error('Error al obtener alimentos:', error); 
      }
    };

    fetchFoods();
  }, [token]);

  return (
    <div>
      <h2>Usuario:</h2>
      {user ? (
        <div>
          <p>Nombre: {user.name}</p>
          <p>Email: {user.email}</p>
          {/* Agrega más campos de usuario según tus necesidades */}
        </div>
      ) : (
        <p>Cargando usuario...</p>
      )}
    </div>
  )
}

export default Acount