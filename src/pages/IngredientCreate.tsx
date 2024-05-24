import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import {
  TextField,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './IngredientCreate.css'
import ingredientService from '../services/IngredientService.ts';
import { Allergen, FoodGroup, NutrientsTypes, Units, getUnitFromName } from '../utils/enums.ts';
import { CreateIngredientInterface } from '../utils/interfaces.ts';


function IngredientCreate() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [ingredient, setIngredient] = useState<CreateIngredientInterface>({
    _id: '',
    name: '',
    amount: 0,
    unit: '',
    estimatedCost: '',
    foodGroup: FoodGroup.Otro,
    allergens: [],
    nutrients: [],
    ownerUser: ''
  });


  useEffect(() => {
    if (!token) {
      alert('Debe iniciar sesión para acceder a esta página.');
      navigate('/login');
    }
  }, [token, navigate]);


  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const allergen = event.target.name;
    const isChecked = event.target.checked;
  
    setIngredient((prevIngredient) => {
      const updatedAllergens = isChecked
        ? [...prevIngredient.allergens, allergen]
        : prevIngredient.allergens.filter((a) => a !== allergen);
  
      return { ...prevIngredient, allergens: updatedAllergens };
    });
  };

  const getNutrientAmount = (nutrientName: NutrientsTypes): number => {
    const nutrient = ingredient.nutrients.find(n => n.name === nutrientName);
    return nutrient ? nutrient.amount : 0;
  };

  const handleNutrientChange = (nutrientName: NutrientsTypes, newAmount: number, unit: string) => {
    setIngredient(prevIngredient => {
      const updatedNutrients = prevIngredient.nutrients.map(nutrient => {
        if (nutrient.name === nutrientName) {
          return { ...nutrient, amount: newAmount };
        }
        return nutrient;
      });
  
      // Si el nutriente no está en la lista, agregarlo
      if (!updatedNutrients.find(nutrient => nutrient.name === nutrientName)) {
        updatedNutrients.push({ name: nutrientName, amount: newAmount, unit: unit });
      }
  
      return { ...prevIngredient, nutrients: updatedNutrients };
    });
  };


  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (!ingredient.name) {
      newErrors.name = 'El nombre es requerido.';
      valid = false;
    }
    if (!ingredient.foodGroup) {
      newErrors.foodGroup = 'El grupo de alimento es requerido.';
      valid = false;
    }
    if (!ingredient.amount) {
      newErrors.amount = 'La cantidad es requerida.';
      valid = false;
    }
    if (!ingredient.unit) {
      newErrors.unit = 'La unidad es requerida.';
      valid = false;
    }
    if (!ingredient.estimatedCost) {
      newErrors.estimatedCost = 'El costo estimado es requerido.';
      valid = false;
    }

    // Validar todos los macronutrientes
    [
      NutrientsTypes.Energia,
      NutrientsTypes.Proteinas,
      NutrientsTypes.Carbohidratos,
      NutrientsTypes.GrasaTotal,
      NutrientsTypes.Sal,
      NutrientsTypes.Azucar,
      NutrientsTypes.GrasaSaturada,
    ].forEach(nutrient => {
      if (!ingredient.nutrients.some(n => n.name === nutrient && n.amount > 0)) {
        newErrors[nutrient] = `*`;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  function createIngredientFunction() {
   if (!validateForm()) {
      // Si hay errores, no enviar el formulario
      return;
    }

    // Variables basicas
    const ingredientToSend = {
      name: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit,
      estimatedCost: parseFloat(ingredient.estimatedCost),
      foodGroup: ingredient.foodGroup,
      allergens: ingredient.allergens,
      nutrients: ingredient.nutrients
    };

    // Realizar peticion post
    try {
      if (token) {
        console.log(ingredientToSend)
        ingredientService
          .createIngredient(token, ingredientToSend)
          .then((response) => {
            console.log(response);
            if(response.status == 201) {
              alert('Ingrediente creado');
              navigate('/ingredients/' + response.data._id)
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


  if (!token) {
    return null;
  }



  
  return (
    <div>
      <div className="topContainerIntro">
        <div className="containerIntro">
          <h3>Recuerda pulsar el boton de crear ingrediente</h3>
          <Button
            variant="contained"
            className="botonRegisterAccount"
            onClick={createIngredientFunction}
          >
            Crear ingrediente
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
            error={!!errors.name}
            helperText={errors.name}
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
            error={!!errors.foodGroup}
            helperText={errors.foodGroup}
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
              error={!!errors.amount}
              helperText={errors.amount}
            />

            <TextField
              fullWidth
              required
              variant="filled"
              id="outlined-select-currency"
              select
              label="Unidad"
              value={ingredient.unit}
              onChange={(e) =>
                setIngredient({ ...ingredient, unit: (e.target.value) })
              }
              className='textFieldAccount'
              error={!!errors.unit}
              helperText={errors.unit}
            >
              {Object.values(Units).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
          
          <TextField
            required
            fullWidth
            variant="filled"
            id="estimatedCost"
            label="Costo Estimado"
            InputProps={{
              endAdornment: <InputAdornment position="end">euros</InputAdornment>,
            }}
            value={ingredient.estimatedCost}
            onChange={(e) =>
              setIngredient({ ...ingredient, estimatedCost: (e.target.value) })
            }
            className='textFieldAccount'
            error={!!errors.estimatedCost}
            helperText={errors.estimatedCost}
          />
        </div>


        <div className='formContentIngredient'>
          <Typography variant="h6" gutterBottom  className='tipographyAllergens'>
            Alérgenos
          </Typography>
          <Box>
            {Object.values(Allergen).map((allergen) => (
              <FormControlLabel
                key={allergen}
                control={
                  <Checkbox
                    checked={ingredient.allergens.includes(allergen)}
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
            <Box>
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
                    <strong className='nutrientTitle'>Macronutrientes</strong>
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
                    <Box key={nutrient} sx={{ mb: 1}}>
                      <Typography variant="body2" display="inline">
                        <strong>{nutrient}:</strong>
                      </Typography>
                      <TextField
                        //type="number"
                        required
                        size="small"
                        variant="standard"
                        value={getNutrientAmount(nutrient)}
                        onChange={(e) => handleNutrientChange(nutrient, Number(e.target.value), getUnitFromName(nutrient))}
                        inputProps={{
                          style: { width: `${getNutrientAmount(nutrient).toString().length + 1}ch` }
                        }}
                        style={{ marginLeft: '10px'}}
                        error={!!errors[nutrient]}
                        helperText={errors[nutrient]}
                      />{getUnitFromName(nutrient)}
                    </Box>
                  ))}
                </Box>

                {/* Minerales */}
                <Box>
                  <Typography variant="subtitle1" component="h3">
                    <strong className='nutrientTitle'>Minerales</strong>
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
                      <Typography variant="body2" display="inline">
                        <strong>{nutrient}:</strong>
                      </Typography>
                      <TextField
                        //type="number"
                        required
                        size="small"
                        variant="standard"
                        value={getNutrientAmount(nutrient)}
                        onChange={(e) => handleNutrientChange(nutrient, Number(e.target.value), getUnitFromName(nutrient))}
                        inputProps={{
                          style: { width: `${getNutrientAmount(nutrient).toString().length + 1}ch` }
                        }}
                        style={{ marginLeft: '10px'}}
                        error={!!errors[nutrient]}
                        helperText={errors[nutrient]}
                      />{getUnitFromName(nutrient)}
                    </Box>
                  ))}
                </Box>
                {/* Vitaminas */}
                <Box>
                  <Typography variant="subtitle1" component="h3">
                    <strong className='nutrientTitle'>Vitaminas</strong>
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
                      <Typography variant="body2" display="inline">
                        <strong>{nutrient}:</strong>
                      </Typography>
                      <TextField
                        //type="number"
                        required
                        size="small"
                        variant="standard"
                        value={getNutrientAmount(nutrient)}
                        onChange={(e) => handleNutrientChange(nutrient, Number(e.target.value), getUnitFromName(nutrient))}
                        inputProps={{
                          style: { width: `${getNutrientAmount(nutrient).toString().length + 1}ch` }
                        }}
                        style={{ marginLeft: '10px'}}
                        error={!!errors[nutrient]}
                        helperText={errors[nutrient]}
                      />{getUnitFromName(nutrient)}
                    </Box>
                  ))}
                </Box>
                {/* Varios */}
                <Box>
                  <Typography variant="subtitle1" component="h3">
                    <strong className='nutrientTitle'>Otros</strong>
                  </Typography>
                  {[
                    NutrientsTypes.Fibra,
                    NutrientsTypes.Colesterol,
                  ].map((nutrient) => (
                    <Box key={nutrient} sx={{ mb: 1 }}>
                      <Typography variant="body2" display="inline">
                        <strong>{nutrient}:</strong>
                      </Typography>
                      <TextField
                        required
                        size="small"
                        variant="standard"
                        value={getNutrientAmount(nutrient)}
                        onChange={(e) => handleNutrientChange(nutrient, Number(e.target.value), getUnitFromName(nutrient))}
                        inputProps={{
                          style: { width: `${getNutrientAmount(nutrient).toString().length + 1}ch` }
                        }}
                        style={{ marginLeft: '10px'}}
                        error={!!errors[nutrient]}
                        helperText={errors[nutrient]}
                      />{getUnitFromName(nutrient)}
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
          onClick={createIngredientFunction}
        >
          Crear ingrediente
        </Button>
      </div>
    </div>
  )
}

export default IngredientCreate