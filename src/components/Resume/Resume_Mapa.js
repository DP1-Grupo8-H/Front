import React, {useState} from "react";
import { Typography, Button, Grid } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './Resume.css';

import Leyenda from '../../archives/Leyenda.PNG'
import CustomizedInputs from "../utils/CustomizedInputs";


export default function ResumeMapa({data}){

  return(
    <Grid container className='noncollapsibleResume' align = 'left' marginBottom='1rem'>
      <Grid item className = 'toggle' md = '12' xs = '12' align = 'left' >
          <Typography align = 'left' marginLeft = '1rem' marginTop = '0.2rem' variant="h5" color = 'secondary.contrastText'>
           Resumen
          </Typography>
      </Grid>
      <Grid item className = 'content' 
          md = '12' xs = '12'
          align = 'left' >
          <Grid container padding= "0.5rem" alignItems = "center">
            <Grid item xs = {9} sm = {9} align = "left">
              < Typography variant="body2_bold" mb={2} fontFamily = "Roboto">
                  Cantidad de Rutas Generadas:
              </Typography>
            </Grid>
            <Grid item xs = {2} sm = {2} align = "right" >
              <CustomizedInputs value = {data ? data.cant : '-'} readOnly = "true"/>
            </Grid>
            <Grid item xs = {9} sm = {9} align = "left">
              < Typography variant="body2_bold" mb={2} fontFamily = "Roboto">
                  Cantidad de Tramos Bloqueados:
              </Typography>
            </Grid>
            <Grid item xs = {2} sm = {2} align = "right" >
              <CustomizedInputs value = {data ? data.blq : '-'} readOnly = "true"/>
            </Grid>
            <Grid item xs = {9} sm = {9} align = "left">
              < Typography variant="body2_bold" mb={2} fontFamily = "Roboto">
                  Cantidad de Camiones en ruta:
              </Typography>
            </Grid>
            <Grid item xs = {2} sm = {2} align = "right" >
              <CustomizedInputs value = {data ? data.ruta : '-'} readOnly = "true"/>
            </Grid>
            <Grid item xs = {9} sm = {9} align = "left">
              < Typography variant="body2_bold" mb={2} fontFamily = "Roboto">
                  Camiones en mantenimiento:
              </Typography>
            </Grid>
            <Grid item xs = {2} sm = {2} align = "right" >
              <CustomizedInputs value = {data ? data.mant : '-'} readOnly = "true"/>
            </Grid>
          </Grid>
      </Grid>
    </Grid>
  );
}