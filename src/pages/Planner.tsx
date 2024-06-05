import React, { useState, useEffect } from 'react';
import userService from '../services/UserService.ts';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import {
  TextField,
  Button,
  Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Planner.css'
import ingredientService from '../services/IngredientService.ts';
import { ActivityLevel, Allergen, Diet, Gender } from '../utils/enums.ts';
import { IngredientInterface, MenuInterface, NutritionResponse, UserInfoInterface } from '../utils/interfaces.ts';
import { capitalizeFirstLetter } from '../utils/utils';
import plannerService from '../services/PlannerService.ts';


function Planner() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState<{ _id: string; name: string; unit: string; amount: string }[]>([])

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [menuInfo, setMenuInfo] = useState<MenuInterface>({
    title: '',
    numberDays: 0,
    numberServices: 0,
    recipesPerDay: [],
    caloriesTarget: 0,
    allergies: [],
    diet: '',
    excludedIngredients: [],
    avergageEstimatedCost: 0,
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


  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await ingredientService.getIngredients();
        const ingredientsJson: IngredientInterface[] = response.data;
        const initialIngredients = ingredientsJson.map((ingredient) => ({
          _id: ingredient._id,
          name: ingredient.name,
          unit: ingredient.unit,
          amount: '',
        }));
        setIngredients(initialIngredients);
      } catch (error) {
        console.error('Error al obtener la información de los ingredientes: ', error);
      }
    };

    fetchIngredients();
  }, []);


  async function getUserData() {
    if (token) {
      userService.getUserInfo(token).then((response) => {
        setUserInfo(response.data); // Almacena la información del usuario
      }).catch((error) => {
        console.error('Error al obtener la información del usuario:', error);
      });
    }
    else {
      alert('Debe Iniciar Sesión')
    }
  }

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (!menuInfo.numberDays) {
      newErrors.numberDays = 'El número de días es requerido.';
      valid = false;
    }
    if (!menuInfo.numberServices) {
      newErrors.numberServices = 'El número de servicios es requerido.';
      valid = false;
    }
    if (!userInfo.gender) {
      newErrors.gender = 'El genero es requerido.';
      valid = false;
    }
    if (!userInfo.age) {
      newErrors.age = 'La edad es requerida.';
      valid = false;
    }
    if (!userInfo.weight) {
      newErrors.weight = 'El peso es requerido.';
      valid = false;
    }
    if (!userInfo.height) {
      newErrors.height = 'La altura es requerida.';
      valid = false;
    }
    if (!userInfo.activityLevel) {
      newErrors.activityLevel = 'El nivel de actividad es requerido.';
      valid = false;
    }

    setErrors(newErrors); // Actualiza los errores
    return valid;
  };

  async function sendPlannerForm() {
    if (!validateForm()) {
      // Si hay errores, no envíes el formulario
      return;
    }
  
    const userDataForNutrientsCalc = {
      gender: userInfo.gender,
      weight: userInfo.weight,
      height: userInfo.height,
      age: userInfo.age,
      activityLevel: userInfo.activityLevel
    };
  
    let userNutrientsCalc;
    try {
      const response = await plannerService.calcNutrientsUser(userDataForNutrientsCalc);
      userNutrientsCalc = response.data;
    } catch (error) {
      console.log(error);
      return;
    }
  
    // Variables básicas
    const menuInfoToSend = {
      numberDays: menuInfo.numberDays,
      numberServices: menuInfo.numberServices,
      caloriesTarget: userNutrientsCalc.kcalPerMeal,
      allergies: userInfo.allergies,
      diet: userInfo.diet,
      excludedIngredients: userInfo.excludedIngredients.map((ingredient) => {return ingredient._id})
    };
  
    // Realizar petición
    try {
      console.log(menuInfoToSend);
      const planResponse = await plannerService.generatePlan(menuInfoToSend);
      console.log(planResponse);

      const generatedMenu = planResponse.data;
      console.log(generatedMenu)
      navigate('/menuDetails', { state: { menu: generatedMenu } });
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div>
      <div className="topContainerIntroPlanner">
        <div className="containerIntroPlanner">
          <h3>Genera tu menu personalizado</h3>
          <Button
            variant="contained"
            className="botonRegisterAccount"
            onClick={sendPlannerForm}
          >
            generar plan
          </Button>
        </div>
      </div>


      <div className='containerFormPlanner'>
        <div className='formContentPlanner'>
          <TextField
            required
            margin='normal'
            fullWidth
            variant="filled"
            id="days"
            label="Número de Días"
            name="days"
            value={menuInfo.numberDays}
            onChange={(e) =>
              setMenuInfo({ ...menuInfo, numberDays: Number(e.target.value) })
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">días</InputAdornment>,
            }}
            className='textFieldCreateRecipe'
            error={!!errors.numberDays}
            helperText={errors.numberDays}
          />

          <TextField
            required
            margin='normal'
            fullWidth
            variant="filled"
            id="services"
            label="Número de Servicios"
            name="services"
            value={menuInfo.numberServices}
            onChange={(e) =>
              setMenuInfo({ ...menuInfo, numberServices: Number(e.target.value) })
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">pers</InputAdornment>,
            }}
            className='textFieldCreateRecipe'
            error={!!errors.numberServices}
            helperText={errors.numberServices}
          />
          
          <Button
            variant="contained"
            className="botonRegisterAccount"
            onClick={getUserData}
          >
            Obtener datos del usuario
          </Button>
        </div>


        <div className='formContentAccount'>
          <TextField
            required
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
            error={!!errors.gender}
            helperText={errors.gender}
          >
            {Object.values(Gender).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
            
          </TextField>

          <TextField
            required
            fullWidth
            variant="filled"
            id="age"
            label="Edad"
            name="age"
            value={userInfo.age}
            onChange={(e) =>
              setUserInfo({ ...userInfo, age: Number(e.target.value)}) /*|| ''*/
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">años</InputAdornment>,
            }}
            className='textFieldCreateRecipe'
            error={!!errors.age}
            helperText={errors.age}
          />

          <div className="rowAccount">
            <TextField
              required
              fullWidth
              variant="filled"
              id="weight"
              label="Peso"
              name="weight"
              value={userInfo.weight}
              onChange={(e) => setUserInfo({ ...userInfo, weight: Number(e.target.value)})}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              className='textFieldAccount'
              error={!!errors.weight}
              helperText={errors.weight}
            />

            <TextField
              required
              fullWidth
              variant="filled"
              id="height"
              label="Altura"
              name="height"
              value={userInfo.height}
              onChange={(e) => setUserInfo({ ...userInfo, height: Number(e.target.value)})}
              InputProps={{
                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
              }}
              className='textFieldAccount'
              error={!!errors.height}
              helperText={errors.height}
            />
          </div>        

          <TextField
            required
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
            error={!!errors.activityLevel}
            helperText={errors.activityLevel}
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
              options={Object.values(Allergen)}
              value={userInfo.allergies}
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
              options={Object.values(Diet)} 
              value={userInfo.diet}
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
          onClick={sendPlannerForm}
        >
          generar plan
        </Button>
      </div>
    </div>
  )
}

export default Planner