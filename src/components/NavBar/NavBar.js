import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Typography, Toolbar, Avatar, Container, Box, IconButton, Button, Menu, MenuItem } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';

import Logo from '../../archives/Logo.svg';


import useStyles from './styles';
import {useNavigate} from 'react-router-dom';

const pages = ['Mapa', 'Mantenimiento', 'Simulaciones', 'Reportes'];
const p_simulation = ['A 7 días', 'Colapso'];


const Navbar = () => {
  const classes = useStyles();
  const navigate = useNavigate(); //Para poder hacer uso de redux

  const openNav = (nav) => {
    //Navegamos a una URl
    switch(nav.textContent){
      case 'Mapa':
        navigate('/home');
        break;
      case 'A 7 días':
        navigate('/sim/7_dias');
        break;
      case 'Colapso':
        navigate('/sim/colapso');
        break;
      case 'Mantenimiento':
        navigate('/mant');
        break;
      case 'Reportes':
        navigate('/rep');
        break;
      default:
    }
  }

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  console.log("Data: anchoElUser - ", " anchorElUser", anchorElUser)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (event) => {
    openNav(event.currentTarget);
    setAnchorElUser(null);
  };


  return (
      <AppBar className = {classes.appBar} position ="static" color="secondary">
        { /* La barra de aplicaciones */}
        <Container maxWidth="xl">
          <Typography className = {classes.heading} variant = "h4" align ="left">
              <Toolbar disableGutters>
                <img src={Logo} alt="OP-SEP Logo" color = "#FFFF"/>
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="/home"
                  className={classes.logo_text}
                >
                  OP-SEP
                </Typography>
                <Box sx={{ flexGrow: 10, display: { xs: 'none', md: 'flex' } }}>
                  {pages.map((page) => (
                    <div>
                      {(page === 'Simulaciones' ) ? 
                        <>
                          <Button
                          key={page}
                          onClick={handleOpenUserMenu}
                          style={{maxWidth: '240px', maxHeight: '60px', minWidth: '240px', minHeight: '60px'}}
                          sx={{ my: 0, color: 'white', display: 'block' }}
                          >
                            {page}
                          </Button>
                          <Menu
                            sx={{ mt: '72px' }}
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
                            style={{maxWidth: '240px', minWidth: '240px'}}
                            onClose={handleCloseUserMenu}
                          >
                            {p_simulation.map((setting) => (
                              <MenuItem key={setting} onClick={handleCloseUserMenu} style={{maxWidth: '240px', minWidth: '240px'}}>
                                <Typography textAlign="center">{setting}</Typography>
                              </MenuItem>
                            ))}
                          </Menu>
                        </>
                      : 
                        <Button
                        key={page}
                        onClick={handleCloseUserMenu}
                        style={{maxWidth: '240px', maxHeight: '60px', minWidth: '240px', minHeight: '60px'}}
                        sx={{ my: 0, color: 'white', display: 'block' }}
                        >
                          {page}
                        </Button>
                      }
                    </div>
                  ))}
                </Box>
              </Toolbar>
          </Typography>
        </Container>
      </AppBar>
  );
}; 

export default Navbar;