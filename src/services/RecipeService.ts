import axios from 'axios'

const ENDPOINT_PATH = import.meta.env.VITE_ENDPOINT_PATH;

const recipeService = {
  getRecipes() {
    return axios.get(ENDPOINT_PATH + '/recipe')
  },

  getRecipeById(_id: string) {
    return axios.get(ENDPOINT_PATH + '/recipe/' + _id)
  },

  createRecipe(token: string, recipe: {}) {
    return axios.post(
      ENDPOINT_PATH + '/recipe', // URL de la solicitud
      recipe,   // El cuerpo de la solicitud
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar la cabecera de autorización
          'Content-Type': 'application/json', // Si estás enviando datos en formato JSON
        },
      }
    );
  },

  modifyRecipe(_id: string, token: string, recipe: {}) {
    return axios.patch(
      ENDPOINT_PATH + '/recipe/' + _id,
      recipe,
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar la cabecera de autorización
          'Content-Type': 'application/json', // Si estás enviando datos en formato JSON
        },
      }
    );
  },

  deleteRecipe(_id: string, token: string) {
    return axios.delete(ENDPOINT_PATH + '/recipe/' + _id, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },

  searchRecipesPerIngredients(ingredients: string[]) {
    return axios.post(ENDPOINT_PATH + '/recipeSearchPerIngredients', {
      ingredients: ingredients
    });
  }
}

export default recipeService