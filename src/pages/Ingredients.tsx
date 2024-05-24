import React, { useState, useEffect } from 'react';
import ingredientService from '../services/IngredientService';
import IngredientCard from '../components/IngredientCard';
import { IngredientInterface } from '../utils/interfaces';
import { FormControl, InputLabel, Select, MenuItem, Slider, Button, TextField, Box, IconButton, Menu } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SelectChangeEvent } from '@mui/material/Select';
import { Allergen, FoodGroup } from '../utils/enums';
import { useNavigate } from 'react-router-dom';
import './Ingredients.css'; 

function Ingredients() {
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState<IngredientInterface[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<IngredientInterface[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(30);
  const [filters, setFilters] = useState({
    foodGroup: '',
    allergen: '',
    maxPrice: maxPrice // Precio máximo inicial
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await ingredientService.getIngredients();
        setIngredients(response.data);

        const fetchedIngredients: IngredientInterface[] = response.data;
        if (fetchedIngredients.length > 0) {
          const prices = fetchedIngredients.map(ingredient => ingredient.estimatedCost);
          const min = Math.min(...prices);
          const max = Math.max(...prices);

          setMinPrice(min);
          setMaxPrice(max);
          setFilters((prevFilters) => ({...prevFilters, maxPrice: max }));
        }
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
    <div className="homeIngredient">
      <div className="contentIngredient">
        <Box display="flex">
          <TextField // Buscador
            type="text"
            placeholder="Buscar Ingrediente"
            value={searchTerm}
            onChange={handleSearchChange}
            className="searchBar"
          />


        <div className='filtersContainer'>
          <IconButton onClick={handleMenuOpen} className="filtersIcon">
            <FilterListIcon />
          </IconButton></div>
          <Menu
            id="filters-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            className="filtersMenu"
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
                  min={minPrice}
                  max={maxPrice}
                  className="filtersSlider"
                  sx={{ml: 0, color: '#545454', mb: 1}}
                />
              </FormControl>
            </MenuItem>
            
            <MenuItem>
              <Button variant="contained" className='cleanFiltersButton' onClick={() => setFilters({ foodGroup: '', allergen: '', maxPrice: maxPrice })}>
                Limpiar Filtros
              </Button>
            </MenuItem>
          </Menu>
        </Box>


        {/* Botón añadir ingrediente */}
        <Box>
          <h3 className='h3Ingredients'>Añade  tu propio ingrediente</h3>
          <Button
            variant="contained"
            className="botonCreateIngredients"
            onClick={() => navigate(`/ingredients/create`)}
          >
            +
          </Button>
        </Box>
      </div>


      {/* Cards con los ingredientes */}
      <div className="cardsContainer">
        {filteredIngredients.map((ingredient) => (
          <IngredientCard key={ingredient._id} ingredient={ingredient} />
        ))}
      </div>
    </div>
  );
}

export default Ingredients;