import React, { useState, useEffect } from 'react';
import ingredientService from '../services/IngredientService';
import IngredientCard from '../components/IngredientCard';
import { GETIngredientInterface, IngredientInterface } from '../utils/interfaces';
import { FormControl, InputLabel, Select, MenuItem, Slider, Button, TextField, Box, IconButton, Menu, FormControlLabel, Switch, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SelectChangeEvent } from '@mui/material/Select';
import { Allergen, FoodGroup } from '../utils/enums';
import { useNavigate } from 'react-router-dom';
import './Ingredients.css'; 
import userService from '../services/UserService';

function Ingredients() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState<GETIngredientInterface[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<GETIngredientInterface[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(30);
  const [appliedFilters, setAppliedFilters] = useState<{filter: string, value: string}[]>([]);
  const [filters, setFilters] = useState({
    foodGroup: '',
    allergen: '',
    maxPrice: maxPrice, 
    userIngredients: false
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
          fetchedIngredients.sort((a, b) => a.name.localeCompare(b.name));
          
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

  // Mostrar filtros aplicados
  useEffect(() => {
    const applied: {filter: string, value: string}[] = [];
  
    if (filters.foodGroup) {
      applied.push({filter: `Grupo de Alimentos:`, value: `${filters.foodGroup}`});
    }
  
    if (filters.allergen) {
      applied.push({filter: `Sin Alérgenos:`, value: `${filters.allergen}`});
    }
  
    if (filters.maxPrice < maxPrice) {
      applied.push({filter: `Precio Máximo:`, value: `${filters.maxPrice}€`});
    }
  
    if (filters.userIngredients) {
      applied.push({filter: `Mostrando:`, value: `Mis Ingredientes`});
    }
  
    setAppliedFilters(applied);
  }, [filters, maxPrice]);


  const applyFilters = async () => {
    let filteredData = ingredients;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      // Normaliza y eliminar la tildes del searchTerm
      const normalizedSearchTerm = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      filteredData = filteredData.filter(ingredient => {
        // Normaliza y eliminar la tildes del ingrediente
        const normalizedIngredientName = ingredient.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        // Buscar
        return normalizedIngredientName.includes(normalizedSearchTerm);
      });
    }

    // Filtrar por grupo de alimentos
    if (filters.foodGroup) {
      filteredData = filteredData.filter(ingredient => ingredient.foodGroup === filters.foodGroup);
    }

    // Filtrar por alérgenos
    if (filters.allergen) {
      filteredData = filteredData.filter(ingredient => !ingredient.allergens.includes(filters.allergen));
    }

    // Filtrar por precio máximo
    filteredData = filteredData.filter(ingredient => ingredient.estimatedCost <= filters.maxPrice);

    if (token && filters.userIngredients) {
      const userResponse = await userService.getUserInfo(token);
      const userID = userResponse.data._id;
      filteredData = filteredData.filter(ingredient => ingredient.ownerUser._id === userID);
    }

    setFilteredIngredients(filteredData);
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
            placeholder="Buscar ingrediente"
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
              <MenuItem key="foodGroup">
                <FormControl fullWidth variant="filled">
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
                    sx={{ml: 0, color: '#545454', mb: 2, pb:0}}
                  />
                </FormControl>
              </MenuItem>,
              token && (
                  <MenuItem key="userIngredients">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filters.userIngredients}
                          onChange={handleSwitchChange}
                          name="userIngredients"
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
                      label="Mostrar Mis Ingredientes"
                    />
                  </MenuItem>
                ),
            
              <MenuItem key="clearFilters">
                <Button variant="contained" className='cleanFiltersButton' onClick={() => setFilters({ foodGroup: '', allergen: '', maxPrice: maxPrice, userIngredients: false })}>
                  Limpiar Filtros
                </Button>
              </MenuItem>
            ]}
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

      {/* Mostrar filtros aplicados */}
      {appliedFilters.length > 0 && (
        <Box display="flex" flexDirection="row" alignItems="left" flexWrap='wrap' mb={1} sx={{width:'85%', mt: '0'}}>
          <Typography variant="body2" color="textPrimary" noWrap component="div" mx={0.5} sx={{color: '#545454'}}>
              <b>Filtros aplicados:</b>
            </Typography>
          {appliedFilters.map((filter, index) => (
            <Typography key={index} variant="body2" color="textPrimary" noWrap component="div" mx={0.5} sx={{color: '#545454'}}>
              <b>{filter.filter}</b> {filter.value}
            </Typography>
          ))}
        </Box>
      )}


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