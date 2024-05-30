import React, { useState, useEffect } from 'react';
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
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { FoodGroup, Nutrient, NutrientsTypes } from '../utils/enums';
import './IngredientCard.css'
import { useNavigate } from 'react-router-dom';
import { GETIngredientInterface } from '../utils/interfaces';
import { capitalizeFirstLetter } from '../utils/utils';

interface IngredientCardProps {
  ingredient: GETIngredientInterface;
}

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

function IngredientCard({ ingredient }: IngredientCardProps) {
  const foodGroupImage = foodGroupImages[ingredient.foodGroup as FoodGroup];
  const kcalNutrient = ingredient.nutrients.find((nutrient) => nutrient.name === NutrientsTypes.Energia);
  const navigate = useNavigate();

  return (
    <Card className='cardContainer'>
      <CardMedia
        component="img"
        image={foodGroupImage}
        alt={ingredient.name}
        className='cardImgContainer'
      />
      <CardContent className='CardTextContainer'>
        <Typography variant="h5" component="div" style={{ fontWeight: 'bold' }}>
          {capitalizeFirstLetter(ingredient.name)}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {ingredient.estimatedCost.toFixed(2)}€ /{ingredient.amount}{ingredient.unit}
        </Typography>
        {kcalNutrient && (
          <Typography variant="body2" color="textSecondary" component="p">
            {kcalNutrient.amount.toFixed(2)} kcal/{ingredient.amount}{ingredient.unit}
          </Typography>
        )}
        <Button onClick={() => navigate(`/ingredients/${ingredient._id}`)} variant="contained" className='buttonCard'>
          Más Info
        </Button>
      </CardContent>
    </Card>
  );
};

export default IngredientCard;