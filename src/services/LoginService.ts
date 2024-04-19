import axios from 'axios'

const ENDPOINT_PATH = 'http://localhost:3000/login'


const auth = {
  login(username: string, password: string) {
    return axios.post(ENDPOINT_PATH, { username: username, password: password })
  },
}

export default auth