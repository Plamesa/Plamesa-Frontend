import EntranteImg from '../assets/foodType/entrante.svg';
import PrincipalImg from '../assets/foodType/principal.svg';
import PostreImg from '../assets/foodType/postre.svg';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { FoodType, NutrientsTypes } from '../utils/enums';
import './RecipeCard.css'
import { useNavigate } from 'react-router-dom';
import { GETRecipeInterface } from '../utils/interfaces';
import { capitalizeFirstLetter } from '../utils/utils';

interface RecipeCardProps {
  recipe: GETRecipeInterface;
}

const foodTypeImages: { [key in FoodType]: string } = {
  [FoodType.Entrante]: EntranteImg,
  [FoodType.PlatoPrincipal]: PrincipalImg,
  [FoodType.Postre]: PostreImg
};

function RecipeCard({ recipe }: RecipeCardProps) {
  const foodTypeImage = foodTypeImages[recipe.foodType as FoodType];
  const kcalNutrient = recipe.nutrients.find((nutrient) => nutrient.name === NutrientsTypes.Energia);
  const navigate = useNavigate();

  return (
    <Card className='cardContainer'>
      <CardMedia
        component="img"
        image={foodTypeImage}
        alt={recipe.name}
        className='cardImgContainer'
      />
      <CardContent className='CardTextContainer'>
        <Typography variant="h5" component="div" style={{ fontWeight: 'bold' }}>
          {capitalizeFirstLetter(recipe.name)}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" component="p">
          {recipe.estimatedCost.toFixed(2)}€ /{recipe.numberService} pers
        </Typography>
        {kcalNutrient && (
          <Typography variant="body2" color="textSecondary" component="p">
            {kcalNutrient.amount.toFixed(2)} kcal /{recipe.numberService} pers
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary" component="p">
          {recipe.preparationTime} min
        </Typography>
        <Button onClick={() => navigate(`/recipes/${recipe._id}`)} variant="contained" className='buttonCard'>
          Más Info
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;