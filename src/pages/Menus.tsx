import React, { useState, useEffect } from 'react';
import { GETMenuInterface} from '../utils/interfaces';
import { Button, TextField, Box,} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Recipes.css'; 
import userService from '../services/UserService';
import menuService from '../services/MenuService';
import MenuCard from '../components/MenuCard';

function Menus() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [menus, setMenus] = useState<GETMenuInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        if (token) {
          const responseUser = await userService.getUserInfo(token);

          const menusIds: string[] = responseUser.data.savedMenus;
          if (menusIds.length > 0) {
            const newMenus = await Promise.all(menusIds.map(async (menuId) => {
              const menuObj = await menuService.getMenuById(menuId, token);
              return menuObj.data 
            }));

            setMenus(newMenus);
          }
        }
      } catch (error) {
        console.error('Error al obtener la información de los menus: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [token]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMenus = menus.filter(menu =>
    menu.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="homeIngredient">
      <div className="contentIngredient">
        <Box display="flex">
          <TextField // Buscador
            type="text"
            placeholder="Buscar Menu"
            value={searchTerm}
            onChange={handleSearchChange}
            className="searchBar"
          />
        </Box>


        {/* Botón añadir menu */}
        <Box>
          <h3 className='h3Ingredients'>Genera un nuevo MENU</h3>
          <Button
            variant="contained"
            className="botonCreateIngredients"
            onClick={() => navigate(`/planner`)}
          >
            +
          </Button>
        </Box>
      </div>


      {/* Cards con los menus */}
      <div className="cardsContainer">
        {filteredMenus.map((menu) => (
          <MenuCard key={menu._id} menu={menu} />
        ))}
      </div>
    </div>
  );
}

export default Menus;