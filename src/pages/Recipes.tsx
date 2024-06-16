import React, { useState, useEffect } from 'react';
import { GETRecipeInterface, RecipeInterface } from '../utils/interfaces';
import { FormControl, InputLabel, Select, MenuItem, Slider, Button, TextField, Box, IconButton, Menu, FormControlLabel, Switch, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SelectChangeEvent } from '@mui/material/Select';
import { Allergen, FoodType } from '../utils/enums';
import { useNavigate } from 'react-router-dom';
import './Recipes.css'; 
import recipeService from '../services/RecipeService';
import RecipeCard from '../components/RecipeCard';
import userService from '../services/UserService';

function Recipes() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<GETRecipeInterface[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<GETRecipeInterface[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(30);
  const [filters, setFilters] = useState({
    foodType: '',
    allergen: '',
    maxPrice: maxPrice,
    favoriteRecipes: false,
    userRecipes: false
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
    const fetchRecipes = async () => {
      try {
        const response = await recipeService.getRecipes();
        setRecipes(response.data);

        const fetchedRecipes: RecipeInterface[] = response.data;
        if (fetchedRecipes.length > 0) {
          fetchedRecipes.sort((a, b) => a.name.localeCompare(b.name));
          const prices = fetchedRecipes.map(recipe => recipe.estimatedCost);
          const min = Math.min(...prices);
          const max = Math.max(...prices);

          setMinPrice(min);
          setMaxPrice(max);
          setFilters((prevFilters) => ({...prevFilters, maxPrice: max }));
        }
      } catch (error) {
        console.error('Error al obtener la información de las recetas: ', error);
      }
    };

    fetchRecipes();
  }, []);

  // Aplicar filtros cuando cambian los valores
  useEffect(() => {
    if (recipes.length > 0) {
      applyFilters();
    }
  }, [filters, recipes]);

  // Aplicar filtros según término de búsqueda y valores de filtros
  useEffect(() => {
    if (recipes.length > 0) {
      applyFilters();
    }
  }, [searchTerm, recipes]);


  const applyFilters = async () => {
    let filteredData = recipes;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filteredData = filteredData.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por grupo de alimentos
    if (filters.foodType) {
      filteredData = filteredData.filter(recipe => recipe.foodType === filters.foodType);
    }

    // Filtrar por alérgeno
    if (filters.allergen) {
      filteredData = filteredData.filter(recipe => !recipe.allergens.includes(filters.allergen));
    }

    // Filtrar por precio máximo
    filteredData = filteredData.filter(recipe => recipe.estimatedCost <= filters.maxPrice);

    if (token && filters.favoriteRecipes) {
      const userInfoResponse = await userService.getUserInfo(token);
      const favoriteIds = userInfoResponse.data.favoriteRecipes.map((recipe: { _id: string }) => recipe._id);
      filteredData = filteredData.filter(recipe => favoriteIds.includes(recipe._id));
    }

    if (token && filters.userRecipes) {
      const userResponse = await userService.getUserInfo(token);
      const userID = userResponse.data._id;
      filteredData = filteredData.filter(recipe => recipe.ownerUser._id === userID);
    }

    setFilteredRecipes(filteredData);
  };

  const handleFilterChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name!]: value });
  };

  const handleMaxPriceChange = (_: Event, newValue: number | number[]) => {
    setFilters({ ...filters, maxPrice: newValue as number });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFilters({ ...filters, [name]: checked });
  };


  return (
    <div className="homeIngredient">
      <div className="contentIngredient">
        <Box display="flex">
          <TextField // Buscador
            type="text"
            placeholder="Buscar Receta"
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
            {[
              <MenuItem key="foodType">
                <FormControl fullWidth variant="filled">
                  <InputLabel id="foodType-label">Tipo de Comida</InputLabel>
                  <Select
                    labelId="foodType-label"
                    id="foodType-select"
                    value={filters.foodType}
                    name="foodType"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {Object.values(FoodType).map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MenuItem>,
              <MenuItem key="allergen">
                <FormControl fullWidth variant="filled">
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
              </MenuItem>,
              <MenuItem key="maxPrice">
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
                    sx={{ ml: 0, color: '#545454', mb: 2, pb: 0 }}
                  />
                </FormControl>
              </MenuItem>,
              token && (
                <MenuItem key="favoriteRecipes">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.favoriteRecipes}
                        onChange={handleSwitchChange}
                        name="favoriteRecipes"
                        sx={{
                          '& .MuiSwitch-switchBase': {
                            color: '#545454',
                            '&.Mui-checked': {
                              color: '#333333',
                              '& + .MuiSwitch-track': {
                                backgroundColor: '#333333',
                              },
                            },
                          },
                        }}
                      />
                    }
                    label="Mostrar Favoritos"
                  />
                </MenuItem>
              ),
              token && (
                <MenuItem key="userRecipes">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.userRecipes}
                        onChange={handleSwitchChange}
                        name="userRecipes"
                        sx={{
                          '& .MuiSwitch-switchBase': {
                            color: '#545454',
                            '&.Mui-checked': {
                              color: '#333333',
                              '& + .MuiSwitch-track': {
                                backgroundColor: '#333333',
                              },
                            },
                          },
                        }}
                      />
                    }
                    label="Mostrar Mis Recetas"
                  />
                </MenuItem>
              ),

              <MenuItem key="clearFilters">
                <Button variant="contained" className='cleanFiltersButton' onClick={() => setFilters({ foodType: '', allergen: '', maxPrice: maxPrice, favoriteRecipes: false, userRecipes: false })}>
                  Limpiar Filtros
                </Button>
              </MenuItem>
            ]}
          </Menu>

          <Button onClick={() => navigate('/recipesSearch')} sx={{maxWidth: '120px', color:'#545454', ml: '5px'}}>
            <Typography variant='body2' component='p'>
              Buscar por Ingredientes
            </Typography>
          </Button>
        </Box>


        {/* Botón añadir ingrediente */}
        <Box>
          <h3 className='h3Ingredients'>Añade tu propia receta</h3>
          <Button
            variant="contained"
            className="botonCreateIngredients"
            onClick={() => navigate(`/recipes/create`)}
          >
            +
          </Button>
        </Box>
      </div>


      {/* Cards con las recetas */}
      <div className="cardsContainer">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default Recipes;