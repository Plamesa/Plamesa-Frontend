import axios from 'axios'

const ENDPOINT_PATH = 'http://localhost:3000/ingredient'


const ingredientService = {
  getIngredients() {
    return axios.get(ENDPOINT_PATH)
  },

  getIngredientById(_id: string) {
    return axios.get(ENDPOINT_PATH + '/' + _id)
  },

  createIngredient(token: string, ingredient: {}) {
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

  deleteIngredient(_id: string, token: string) {
    return axios.delete(ENDPOINT_PATH + '/' + _id, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },
}

export default ingredientService