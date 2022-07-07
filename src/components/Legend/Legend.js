import React, {useState} from "react";
import { Typography, Button, Grid } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './Legend.css';


export default function Legend(){
  // const [isOpen, setIsOpen] = useState(false);
  // return(
  //   <Grid container className='collapsible' style ={{zIndex: 99999}}  align = 'left' marginBottom='1rem'>
  //     <Grid item className = 'toggle' md = '12' xs = '12' 
  //         onMouseOver = {() => setIsOpen(true)} 
  //         onMouseOut = {() => setIsOpen(false)}
  //         style ={{zIndex: 99999}}
  //         align = 'right'>
  //       {isOpen ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}
  //     </Grid>
  //     <Grid item className = {isOpen ? 'show' : 'content'} 
  //         md = '12' xs = '12'
  //         align = 'right' >
  //       <img src={require('../../archives/Leyenda.PNG')} alt = 'Legend' width="100%" height = '120rem' />
  //       </Grid>
  //   </Grid>
  // );

  return(
    <Grid container className='noncollapsible' align = 'left' marginBottom='0rem'>
      <Grid item className = 'toggle' md = '12' xs = '12' align = 'left' >
          <Typography align = 'left' marginLeft = '1rem' marginTop = '0.2rem' variant="h5" color = 'secondary.contrastText'>
           Leyenda
          </Typography>
      </Grid>
      <Grid item className = 'content' 
          md = '12' xs = '12'
          align = 'left' >
          <img src={require('../../archives/Leyenda.PNG')} alt = 'Legend' width="100%" height = '120rem' />
      </Grid>
    </Grid>
  );
}