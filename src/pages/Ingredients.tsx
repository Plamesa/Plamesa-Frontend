import React, { useState, useEffect } from 'react';
import './Ingredients.css'; // Archivo CSS para animaciones
import ingredientService from '../services/IngredientService';
import IngredientCard from '../components/IngredientCard';
import { FoodGroup, Nutrient } from '../utils/enums';
import { IngredientInterface } from '../utils/interfaces';


function Ingredients() {
  const [ingredients, setIngredients] = useState<IngredientInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await ingredientService.getIngredients();
        setIngredients(response.data);
      } catch (error) {
        console.error('Error al obtener la información de los ingredientes: ', error);
      }
    };

    fetchIngredients();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home" style={{ height: '100vh', textAlign: 'center' }}>
      <div className="content" style={{ padding: '20px' }}>
        <h1 className="animated-text">¡Ingredientes!</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre de ingrediente"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="cardsContainer">
          {filteredIngredients.map((ingredient) => (
            <IngredientCard key={ingredient._id} ingredient={ingredient} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Ingredients;