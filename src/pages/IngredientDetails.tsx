import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ingredientService from '../services/IngredientService';
import { Allergen, FoodGroup, Nutrient } from '../utils/enums';
import { IngredientInterface } from '../utils/interfaces';

function IngredientDetails() {
  const { _id } = useParams(); // Obtener el ID del ingrediente de los parámetros de la URL
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

  useEffect(() => {
    // Hacer una solicitud para obtener los detalles del ingrediente según su ID
    if (_id) {
      ingredientService.getIngredientById(_id)
        .then(response => setIngredient(response.data))
        .catch(error => console.error('Error al obtener los detalles del ingrediente:', error));
    }
    
  }, [_id]);

  return (
    <div>
      <h2>{ingredient.name} Detalles</h2>
      <p>ID: {_id}</p>
      {/* Renderizar otros detalles del ingrediente aquí */}
    </div>
  );
}

export default IngredientDetails;