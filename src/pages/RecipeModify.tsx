import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import { Delete } from '@mui/icons-material';
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Autocomplete,
  InputAdornment,
  Box,
} from '@mui/material';
import { IngredientInterface, RecipeInterface } from '../utils/interfaces.ts';
import ingredientService from '../services/IngredientService.ts';
import { FoodType, IngredientRecipe } from '../utils/enums.ts';
import recipeService from '../services/RecipeService.ts';
import './RecipeCreate.css'
import userService from '../services/UserService.ts';
import { capitalizeFirstLetter } from '../utils/utils';

function RecipeModify() {
  const { _id } = useParams<{ _id: string }>(); // Obtener id de parametros de la URL
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState<{ _id: string; name: string; unit: string; amount: string }[]>([])
  const [selectedIngredient, setSelectedIngredient] = useState<{ _id: string; name: string; unit: string; amount: string }[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [recipe, setRecipe] = useState<RecipeInterface>({
    _id: '',
    name: '',
    numberService: 0,
    preparationTime: 0,
    foodType: FoodType.Entrante,
    instructions: [],
    comments: '',
    cookware: [],
    ingredients: [],
    estimatedCost: 0,
    allergens: [],
    nutrients: [],
    ownerUser: ''
  })


  useEffect(() => {
    if (!token) {
      alert('Debe iniciar sesión para acceder a esta página.');
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener la receta
        if (_id) {
          const recipeResponse = await recipeService.getRecipeById(_id);
          const recipeData = recipeResponse.data;
          const cookwareString = recipeData.cookware.join('\n');
          const instructionsString = recipeData.instructions.join('\n');

          setRecipe({
            ...recipeData,
            cookware: [cookwareString],
            instructions: [instructionsString]
          });

          const newIngredients = recipeResponse.data.ingredients.map((ingredient: {amount: string; ingredientID: {_id: string; name: string; unit: string}}) => ({
            _id: ingredient.ingredientID._id,
            name: ingredient.ingredientID.name,
            unit: ingredient.ingredientID.unit,
            amount: ingredient.amount
          }));
          setSelectedIngredient(newIngredients);

          // Obtener la información del usuario si hay un token
          if (token) {
            const userResponse = await userService.getUserInfo(token);

            if (userResponse.data._id != recipeResponse.data.ownerUser._id && userResponse.data.role != 'Administrador') {
              alert('NO tiene permiso para modificar este ingrediente');
              navigate(`/ingredients/${recipeResponse.data._id}`);
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [token, _id]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await ingredientService.getIngredients();
        const ingredientsJson: IngredientInterface[] = response.data;
        const initialIngredients = ingredientsJson.map((ingredient) => ({
          _id: ingredient._id,
          name: ingredient.name,
          unit: ingredient.unit,
          amount: '',
        }));
        setIngredients(initialIngredients);
      } catch (error) {
        console.error('Error al obtener la información de los ingredientes: ', error);
      }
    };

    fetchIngredients();
  }, []);

  const handleDeleteIngredient = (index: number) => {
    const updatedList = selectedIngredient.filter((_, i) => i !== index);
    setSelectedIngredient(updatedList);
  };

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (!recipe.name) {
      newErrors.name = 'El nombre es requerido.';
      valid = false;
    }
    if (!recipe.foodType) {
      newErrors.foodType = 'El tipo de comida es requerido.';
      valid = false;
    }
    if (!recipe.numberService) {
      newErrors.numberService = 'El número de servicios es requerido.';
      valid = false;
    }
    if (!recipe.preparationTime) {
      newErrors.preparationTime = 'El tiempo de preparación es requerido.';
      valid = false;
    }
    if (recipe.instructions.length === 0) {
      newErrors.instructions = 'Las instrucciones son requeridas.';
      valid = false;
    }    
    else if (recipe.instructions[0] === '') {
      newErrors.instructions = 'Las instrucciones son requeridas.';
      valid = false;
    }
    if (selectedIngredient.length === 0) {
      newErrors.selectedIngredient = 'Debe seleccionar al menos un ingrediente.';
      valid = false;
    }


    selectedIngredient.forEach((ingredient, index) => {
      if (ingredient.amount === '') {
        newErrors[`ingredient-${index}`] = 'Cantidad requerida';
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  function createIngredientFunction() {
   if (!validateForm()) {
      // Si hay errores, no enviar el formulario
      return;
    }

    let ingredientsArray: IngredientRecipe[] = [];
    selectedIngredient.map((ingredient) => {
      ingredientsArray.push({ingredientID: ingredient._id, amount: parseFloat(ingredient.amount)})
    })
    const instructionsArray: string[] = recipe.instructions[0].split('\n').filter(instruction => instruction.trim() !== '');
    const cookWareArray: string[] = recipe.cookware.length != 0 ? recipe.cookware[0].split('\n').filter(cookware => cookware.trim() !== ''): [];
    // Variables basicas
    const recipeToSend = {
      name: recipe.name,
      numberService: recipe.numberService,
      preparationTime: recipe.preparationTime,
      foodType: recipe.foodType,
      ingredients: ingredientsArray,
      instructions: instructionsArray,
      cookware: cookWareArray,
      comments: recipe.comments
    };

    // Realizar peticion post
    try {
      if (token) {
        recipeService
          .modifyRecipe(recipe._id, token, recipeToSend)
          .then((response) => {
            if(response.status == 201) {
              alert('Receta modificada');
              navigate('/recipes/' + response.data._id)
            }
          })
          .catch((error) => {
            console.log(error)
            alert('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
          })
      }
    } catch (error) {
      console.log(error);
    }
  };


  if (!token) {
    return null;
  }



  
  return (
    <div>
      <div className="topContainerIntroCreateRecipe">
        <div className="containerIntroCreateRecipe">
          <h3>Recuerda pulsar el boton de modificar receta</h3>
          <Button
            variant="contained"
            className="botonRegisterCreateRecipe"
            onClick={createIngredientFunction}
          >
            Modificar receta
          </Button>
        </div>
      </div>


      {/** Contenido basico de la receta */}
      <div className='containerFormCreateRecipe'>
        <div className='formContentCreateRecipe'>
          <TextField
            required
            margin='normal'
            fullWidth
            variant="filled"
            id="nombre"
            label="Nombre de la Receta"
            name="name"
            value={recipe.name}
            onChange={(e) =>
              setRecipe({ ...recipe, name: e.target.value })
            }
            className='textFieldCreateRecipe'
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            fullWidth
            required
            variant="filled"
            id="outlined-select-currency"
            select
            label="Tipo de comida"
            value={recipe.foodType}
            onChange={(e) =>
              setRecipe({ ...recipe, foodType: (e.target.value as FoodType) })
            }
            className='textFieldCreateRecipe'
            error={!!errors.foodType}
            helperText={errors.foodType}
          >
            {Object.values(FoodType).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            required
            margin='normal'
            fullWidth
            variant="filled"
            id="cantidad"
            label="Número de Servicios"
            name="cantidad"
            value={recipe.numberService}
            onChange={(e) =>
              setRecipe({ ...recipe, numberService: Number(e.target.value) })
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">pers</InputAdornment>,
            }}
            className='textFieldCreateRecipe'
            error={!!errors.numberService}
            helperText={errors.numberService}
          />

          <TextField
            required
            margin='normal'
            fullWidth
            variant="filled"
            id="cantidad"
            label="Tiempo de Preparación"
            name="cantidad"
            value={recipe.preparationTime}
            onChange={(e) =>
              setRecipe({ ...recipe, preparationTime: Number(e.target.value) })
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">min</InputAdornment>,
            }}
            className='textFieldCreateRecipe'
            error={!!errors.preparationTime}
            helperText={errors.preparationTime}
          />
        </div>


        <div className='formContentRecipeSelectIngredients'>
          <Autocomplete
            multiple
            options={ingredients}
            getOptionLabel={(option) => capitalizeFirstLetter(option.name)}
            value={selectedIngredient}
            onChange={(_, newValue) => setSelectedIngredient(newValue)}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField 
                {...params} 
                variant="filled" 
                label="Selecciona un ingrediente" 
                fullWidth 
                error={!!errors.selectedIngredient } // Pasar el error específico del Autocomplete
                helperText={errors.selectedIngredient } // Pasar el mensaje de ayuda específico del Autocomplete
              />
            )}
            className='textFieldCreateRecipe'
          />

          {/* Lista de ingredientes seleccionados */}
          <div>
            <Typography variant="h6" gutterBottom>
              Ingredientes Seleccionados:
            </Typography>

            {selectedIngredient.map((ingredient, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                marginBottom="8px"
              >
                <Typography className='typographySelectIngredientsRecipe'>
                  {capitalizeFirstLetter(ingredient.name)}
                </Typography>

                <Box display="flex" alignItems="center" marginLeft="8px" marginRight="8px">
                  <TextField
                    //type="number"
                    size="small"
                    id="cantidad"
                    name="cantidad"
                    value={ingredient.amount}
                    onChange={(e) => {
                      const updatedIngredient = { ...ingredient, amount: e.target.value };
                      const updatedList = [...selectedIngredient];
                      updatedList[index] = updatedIngredient;
                      setSelectedIngredient(updatedList);
                    }}
                    className='textFieldIngredientsCreateRecipe'
                    error={!!errors[`ingredient-${index}`]}
                    helperText={errors[`ingredient-${index}`]}
                  />

                  <Typography sx={{ml:1, width: 15}}>{ingredient.unit}</Typography>
                </Box>

                <IconButton onClick={() => handleDeleteIngredient(index)}>
                  <Delete sx={{ color: '#FDF8EB' }} />
                </IconButton>
              </Box>
            ))}
          </div>
        </div>
      </div>

    
      <div className="topContainerLargeCreateRecipe">
        <div className="containerLargeFormCreateRecipe">
          <div className="formLargeContentCreateRecipe">
            <Typography variant="h6" gutterBottom>
              Instrucciones
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              variant="filled"
              label="Ingrese las instrucciones (una por línea)"
              value={recipe.instructions}
              onChange={(e) => 
                setRecipe({ ...recipe, instructions: [e.target.value] })
              }
              className='textFieldCreateRecipe'
              error={!!errors.instructions}
              helperText={errors.instructions}
            />
          </div>
        </div>
      </div>



      <div className='containerFormCreateRecipe'>
        <div className='formContentCreateRecipe'>
          <Typography variant="h6" gutterBottom>
            Utensilios
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant="filled"
            label="Ingrese los utensilios (uno por línea)"
            value={recipe.cookware}
            onChange={(e) => 
              setRecipe({ ...recipe, cookware: [e.target.value] })
            }
            className='textFieldCreateRecipe'
          />
        </div>


        <div className='formContentCreateRecipe'>
          <Typography variant="h6" gutterBottom>
            Comentarios
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant="filled"
            label="Ingrese los comentarios que desee"
            value={recipe.comments}
            onChange={(e) => 
              setRecipe({ ...recipe, comments: e.target.value })
            }
            className='textFieldCreateRecipe'
          />
        </div>
      </div>
      


      <div className='buttonContainerCreateRecipe'>
        <Button
          variant="contained"
          className="botonRegisterCreateRecipe"
          onClick={createIngredientFunction}
        >
          Modificar receta
        </Button>
      </div>
    </div>
  )
}

export default RecipeModify