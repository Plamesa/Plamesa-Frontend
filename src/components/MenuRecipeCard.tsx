import { Card, CardContent, Typography, Button } from '@mui/material';
import { NutrientsTypes } from '../utils/enums';
import './MenuRecipeCard.css'
import { useNavigate } from 'react-router-dom';
import { RecipeInterface } from '../utils/interfaces';
import { capitalizeFirstLetter } from '../utils/utils';


function MenuRecipeCard({recipe, numberServices}: {recipe: RecipeInterface, numberServices: number}) {
  const navigate = useNavigate();
  const kcalNutrient = recipe.nutrients.find((nutrient) => nutrient.name === NutrientsTypes.Energia);

  return (
    <Card className='cardContainer'>
      <CardContent className='CardTextContainer'>
        <Typography variant="h5" component="div" style={{ fontWeight: 'bold' }}>
          {capitalizeFirstLetter(recipe.name)}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" component="p">
          {(recipe.estimatedCost * numberServices / recipe.numberService).toFixed(2)}€ /{numberServices} pers
        </Typography>
        {kcalNutrient && (
          <Typography variant="body2" color="textSecondary" component="p">
            {(kcalNutrient.amount * numberServices / recipe.numberService).toFixed(2)} kcal /{numberServices} pers
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary" component="p">
          {recipe.preparationTime} min
        </Typography>
        <Button onClick={() => navigate(`/recipes/${recipe._id}`, { state: { numberServicesState: numberServices }})} variant="contained" className='buttonCard'>
          Más Info
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuRecipeCard;