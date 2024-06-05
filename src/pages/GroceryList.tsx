import { useState, useEffect } from 'react';
import { GETRecipeInterface, IngredientAmount } from '../utils/interfaces';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import './GroceryList.css'; 
import { capitalizeFirstLetter } from '../utils/utils';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { generateGroceryListPDF } from '../utils/generatePDF';

function GroceryList() {
  const location = useLocation();
  const { recipes, title, numberServices } = location.state as { recipes: Array<{ starter: GETRecipeInterface, main: GETRecipeInterface, dessert: GETRecipeInterface }>, title: string, numberServices: number };
  const [groupedIngredients, setGroupedIngredients] = useState<Array<{ [key: string]: IngredientAmount }>>([]);
  const [totalWeeklyEstimatedCosts, settotalWeeklyEstimatedCosts] = useState<number[]>([]);

  useEffect(() => {
    const aggregateIngredients = () => {
      const ingredientMap: Array<{ [key: string]: IngredientAmount }> = [];
      let weekIngredientMap: { [key: string]: IngredientAmount } = {};
      let totalWeekEstimatedCostVector: number[] = [];
      let totalWeekEstimatedCost: number = 0;
      let dayCount = 0;

      recipes.forEach((day, index) => {
        const allRecipes = [day.starter, day.main, day.dessert];
        allRecipes.forEach(recipe => {
          recipe.ingredients.forEach(ingredient => {
            const key = ingredient.ingredientID._id;
            if (!weekIngredientMap[key]) {
              weekIngredientMap[key] = {
                _id: ingredient.ingredientID._id,
                name: ingredient.ingredientID.name,
                amount: 0,
                unit: ingredient.ingredientID.unit
              };
            }
            weekIngredientMap[key].amount += (ingredient.amount * numberServices / recipe.numberService);
          });
          
          totalWeekEstimatedCost += (recipe.estimatedCost * numberServices / recipe.numberService);
        });

        dayCount += 1;
        if (dayCount === 7 || index === recipes.length - 1) {
          ingredientMap.push(weekIngredientMap);
          totalWeekEstimatedCostVector.push(totalWeekEstimatedCost);
          weekIngredientMap = {};
          dayCount = 0;
          totalWeekEstimatedCost = 0;
        }
      });

      setGroupedIngredients(ingredientMap);
      settotalWeeklyEstimatedCosts(totalWeekEstimatedCostVector);
    };

    aggregateIngredients();
  }, [recipes]);



  return (
    <div className="globalContainer">
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
          <Typography variant="h5" component="h5">
            Lista de la compra menu: {capitalizeFirstLetter(title)}
          </Typography>

        <Box display="flex" alignItems="center">
          <Box onClick={() => generateGroceryListPDF(groupedIngredients, totalWeeklyEstimatedCosts, title)} sx={{ cursor: 'pointer', pl: 1}}>
            <PictureAsPdfIcon sx={{ color: '#545454', fontSize: 50 }} titleAccess='Generar PDF'/>
          </Box>
        </Box>
      </Box>

      {groupedIngredients.map((weekIngredients, weekIndex) => (
        <div key={weekIndex} className="weekContainer">
          <Typography variant="h6" component="h6">
            Semana {weekIndex + 1} | Coste estimado: {(totalWeeklyEstimatedCosts[weekIndex]).toFixed(2)}€
          </Typography>
          <div className="groceryListContainer">
            {Object.values(weekIngredients).map((item) => (
              <div key={item._id} className="groceryItem">
                <FormControlLabel
                  control={<Checkbox defaultChecked={false} />}
                  label={`${capitalizeFirstLetter(item.name)}: ${(item.amount).toFixed(2)} ${item.unit}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}

export default GroceryList;