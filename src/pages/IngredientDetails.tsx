import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ingredientService from '../services/IngredientService';
import { ActivityLevel, Allergen, FoodGroup, Gender, Nutrient, NutrientsTypes, getUnitFromName } from '../utils/enums';
import { IngredientInterface, UserInfoInterface } from '../utils/interfaces';
import { Box, Button, Card, CardContent, CardMedia, Chip, Grid, TextField, Tooltip, Typography } from '@mui/material';
import LacteoImg from '../assets/foodGroups/lacteos.svg';
import HuevosImg from '../assets/foodGroups/huevos.svg';
import CarnicosImg from '../assets/foodGroups/carnicos.svg';
import PescadosImg from '../assets/foodGroups/pescados.svg';
import GrasasImg from '../assets/foodGroups/grasas.svg';
import CerealesImg from '../assets/foodGroups/cereales.svg';
import LegumbresImg from '../assets/foodGroups/legumbres.svg';
import VerdurasImg from '../assets/foodGroups/verduras.svg';
import FrutasImg from '../assets/foodGroups/frutas.svg';
import AzucarImg from '../assets/foodGroups/azucares.svg';
import BebidasImg from '../assets/foodGroups/bebidas.svg';
import MiscelaneaImg from '../assets/foodGroups/otros.svg';
import OtroImg from '../assets/foodGroups/otros.svg';

import CerealesAllergenImg from '../assets/allergens/cereales.svg';
import CrustaceosAllergenImg from '../assets/allergens/crustaceos.svg';
import HuevosAllergenImg from '../assets/allergens/huevos.svg';
import PescadoAllergenImg from '../assets/allergens/pescado.svg';
import CacahuetesFrutosSecosAllergenImg from '../assets/allergens/cacahuetesFrutosSecos.svg';
import SojaAllergenImg from '../assets/allergens/soja.svg';
import LecheAllergenImg from '../assets/allergens/lacteos.svg';
import FrutosCascaraAllergenImg from '../assets/allergens/frutosCascara.svg';
import ApioAllergenImg from '../assets/allergens/apio.svg';
import MostazaAllergenImg from '../assets/allergens/mostaza.svg';
import SesamoAllergenImg from '../assets/allergens/sesamo.svg';
import DioxidoAzufreAllergenImg from '../assets/allergens/dioxidoAzufre.svg';
import AltramucesAllergenImg from '../assets/allergens/altramuces.svg';
import MoluscosAllergenImg from '../assets/allergens/moluscos.svg';

import './IngredientDetails.css'
import userService from '../services/UserService';

const foodGroupImages: { [key in FoodGroup]: string } = {
  [FoodGroup.Lacteos]: LacteoImg,
  [FoodGroup.Huevos]: HuevosImg,
  [FoodGroup.Carnicos]: CarnicosImg,
  [FoodGroup.Pescados]: PescadosImg,
  [FoodGroup.Grasas]: GrasasImg,
  [FoodGroup.Cereales]: CerealesImg,
  [FoodGroup.Legumbres]: LegumbresImg,
  [FoodGroup.Verduras]: VerdurasImg,
  [FoodGroup.Frutas]: FrutasImg,
  [FoodGroup.Azucar]: AzucarImg,
  [FoodGroup.Bebidas]: BebidasImg,
  [FoodGroup.Miscelanea]: MiscelaneaImg,
  [FoodGroup.Otro]: OtroImg,
};

const allergensImages: { [key in Allergen]: string } = {
  [Allergen.Cereales]: CerealesAllergenImg,
  [Allergen.Crustaceos]: CrustaceosAllergenImg,
  [Allergen.Huevos]: HuevosAllergenImg,
  [Allergen.Pescado]: PescadoAllergenImg,
  [Allergen.CacahuetesFrutosSecos]: CacahuetesFrutosSecosAllergenImg,
  [Allergen.Soja]: SojaAllergenImg,
  [Allergen.Leche]: LecheAllergenImg,
  [Allergen.FrutosCascara]: FrutosCascaraAllergenImg,
  [Allergen.Apio]: ApioAllergenImg,
  [Allergen.Mostaza]: MostazaAllergenImg,
  [Allergen.Sesamo]: SesamoAllergenImg,
  [Allergen.DioxidoAzufre]: DioxidoAzufreAllergenImg,
  [Allergen.Altramuces]: AltramucesAllergenImg,
  [Allergen.Moluscos]: MoluscosAllergenImg,
};

function capitalizeFirstLetter(string: string) {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
}

function IngredientDetails() {
  const [foodGroupImage, setFoodGroupImage] = useState<string>();
  const { _id } = useParams<{ _id: string }>(); // Obtener el ID del ingrediente de los parámetros de la URL
  const [amount, setAmount] = useState<number>(0);
  const [isOwner, setIsOwner] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
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
  const navigate = useNavigate();

  const getNutrientAmount = (nutrientName: NutrientsTypes): number => {
    const nutrient = ingredient.nutrients.find(n => n.name === nutrientName);
    return nutrient ? nutrient.amount : 0;
  };

  /*useEffect(() => {
    if (token) {
      userService.getUserInfo(token).then((response) => {
        setUserInfo(response.data); // Almacena la información del usuario
      }).catch((error) => {
        console.error('Error al obtener la información del usuario:', error);
      });
    }
  }, [token]);*/

  useEffect(() => {
    const fetchIngredientDetails = async () => {
      try {
        if (_id && userInfo) {
          const response = await ingredientService.getIngredientById(_id);
          setIngredient(response.data);
          setAmount(response.data.amount);
          setFoodGroupImage(foodGroupImages[response.data.foodGroup as FoodGroup]);
        }
      } catch (error) {
        console.error('Error al obtener los detalles del ingrediente: ', error);
      }
    };

    fetchIngredientDetails();
  }, []);


  function deleteIngredientFunction() {
    var resultado = window.confirm('¿Estas seguro de elimiar el ingrediente?')
    if (resultado === true) {
      try {
        if (token && _id) {
          ingredientService
            .deleteIngredient(_id, token)
            .then((response) => {
              alert('Ingrediente eliminado')
              navigate('/ingredients');
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
    <Grid container className="ingredient-detail-container">
      <Grid item xs={4} md={3} className="left-section">
        <div className='imageLeftContainerDetails'>
          <img src={foodGroupImage} alt={ingredient.name} className='foodGroupImageDetails'></img>
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
          <Typography variant="h5" component="h2">
            Alérgenos
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {ingredient.allergens.length > 0 ? (
              ingredient.allergens.map((allergen) => (
                //<Chip className='allergenIcon' key={allergen} label={allergen} color="primary" />
                <Tooltip title={allergen} arrow>
                  <img src={(allergensImages[allergen as Allergen])} alt={allergen} className='allergenIcon'></img>
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

      {(isOwner || isAdmin) && (
        <div className='buttonContainerIngredient'>
          <Button
            variant="contained"
            className="botonChangeIngredient"
            //onClick={changeUserDataFunction}
          >
            Modificar Ingrediente
          </Button>

          <Button
            variant="contained"
            className="botonDeleteIngredient"
            onClick={deleteIngredientFunction} 
          >
            Borrar Ingrediente
          </Button>
        </div>
      )}
      </Grid>
    </Grid>
  );
}

export default IngredientDetails;