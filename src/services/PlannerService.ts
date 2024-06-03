import axios from 'axios'

const ENDPOINT_PATH = 'http://localhost:3000'


const plannerService = {
  calcNutrientsUser(data: {}) {
    return axios.post(ENDPOINT_PATH + '/calcNutrientsUser', data)
  },

  generatePlan(data: {}) {
    return axios.post(ENDPOINT_PATH + '/planner', data)
  },
}

export default plannerService