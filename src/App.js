import React, {useState, useEffect} from "react";

import { Container, Box } from '@mui/material';
import { BrowserRouter, Routes , Route, Navigate } from 'react-router-dom';
import {createTheme, ThemeProvider } from '@mui/material/styles';

import Home from "./pages/Home/Home"
import Seven_Days from "./pages/Simulation/7_Dias"
import Navbar from "./components/NavBar/NavBar";

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#FFA000',
      darker: '#FFA000',
      contrastText: '#000000',
    },
    secondary: {
      main: '#000000',
      darker: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary_white: {
      main: '#FFFFFF',
      darker: '#FFFFFF',
      contrastText: '#000000',
    },
    neutral: {
      main: '#FFF6E7',
      contrastText: '#FFA000',
    },
  },
});

const App = () => {
  return (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Container maxWidth="xl">
        <Navbar />
        <Box
            maxWidth = 'stretch'
            maxHeight = 'stretch'
            sx={{
              backgroundColor: 'secondary_white.main',
            }}
        >
        <Routes >
          {/* Redireccionamiento - se ven solo si estamos en este PATH */}
          <Route path="/" exact element={() => <Navigate to = '/home' />} />
          {/* Redireccionamiento a Home - general */}
          <Route path="/home" exact element = {< Home />} />
          {/* Redireccionamiento a mant -- mantenimientos*/}
          <Route path="/mant" exact element = {< Home />} />
          {/* Redireccionamiento a simulations 7 dias*/}
          <Route path="/sim/7_dias" exact element = {< Seven_Days />} />
          {/* Redireccionamiento a simulations colapso*/}
          <Route path="/sim/colapso" exact element = {< Home />} />
          {/*Redireccionamiento a reportes */}
          <Route path="/sim/7_dias" exact element = {< Home />} />
          <Route path="/rep" exact element = {< Home />} />
      </Routes >
      </Box>
      </Container>
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;