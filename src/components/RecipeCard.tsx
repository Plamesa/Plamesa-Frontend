import React, { useState, useEffect } from 'react';
import EntranteImg from '../assets/foodType/entrante.svg';
import PrincipalImg from '../assets/foodType/principal.svg';
import PostreImg from '../assets/foodType/postre.svg';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { FoodType, NutrientsTypes } from '../utils/enums';
import './RecipeCard.css'
import { useNavigate } from 'react-router-dom';
import { GETRecipeInterface, RecipeInterface } from '../utils/interfaces';

interface RecipeCardProps {
  recipe: GETRecipeInterface;
}

const foodTypeImages: { [key in FoodType]: string } = {
  [FoodType.Entrante]: EntranteImg,
  [FoodType.PlatoPrincipal]: PrincipalImg,
  [FoodType.Postre]: PostreImg
};

function capitalizeFirstLetter(string: string) {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
}

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
          {Math.round(recipe.estimatedCost)}€ /{recipe.numberService} pers
        </Typography>
        {kcalNutrient && (
          <Typography variant="body2" color="textSecondary" component="p">
            {kcalNutrient.amount} kcal /{recipe.numberService} pers
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