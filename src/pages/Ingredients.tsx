import React, { useState, useEffect } from 'react';
import './Ingredients.css'; // Archivo CSS para estilos
import ingredientService from '../services/IngredientService';
import IngredientCard from '../components/IngredientCard';
import { IngredientInterface } from '../utils/interfaces';
import { FormControl, InputLabel, Select, MenuItem, Slider, Button, TextField } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Allergen, FoodGroup } from '../utils/enums';

function Ingredients() {
  const [ingredients, setIngredients] = useState<IngredientInterface[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<IngredientInterface[]>([]);
  const [filters, setFilters] = useState({
    foodGroup: '',
    allergen: '',
    maxPrice: 20 // Precio máximo inicial
  });
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

  // Aplicar filtros cuando cambian los valores
  useEffect(() => {
    if (ingredients.length > 0) {
      applyFilters();
    }
  }, [filters, ingredients]);

  // Aplicar filtros según término de búsqueda y valores de filtros
  useEffect(() => {
    if (ingredients.length > 0) {
      applyFilters();
    }
  }, [searchTerm, ingredients]);

  const applyFilters = () => {
    let filteredData = ingredients;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filteredData = filteredData.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por grupo de alimentos
    if (filters.foodGroup) {
      filteredData = filteredData.filter(ingredient => ingredient.foodGroup === filters.foodGroup);
    }

    // Filtrar por alérgeno
    if (filters.allergen) {
      filteredData = filteredData.filter(ingredient => ingredient.allergens.includes(filters.allergen));
    }

    // Filtrar por precio máximo
    filteredData = filteredData.filter(ingredient => ingredient.estimatedCost <= filters.maxPrice);

    setFilteredIngredients(filteredData);
  };

  const handleFilterChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name!]: value });
  };

  const handleMaxPriceChange = (event: Event, newValue: number | number[]) => {
    setFilters({ ...filters, maxPrice: newValue as number });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="home">
      <div className="content">
        <TextField
          type="text"
          placeholder="Buscar por nombre de ingrediente"
          value={searchTerm}
          onChange={handleSearchChange}
          className="searchBar"
        />

        <div className="filtersContainer">
          <FormControl fullWidth>
            <InputLabel id="filters-label">Filtros</InputLabel>
            <Select
              labelId="filters-label"
              id="filters-select"
              MenuProps={{ anchorOrigin: { vertical: 'bottom', horizontal: 'left' } }}
            >
              <MenuItem>
                <FormControl fullWidth>
                  <InputLabel id="foodGroup-label">Grupo de Alimentos</InputLabel>
                  <Select
                    labelId="foodGroup-label"
                    id="foodGroup-select"
                    value={filters.foodGroup}
                    name="foodGroup"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {Object.values(FoodGroup).map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MenuItem>

              <MenuItem>
                <FormControl fullWidth>
                  <InputLabel id="allergen-label">Alérgenos</InputLabel>
                  <Select
                    labelId="allergen-label"
                    id="allergen-select"
                    value={filters.allergen}
                    name="allergen"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {Object.values(Allergen).map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MenuItem>

              <MenuItem>
                <FormControl fullWidth>
                  <InputLabel id="maxPrice-label">Precio Máximo</InputLabel>
                  <Slider
                    aria-labelledby="maxPrice-label"
                    value={filters.maxPrice}
                    onChange={handleMaxPriceChange}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={20} // Precio máximo máximo
                  />
                </FormControl>
              </MenuItem>
              <MenuItem>
                <Button variant="contained" onClick={() => setFilters({ foodGroup: '', allergen: '', maxPrice: 10 })}>
                  Limpiar Filtros
                </Button>
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      
      <div className="cardsContainer">
        {filteredIngredients.map((ingredient) => (
          <IngredientCard key={ingredient._id} ingredient={ingredient} />
        ))}
      </div>
    </div>
  );
}

export default Ingredients;