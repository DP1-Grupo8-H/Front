import React, {useState, useEffect} from "react";
import { Typography, Button, Grid, TextField, CircularProgress, Box } from '@mui/material';

import DataExtractor from '../DataExtractor';
import CustomizedInputs from "../../../components/utils/CustomizedInputs";
import CiudadService from '../../../services/ciudadService.js'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';

import { format } from 'date-fns';

import {useNavigate} from 'react-router-dom';


export default function ModalResume({setOpenResume, historico, fechaActual, fechaFin}){
  const navigate = useNavigate(); //Para poder hacer uso de redux
  
  const openNav = (nav) => {
    console.log(historico);
    navigate('/sim/colapso/resumen', { state: {historico: historico} });
  }

  const handleClick = (event) => {
    openNav(event.currentTarget);
  };
    
  const [data, setData] = useState({ped_entr: '', paq_entr: '', km_rec: ''});

  const retrievePaq = (historico) => {
    let cant_paq = 0;
    for(let h of historico){
      for(let plan of h.plan_transporte){
        cant_paq+=plan.cantidad;
      }
    }
    if(Math.trunc(cant_paq/1000) > 0){
      if(Math.trunc(cant_paq/1000000) > 0){
        cant_paq = (Math.trunc(cant_paq/1000000)).toString().concat('M');
      }
      else{
        cant_paq = (Math.trunc(cant_paq/1000)).toString().concat('K');
      }
    }
    else{
      cant_paq = cant_paq.toString().concat('');
    }
    return cant_paq;
  }

  useEffect(() => {
    const ped_entr = historico.filter(ped => {
      return (ped.plan_transporte.length > 0);
    }).length;
    const paq_entr = retrievePaq(historico);
    const km_rec = [];
    
    const sim = { ped_entr: ped_entr, paq_entr: paq_entr, km_rec: km_rec };
    
    setData(setData => ({...setData, ...sim}));
  
  }, [historico])
  console.log(data);

  console.log(historico);

  return(
    <>
    { (historico.length > 0 && data.ped_entr > 0) ?
    <>
    < Typography variant="b1" mb={2} fontFamily = "Roboto">
      La simulación termino su ejecución. El resumen de la ejecución es el siguiente:
    </Typography>
    <Box sx={{  bgcolor: 'secondary_white.main',
                m: 1,
                margin: '1rem 0rem -1rem 0rem',
                padding: '1rem',
                border: 1.5,
                width: 'auto',
                height: 'auto',borderColor: 'primary.main', borderRadius: '16px 16px 0px 0px' }}>
      <Grid container padding= "5px 0px 0px 0px" alignItems = "center">
        <Grid item xs = {1.5} sm = {1.5} align = "right">
          < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
              Fecha inicio:
          </Typography>
        </Grid>
        <Grid item xs = {1.5} sm = {1.5} align = "left" >
          <CustomizedInputs value = {format(fechaActual, 'yyyy-MM-dd')} readOnly = "true"/>
        </Grid>
        <Grid item xs = {5} sm = {5} align = "right"></Grid>
        <Grid item xs = {1.5} sm = {1.5} align = "right">
          < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
              Fecha fin:
          </Typography>
        </Grid>
        <Grid item xs = {1.5} sm = {1.5} align = "left" >
          <CustomizedInputs value = {format(fechaFin, 'yyyy-MM-dd')} readOnly = "true"/>
        </Grid>
        <Grid item xs = {1.5} sm = {1.5} align = "right">
          < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
              Hora inicio:
          </Typography>
        </Grid>
        <Grid item xs = {1} sm = {1} align = "left" >
          <CustomizedInputs value = {format(fechaActual, 'hh:mm:ss')} readOnly = "true"/>
        </Grid>
        <Grid item xs = {5.5} sm = {5.5} align = "right"></Grid>
        <Grid item xs = {1.5} sm = {1.5} align = "right">
          < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
              Hora fin:
          </Typography>
        </Grid>
        <Grid item xs = {1} sm = {1} align = "left" >
          <CustomizedInputs value = {format(fechaActual, 'hh:mm:ss')} readOnly = "true"/>
        </Grid>
      </Grid>
      <Grid container padding= "0px 0px 0px 0px" alignItems = "center">
        <Grid item xs = {5} sm = {5} align = "center" marginTop = {3}>
          {/* FOR THE RESUME */}
          <Grid container alignItems = "center">
            <Grid item xs = {10} sm = {10} align = "left">
              < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
                  Cantidad de Pedidos Entregados:
              </Typography>
            </Grid>
            <Grid item xs = {2} sm = {2} align = "left" >
              <CustomizedInputs value = {data.ped_entr} readOnly = "true"/>
            </Grid>
            <Grid item xs = {10} sm = {10} align = "left">
              < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
                  Cantidad de Paquetes Entregados:
              </Typography>
            </Grid>
            <Grid item xs = {2} sm = {2} align = "left" >
              <CustomizedInputs value = {data.paq_entr} readOnly = "true"/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs = {2} sm = {2} align = "center" marginTop = {3}></Grid>
        <Grid item xs = {5} sm = {5} align = "center" marginTop = {3}>
          {/* FOR THE STATE */}
          <Box sx={{  bgcolor: 'secondary_white.main',
                      m: 1,
                      border: 1,
                      width: '20rem',
                      height: '10rem',borderColor: 'primary.main', borderRadius: '16px' }}>
          <Grid item xs = {12} sm = {12} align = "center" marginTop = {0}>
            <ErrorOutlineIcon sx={{ fontSize: 120, color:'#e53e3e' }} />
          </Grid>
          <Grid item xs = {12} sm = {12} align = "center" marginTop = {0}>
          < Typography variant="body1_bold" mb={2} fontFamily = "Roboto" color ='#e53e3e' >
                  El sistema colapso
          </Typography>
          </Grid>
          </Box>
        </Grid>
        <Grid item xs = {12} sm = {12} align = "right" marginTop = {0}>
        <Grid item xs = {3} sm = {3} align = "right" marginTop = {0}>
            <Button variant = "text" color = "primary" size = "large" type = "submit"  onClick = {handleClick}> 
              <Typography variant = "button_max" > Ver Detalle </Typography>
              <ArrowCircleRightOutlinedIcon sx={{ fontSize: 40, color:'primary.main' }}/>
            </Button>
        </Grid>
        </Grid>
      </Grid>
    </Box>
    </>
    :
    <>
    <Grid item xs = {12} sm = {12} align = "center" >
        <CircularProgress />
    </Grid>
    </>
  }
  </>
  );
}