import axios from 'axios'

const ENDPOINT_PATH = 'http://localhost:3000/ingredient'


const ingredientService = {
  getIngredients() {
    return axios.get(ENDPOINT_PATH)
  },

  getIngredientById(_id: string) {
    return axios.get(ENDPOINT_PATH + '/' + _id)
  },
}

export default ingredientService