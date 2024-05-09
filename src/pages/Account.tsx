import React, { useState, useEffect } from 'react';
import userService from '../services/UserService.ts';
//import { TextField, Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import {
  FormControlLabel,
  FormGroup,
  TextField,
  Button,
  Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Account.css'
import ingredientService from '../services/IngredientService.ts';
import { ActivityLevel, Gender } from '../utils/enums.ts';

interface UserInfoInterface {
  username: string;
  name: string;
  password: string;
  email: string;
  gender: Gender;
  weight: number;
  height: number;
  age: number;
  activityLevel: ActivityLevel;
  allergies: string[];
  diet: string;
  excludedIngredients: { id: string; name: string }[];
}

interface IngredientInterface {
  _id: string;
  name : string;
  amount: number;
  unit: string;
  estimatedCost: number;
  foodGroup: string;
  allergens: string[];
  nutrients: string[];
  ownerUser: string;
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
  { value: undefined, label: 'Ninguna Opción' },
];

// Listado de alérgenos
const allergens = [
  'Cereales',
  'Crustaceos',
  'Huevos',
  'Pescado',
  'Cacahuetes y Frutos Secos',
  'Soja',
  'Leche',
  'Frutos de Cascara',
  'Apio',
  'Mostaza',
  'Sesamo',
  'DioxidoAzufre',
  'Altramuces',
  'Moluscos',
];

// Opciones de dietas
const diets = [
  'Vegana',
  'Vegetariana',
  'Omnívora',
  'Paleo',
  ''
];

// Lista de ingredientes para excluir
let ingredients: { id: string; name: string }[] = []

function Account() {
  const [userInfo, setUserInfo] = useState<UserInfoInterface>({
    username: '',
    name: '',
    password: '',
    email: '',
    gender: Gender.Vacio,
    weight: 0,
    height: 0,
    age: 0,
    activityLevel: ActivityLevel.Vacio,
    allergies: [],
    diet: '',
    excludedIngredients: []
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      userService.getUserInfo(token).then((response) => {
        setUserInfo(response.data); // Almacena la información del usuario
      }).catch((error) => {
        console.error('Error al obtener la información del usuario:', error);
      });
    }
  }, [token]); // Se ejecuta cuando el token cambia

  useEffect(() => {
    try {
      ingredientService.getIngredients().then((response) => {
        const ingredientsJson: IngredientInterface[] = response.data;
        if (ingredients.length == 0) {
          for (let i = 0; i < ingredientsJson.length; i++) {
            ingredients.push({ id: ingredientsJson[i]._id, name: ingredientsJson[i].name})
          }
        }
      }).catch((error) => {
        console.error('Error al obtener la información de los ingredientes: ', error);
      });
    } catch{ (error: Error) => { console.log(error) }}
    
    return () => {
      // Limpiar antes de que el componente se vuelva a renderizar
      ingredients = [];
    };
    
  });

  const handleActivityLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newActivityLevel = e.target.value;
    
    const allowedValues = ['Sedentario', 'Ligero', 'Moderado', 'Activo', 'Muy activo'];
    
    if (allowedValues.includes(newActivityLevel)) {
      setUserInfo({ ...userInfo, activityLevel: (newActivityLevel as ActivityLevel)});
    } else {
      console.error("Valor fuera de rango:", newActivityLevel);
    }
  };

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

  return (
    <div>
      <div className="topContainer">
        <div className="container2FormAccount">
          <h3>Para realizar cualquier cambio pulsar el boton de guardar</h3>
        </div>
      </div>


      <div className='containerFormAccount'>
        <div className='formContentAccount'>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              margin='normal'
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
              required
              fullWidth
              margin='normal'
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
          </form>
        </div>


        <div className='formContentAccount'>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="filled"
              id="outlined-select-currency"
              select
              label="Genero"
              value={userInfo.gender}
              onChange={(e) =>
                setUserInfo({ ...userInfo, gender: (e.target.value as Gender) })
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
                setUserInfo({ ...userInfo, age: Number(e.target.value) })
              }
              className='textFieldAccount'
            />

            <div className="rowAccount"> {/* Contenedor Flex para colocar en la misma fila */}
              <OutlinedInput
                fullWidth
                endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{ 'aria-label': 'peso' }}
                value={userInfo.weight}
                onChange={(e) => setUserInfo({ ...userInfo, weight: Number(e.target.value) })}
                className='textFieldAccount'
              />

              <OutlinedInput
                fullWidth
                endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                aria-describedby="outlined-height-helper-text"
                inputProps={{ 'aria-label': 'altura' }}
                value={userInfo.height}
                onChange={(e) => setUserInfo({ ...userInfo, height: Number(e.target.value) })}
                className='textFieldAccount'
              />
            </div>
            

            <TextField
              fullWidth
              variant="filled"
              id="outlined-select-currency"
              select
              label="Nivel de actividad"
              value={userInfo.activityLevel}
              onChange={handleActivityLevelChange}
              className="textFieldAccount"
            >
              {activityLevel.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </form>
        </div>
      </div>

    
      <div className="topContainer">
        <div className="container2FormAccount">

          <div className="form2ContentAccount">
            <Autocomplete
              className='textFieldAccount'
              multiple
              options={allergens} // Lista de opciones
              value={userInfo.allergies} // Ingredientes seleccionados
              onChange={(_, newValue) => {
                setUserInfo({ ...userInfo, allergies: newValue })
              }}
              renderInput={(params) => (
                <TextField {...params} variant="filled" label="Alergenos" fullWidth />
              )}
            />
          </div>

          <div className="form2ContentAccount">
            <Autocomplete
              className='textFieldAccount'
              options={diets} // Lista de opciones
              value={userInfo.diet} // Ingredientes seleccionados
              onChange={(_, newValue) => {
                if(newValue != null) {
                  setUserInfo({ ...userInfo, diet: newValue })
                }
                else {
                  setUserInfo({ ...userInfo, diet: '' })
                }
              }}
              renderInput={(params) => (
                <TextField {...params} variant="filled" label="Tipo de Dieta" fullWidth />
              )}
            />
          </div>

          <div className="form2ContentAccount">
            <Autocomplete
              className='textFieldAccount'
              multiple
              options={ingredients} // Lista de opciones
              getOptionLabel={(option) => option.name}
              value={userInfo.excludedIngredients} // Ingredientes seleccionados
              onChange={(_, newValue) => {
                setExcludedIngredients(newValue);
                setUserInfo({ ...userInfo, excludedIngredients: newValue })
              }}
              renderInput={(params) => (
                <TextField {...params} variant="filled" label="Ingredientes a Excluir" fullWidth />
              )}
            />
          </div>
        </div>
      </div>


      <div className='buttonContainer'>
        <Button
          variant="contained"
          className="botonRegisterAccount"
          onClick={handleSubmit} // Envía ambos formularios
        >
          Guardar Cambios
        </Button>

        <Button
          variant="contained"
          className="botonDeleteAccount"
          onClick={handleSubmit} // Envía ambos formularios
        >
          Borrar Usuario
        </Button>
      </div>
    </div>
  )
}

export default Account