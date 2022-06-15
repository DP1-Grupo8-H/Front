import React, {useState} from "react";
import { Typography, Button, Grid } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './Legend.css';


export default function Legend(){
  const [isOpen, setIsOpen] = useState(false);
  return(
    <Grid container className='collapsible' style ={{zIndex: 99999}}  align = 'right'>
      <Grid item className = 'toggle' md = '12' xs = '12' 
          onMouseOver = {() => setIsOpen(true)} 
          onMouseOut = {() => setIsOpen(false)}
          style ={{zIndex: 99999}}
          align = 'right'>
        {isOpen ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}
      </Grid>
      <Grid item className = {isOpen ? 'show' : 'content'} 
          md = '12' xs = '12'
          align = 'right' >
        Some content
        </Grid>
    </Grid>
  );
}