import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ingredientService from '../services/IngredientService';
import { Allergen, FoodGroup, Nutrient, NutrientsTypes, getUnitFromName } from '../utils/enums';
import { IngredientInterface } from '../utils/interfaces';
import { Box, Card, CardContent, CardMedia, Chip, Grid, TextField, Tooltip, Typography } from '@mui/material';
import FrutasImg from '../assets/foodGroups/frutas.svg';
import './IngredientDetails.css'

function capitalizeFirstLetter(string: string) {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
}

function IngredientDetails() {
  const { _id } = useParams<{ _id: string }>(); // Obtener el ID del ingrediente de los parámetros de la URL
  const [amount, setAmount] = useState<number>(0);
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

  const getNutrientAmount = (nutrientName: NutrientsTypes): number => {
    const nutrient = ingredient.nutrients.find(n => n.name === nutrientName);
    return nutrient ? nutrient.amount : 0;
  };

  useEffect(() => {
    // Hacer una solicitud para obtener los detalles del ingrediente según su ID
    if (_id) {
      ingredientService.getIngredientById(_id)
        .then((response) => {
          setIngredient(response.data)
          setAmount(response.data.amount)
        })
        //setAmount(response.data.amount);
        .catch(error => console.error('Error al obtener los detalles del ingrediente:', error));
    }
    
  }, [_id]);

  return (
    <Grid container className="ingredient-detail-container">
      <Grid item xs={12} md={3} className="left-section">
        <div className='imageLeftContainerDetails'>
          <img src={FrutasImg} alt={ingredient.name} className='foodGroupImageDetails'></img>
        </div>
          
        <div className='textLeftContainerDetails'>
          <Typography variant="body1" color="textSecondary" component="p">
            <strong>Coste:</strong> <br></br> {ingredient.estimatedCost}€
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            <strong>Grupo de alimentos:</strong> <br></br> {ingredient.foodGroup}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            <strong>Usuario propietario:</strong> <br></br> {ingredient.ownerUser.username}
          </Typography> 
        </div>
      </Grid>

      <Grid item xs={12} md={9} className="right-section">
        <Typography variant="h2" component="h1">
          {capitalizeFirstLetter(ingredient.name)}
        </Typography>

        <Typography variant="body1" component="p" sx={{mb:5}}>
          * Valores correspondientes para 
          <TextField
            //type="number"
            size="small"
            variant="standard"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            inputProps={{
              style: { width: `${amount.toString().length + 1}ch` }
            }}
            style={{ marginLeft: '10px'}}
          />
          {ingredient.unit}
        </Typography>
        {/* Puedes agregar más elementos aquí según sea necesario */}
        {/* Sección de alérgenos */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2">
            Alérgenos
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {ingredient.allergens.length > 0 ? (
              ingredient.allergens.map((allergen) => (
                //<Chip className='allergenIcon' key={allergen} label={allergen} color="primary" />
                <Tooltip title={allergen} arrow>
                  <img src={FrutasImg} alt={allergen} className='allergenIcon'></img>
                </Tooltip>
                
              ))
            ) : (
              <Typography variant="body1" color="textSecondary" component="p">
                No tiene alérgenos
              </Typography>
            )}
          </Box>
        </Box>


        {/* Sección de nutrientes */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2">
            Información Nutricional
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 5, mt: 1}}>
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
                <Box key={nutrient} sx={{ flex: '1 1 100px' }}>
                  <Typography variant="body2">
                    <strong>{nutrient}:</strong> {getNutrientAmount(nutrient)} {getUnitFromName(nutrient)}
                  </Typography>
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
                <Box key={nutrient} sx={{ flex: '1 1 100px' }}>
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
                <Box key={nutrient} sx={{ flex: '1 1 100px' }}>
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
                <Box key={nutrient} sx={{ flex: '1 1 100px' }}>
                  <Typography variant="body2">
                    <strong>{nutrient}:</strong> {getNutrientAmount(nutrient)} {getUnitFromName(nutrient)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default IngredientDetails;