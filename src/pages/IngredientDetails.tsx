import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ingredientService from '../services/IngredientService';
import { Allergen, FoodGroup,  NutrientsTypes, getUnitFromName } from '../utils/enums';
import { GETIngredientInterface } from '../utils/interfaces';
import { Box, Button, Grid, TextField, Tooltip, Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
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
import userService from '../services/UserService';
import { generateIngredientsPDF } from '../utils/generatePDF';
import { capitalizeFirstLetter } from '../utils/utils';
import './IngredientDetails.css'

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


function IngredientDetails() {
  const { _id } = useParams<{ _id: string }>(); // OObtener id de parametros de la URL
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const [foodGroupImage, setFoodGroupImage] = useState<string>();
  const [amount, setAmount] = useState<number>(0);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [ingredient, setIngredient] = useState<GETIngredientInterface>({
    _id: '',
    name: '',
    amount: 0,
    unit: '',
    estimatedCost: 0,
    foodGroup: FoodGroup.Otro,
    allergens: [],
    nutrients: [],
    ownerUser: { _id: '', username: '' }
  });

  const getNutrientAmount = (nutrientName: NutrientsTypes): number => {
    const nutrient = ingredient.nutrients.find(n => n.name === nutrientName);
    return nutrient ? nutrient.amount : 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el ingrediente
        if (_id) {
          const ingredientResponse = await ingredientService.getIngredientById(_id);
          setIngredient(ingredientResponse.data);
          setFoodGroupImage(foodGroupImages[ingredientResponse.data.foodGroup as FoodGroup]);
          if (location.state) {
            const { amountState } = location.state as { amountState: number };
            setAmount(amountState);
          }
          else {
            setAmount(ingredientResponse.data.amount);
          }

          // Obtener la información del usuario si hay un token
          if (token) {
            const userResponse = await userService.getUserInfo(token);
            //setUserInfo(userResponse.data);

            if (userResponse.data.role === 'Administrador') {
              setIsAdmin(true);
            }
            if (userResponse.data.username === ingredientResponse.data.ownerUser.username) {
              setIsOwner(true);
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [token, _id]);


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
            .catch((error) => {
              console.log(error)
              if (error && error.response && error.response.data && error.response.data.error ) {
                alert(error.response.data.error);
              }
            })
          }
      } catch (error) {
        console.log(error)
      }
    }
  }


  return (
    <Grid container className="ingredientDetailContainer">
      <Grid item xs={12} md={3} className="leftSection">
        <div className='imageLeftContainerDetails'>
          <img src={foodGroupImage} alt={ingredient.name} className='foodGroupImageDetails'></img>
        </div>
          
        <div className='textLeftContainerDetails'>
          <Typography variant="body1" color="textSecondary" component="p">
            <strong>Grupo de alimentos:</strong> <br></br> {ingredient.foodGroup}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            <strong>Coste:</strong> <br></br> {(ingredient.estimatedCost * amount / ingredient.amount).toFixed(2)}€
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            <strong>Usuario propietario:</strong> <br></br> {capitalizeFirstLetter(ingredient.ownerUser.username)}
          </Typography> 
        </div>
      </Grid>



      <Grid item xs={12} md={9} className="rightSection">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h2" component="h1" sx={{fontWeight: 'bold'}}>
            {capitalizeFirstLetter(ingredient.name)}
          </Typography>
  
          <Box onClick={() => generateIngredientsPDF(ingredient, amount)} sx={{ cursor: 'pointer', pl: 1}}>
            <PictureAsPdfIcon sx={{ color: '#545454', fontSize: 50 }} titleAccess='Generar PDF'/>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" sx={{ mb: 5 }}>
          <Typography variant="body1" component="p">
            * Valores correspondientes para
          </Typography>
          <TextField
            size="small"
            variant="standard"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            inputProps={{
              style: { width: `${amount.toString().length + 1}ch`, textAlign: 'center' }
            }}
          />
          <Typography variant="body1" component="p">
            {ingredient.unit}
          </Typography>
        </Box>
        


        {/* Sección de alérgenos */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" sx={{fontWeight: 'bold'}}>
            Alérgenos
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {ingredient.allergens.length > 0 ? (
              ingredient.allergens.map((allergen) => (
                <Tooltip key={allergen} title={allergen} arrow>
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
          <Typography variant="h5" component="h2" sx={{fontWeight: 'bold'}}>
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
                <Box key={nutrient} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>{nutrient}:</strong> {(getNutrientAmount(nutrient)  * amount / ingredient.amount).toFixed(2)} {getUnitFromName(nutrient)}
                  </Typography>
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
                  <Typography variant="body2">
                    <strong>{nutrient}:</strong> {(getNutrientAmount(nutrient) * amount / ingredient.amount).toFixed(2)} {getUnitFromName(nutrient)}
                  </Typography>
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
                  <Typography variant="body2">
                    <strong>{nutrient}:</strong> {(getNutrientAmount(nutrient) * amount / ingredient.amount).toFixed(2)} {getUnitFromName(nutrient)}
                  </Typography>
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
                  <Typography variant="body2">
                    <strong>{nutrient}:</strong> {(getNutrientAmount(nutrient) * amount / ingredient.amount).toFixed(2)} {getUnitFromName(nutrient)}
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
            onClick={() => navigate(`/ingredients/modify/${ingredient._id}`)}
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