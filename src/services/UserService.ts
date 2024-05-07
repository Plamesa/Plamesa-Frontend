import axios from 'axios'

const ENDPOINT_PATH = 'http://localhost:3000/user'


const userService = {
  getUserInfo(token: string) {
    return axios.get(ENDPOINT_PATH + '/6632266070a98151dc0295e7', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },
}

export default userService