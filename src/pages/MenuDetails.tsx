import React, { useState, useEffect, MenuHTMLAttributes } from 'react';
import { GETRecipeInterface, MenuDocumentInterface, RecipeInterface } from '../utils/interfaces';
import { FormControl, InputLabel, Select, MenuItem, Slider, Button, TextField, Box, IconButton, Menu, FormControlLabel, Switch, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SelectChangeEvent } from '@mui/material/Select';
import { Allergen, FoodType, NutrientsTypes, RecipesPerDay } from '../utils/enums';
import { useNavigate, useLocation } from 'react-router-dom';
import './MenuDetails.css'; 
import recipeService from '../services/RecipeService';
import RecipeCard from '../components/RecipeCard';
import userService from '../services/UserService';
import MenuRecipeCard from '../components/MenuRecipeCard';
import { capitalizeFirstLetter } from '../utils/utils';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

function MenuDetails() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const { menu } = location.state as { menu: MenuDocumentInterface };

  const [recipes, setRecipes] = useState<Array<{ starter: RecipeInterface, main: RecipeInterface, dessert: RecipeInterface }>>([]);
  const [totals, setTotals] = useState<Array<{ kcal: number, macros: { protein: number, carbs: number, fat: number }, cost: number }>>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

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
        const newRecipes = await Promise.all(menu.recipesPerDay.map(async (recipe) => {
          const starter = await recipeService.getRecipeById(recipe.recipeStarterID);
          const main = await recipeService.getRecipeById(recipe.recipeMainDishID);
          const dessert = await recipeService.getRecipeById(recipe.recipeDessertID);
          return { starter: starter.data, main: main.data, dessert: dessert.data };
        }));
        setRecipes(newRecipes);

        const newTotals = newRecipes.map(dayRecipes => {
          const numberServices = menu.numberServices;
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
          return { kcal, macros, cost };
        });
        setTotals(newTotals);
      } catch (error) {
        console.error('Error al obtener la información de las recetas: ', error);
      }
    };

    fetchRecipes();
  }, [menu]);

  const handleFavoriteClick = async () => {
    try {
      if (token) {
        if (isFavorite) {
          //await userService.removeFavoriteRecipe(token, _id);
        } else {
          //await userService.addFavoriteRecipe(token, _id);
        }
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    }
  };


  return (
    <div className="globalContainer">
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>

        <TextField
            variant="standard"
            value={'dsa'}
            /*onChange={(e) => setAmount(Number(e.target.value))}
            inputProps={{
              style: { width: `${amount.toString().length + 1}ch`, textAlign: 'center' }
            }}*/
          />
        <Box display="flex" alignItems="center">
          {token && (
            <Box onClick={handleFavoriteClick} sx={{ cursor: 'pointer', pl: 1}}>
              {isFavorite ? <Favorite sx={{ color: '#BC4B51', fontSize: 50 }} /> : <FavoriteBorder sx={{ fontSize: 50 }}/>}
            </Box>
          )}
          <Box /*onClick={() => generateRecipePDF(recipe, services)}*/ sx={{ cursor: 'pointer', pl: 1}}>
            <PictureAsPdfIcon sx={{ color: '#545454', fontSize: 50 }} />
          </Box>
        </Box>
      </Box>


      <div className="daysContainer">
        {recipes.map((dayRecipes, index) => (
          <div key={index} className="dayColumn">
            <h2>Día {index + 1}</h2>
            <MenuRecipeCard recipe={dayRecipes.starter} numberServices={menu.numberServices} />
            <MenuRecipeCard recipe={dayRecipes.main} numberServices={menu.numberServices} />
            <MenuRecipeCard recipe={dayRecipes.dessert} numberServices={menu.numberServices} />
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
    </div>
  );
}

export default MenuDetails;