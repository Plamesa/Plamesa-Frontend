import axios from 'axios'
import { ActivityLevel, Allergen, Gender } from '../utils/enums'

const ENDPOINT_PATH = 'http://localhost:3000/user'


const userService = {
  getUserInfo(token: string) {
    return axios.get(ENDPOINT_PATH, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },

  changeUserInfo(token: string, newUserInfo: {}) {
    console.log(newUserInfo)
    return axios.patch(
      ENDPOINT_PATH, // URL de la solicitud
      newUserInfo,   // El cuerpo de la solicitud
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar la cabecera de autorización
          'Content-Type': 'application/json', // Si estás enviando datos en formato JSON
        },
      }
    );
  },

  deleteUser(token: string) {
    return axios.delete(ENDPOINT_PATH, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },
}

export default userService