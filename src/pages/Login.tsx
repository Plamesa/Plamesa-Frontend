import React, { useState } from 'react';
import './Login.css'
import auth from '../services/LoginService';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de autenticación aquí
    console.log('Formulario enviado:', formData);

    try {
      auth
        .login(formData.username, formData.password)
        .then((response) => {
          console.log(response)
          if (response.status == 200) {
            localStorage.setItem('token', response.data.token);
          }
        })
        .catch((error) => {
          console.log(error)
          
        })
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </>
  )
}

export default Login