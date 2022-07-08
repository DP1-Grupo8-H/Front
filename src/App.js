import React, {useState, useEffect} from "react";

import { Container, Box } from '@mui/material';
import { BrowserRouter, Routes , Route, Navigate } from 'react-router-dom';
import {ThemeProvider } from '@mui/material/styles';

import newTheme from './themes.js'

import Home from "./pages/Home/Home"
import SevenDays from "./pages/Simulation/7_Dias"
import Navbar from "./components/NavBar/NavBar";
import ResumenDetalle from "./pages/Simulation/Modals/Resumen_Detalle.js";
import Colapse from "./pages/Colapse/Colapse.js";
import ResumenDetalleColapse from "./pages/Colapse/Modals/Resumen_Detalle.js";


const App = () => {

  

  const theme = newTheme();
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
          <Route path="/" exact element={<Navigate to = '/home' />} />
          {/* Redireccionamiento a Home - general */}
          <Route path="/home" exact element = {< Home />} />
          {/* Redireccionamiento a mant -- mantenimientos*/}
          <Route path="/mant" exact element = {< Home />} />
          {/* Redireccionamiento a simulations 7 dias*/}
          <Route path="/sim/7_dias" exact element = {< SevenDays />} />
          {/* Redireccionamiento - hacia un detalle */}
          <Route path="sim/7_dias/resumen" exact element = {< ResumenDetalle />} />
          {/* Redireccionamiento a simulations colapso*/}
          <Route path="/sim/colapso" exact element = {< Colapse />} />
          {/* Redireccionamiento - hacia un detalle */}
          <Route path="sim/colapso/resumen" exact element = {< ResumenDetalleColapse />} />
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