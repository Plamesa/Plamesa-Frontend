import axios from 'axios'

const ENDPOINT_PATH = process.env.ENDPOINT_PATH + '/menu' || 'http://localhost:3000/menu'

const menuService = {
  getMenuById(_id: string, token: string,) {
    return axios.get(
      ENDPOINT_PATH + '/' + _id,
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar la cabecera de autorización
          'Content-Type': 'application/json', // Si estás enviando datos en formato JSON
        },
      })
  },

  saveMenu(token: string, menu: {}) {
    return axios.post(
      ENDPOINT_PATH, // URL de la solicitud
      menu,   // El cuerpo de la solicitud
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar la cabecera de autorización
          'Content-Type': 'application/json', // Si estás enviando datos en formato JSON
        },
      }
    );
  },

  modifyMenu(_id: string, token: string, menu: {}) {
    return axios.patch(
      ENDPOINT_PATH + '/' + _id,
      menu,
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar la cabecera de autorización
          'Content-Type': 'application/json', // Si estás enviando datos en formato JSON
        },
      }
    );
  },

  deleteMenu(_id: string, token: string) {
    return axios.delete(ENDPOINT_PATH + '/' + _id, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },
}

export default menuService