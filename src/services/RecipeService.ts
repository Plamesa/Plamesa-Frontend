import axios from 'axios'

const ENDPOINT_PATH = 'http://localhost:3000/recipe'


const recipeService = {
  getRecipes() {
    return axios.get(ENDPOINT_PATH)
  },

  getRecipeById(_id: string) {
    return axios.get(ENDPOINT_PATH + '/' + _id)
  },

  /*createIngredient(token: string, ingredient: {}) {
    return axios.post(
      ENDPOINT_PATH, // URL de la solicitud
      ingredient,   // El cuerpo de la solicitud
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar la cabecera de autorización
          'Content-Type': 'application/json', // Si estás enviando datos en formato JSON
        },
      }
    );
  },

  modifyIngredient(_id: string, token: string, ingredient: {}) {
    return axios.patch(
      ENDPOINT_PATH + '/' + _id,
      ingredient,
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar la cabecera de autorización
          'Content-Type': 'application/json', // Si estás enviando datos en formato JSON
        },
      }
    );
  },*/

  deleteRecipe(_id: string, token: string) {
    return axios.delete(ENDPOINT_PATH + '/' + _id, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },
}

export default recipeService