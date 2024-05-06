import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import auth from '../services/LoginService';
import logo from '../assets/LOGIN-16.svg';
import './Register.css'

interface RegisterFormData {
  username: string;
  name: string;
  password: string;
  email: string;
}

function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    name: '',
    password: '',
    email: '',
  });

  const [errors, setErrors] = useState<{ password?: string; email?: string }>({}); // Estado para mensajes de error
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: { password?: string; email?: string } = {};

    // Validación de la contraseña
    const passwordPattern = /^(?=.*[0-9])(?=.*[A-ZÑ])[a-zA-Z0-9Ññ]{6,}$/;
    if (!passwordPattern.test(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos una mayúscula, un número y ser de 6 caracteres.';
      valid = false;
    }

    // Validación del correo electrónico
    const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Correo electrónico no válido.';
      valid = false;
    }

    setErrors(newErrors); // Actualiza los errores
    return valid;
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Si hay errores, no envíes el formulario
      return;
    }

    console.log('Formulario enviado:', formData);
    try {
      auth
        .register(formData.username, formData.name, formData.password, formData.email)
        .then(async (response) => {
          console.log(response);
          if (response.status === 201) {
            console.log('Se ha creado correctamente');
            logUser();
          }
          else {
            alert('Ha ocurrido algun problema en la creación de usuario')
          }
        })
        .catch((error) => {
          console.log(error)
          if (error.response.status === 404) {
            alert('El usuario introducido no existe');
          }
          else if (error.response.status === 401) {
            alert('Credenciales incorrectas');
          }
          else if (error.response.status === 500) {
            alert('Error en el servidor')
            console.log(error)
          }
          })
    } catch (error) {
      console.log(error);
    }
  };


  function logUser() {
    try {
      auth
          .login(formData.username, formData.password)
          .then((responseLogin) => {
            if (responseLogin.status === 200) {
              localStorage.setItem('token', responseLogin.data.token);
              alert('Todo perfect')
              navigate('/');
            }
            else {
              alert('Ha ocurrido algun problema en la autentificacion del usuario')
            }
          })
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='containerForm'>
      <div className='formContent'>
        <form onSubmit={handleSubmit}>
          <img src={logo} alt="Plamesa Logo" className='logoIcon'/>

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
            id="name"
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
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
            error={Boolean(errors.password)} // Muestra el error
            helperText={errors.password} // Mensaje de error
          />

          <TextField
            margin="normal"
            required
            fullWidth
            variant="filled"
            id="email"
            label="Correo"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className='textField'
            error={Boolean(errors.email)} // Muestra el error
            helperText={errors.email} // Mensaje de error
          />
          
          <Button type="submit" variant="contained" className='botonRegister'>
            Registrarse
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Register;