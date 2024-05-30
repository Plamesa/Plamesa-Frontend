import React, { useState, useEffect } from 'react';
import userService from '../services/UserService.ts';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import {
  TextField,
  Button,
  Autocomplete,
  FormControl,
  InputLabel,
  IconButton,
  FilledInput,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Account.css'
import ingredientService from '../services/IngredientService.ts';
import { ActivityLevel, Allergen, Diet, Gender } from '../utils/enums.ts';
import { IngredientInterface, UserInfoInterface } from '../utils/interfaces.ts';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { capitalizeFirstLetter } from '../utils/utils';

// Lista de ingredientes para excluir
let ingredients: { _id: string; name: string }[] = []

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
  const [errors, setErrors] = useState<{ password?: string; email?: string }>({}); // Estado para mensajes de error

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const navigate = useNavigate();

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
            ingredients.push({ _id: ingredientsJson[i]._id, name: ingredientsJson[i].name})
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


  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: { password?: string; email?: string } = {};

    // Validación de la contraseña
    const passwordPattern = /^(?=.*[0-9])(?=.*[A-ZÑ])[a-zA-Z0-9Ññ]{6,}$/;
    if (userInfo.password != '' && !passwordPattern.test(userInfo.password)) {
      newErrors.password = 'La contraseña debe tener al menos una mayúscula, un número y tener mínimo 6 caracteres.';
      valid = false;
    }

    // Validación del correo electrónico
    const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailPattern.test(userInfo.email)) {
      newErrors.email = 'Correo electrónico no válido.';
      valid = false;
    }

    setErrors(newErrors); // Actualiza los errores
    return valid;
  };


  function changeUserDataFunction() {
    if (!validateForm()) {
      // Si hay errores, no envíes el formulario
      return;
    }

    // Variables basicas
    let userInfoToSend = {};
    userInfoToSend = {
      username: userInfo.username,
      name: userInfo.name,
      email: userInfo.email,
      gender: userInfo.gender,
      age: userInfo.age,
      weight: userInfo.weight,
      height: userInfo.height,
      activityLevel: userInfo.activityLevel,
      allergies: userInfo.allergies,
      diet: userInfo.diet
    };

    // Caso de que se incluya contraseña
    if (userInfo.password != '') {
      userInfoToSend = { ...userInfoToSend, password: userInfo.password }
    }

    // Caso de los ingredientes
    let newExcludedIngredients = [];
    for (let i = 0; i < userInfo.excludedIngredients.length; i++) {
      newExcludedIngredients.push(userInfo.excludedIngredients[i]._id);
    }
    userInfoToSend = { ...userInfoToSend, excludedIngredients: newExcludedIngredients }

    // Realizar peticion patch
    try {
      if (token) {
        console.log(userInfoToSend)
        userService
          .changeUserInfo(token, userInfoToSend)
          .then((response) => {
            console.log(response);
            if(response.status == 201) {
              alert('Datos actualizados correctamente');
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
      }
    } catch (error) {
      console.log(error);
    }
  };


  function deleteUserFunction() {
    var resultado = window.confirm('¿Estas seguro de elimiar el usuario?')
    if (resultado === true) {
      try {
        if (token) {
          userService
            .deleteUser(token)
            .then((response) => {
              localStorage.removeItem('token'); // Elimina el token del localStorage
              alert('Usuario eliminado')
              navigate('/');
              console.log(response)
            })
            .catch((error: Error) => {
              console.log(error)
            })
          }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div>
      <div className="topContainerIntro">
        <div className="containerIntro">
          <h3>Recuerda pulsar el boton de guardar cambios</h3>
          <Button
            variant="contained"
            className="botonRegisterAccount"
            onClick={changeUserDataFunction}
          >
            Guardar Cambios
          </Button>
        </div>
      </div>


      <div className='containerFormAccount'>
        <div className='formContentAccount'>
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

          <FormControl variant="filled" fullWidth error={Boolean(errors.password)} className='textFieldAccount'>
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
                setUserInfo({ ...userInfo, password: e.target.value })
              }
            />
            {errors.password && <Typography variant="caption" color="error" className='errorContainer'>{errors.password}</Typography>}
          </FormControl>

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
            error={Boolean(errors.email)} // Muestra el error
            helperText={errors.email} // Mensaje de error
          />
        </div>


        <div className='formContentAccount'>
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
            {Object.values(Gender).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
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
            value={userInfo.age} /*|| ''*/
            onChange={(e) =>
              setUserInfo({ ...userInfo, age: Number(e.target.value)}) /*|| ''*/
            }
            className='textFieldAccount'
          />

          <div className="rowAccount">
            <OutlinedInput
              fullWidth
              endAdornment={<InputAdornment position="end">kg</InputAdornment>}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{ 'aria-label': 'peso' }}
              value={userInfo.weight}
              onChange={(e) => setUserInfo({ ...userInfo, weight: Number(e.target.value)})}
              className='textFieldAccount'
            />

            <OutlinedInput
              fullWidth
              endAdornment={<InputAdornment position="end">cm</InputAdornment>}
              aria-describedby="outlined-height-helper-text"
              inputProps={{ 'aria-label': 'altura' }}
              value={userInfo.height}
              onChange={(e) => setUserInfo({ ...userInfo, height: Number(e.target.value)})}
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
            onChange={(e) =>
              setUserInfo({ ...userInfo, activityLevel: (e.target.value as ActivityLevel) })
            }
            className="textFieldAccount"
          >
            {Object.values(ActivityLevel).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>

    
      <div className="topContainer">
        <div className="container2FormAccount">

          <div className="form2ContentAccount">
            <Autocomplete
              className='textFieldAccount'
              multiple
              options={Object.values(Allergen)} // Lista de opciones
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
              options={Object.values(Diet)} // Lista de opciones
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
              getOptionLabel={(option) => capitalizeFirstLetter(option.name)}
              value={userInfo.excludedIngredients} // Ingredientes seleccionados
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onChange={(_, newValue) => {
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
          onClick={changeUserDataFunction}
        >
          Guardar Cambios
        </Button>

        <Button
          variant="contained"
          className="botonDeleteAccount"
          onClick={deleteUserFunction} 
        >
          Borrar Usuario
        </Button>
      </div>
    </div>
  )
}

export default Account