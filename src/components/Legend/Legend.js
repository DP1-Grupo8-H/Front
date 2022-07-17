import React, {useState} from "react";
import { Typography, Button, Grid } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './Legend.css';

import Leyenda from '../../archives/Leyenda.PNG'


export default function LegendMapa(){
  return(
    <Grid container className='noncollapsible' align = 'left' marginBottom='1rem'>
      <Grid item className = 'toggle' md = '12' xs = '12' align = 'left' >
          <Typography align = 'left' marginLeft = '1rem' marginTop = '0.2rem' variant="h5" color = 'secondary.contrastText'>
           Leyenda
          </Typography>
      </Grid>
      <Grid item className = 'content' 
          md = '12' xs = '12'
          align = 'left' >
          <img src={require('../../archives/Leyenda.PNG')} alt = 'Legend' width="100%" height = '150rem' />
      </Grid>
    </Grid>
  );
}