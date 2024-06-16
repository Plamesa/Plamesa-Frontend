import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Allergen,FoodType,  NutrientsTypes, getUnitFromName } from '../utils/enums';
import {  GETRecipeInterface} from '../utils/interfaces';
import { Box, Button, Grid, TextField, Tooltip, Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EntranteImg from '../assets/foodType/entranteDetails.svg';
import PrincipalImg from '../assets/foodType/principalDetails.svg';
import PostreImg from '../assets/foodType/postreDetails.svg';

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
import './RecipeDetails.css'
import recipeService from '../services/RecipeService';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { generateRecipePDF } from '../utils/generatePDF';
import { capitalizeFirstLetter } from '../utils/utils';

const foodTypeImages: { [key in FoodType]: string } = {
  [FoodType.Entrante]: EntranteImg,
  [FoodType.PlatoPrincipal]: PrincipalImg,
  [FoodType.Postre]: PostreImg
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

function RecipeDetails() {
  const { _id } = useParams<{ _id: string }>(); // Obtener id de parametros de la URL
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const [foodTypeImage, setFoodTypeImage] = useState<string>();
  const [services, setServices] = useState<number>(0);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const [recipe, setRecipe] = useState<GETRecipeInterface>({
    _id: '',
    name: '',
    numberService: 0,
    preparationTime: 0,
    foodType: FoodType.Entrante,
    instructions: [],
    comments: '',
    cookware: [],
    ingredients: [],
    estimatedCost: 0,
    allergens: [],
    nutrients: [],
    ownerUser: { _id: '', username: '' }
  })

  const getNutrientAmount = (nutrientName: NutrientsTypes): number => {
    const nutrient = recipe.nutrients.find(n => n.name === nutrientName);
    return nutrient ? nutrient.amount : 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener la receta
        if (_id) {
          const recipeResponse = await recipeService.getRecipeById(_id);
          setRecipe(recipeResponse.data);
          setFoodTypeImage(foodTypeImages[recipeResponse.data.foodType as FoodType]);
          if (location.state) {
            const { numberServicesState } = location.state as { numberServicesState: number };
            setServices(numberServicesState);
          }
          else {
            setServices(recipeResponse.data.numberService);
          }
          
          // Obtener la información del usuario si hay un token
          if (token) {
            const userResponse = await userService.getUserInfo(token);

            if (userResponse.data.role === 'Administrador') {
              setIsAdmin(true);
            }
            if (userResponse.data.username === recipeResponse.data.ownerUser.username) {
              setIsOwner(true);
            }

            const userInfoResponse = await userService.getUserInfo(token);
            setIsFavorite(userInfoResponse.data.favoriteRecipes.some((recipe: {_id: string, name: string}) => recipe._id === _id));
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [token, _id]);

  const handleFavoriteClick = async () => {
    try {
      if (token && _id) {
        if (isFavorite) {
          await userService.removeFavoriteRecipe(token, _id);
        } else {
          await userService.addFavoriteRecipe(token, _id);
        }
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    }
  };

  function deleteRecipeFunction() {
    var resultado = window.confirm('¿Estas seguro de elimiar la receta?')
    if (resultado === true) {
      try {
        if (token && _id) {
          recipeService
            .deleteRecipe(_id, token)
            .then((response) => {
              alert('Receta eliminada')
              navigate('/recipes');
              console.log(response)
            })
            .catch((error) => {
              console.log(error)
              if (error.response && error.response.data && error.response.status) {
                if (error.response.status === 400) {
                  alert(`${error.response.data.error}`);
                }
              } else {
                alert('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
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
          <img src={foodTypeImage} alt={recipe.name} className='foodGroupImageDetails'></img>
        </div>
          
        <div className='textLeftContainerDetailsRecipe'>
          <Typography variant="body1" color="textSecondary" component="p">
            <strong>Tipo de comida:</strong> <br></br> {recipe.foodType}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            <strong>Tiempo de preparación:</strong> <br></br> {recipe.preparationTime} min
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            <strong>Coste:</strong> <br></br> {(recipe.estimatedCost * services / recipe.numberService).toFixed(2)}€
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            <strong>Usuario propietario:</strong> <br></br> {capitalizeFirstLetter(recipe.ownerUser.username)}
          </Typography> 
        </div>
      </Grid>



      <Grid item xs={12} md={9} className="rightSection">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h2" component="h1" sx={{fontWeight: 'bold'}}>
            {capitalizeFirstLetter(recipe.name)}
          </Typography>
          <Box display="flex" alignItems="center">
            {token && (
              <Box onClick={handleFavoriteClick} sx={{ cursor: 'pointer', pl: 1}}>
                {isFavorite ? <Favorite sx={{ color: '#BC4B51', fontSize: 50 }} titleAccess='Favorita'/> : <FavoriteBorder sx={{ fontSize: 50 }} titleAccess='Favorita'/>}
              </Box>
            )}
            <Box onClick={() => generateRecipePDF(recipe, services)} sx={{ cursor: 'pointer', pl: 1}}>
              <PictureAsPdfIcon sx={{ color: '#545454', fontSize: 50 }} titleAccess='Generar PDF'/>
            </Box>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" sx={{ mb: 5 }}>
          <Typography variant="body1" component="p">
            * Valores correspondientes para
          </Typography>
          <TextField
            size="small"
            variant="standard"
            value={services}
            onChange={(e) => setServices(Number(e.target.value))}
            inputProps={{
              style: { width: `${services.toString().length + 1}ch`, textAlign: 'center' }
            }}
          />
          <Typography variant="body1" component="p">
            personas
          </Typography>
        </Box>
        


        {/* Sección de alérgenos */}
        <Box sx={{ mt: 4, pl: '16px'}}>
          <Typography variant="h5" component="h2" sx={{fontWeight: 'bold'}}>
            Alérgenos
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {recipe.allergens.length > 0 ? (
              recipe.allergens.map((allergen) => (
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



        {/* Sección de ingredientes y utensilios */}
        <Box sx={{ mt: 4 }}>
          <Grid container >
            <Grid item xs={12} md={6}>
              <Box sx={{backgroundColor: '#FFFFEC', borderRadius: '20px', pl: '16px', pt: '16px', pb: '5px', mr: { md: 2 }, mb: 1}}>
                <Typography variant="h5" component="h2" sx={{fontWeight: 'bold'}}>
                  Ingredientes
                </Typography>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      <Typography variant="body1" component="p" sx={{ cursor:'pointer', ":hover": {textDecoration: 'underline'}}} onClick={() => navigate(`/ingredients/${ingredient.ingredientID._id}`, { state: { amountState: (ingredient.amount * services / recipe.numberService).toFixed(2) }})}>
                        <strong>{capitalizeFirstLetter(ingredient.ingredientID.name)}:</strong> {(ingredient.amount * services / recipe.numberService).toFixed(2)} {ingredient.ingredientID.unit}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} sx={{backgroundColor: '#FFFFEC', borderRadius: '20px', pl: '16px', pt: '16px', mb: 1}}>
              <Typography variant="h5" component="h2" sx={{fontWeight: 'bold'}}>
                Utensilios de Cocina
              </Typography>
              <ul>
                {recipe.cookware.length > 0 ? (
                  recipe.cookware.map((utensil, index) => (
                    <li key={index}>
                      <Typography variant="body1" component="p">
                        {capitalizeFirstLetter(utensil)}
                      </Typography>
                    </li>
                  ))
                ) : (
                  <Typography variant="body1" component="p">
                    No se han especificado utensilios.
                  </Typography>
                )}
              </ul>
            </Grid>
          </Grid>
        </Box>

        {/* Sección de instrucciones */}
        <Box sx={{ mt: 4, backgroundColor: '#FFFFEC', borderRadius: '20px', pl: '16px', pt: '16px' }}>
          <Typography variant="h5" component="h2" sx={{fontWeight: 'bold'}}>
            Instrucciones
          </Typography>
          <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
            <ol style={{ maxWidth: '100%' }}>
              {recipe.instructions.length > 0 ? (
                recipe.instructions.map((instruction, index) => (
                  <li key={index} style={{ wordWrap: 'break-word' }}>
                    <Typography variant="body1" component="p">
                      {instruction}
                    </Typography>
                  </li>
                ))
              ) : (
                <Typography variant="body1" component="p">
                  No se han especificado instrucciones.
                </Typography>
              )}
            </ol>
          </div>
        </Box>

        {/* Sección de comentarios */}
        <Box sx={{ mt: 4, maxWidth: '100%', backgroundColor: '#FFFFEC', borderRadius: '20px', pl: '16px', pt: '16px', pb: '16px' }}>
          <Typography variant="h5" component="h2" sx={{fontWeight: 'bold'}}>
            Comentarios
          </Typography>
          <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
            {recipe.comments ? (
              <Typography variant="body1" component="p" sx={{ ml: 2 }}>
                {recipe.comments}
              </Typography>
            ) : (
              <Typography variant="body1" component="p" sx={{ ml: 2 }}>
                No se han especificado comentarios.
              </Typography>
            )}
          </div>
        </Box>


        {/* Sección de nutrientes */}
        <Box sx={{ mt: 4, backgroundColor: '#FFFFEC', borderRadius: '20px', pl: '16px', pt: '16px' }}>
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
                    <strong>{nutrient}:</strong> {(getNutrientAmount(nutrient)  * services / recipe.numberService).toFixed(2)} {getUnitFromName(nutrient)}
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
                    <strong>{nutrient}:</strong> {(getNutrientAmount(nutrient) * services / recipe.numberService).toFixed(2)} {getUnitFromName(nutrient)}
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
                    <strong>{nutrient}:</strong> {(getNutrientAmount(nutrient) * services / recipe.numberService).toFixed(2)} {getUnitFromName(nutrient)}
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
                    <strong>{nutrient}:</strong> {(getNutrientAmount(nutrient) * services / recipe.numberService).toFixed(2)} {getUnitFromName(nutrient)}
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
            onClick={() => navigate(`/recipes/modify/${recipe._id}`)}
          >
            Modificar Receta
          </Button>

          <Button
            variant="contained"
            className="botonDeleteIngredient"
            onClick={deleteRecipeFunction} 
          >
            Borrar Receta
          </Button>
        </div>
      )}
      </Grid>
    </Grid>
  );
}

export default RecipeDetails;