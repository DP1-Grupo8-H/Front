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

function TabPanel(props) {
  //Segunda version - ahora con paginación
  const classes = useStyles();  

  const { children, value, index, plan, camion, ...other } = props;
  return(
    <>
    {!camion ? ( 
      <Grid align = "center">
          <CircularProgress/>
      </Grid>) : (
      <>
      <Card className={classes.card}>
        <CardContent>
          <Grid container spacing = {0}>
            <Grid item xs = {12} sm = {12} align = "left" sx = {{margin:"-1rem 0rem -1rem 0rem"}}>
              <Typography color = "secondary_white.darker" gutterBottom variant="body1" component="h2">#{
                camion.id}
              </Typography>
            </Grid>
            <Grid item xs = {4} sm = {4} align = "left" >
              <Typography color = "primary" gutterBottom variant="h5" component="h2">Camion {
                camion.placa}
              </Typography>
            </Grid>
            <Grid item xs = {4} sm = {4} align = "right" ></Grid>
            <Grid item xs = {4} sm = {4} align = "right" >
              <Typography color = "secondary_white.darker" gutterBottom variant="h5" component="h2" >
                Tipo - {camion.tipo}
                <LocalShippingIcon color = "secondary_white.darker" sx = {{paddingLeft: "1rem", 'vertical-align':'-0.2rem'}} />
              </Typography>
            </Grid>
          </Grid>
          {plan.planes_transporte.map((planArr) => {
            {/* PLANES DE TRANSPORTE */}
            return(
              <Grid container spacing = {0} padding = "0rem 2rem 0rem 2rem">
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
                      {planArr.plan_transporte.map((planAux) => {
                        {/* PLAN DE TRANSPORTE IMPLEMENTACIÓN */}
                        return(      
                          <Grid container padding= "0rem 0rem 0rem 0rem" alignItems = "center">
                          {(planAux.pedido !== null) ?
                            <>
                              <Grid item xs = {0.5} sm = {0.5} align = "left">
                                <ListAltIcon color = "primary" sx = {{'vertical-align':'-0.2rem'}} />
                              </Grid>
                              <Grid item xs = {2} sm = {2} align = "left">
                                <Typography variant="body1_bold" color="primary.main" component="p">Pedido: {planAux.pedido.codigo}
                                </Typography>
                              </Grid>

                              {
                                planAux.pedido_padre !== null ? 
                                <>
                                <Grid item xs = {0.5} sm = {0.5} align = "left">
                                  <ArrowForwardIcon color = "primary" sx = {{'vertical-align':'-0.2rem'}} />
                                </Grid>
                                <Grid item xs = {3} sm = {3} align = "left">
                                  <Typography variant="body1_bold" color="primary.main" component="p">Hereda del: {planAux.pedido_padre.codigo}
                                  </Typography>
                                </Grid>
                                <Grid item xs = {6} sm = {6} align = "right">
                                  <Typography variant="body1_bold" color="primary.main" component="p">Oficina: {planAux.pedido.ciudad.ciudad}
                                    <WarehouseOutlinedIcon color = "primary.main" sx = {{'vertical-align':'-0.2rem'}} />
                                  </Typography>
                                </Grid>
                                </>
                                :
                                <>
                                  <Grid item xs = {3.5} sm = {3.5} align = "left"></Grid>
                                  <Grid item xs = {6} sm = {6} align = "right">
                                  <Typography variant="body1_bold" color="primary.main" component="p">Oficina: {planAux.pedido.ciudad.ciudad}
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
                          { planAux.plan_transporte.map((ruta) => {   
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
                              <Divider> {planAux.pedido !== null ? `Cantidad entregada: ${planAux.pedido.cantidad} de ${planAux.pedido_padre !== null ? planAux.pedido_padre.cantidad: planAux.pedido.cantidad}` : `Regreso al Almacen`}</Divider>
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Box>
                    </Grid>
                  </Box>
                </Grid>
            {/* Footer */}
      
            <CardContent>
              <Grid container spacing = {0}>
                <Grid item xs = {6} sm = {6} align = "left">
                  <Typography display="inline" color = "primary" variant="body1">{`Hora Retorno: ${plan.plan_transporte.at(-1).hora_llegada}`}</Typography>
                </Grid>
              </Grid>
            </CardContent>
            <Divider/>
            </Grid>              
            );
          })
        }
      </CardContent>
    </Card>
    
    </>
    )}
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  plan: PropTypes.number.isRequired,
  camion: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ResumenCamionColapse(){
  //Uso de Redux - seleccionamso la data que regresará de Topics y lo llenamos
  const {state} = useLocation();
  const historico = state.histCamiones;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //Segunda version - ahora con paginación
  const classes = useStyles();  

  return(
    //Si post.length es cero - retornaremos un LOADING - sino veremos el Grid
    <>
    {!historico?.length ? ( 
        <Grid align = "center">
          <CircularProgress/>
        </Grid>) : (
       <Grid className = {classes.container} container 
        alignItems="stretch" spacing = {0.5}>
          {/* PLANES DE TRANSPORTE */}
          <Grid item xs = {12} sm = {12} align = "left">
              <Box sx={{ width: '100%' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="#FFA000"
                indicatorColor="primary"
                aria-label="secondary tabs example"
                >
                  {
                    historico.map((plan) => {
                      return(<Tab value={plan.camion.id} label={`Camion #${plan.camion.id}`} {...a11yProps(plan.camion.id)} />);
                    })
                  }
              </Tabs>
              {historico.map((plan) => {
                return(
                <TabPanel value={value} index={plan.camion.id} plan={plan.planes_transporte} camion={plan.camion}>
                  {`Item ${plan.id_plan_transporte}`}
                </TabPanel>
                );
                })
              }
              </Box>
            </Grid>
          </Grid>
          )
            //En este caso - tenemos otro Grid - para items - que contendran cada post
          }
      </>
    );
}