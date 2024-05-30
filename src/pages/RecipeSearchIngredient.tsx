import React, { useState, useEffect } from 'react';
import { GETRecipeInterface, IngredientInterface } from '../utils/interfaces';
import { Button, TextField, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import recipeService from '../services/RecipeService';
import RecipeCard from '../components/RecipeCard';
import ingredientService from '../services/IngredientService';
import { capitalizeFirstLetter } from '../utils/utils';
import './RecipeSearchIngredient.css';

function RecipesSearchIngredient() {
  const [recipes, setRecipes] = useState<GETRecipeInterface[]>([]);
  const [ingredients, setIngredients] = useState<{ _id: string; name: string; unit: string; amount: string }[]>([])
  const [selectedIngredient, setSelectedIngredient] = useState<{ _id: string; name: string; unit: string; amount: string }[]>([]);

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

  async function searchRecipes() {
    try {
      const ingredientsToSearch = selectedIngredient.map(ingredient => { return ingredient._id})
      console.log(ingredientsToSearch)
      await recipeService.searchRecipesPerIngredients(ingredientsToSearch)
        .then(response => {
          console.log(response.data);
          const recipes: GETRecipeInterface[] = response.data.recipes
          setRecipes(recipes);
        })
        .catch(error => {
          console.error(error);
        });

    }catch (error) {
      console.error('Error al obtener la información de los ingredientes: ', error);
    }
  }


  return (
    <div className="homeIngredient">
      <div className='searchBox'>
        <Autocomplete
          multiple
          fullWidth
          options={ingredients}
          getOptionLabel={(option) => capitalizeFirstLetter(option.name)}
          value={selectedIngredient}
          onChange={(_, newValue) => setSelectedIngredient(newValue)}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderInput={(params) => (
            <TextField 
              {...params} 
              variant="filled" 
              label="Selecciona un ingrediente" 
              fullWidth 
            />
          )}
          className='textFieldCreateRecipe'
        />
      </div>

      <Button
        variant="contained"
        className="botonRegisterCreateRecipe"
        onClick={searchRecipes}
      >
        Buscar recetas
      </Button>

      {/* Cards con las recetas */}
      <div className="cardsContainer">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default RecipesSearchIngredient;