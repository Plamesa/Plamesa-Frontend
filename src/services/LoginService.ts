import axios from 'axios'

const ENDPOINT_PATH = import.meta.env.VITE_ENDPOINT_PATH || 'http://localhost:3000';


const auth = {
  login(username: string, password: string) {
    return axios.post(ENDPOINT_PATH + '/login', { username: username, password: password })
  },

  register(username: string, name: string, password: string, email: string) {
    return axios.post(ENDPOINT_PATH + '/user', { username: username, name: name, password: password, email: email, role: 'Usuario regular' })
  },
}

export default auth