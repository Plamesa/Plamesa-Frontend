import React, { useState } from 'react';
import { TextField, Button, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link for navigation
import auth from '../services/LoginService';
import logo from '../assets/LOGIN-16.svg';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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
          <FormControl variant="filled" margin="normal" fullWidth required>
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
          </FormControl>

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
