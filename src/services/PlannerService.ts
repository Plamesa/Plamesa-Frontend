import axios from 'axios'

const ENDPOINT_PATH = import.meta.env.VITE_ENDPOINT_PATH;

const plannerService = {
  calcNutrientsUser(data: {}) {
    return axios.post(ENDPOINT_PATH + '/calcNutrientsUser', data)
  },

  generatePlan(data: {}) {
    return axios.post(ENDPOINT_PATH + '/planner', data)
  },
}

export default plannerService