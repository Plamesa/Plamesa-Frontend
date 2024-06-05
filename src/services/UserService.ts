import axios from 'axios'

const ENDPOINT_PATH = process.env.ENDPOINT_PATH || 'http://localhost:3000'

const userService = {
  getUserInfo(token: string) {
    return axios.get(ENDPOINT_PATH + '/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },

  changeUserInfo(token: string, newUserInfo: {}) {
    return axios.patch(
      ENDPOINT_PATH + '/user', // URL de la solicitud
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
    return axios.delete(ENDPOINT_PATH + '/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },

  async addFavoriteRecipe(token: string, _id: string) {
    const userInfoResponse = await this.getUserInfo(token);
    const newFavoritesRecipesBody = {
      favoriteRecipes: userInfoResponse.data.favoriteRecipes || []
    };

    if (!userInfoResponse.data.favoriteRecipes.some((recipe: {_id: string, name: string}) => recipe._id === _id)) {
      newFavoritesRecipesBody.favoriteRecipes.push(_id);
    }

    return await axios.patch(
      ENDPOINT_PATH + '/user', // URL de la solicitud
      newFavoritesRecipesBody, // El cuerpo de la solicitud
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar la cabecera de autorización
          'Content-Type': 'application/json', // Si estás enviando datos en formato JSON
        },
      }
    );
  },

  async removeFavoriteRecipe(token: string, _id: string) {
    const userInfoResponse = await this.getUserInfo(token);
    const newFavoritesRecipesBody = {
      favoriteRecipes: userInfoResponse.data.favoriteRecipes || []
    };

    const index = newFavoritesRecipesBody.favoriteRecipes.findIndex((recipe: {_id: string, name: string}) => recipe._id === _id);
    if (index !== -1) {
      newFavoritesRecipesBody.favoriteRecipes.splice(index, 1);
    }

    return await axios.patch(
      ENDPOINT_PATH + '/user', // URL de la solicitud
      newFavoritesRecipesBody, // El cuerpo de la solicitud
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar la cabecera de autorización
          'Content-Type': 'application/json', // Si estás enviando datos en formato JSON
        },
      }
    );
  },
}

export default userService