import { GETRecipeInterface } from '../utils/interfaces';
import { capitalizeFirstLetter } from '../utils/utils';
import RecipeCard from './RecipeCard';

interface RecipeCardProps {
  recipe: GETRecipeInterface;
  matchingIngredients: { amount: number; ingredientID: {name: string; unit: string; _id: string} }[]
}

function RecipeCardSearchIngredient ({ recipe, matchingIngredients }: RecipeCardProps) {
  return (
    <div className="recipeCardWrapper">
      <RecipeCard recipe={recipe} />
      
      <div className="matchingIngredients">
        <h4 style={{marginBottom: '0'}}>Ingredientes Coincidentes</h4>
        <ul style={{marginTop: '10px', textAlign: 'left'}}>
          {matchingIngredients.map(ingredient => (
            <li key={ingredient.ingredientID._id}>{capitalizeFirstLetter(ingredient.ingredientID.name)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeCardSearchIngredient;