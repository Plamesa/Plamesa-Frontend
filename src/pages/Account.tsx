import React, { useState, useEffect } from 'react';
import userService from '../services/UserService.ts';
//import { TextField, Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
  Button,
  Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Account.css'

interface UserInfoInterface {
  username: string;
  name: string;
  password: string;
  email: string;
  gender: 'Masculino' | 'Femenino';
  weight: number;
  height: number;
  age: number;
  activityLevel: 'Sedentario' | 'Ligero' | 'Moderado' | 'Activo' | 'Muy activo';
}

const genders = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Femenino', label: 'Femenino' },
];

const activityLevel = [
  { value: 'Sedentario', label: 'Poco o ningún ejercicio' },
  { value: 'Ligero', label: 'Ejercicio ligero o deportes 1-3 días por semana' },
  { value: 'Moderado', label: 'Ejercicio moderado o deportes 3-5 días por semana' },
  { value: 'Activo', label: 'Ejercicio intenso o deportes 6-7 días por semana' },
  { value: 'Muy activo', label: 'Muy activo' },
];

// Listado de alérgenos
const allergens = [
  'Gluten',
  'Lactosa',
  'Soja',
  'Frutos secos',
  'Mariscos',
  'Huevos',
];

// Opciones de dietas
const diets = [
  'Vegana',
  'Vegetariana',
  'Omnívora',
  'Paleo',
];

// Lista de ingredientes para excluir
const ingredients = [
  'Tomate',
  'Cebolla',
  'Queso',
  'Leche',
  'Pescado',
  'Carne',
];

function Account() {
  const [userInfo, setUserInfo] = useState<UserInfoInterface>({
    username: '',
    name: '',
    password: '',
    email: '',
    gender: '',
    weight: 0,
    height: 0,
    age: 0,
    activityLevel: ''
  });
  const token = localStorage.getItem('token');

  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedDiet, setSelectedDiet] = useState<string>('');
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);

  useEffect(() => {
    if (token) {
      userService.getUserInfo(token).then((response) => {
        setUserInfo(response.data); // Almacena la información del usuario
      }).catch((error) => {
        console.error('Error al obtener la información del usuario:', error);
      });
    }
  }, [token]); // Se ejecuta cuando el token cambia

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    /*if (!validateForm()) {
      // Si hay errores, no envíes el formulario
      return;
    }*/

    console.log('Formulario enviado:', userInfo);
    try {
      /*auth
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
        })*/
    } catch (error) {
      console.log(error);
    }
  };

  // Manejo de cambio para alérgenos
  const handleAllergensChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedAllergens((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Manejo de cambio para la dieta
  const handleDietChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDiet(event.target.value);
  };

  return (
    /*<div>
      {userInfo ? (
        <div>
          <h2>Perfil del Usuario</h2>
          <p>Nombre: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
        </div>
      ) : (
        <p>Cargando información del usuario...</p>
      )}
    </div>*/
    <div>
      <h4>Para realizar cualquier cambio pulsar el boton de guardar</h4>
      <div className='containerFormAccount'>
        <div className='formContentAccount'>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              variant="filled"
              id="username"
              label="Nombre de Usuario"
              name="username"
              value={userInfo.username}
              onChange={(e) =>
                setUserInfo({ ...userInfo, username: e.target.value })
              }
              className='textFieldAccount'
            />

            <TextField
              margin="normal"
              required
              fullWidth
              variant="filled"
              id="name"
              label="Nombre"
              name="name"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
              className='textFieldAccount'
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
              value={userInfo.password}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
              className='textFieldAccount'
              //error={Boolean(errors.password)} // Muestra el error
              //helperText={errors.password} // Mensaje de error
            />

            <TextField
              margin="normal"
              required
              fullWidth
              variant="filled"
              id="email"
              label="Correo"
              name="email"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
              className='textFieldAccount'
              //error={Boolean(errors.email)} // Muestra el error
              //helperText={errors.email} // Mensaje de error
            />
            
            <Button type="submit" variant="contained" className='botonRegisterAccount'>
              Registrarse
            </Button>
          </form>
        </div>

        <div className='formContentAccount'>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              fullWidth
              variant="filled"
              id="outlined-select-currency"
              select
              label="Genero"
              value={userInfo.gender}
              onChange={(e) =>
                setUserInfo({ ...userInfo, gender: e.target.value })
              }
              className='textFieldAccount'
            >
              {genders.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <OutlinedInput
              fullWidth
              id="outlined-adornment-age"
              endAdornment={<InputAdornment position="end">años</InputAdornment>}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                'aria-label': 'años',
              }}
              value={userInfo.age}
              onChange={(e) =>
                setUserInfo({ ...userInfo, age: e.target.value })
              }
              sx={{mt:1.5, mb:1.5}}
              className='textFieldAccount'
            />

            <div className="rowAccount"> {/* Contenedor Flex para colocar en la misma fila */}
              <OutlinedInput
                fullWidth
                endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{ 'aria-label': 'peso' }}
                value={userInfo.weight}
                onChange={(e) => setUserInfo({ ...userInfo, weight: e.target.value })}
                className='textFieldAccount'
              />

              <OutlinedInput
                fullWidth
                endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                aria-describedby="outlined-height-helper-text"
                inputProps={{ 'aria-label': 'altura' }}
                value={userInfo.height}
                onChange={(e) => setUserInfo({ ...userInfo, height: e.target.value })}
                className='textFieldAccount'
              />
            </div>
            <div className="flex-row">
            <TextField
              margin="normal"
              fullWidth
              variant="filled"
              id="outlined-select-currency"
              select
              label="Nivel de actividad"
              value={userInfo.activityLevel}
              onChange={(e) =>
                setUserInfo({ ...userInfo, activityLevel: e.target.value })
              }
              className="textFieldAccount"
            >
              {activityLevel.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            </div>
            <Button type="submit" variant="contained" className='botonRegisterAccount'>
              Registrarse
            </Button>
          </form>
        </div>
      </div>

      <div className="container2FormAccount">
        {/* Alérgenos (Checkbox) */}
        <div className="form2ContentAccount">
          <FormGroup className='checkBoxAccount'>
            <label className='labelAccount'>Alergenos</label>
            {allergens.map((allergen) => (
              <FormControlLabel
                key={allergen}
                control={
                  <Checkbox
                    value={allergen}
                    checked={selectedAllergens.includes(allergen)}
                    onChange={handleAllergensChange}
                  />
                }
                label={allergen}
              />
            ))}
          </FormGroup>
        </div>

        {/* Dietas (Radio Buttons) */}
        <div className="form2ContentAccount">
          <RadioGroup className='checkBoxAccount' value={selectedDiet} onChange={handleDietChange}>
          <label className='labelAccount'>Dieta</label>
            {diets.map((diet) => (
              <FormControlLabel
                key={diet}
                value={diet}
                control={<Radio />}
                label={diet}
              />
            ))}
          </RadioGroup>
        </div>

        {/* Exclusión de Ingredientes (Autocomplete) */}
        <div className="form2ContentAccount">
          <Autocomplete
            className='textFieldAccount'
            multiple
            options={ingredients} // Lista de opciones
            value={excludedIngredients} // Ingredientes seleccionados
            onChange={(event, newValue) => {
              setExcludedIngredients(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} variant="filled" label="Ingredientes a Excluir" fullWidth />
            )}
          />
        </div>
      </div>

      <Button
        variant="contained"
        className="botonRegisterAccount"
        onClick={handleSubmit} // Envía ambos formularios
      >
        Guardar Todos los Cambios
      </Button>
    </div>
  )
}

export default Account