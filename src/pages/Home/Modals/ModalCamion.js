import React, {useState, useEffect} from "react";
import { Typography, Button, Grid, TextField, CircularProgress, Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Divider, TablePagination, CardActionArea, CardActions, ButtonBase, Tab, Tabs, LinearProgress, Skeleton } from '@mui/material';

import { format } from 'date-fns';
import useStyles from './styles';

import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import moment from 'moment';

import {useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';
import CustomizedInputs from "../../../components/utils/CustomizedInputs";

function findFecha_entrega(planes){
    if (planes.length === 0) {
        return 'Aún no se entrega';
    }

    var max = planes[0];
    var maxIndex = 0;

    for (var i = 1; i < planes.length; i++) {
      if (planes[i].hora_llegada > max.hora_llegada) {
        maxIndex = i;
            max = planes[i];
        }
    }
    return planes[maxIndex].hora_llegada;
}

export default function ModalCamion({setOpenCamion, pedCamion}){
  console.log(pedCamion);


  //Segunda version - ahora con paginación
  const classes = useStyles();  

  return(
    <>
    {!pedCamion ? ( 
      <Grid align = "center">
          <CircularProgress/>
      </Grid>) : (
      <>
      <Card className={classes.card}>
        <CardContent>
          <Grid container spacing = {0}>
            <Grid item xs = {12} sm = {12} align = "left" sx = {{margin:"-1rem 0rem -1rem 0rem"}}>
              <Typography color = "secondary_white.darker" gutterBottom variant="body1" component="h2">#{
                pedCamion.camion.id}
              </Typography>
            </Grid>
            <Grid item xs = {4} sm = {4} align = "left" >
              <Typography color = "primary" gutterBottom variant="h5" component="h2">Camion {
                pedCamion.camion.placa}
              </Typography>
            </Grid>
            <Grid item xs = {4} sm = {4} align = "right" ></Grid>
            <Grid item xs = {4} sm = {4} align = "right" >
              <Typography color = "secondary_white.darker" gutterBottom variant="h5" component="h2" >
                Tipo - {pedCamion.camion.tipo}
                <LocalShippingIcon color = "secondary_white.darker" sx = {{paddingLeft: "1rem", 'vertical-align':'-0.2rem'}} />
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing = {0} padding = "0rem 2rem 0rem 2rem">
          {/* PLANES DE TRANSPORTE */}
          <Grid item xs = {12} sm = {12} align = "left">
              <Box sx={{ width: '100%' }}>
                  
                <Grid container padding= "0rem 0rem 0rem 0rem" alignItems = "center">
                  <Grid item xs = {4} sm = {4} align = "left">
                    <Typography variant="h6" color="textSecondary" component="p">Plan(es) de Transporte:</Typography>
                  </Grid>
                  <Box sx={{  bgcolor: 'secondary_white.main',
                    m: 1,
                    margin: '0rem 0rem -1rem 0rem',
                    backgroundColor: 'neutral.main',
                    padding: '1rem',
                    border: 1.5,
                    width: 'auto',
                    height: 'auto',borderColor: 'primary.main', borderRadius: '0px 0px 16px 16px ' }}>
                  {pedCamion.plan_transporte.map((plan) => {
                    {/* PLAN DE TRANSPORTE IMPLEMENTACIÓN */}
                    return(      
                      <Grid container padding= "0rem 0rem 0rem 0rem" alignItems = "center">
                      {(plan.pedido !== null) ?
                        <>
                          <Grid item xs = {0.5} sm = {0.5} align = "left">
                            <ListAltIcon color = "primary" sx = {{'vertical-align':'-0.2rem'}} />
                          </Grid>
                          <Grid item xs = {2} sm = {2} align = "left">
                            <Typography variant="body1_bold" color="primary.main" component="p">Pedido: {plan.pedido.codigo}
                            </Typography>
                          </Grid>

                          {
                            plan.pedido_padre !== null ? 
                            <>
                            <Grid item xs = {0.5} sm = {0.5} align = "left">
                              <ArrowForwardIcon color = "primary" sx = {{'vertical-align':'-0.2rem'}} />
                            </Grid>
                            <Grid item xs = {3} sm = {3} align = "left">
                              <Typography variant="body1_bold" color="primary.main" component="p">Hereda del: {plan.pedido_padre.codigo}
                              </Typography>
                            </Grid>
                            <Grid item xs = {6} sm = {6} align = "right">
                              <Typography variant="body1_bold" color="primary.main" component="p">Oficina: {plan.pedido.ciudad.ciudad}
                                <WarehouseOutlinedIcon color = "primary.main" sx = {{'vertical-align':'-0.2rem'}} />
                              </Typography>
                            </Grid>
                            </>
                            :
                            <>
                              <Grid item xs = {3.5} sm = {3.5} align = "left"></Grid>
                              <Grid item xs = {6} sm = {6} align = "right">
                              <Typography variant="body1_bold" color="primary.main" component="p">Oficina: {plan.pedido.ciudad.ciudad}
                                <WarehouseOutlinedIcon color = "primary.main" sx = {{'vertical-align':'-0.2rem'}} />
                              </Typography>
                            </Grid>
                            </>
                          }
                          <Grid item xs = {12} sm = {12} align = "left">
                            <Skeleton color="inherit"  variant="text" />
                          </Grid>
                        </>
                        : 
                        <>
                          <Grid item xs = {4} sm = {4} align = "left">
                            <Typography variant="body1_bold" color="primary.main" component="p">Retorno
                            </Typography>
                          </Grid>
                          <Grid item xs = {12} sm = {12} align = "left">
                            <Skeleton color="inherit"  variant="text" />
                          </Grid>
                        </>
                      }  
                      <Grid container paddingTop= "1rem" alignItems = "center">  
                      { plan.plan_transporte.map((ruta) => {   
                        return(        
                            <>
                              <Grid item xs = {0.5} sm = {0.5} align = "center" >
                                  <DoubleArrowIcon color = "secondary_white.darker" sx = {{paddingLeft: "1rem", 'vertical-align':'0.7rem'}} />
                              </Grid>
                              <Grid item xs = {2.5} sm = {2.5} align = "center" >
                                < Typography variant="body1" mb={2} fontFamily = "Roboto">
                                    {ruta.ciudad.ciudad} - { moment(ruta.fecha_llegada).format('DD-MM-YYYY h:mm:ss a')} 
                                </Typography>
                              </Grid>
                            </>
                        );
                      }
                      )}
                      </Grid>
                        <Grid item xs = {12} sm = {12} align = "center" >
                          <Divider> {plan.pedido !== null ? `Cantidad entregada: ${plan.pedido.cantidad} de ${plan.pedido_padre !== null ? plan.pedido_padre.cantidad: plan.pedido.cantidad}` : `Regreso al Almacen`}</Divider>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Box>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      {/* Footer */}

      <CardContent>
        <Grid container spacing = {0}>
          <Grid item xs = {6} sm = {6} align = "left">
            <Typography display="inline" color = "primary" variant="body1">{`Hora Retorno: ${pedCamion.plan_transporte.at(-1).hora_llegada}`}</Typography>
          </Grid>
          <Grid item xs = {6} sm = {6} align = "right">
            <Typography display="inline" color = "primary" variant="body1">{`Num. Paquetes: ${pedCamion.camion.num_paquetes}`}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider/>
    </Card>
    
    </>
    )}
    </>
  );
}