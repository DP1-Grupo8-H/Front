import React, {useState} from "react";
import { Typography, Button, Grid, TextField, CircularProgress, Box } from '@mui/material';

import DataExtractor from './DataExtractor';
import CustomizedInputs from "../../components/utils/CustomizedInputs";
import CiudadService from '../../services/ciudadService.js'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';

import { format } from 'date-fns';

export default function ModalResume({setOpenResume, historico, fechaActual}){
 
  
  console.log(historico);

  return(
    <>
    { (historico.length > 0) ?
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
        <Grid item xs = {1} sm = {1} align = "left" >
          <CustomizedInputs value = {format(fechaActual, 'yyyy-MM-dd')} readOnly = "true"/>
        </Grid>
        <Grid item xs = {6} sm = {6} align = "right"></Grid>
        <Grid item xs = {1.5} sm = {1.5} align = "right">
          < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
              Fecha fin:
          </Typography>
        </Grid>
        <Grid item xs = {1} sm = {1} align = "left" >
          <CustomizedInputs value = {format(new Date(fechaActual.getDate() + 7), 'yyyy-MM-dd')} readOnly = "true"/>
        </Grid>
        <Grid item xs = {1.5} sm = {1.5} align = "right">
          < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
              Hora inicio:
          </Typography>
        </Grid>
        <Grid item xs = {1} sm = {1} align = "left" >
          <CustomizedInputs value = {format(fechaActual, 'hh:mm:ss')} readOnly = "true"/>
        </Grid>
        <Grid item xs = {6} sm = {6} align = "right"></Grid>
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
              <CustomizedInputs value = {format(fechaActual, 'hh:mm:ss')} readOnly = "true"/>
            </Grid>
            <Grid item xs = {10} sm = {10} align = "left">
              < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
                  Cantidad de Paquetes Entregados:
              </Typography>
            </Grid>
            <Grid item xs = {2} sm = {2} align = "left" >
              <CustomizedInputs value = {format(fechaActual, 'hh:mm:ss')} readOnly = "true"/>
            </Grid>
            <Grid item xs = {10} sm = {10} align = "left">
              < Typography variant="body1_bold" mb={2} fontFamily = "Roboto">
                  Cantidad de Kilometros Recorridos:
              </Typography>
            </Grid>
            <Grid item xs = {2} sm = {2} align = "left" >
              <CustomizedInputs value = {format(fechaActual, 'hh:mm:ss')} readOnly = "true"/>
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
            <CheckCircleOutlineIcon sx={{ fontSize: 120, color:'#56AD5A' }} />
          </Grid>
          <Grid item xs = {12} sm = {12} align = "center" marginTop = {0}>
          < Typography variant="body1_bold" mb={2} fontFamily = "Roboto" color ='#56AD5A' >
                  Finalizado Correctamente
          </Typography>
          </Grid>
          </Box>
        </Grid>
        {/* <Grid item xs = {12} sm = {12} align = "right" marginTop = {0}>
        <Grid item xs = {3} sm = {3} align = "right" marginTop = {0}>
            <Button variant = "text" color = "primary" size = "large" type = "submit"  onClick = {() => setOpenResume(false)}> 
              <Typography variant = "button_max" > Ver Detalle </Typography>
              <ArrowCircleRightOutlinedIcon sx={{ fontSize: 40, color:'primary.main' }}/>
            </Button>
        </Grid>
        </Grid> */}
      </Grid>
    </Box>
    </>
    :
    <></>
  }
  </>
  );
}