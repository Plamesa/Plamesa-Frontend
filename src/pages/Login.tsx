import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link for navigation
import auth from '../services/LoginService';
import logo from '../assets/LOGIN-16.svg';
import './Login.css'

interface LoginFormData {
  username: string;
  password: string;
}

function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    console.log('Formulario enviado:', formData);
    try {
      auth
        .login(formData.username, formData.password)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            localStorage.setItem('token', response.data.token);
            alert('¡Se ha iniciado sesión correctamente!');
            navigate('/');
          }
          else {
            alert('Ha ocurrido algún problema en la autentificación del usuario')
          }

          /*if (history.length > 1) { 
            navigate(-1);
          } else {
            navigate('/');
          }*/
        })
        .catch((error) => {
          console.log(error)
          if (error && error.response) {
            if (error.response.status === 404) {
              alert('El usuario introducido no existe');
            } else if (error.response.status === 401) {
              alert('Credenciales incorrectas');
            } else {
              alert(`Error inesperado: ${error.response.status}`);
            }
          } else {
            alert('Error inesperado. Por favor, inténtelo de nuevo más tarde.');
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='containerFormLogin'>
      <div className='formContent'>
        <img src={logo} alt="Plamesa Logo" className='logoIcon'/>
      
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            variant="filled"
            id="username"
            label="Nombre de Usuario"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className='textField'
          />

          <TextField
            margin="normal"
            required
            fullWidth
            variant="filled"
            id="password"
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className='textField'
          />

          <Button type="submit" variant="contained" className='botonLogin'>
            Iniciar sesión
          </Button>
        </form>

        <Link to="/register" className='registerURL'>Registrarse</Link>
      </div>
    </div>
  );
}

export default Login;
