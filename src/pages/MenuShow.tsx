import React, { useState, useEffect } from 'react';
import { GETMenuInterface, RecipeInterface } from '../utils/interfaces';
import { Button, TextField, Box } from '@mui/material';
import { NutrientsTypes } from '../utils/enums';
import { useNavigate, useParams } from 'react-router-dom';
import './MenuDetails.css'; 
import recipeService from '../services/RecipeService';
import MenuRecipeCard from '../components/MenuRecipeCard';
import { capitalizeFirstLetter } from '../utils/utils';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { LocalGroceryStoreSharp, Save } from '@mui/icons-material';
import ingredientService from '../services/IngredientService';
import menuService from '../services/MenuService';

function MenuShow() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { _id } = useParams<{ _id: string }>();

  const [recipes, setRecipes] = useState<Array<{ starter: RecipeInterface, main: RecipeInterface, dessert: RecipeInterface }>>([]);
  const [totals, setTotals] = useState<Array<{ kcal: number, macros: { protein: number, carbs: number, fat: number }, cost: number }>>([]);
  const [ingredients, setIngredients] = useState<{_id: string, name: string}[]>([]);
  const [menuData, setMenuData] = useState<GETMenuInterface>({
    _id: '',
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

  const getNutrientAmount = (nutrientName: NutrientsTypes, recipe: RecipeInterface): number => {
    const nutrient = recipe.nutrients.find(n => n.name === nutrientName);
    return nutrient ? nutrient.amount : 0;
  };

  // Calcular los valores nutricionales y el precio según el número de servicios
  const calculateRecipeValues = (recipe: RecipeInterface, numberServices: number) => {
    return {
      kcal: getNutrientAmount(NutrientsTypes.Energia, recipe) * numberServices / recipe.numberService,
      macros: {
        protein: getNutrientAmount(NutrientsTypes.Proteinas, recipe) * numberServices / recipe.numberService,
        carbs: getNutrientAmount(NutrientsTypes.Carbohidratos, recipe) * numberServices / recipe.numberService,
        fat: getNutrientAmount(NutrientsTypes.GrasaTotal, recipe) * numberServices / recipe.numberService
      },
      cost: recipe.estimatedCost * numberServices / recipe.numberService
    };
  };
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        if (_id && token) {
          const menuResponse = await menuService.getMenuById(_id, token);
          const menuResponseData: GETMenuInterface = menuResponse.data;
          setMenuData(menuResponseData);

          const newRecipes = await Promise.all(menuResponseData.recipesPerDay.map(async (recipe) => {
            const starter = await recipeService.getRecipeById(recipe.recipeStarterID._id);
            const main = await recipeService.getRecipeById(recipe.recipeMainDishID._id);
            const dessert = await recipeService.getRecipeById(recipe.recipeDessertID._id);
            return { starter: starter.data, main: main.data, dessert: dessert.data };
          }));
          setRecipes(newRecipes);
  
          let avergageCost: number = 0;
          const newTotals = newRecipes.map(dayRecipes => {
            const numberServices = menuResponseData.numberServices;
            const starter = calculateRecipeValues(dayRecipes.starter, numberServices);
            const main = calculateRecipeValues(dayRecipes.main, numberServices);
            const dessert = calculateRecipeValues(dayRecipes.dessert, numberServices);
  
            const kcal = starter.kcal + main.kcal + dessert.kcal;
            const macros = {
              protein: starter.macros.protein + main.macros.protein + dessert.macros.protein,
              carbs: starter.macros.carbs + main.macros.carbs + dessert.macros.carbs,
              fat: starter.macros.fat + main.macros.fat + dessert.macros.fat
            };
            const cost = starter.cost + main.cost + dessert.cost;
            avergageCost += cost;
            return { kcal, macros, cost };
          });
          setTotals(newTotals);
          menuData.avergageEstimatedCost = avergageCost / menuData.numberDays;
        }
      } catch (error) {
        console.error('Error al obtener la información de las recetas: ', error);
      }
    };

    const fetchIngredients = async () => {
      try {
        const newIngredients = await Promise.all(menuData.excludedIngredients.map(async (ingredient) => {
          const ingredientObj = await ingredientService.getIngredientById(ingredient);
          return { _id: ingredientObj.data._id, name: ingredientObj.data.name }
        }));
        setIngredients(newIngredients);

      } catch (error) {
        console.error('Error al obtener la información de los ingredientes: ', error);
      }
    };

    fetchRecipes();
    fetchIngredients();
  }, [_id, token]);

  async function saveMenu() {
    try {
      if (token && _id) {
        await menuService
          .modifyMenu(_id, token, {title: menuData.title})
          .then((response) => {
            console.log(response);
            if(response.status == 201) {
              alert('Menu guardado');
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
      else {
        alert("Debe Iniciar Sesión para poder guardar el menu")
      }
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    }
  };


  async function deleteMenuFunction() {
    var resultado = window.confirm('¿Estas seguro de elimiar el menu?')
    if (resultado === true) {
      try {
        if (token && _id) {
          await menuService
            .deleteMenu(_id, token)
            .then((response) => {
              alert('Menu eliminado')
              navigate('/menus');
              console.log(response)
            })
            .catch((error) => {
              console.log(error)
              alert('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
            })
          }
      } catch (error) {
        console.log(error)
      }
    }
  }


  return (
    <div className="globalContainer">
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
        <TextField
          variant="standard"
          value={menuData.title}
          onChange={(e) => setMenuData({...menuData, title: e.target.value})}
          inputProps={{
            style: { width: `${menuData.title.toString().length + 1}ch`, textAlign: 'center', color: '#545454', fontSize: '25px'}
          }}
          className='TextFieldTitleMenu'
        />

        <Box display="flex" alignItems="center">
          {token && (
            <Box onClick={saveMenu} sx={{ cursor: 'pointer', pl: 1}}>
              <Save sx={{ color: '#545454', fontSize: 50 }} />
            </Box>
          )}
          <Box /*onClick={() => generateRecipePDF(recipe, services)}*/ sx={{ cursor: 'pointer', pl: 1}}>
            <PictureAsPdfIcon sx={{ color: '#545454', fontSize: 50 }} />
          </Box>
          <Box /*onClick={() => generateRecipePDF(recipe, services)}*/ sx={{ cursor: 'pointer', pl: 1}}>
            <LocalGroceryStoreSharp sx={{ color: '#545454', fontSize: 50 }} />
          </Box>
        </Box>
      </Box>


      <div className="daysContainer">
        {recipes.map((dayRecipes, index) => (
          <div key={index} className="dayColumn">
            <h2>Día {index + 1}</h2>
            <MenuRecipeCard recipe={dayRecipes.starter} numberServices={menuData.numberServices} />
            <MenuRecipeCard recipe={dayRecipes.main} numberServices={menuData.numberServices} />
            <MenuRecipeCard recipe={dayRecipes.dessert} numberServices={menuData.numberServices} />
            <div className="totals">
              <p><strong>Coste Estimado:</strong> {(totals[index]?.cost).toFixed(2)} €</p>
              <p><strong>Energia:</strong> {(totals[index]?.kcal).toFixed(2)} kcal</p>
              <p><strong>Proteinas:</strong> {(totals[index]?.macros.protein).toFixed(2)} g</p>
              <p><strong>Carbohidratos:</strong> {(totals[index]?.macros.carbs).toFixed(2)} g</p>
              <p><strong>Grasas:</strong> {(totals[index]?.macros.fat).toFixed(2)} g</p>
            </div>
          </div>
        ))}
      </div>

      <Box className="menuInfo">
        <p><strong>Número de Días:</strong><br></br> {menuData.numberDays} días</p>
        <p><strong>Número de Servicios:</strong><br></br> {menuData.numberServices} pers</p>
        <p><strong>Objetivo de Calorias:</strong><br></br> {(menuData.caloriesTarget).toFixed(2)} kcal</p>
        <p><strong>Coste Medio:</strong><br></br> {(menuData.avergageEstimatedCost).toFixed(2)} €</p>

        {/* Allergies */}
        <div>
          <strong>Alergias:</strong>
          {menuData.allergies.length ? (
            <div>
              {menuData.allergies.map((allergy) => (
                <p key={allergy} style={{ margin: '0', padding: '0' }}>
                  {allergy}
                </p>
              ))}
            </div>
          ) : (
            <p style={{ margin: '0', padding: '0' }}>No se indican alergias</p>
          )}
        </div>

        {/* Excluded Ingredients */}
        <div>
          <strong>Ingredientes a Excluir:</strong>
          {ingredients.length ? (
            <div>
              {ingredients.map((ingredient) => (
                <p key={ingredient._id} style={{ margin: '0', padding: '0' }}>
                  {capitalizeFirstLetter(ingredient.name)}
                </p>
              ))}
            </div>
          ) : (
            <p style={{ margin: '0', padding: '0' }}>No se indican ingredientes a excluir</p>
          )}
        </div>

        {/* Diet */}
        <p>
          <strong>Tipo de Dieta:</strong><br></br>
          {menuData.diet ? menuData.diet : 'No se indica dieta'}
        </p>
      </Box>

      <div className='buttonContainerMenuDetails'>
        <Button
          variant="contained"
          className="botonSaveMenu"
          onClick={saveMenu}
        >
          Guardar menu
        </Button>

        <Button
            variant="contained"
            className="botonDeleteIngredient"
            onClick={deleteMenuFunction} 
          >
            Borrar menu
          </Button>
      </div>
    </div>
  );
}

export default MenuShow;