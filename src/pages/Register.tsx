import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, FilledInput, InputAdornment, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import auth from '../services/LoginService';
import logo from '../assets/LOGIN-16.svg';
import './Register.css'
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const [errors, setErrors] = useState<{ password?: string; email?: string }>({}); // Estado para mensajes de error
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: { password?: string; email?: string } = {};

    // Validación de la contraseña
    const passwordPattern = /^(?=.*[0-9])(?=.*[A-ZÑ])[a-zA-Z0-9Ññ]{6,}$/;
    if (!passwordPattern.test(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos una mayúscula, un número y tener mínimo 6 caracteres.';
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
        .then((response) => {
          console.log(response);
          if (response.status === 201) {
            console.log('Se ha creado correctamente');
            logUser();
          }
          else {
            alert('Ha ocurrido algún problema en la creación de usuario')
          }
        })
        .catch((error) => {
          console.log(error)
          if (error.response && error.response.data && error.response.data.code) {
            if (error.response.data.code === 11000) {
              const fieldWithError = Object.keys(error.response.data.keyPattern)[0];
              const valueWithError = error.response.data.keyValue[fieldWithError];
          
              alert(`El ${fieldWithError}: "${valueWithError}" ya existe.`);
            }
          } else {
            alert('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
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
              alert('Se ha creado el usuario correctamente y se ha iniciado sesión')
              navigate('/');
            }
            else {
              alert('Ha ocurrido algún problema en la autentificación del usuario')
            }
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

          <FormControl variant="filled" margin="normal" fullWidth required error={Boolean(errors.password)}>
            <InputLabel htmlFor="filled-adornment-password">Contraseña</InputLabel>
            <FilledInput
              id="filled-adornment-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className='textField'
            />
            {errors.password && <Typography variant="caption" color="error" className='errorContainer'>{errors.password}</Typography>}
          </FormControl>

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