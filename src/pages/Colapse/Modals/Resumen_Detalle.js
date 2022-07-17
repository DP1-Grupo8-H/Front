import React, {useState, useEffect} from "react";
import { Typography, Button, Grid, TextField, CircularProgress, Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Divider, TablePagination, CardActionArea, CardActions, ButtonBase, Tab, Tabs, LinearProgress } from '@mui/material';

import { format } from 'date-fns';
import useStyles from './styles';

import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import moment from 'moment';

import {useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';
import CustomizedInputs from "../../../components/utils/CustomizedInputs";

function TabPanel(props) {
  const { children, value, index, plan, pedido, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{  bgcolor: 'secondary_white.main',
                m: 1,
                margin: '0rem 0rem -1rem 0rem',
                backgroundColor: 'neutral.main',
                padding: '1rem',
                border: 1.5,
                width: 'auto',
                height: 'auto',borderColor: 'primary.main', borderRadius: '0px 0px 16px 16px ' }}>
          {/* PLAN DE TRANSPORTE IMPLEMENTACIÓN */}
          <Grid container padding= "0rem 0rem 0rem 0rem" alignItems = "center">
            <Grid item xs = {4} sm = {4} align = "left" >
                  < Typography variant="body1_bold" mb={2} color = "primary" fontFamily = "Roboto">
                      <LocalShippingIcon color = "secondary_white.darker" fontSize = "large" sx = {{paddingRight: "1rem", 'vertical-align':'-0.7rem'}} />
                      {plan.camion.placa} - Tipo: {plan.camion.tipo}
                  </Typography>
            </Grid>
            <Grid item xs = {4} sm = {4} align = "right" >
                  < Typography variant="body1_bold" mb={2} color = "primary" fontFamily = "Roboto">
                      Hora de salida del Almacen: {plan.hora_salida}
                  </Typography>
            </Grid>
            <Grid item xs = {4} sm = {4} align = "right" >
                  < Typography variant="body1_bold" mb={2} color = "primary" fontFamily = "Roboto">
                      Hora de llegada a la Oficina: {plan.hora_llegada}
                  </Typography>
            </Grid>
             <Grid item xs = {12} sm = {12} align = "center" >
              <Divider>RUTA DEL CAMION</Divider>
             </Grid>
          <Grid container paddingTop= "1rem" alignItems = "center">  
          {plan.plan_transporte.map((ruta) => {
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
          })}
          </Grid>
          </Grid>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  plan: PropTypes.number.isRequired,
  pedido: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function findFecha_entrega(planes){
    if (planes.length === 0) {
        return -1;
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

function soloRecibidos(historico){
  const auxHist = historico.filter(ped => {
      return (ped.plan_transporte.length > 0);
  });

  return auxHist;
}

export default function ResumenDetalleColapse(){
  //Uso de Redux - seleccionamso la data que regresará de Topics y lo llenamos
  const {state} = useLocation();
  const dataHistorica = state.historico;

  const historico = soloRecibidos(dataHistorica);
  //Segunda version - ahora con paginación
  const classes = useStyles();  
  const [value, setValue] = useState(0);
  const [pedidos, setPedidos] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const pedAux = historico.slice((page)*rowsPerPage,(page+1)*rowsPerPage);
    console.log(pedAux);
    setPedidos(pedAux);
  }, [page,rowsPerPage]);
  
  return(
    //Si post.length es cero - retornaremos un LOADING - sino veremos el Grid
    !pedidos?.length ? ( 
        <Grid align = "center">
          <CircularProgress/>
        </Grid>) : (
       <Grid className = {classes.container} container 
        alignItems="stretch" spacing = {0.5}>
          { /* Vamos a retornar un elemento dentro del Grid - en este caso- mapeamos todos los posts */
            pedidos.map((hist) => (
              <Grid key = {hist.id} item xs = {12} sm={12}>
                <Card className={classes.card}>
                    <CardContent>
                      <Grid container spacing = {0}>
                        <Grid item xs = {12} sm = {12} align = "left" sx = {{margin:"-1rem 0rem -1rem 0rem"}}>
                          <Typography color = "secondary_white.darker" gutterBottom variant="body1" component="h2">#{
                            hist.pedido.id_pedido}
                          </Typography>
                        </Grid>
                        <Grid item xs = {4} sm = {4} align = "left" >
                          <Typography color = "primary" gutterBottom variant="h5" component="h2">Pedido {
                            hist.pedido.codigo}
                          </Typography>
                        </Grid>
                        <Grid item xs = {4} sm = {4} align = "right" ></Grid>
                        <Grid item xs = {4} sm = {4} align = "right" >
                          <Typography color = "secondary_white.darker" gutterBottom variant="h5" component="h2" >
                            {moment(hist.pedido.fecha_registro).format('DD-MM-YYYY h:mm:ss a')}
                            <AccessTimeOutlinedIcon color = "secondary_white.darker" sx = {{paddingLeft: "1rem", 'vertical-align':'-0.2rem'}} />
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing = {0} padding = "0rem 2rem 0rem 2rem">
                        <Grid item xs = {4} sm = {4} align = "left">
                          <Typography variant="h6" color="textSecondary" component="p">Plan(es) de Transporte:</Typography>
                        </Grid>
                        <Grid item xs = {4} sm = {4} align = "left">
                          <Typography variant="body1_bold" color="textSecondary" component="p">Desde: {hist.pedido.almacen.ciudad}
                              <WarehouseOutlinedIcon color = "secondary_white.darker" sx = {{paddingLeft: "1rem", 'vertical-align':'-0.2rem'}} />
                          </Typography>
                        </Grid>
                        <Grid item xs = {4} sm = {4} align = "right">
                          <Typography variant="body1_bold" color="textSecondary" component="p">Hasta: {hist.pedido.ciudad.ciudad}
                              <StoreOutlinedIcon color = "secondary_white.darker" sx = {{paddingLeft: "1rem", 'vertical-align':'-0.2rem'}} />
                          </Typography>
                        </Grid>
                         <Grid item xs = {12} sm = {12} align = "left">
                          <LinearProgress color="inherit" />
                         </Grid>
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
                                hist.plan_transporte.map((plan) => {
                                  const index_plan = hist.plan_transporte.findIndex(plan_tran => plan_tran.id_hijo == plan.id_hijo);
                                  console.log(index_plan);
                                  if(index_plan < hist.plan_transporte.length -1 && index_plan !== null){
                                    console.log(hist.plan_transporte[index_plan].id_plan_transporte, '==' ,hist.plan_transporte[index_plan+1].id_plan_transporte);
                                  if (hist.plan_transporte[index_plan].id_plan_transporte == hist.plan_transporte[index_plan+1].id_plan_transporte) 
                                      return (<></>);
                                  }
                                  return(<Tab value={plan.id_plan_transporte} label={`Plan #${plan.id_plan_transporte}`} {...a11yProps(plan.id_plan_transporte)} />);
                                })
                              }
                          </Tabs>
                          {hist.plan_transporte.map((plan) => {
                            return(
                            <TabPanel value={value} index={plan.id_plan_transporte} plan={plan} pedido={hist.pedido}>
                              {`Item ${plan.id_plan_transporte}`}
                            </TabPanel>
                            );
                            })
                          }
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  {/* Footer */}

                  <CardContent>
                    <Grid container spacing = {0}>
                      <Grid item xs = {6} sm = {6} align = "left">
                        <Typography display="inline" color = "primary" variant="body1">{`Entrega: ${findFecha_entrega(hist.plan_transporte)}`}</Typography>
                      </Grid>
                      <Grid item xs = {6} sm = {6} align = "right">
                        <Typography display="inline" color = "primary" variant="body1">{`Cantidad: ${hist.pedido.cantidad}`}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider/>
                </Card>
              </Grid>
            ))
            //En este caso - tenemos otro Grid - para items - que contendran cada post
          }
          <TablePagination
            component="div"
            count={historico?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
       </Grid>
    )
  )
}