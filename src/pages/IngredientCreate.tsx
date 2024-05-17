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
  Box,
  FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './IngredientCreate.css'
import ingredientService from '../services/IngredientService.ts';
import { ActivityLevel, Allergen, Diet, FoodGroup, Gender, NutrientsTypes, Units, getUnitFromName } from '../utils/enums.ts';
import { IngredientInterface, UserInfoInterface } from '../utils/interfaces.ts';
import { CheckBox, Visibility, VisibilityOff } from '@mui/icons-material';

// Lista de ingredientes para excluir
let ingredients: { _id: string; name: string }[] = []

function IngredientCreate() {
  const [ingredient, setIngredient] = useState<IngredientInterface>({
    _id: '',
    name: '',
    amount: 0,
    unit: '',
    estimatedCost: 0,
    foodGroup: FoodGroup.Otro,
    allergens: [],
    nutrients: [],
    ownerUser: ''
  });
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

  const [selectedAllergens, setSelectedAllergens] = useState<{ [key: string]: boolean }>({});

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAllergens({
      ...selectedAllergens,
      [event.target.name]: event.target.checked,
    });
  };
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

  const getNutrientAmount = (nutrientName: NutrientsTypes): number => {
    const nutrient = ingredient.nutrients.find(n => n.name === nutrientName);
    return nutrient ? nutrient.amount : 0;
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
        <div className='formContentIngredient'>
          <TextField
            required
            margin='normal'
            fullWidth
            variant="filled"
            id="nombre"
            label="Nombre del Ingrediente"
            name="name"
            value={ingredient.name}
            onChange={(e) =>
              setIngredient({ ...ingredient, name: e.target.value })
            }
            className='textFieldAccount'
          />

          <TextField
            fullWidth
            required
            variant="filled"
            id="outlined-select-currency"
            select
            label="Grupo de Alimento"
            value={ingredient.foodGroup}
            onChange={(e) =>
              setIngredient({ ...ingredient, foodGroup: (e.target.value as FoodGroup) })
            }
            className='textFieldAccount'
          >
            {Object.values(FoodGroup).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          
          <div className="rowAccount">
            <TextField
              required
              margin='normal'
              fullWidth
              variant="filled"
              id="cantidad"
              label="Cantidad del Ingrediente"
              name="cantidad"
              value={ingredient.amount}
              onChange={(e) =>
                setIngredient({ ...ingredient, amount: Number(e.target.value) })
              }
              className='textFieldAccount'
            />

            <TextField
              fullWidth
              required
              variant="filled"
              id="outlined-select-currency"
              select
              label="Grupo de Alimento"
              value={ingredient.unit}
              onChange={(e) =>
                setIngredient({ ...ingredient, unit: (e.target.value) })
              }
              className='textFieldAccount'
            >
              {Object.values(Units).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
          
          <OutlinedInput
            fullWidth
            id="outlined-adornment-age"
            endAdornment={<InputAdornment position="end">euros</InputAdornment>}
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              'aria-label': 'euros',
            }}
            value={ingredient.estimatedCost} /*|| ''*/
            onChange={(e) =>
              setIngredient({ ...ingredient, estimatedCost: Number(e.target.value)}) /*|| ''*/
            }
            className='textFieldAccount'
          />
        </div>


        <div className='formContentIngredient'>
        <Typography variant="h6" gutterBottom>
          Alérgenos
        </Typography>
        <Box>
        {Object.values(Allergen).map((allergen) => (
          <FormControlLabel
            key={allergen}
            control={
              <CheckBox
                checked={!!selectedAllergens[allergen]}
                onChange={handleCheckboxChange}
                name={allergen}
              />
            }
            label={allergen}
          />
        ))}
      </Box>
          
        </div>
      </div>

    
      <div className="topContainer">
        <div className="container2FormAccount">
          <div className="form2ContentAccount">
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" component="h2">
                Información Nutricional
              </Typography>
              <Box sx={{
                mt: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 2,
                justifyItems: 'center',
              }}>
                {/* Macronutrientes */}
                <Box>
                  <Typography variant="subtitle1" component="h3">
                    <strong>Macronutrientes</strong>
                  </Typography>
                  {[
                    NutrientsTypes.Energia,
                    NutrientsTypes.Proteinas,
                    NutrientsTypes.Carbohidratos,
                    NutrientsTypes.GrasaTotal,
                    NutrientsTypes.Sal,
                    NutrientsTypes.Azucar,
                    NutrientsTypes.GrasaSaturada,
                  ].map((nutrient) => (
                    <Box key={nutrient} sx={{ mb: 1 }}>
                      <Typography variant="body2" display="inline">
                        <strong>{nutrient}:</strong>
                      </Typography>
                      <TextField
                        //type="number"
                        required
                        size="small"
                        variant="standard"
                        value={getNutrientAmount(nutrient)}
                        //onChange={(e) => setAmount(Number(e.target.value))}
                        inputProps={{
                          style: { width: `${getNutrientAmount(nutrient).toString().length + 1}ch` }
                        }}
                        style={{ marginLeft: '10px'}}
                      />{getUnitFromName(nutrient)}
                    </Box>
                  ))}
                </Box>
                {/* Minerales */}
                <Box>
                  <Typography variant="subtitle1" component="h3">
                    Minerales
                  </Typography>
                  {[
                    NutrientsTypes.Calcio,
                    NutrientsTypes.Hierro,
                    NutrientsTypes.Potasio,
                    NutrientsTypes.Magnesio,
                    NutrientsTypes.Sodio,
                    NutrientsTypes.Fosforo,
                    NutrientsTypes.Yodo,
                    NutrientsTypes.Selenio,
                    NutrientsTypes.Zinc,
                  ].map((nutrient) => (
                    <Box key={nutrient} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>{nutrient}:</strong> {getNutrientAmount(nutrient)} {getUnitFromName(nutrient)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {/* Vitaminas */}
                <Box>
                  <Typography variant="subtitle1" component="h3">
                    Vitaminas
                  </Typography>
                  {[
                    NutrientsTypes.VitaminaA,
                    NutrientsTypes.VitaminaB6,
                    NutrientsTypes.VitaminaB12,
                    NutrientsTypes.VitaminaC,
                    NutrientsTypes.VitaminaD,
                    NutrientsTypes.VitaminaE,
                  ].map((nutrient) => (
                    <Box key={nutrient} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>{nutrient}:</strong> {getNutrientAmount(nutrient)} {getUnitFromName(nutrient)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {/* Varios */}
                <Box>
                  <Typography variant="subtitle1" component="h3">
                    Otros
                  </Typography>
                  {[
                    NutrientsTypes.Fibra,
                    NutrientsTypes.Colesterol,
                  ].map((nutrient) => (
                    <Box key={nutrient} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>{nutrient}:</strong> {getNutrientAmount(nutrient)} {getUnitFromName(nutrient)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
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
      </div>
    </div>
  )
}

export default IngredientCreate