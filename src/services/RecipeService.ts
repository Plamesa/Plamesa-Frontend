import axios from 'axios'

const ENDPOINT_PATH = 'http://localhost:3000/recipe'


const recipeService = {
  getRecipes() {
    return axios.get(ENDPOINT_PATH)
  },

  getRecipeById(_id: string) {
    return axios.get(ENDPOINT_PATH + '/' + _id)
  },

  createRecipe(token: string, recipe: {}) {
    return axios.post(
      ENDPOINT_PATH, // URL de la solicitud
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
      ENDPOINT_PATH + '/' + _id,
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
    return axios.delete(ENDPOINT_PATH + '/' + _id, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },
}

export default recipeService