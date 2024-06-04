import * as React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LogoIcon from '../assets/NAVBAR-07.svg';
import IconUser from '../assets/LOGIN-13.svg';
import IconUserLog from '../assets/LOGIN-14.svg';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import './Navbar.css'

interface Page {
  name: string;
  route: string;
}

const pages: Page[] = [
  { name: 'Ingredientes', route: '/ingredients' },
  { name: 'Recetas', route: '/recipes' },
  { name: 'Planificador', route: '/planner' },
];

const settingsUnauthenticated: Page[] = [{ name: 'Iniciar Sesión', route: '/login' }];
const settingsAuthenticated: Page[] = [
  { name: 'Cuenta', route: '/account' },
  { name: 'Mis Menus', route: '/menus' },
  { name: 'Cerrar Sesión', route: '/logout' },
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del localStorage
    setAnchorElUser(null); // Cierra el menú
    navigate('/');
  };

  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (
    <AppBar position="static" className="navbar">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={LogoIcon} alt="Logo" className='logo'/>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
            }}
          >
            <Link to="/" className="navbar-link">PLAMESA</Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none'},
              }}
            >
              {pages.map(({name, route}) => (
                <MenuItem key={name} onClick={handleCloseNavMenu}>
                  <Link to={route} className="navbar-routes-menu">{name}</Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          <img src={LogoIcon} alt="Logo" className='logoCenter' />
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#545454',
            }}
          >
            <Link to="/" className="navbar-link">PLAMESA</Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', mr: 1}}>
            {pages.map(({name, route}) => (
              
              <Link key={name} to={route} className="navbar-routes">{name}</Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0}}>
            <Tooltip title="Opciones perfil">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {isAuthenticated ? 
                  <img src={IconUserLog} alt="Logo" className="navbar-userIcon"/> : 
                  <img src={IconUser} alt="Logo" className="navbar-userIcon"/>
                }
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px'}}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {isAuthenticated
              ? settingsAuthenticated.map(({ name, route }) => (
                  <MenuItem
                    key={name}
                    onClick={name === 'Cerrar Sesión' ? handleLogout : handleCloseUserMenu} // Usar handleLogout para "Logout"
                  >
                    {name === 'Cerrar Sesión' ? <span className="navbar-routes-menu">{name}</span> : <Link to={route} className="navbar-routes-menu">{name}</Link>} {/* Sin Link para Logout */}
                  </MenuItem>
                ))
              : settingsUnauthenticated.map(({ name, route }) => (
                  <MenuItem key={name} onClick={handleCloseUserMenu}>
                    <Link to={route} className="navbar-routes-menu">{name}</Link>
                  </MenuItem>
                ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
