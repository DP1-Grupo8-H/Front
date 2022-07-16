import React, {useState, useEffect} from "react";
import Popup from '../../components/utils/Popup';
import { Box, Typography, Button, Grid, TextField, CircularProgress, Tabs, Tab } from '@mui/material';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, useMap,Marker, Polyline,Tooltip} from 'react-leaflet';
import ReactLeafletDriftMarker  from "react-leaflet-drift-marker";
import './App.css';
import Diario from "./Diario.js";
import LegendMapa from "../../components/Legend/Legend_Mapa";
import ResumeMapa from "../../components/Resume/Resume_Mapa";
import ModalListaPed from './Modals/ModalListaPed.js'
import ModalPed from './Modals/ModalPed.js'
import ModalCamion from './Modals/ModalCamion.js'
import { Component } from 'react';
import BallotIcon from '@mui/icons-material/Ballot';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import LZString from 'lz-string';
import ModalDetalle from "./Modals/ModalDetalle";

function TabPanel(props) {
  const { children, value, index, historico, setPedDetail, setOpenDetail, histCamiones, setPedCamion,setOpenCamion,...other } = props;

  const handleDetail = (plan) => {
    setPedDetail(plan);
    setOpenDetail(true);
  }

  const handleClickCamion = (camion) => {
    if(camion.camion.estado === 0){
      setPedCamion(camion);
      setOpenCamion(true);
    }
  }

  function renderSwitch (param) {
    switch (param) {
      case 1:
        return(
        <Typography variant = "b2" color = "#3A9C3E" > 
            Disponible
        </Typography>
        );
        break;
      case 0:
        return(
        <Typography variant = "b2" color = "#822E81" > 
            En ruta
        </Typography>
        );
        break;
      default:
        return(
        <Typography variant = "b2" color = "#F44336" > 
            Mantenimiento
        </Typography>
        );
        break;
    }
  }

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        children === 'Item One'?
        <Grid item xs = {12} sm = {12} align = "left" >
          <Box sx={{  bgcolor: 'secondary_white.main',
                  m: 1,
                  margin: '0rem 0rem 1rem 0rem',
                  backgroundColor: 'neutral',
                  border: 1.5,
                  width: 'auto',
                  overflowY: "scroll",
                  scrollbarColor: "#FFF6E7 #FFFFFF",
                  height: '28rem',borderColor: '#AFAFAF', borderRadius: '6px ' }}>
            <Grid container alignItems = "center">
            {historico.length > 0 ?
              historico.map((plan) => {
              return(
              <Grid item xs = {12} sm = {12} align = "left" marginTop = "0.25rem" marginBottom = "0.25rem">
                <Button variant = "contained" color = "neutral" size = "small" sx={{height: '3rem'}} type = "submit" fullWidth onClick = {() => handleDetail(plan)}>
                  <Grid container alignItems = "center">
                    <Grid item xs = {11} sm = {11} align = "left" marginTop = "0rem">
                    <Typography variant = "button_min" color = "neutral" > 
                        {`PEDIDO| Cod. #${plan.pedido.codigo} → ${plan.pedido.ciudad.ciudad}`}
                    </Typography>
                    </Grid>
                    <Grid item xs = {1} sm = {1} align = "right" marginTop = "0rem">
                      <ArrowForwardIcon color = "neutral.contrastText" sx = {{paddingLeft: "0rem", 'vertical-align':'-0.5rem'}} />
                    </Grid>
                  </Grid> 
                </Button>
              </Grid>
              );
              })
              :
              <Grid item xs = {12} sm = {12} align = "center" marginTop = "16rem">
                <CircularProgress />
              </Grid>
            }
            </Grid>
          </Box>
      </Grid>
        :   
        <Grid item xs = {12} sm = {12} align = "left" >
          <Box sx={{  bgcolor: 'secondary_white.main',
                  m: 1,
                  margin: '0rem 0rem 1rem 0rem',
                  backgroundColor: 'neutral',
                  border: 1.5,
                  width: 'auto',
                  overflowY: "scroll",
                  scrollbarColor: "#FFF6E7 #FFFFFF",
                  height: '28rem',borderColor: '#AFAFAF', borderRadius: '6px ' }}>
            <Grid container alignItems = "center">
            {histCamiones.length > 0 ?
              histCamiones.map((camion) => {
              return(
              <Grid item xs = {12} sm = {12} align = "left" marginTop = "0.25rem" marginBottom = "0.25rem">
                <Button variant = "contained" color = "secondary_white" size = "small" sx={{height: '3rem'}} type = "submit" fullWidth onClick = {() => {handleClickCamion(camion)}}>
                  <Grid container alignItems = "center">
                    <Grid item xs = {1} sm = {1} align = "right" marginTop = "0rem">
                      <LocalShippingIcon color = "primary" fontSize = "large" sx = {{paddingRight: "1rem", 'vertical-align':'-0.5rem'}} />
                    </Grid>
                    <Grid item xs = {10} sm = {10} align = "left" marginTop = "0rem">
                    <Typography variant = "button_min" color = "primary.main" > 
                        {` #${camion.camion.id} - Placa: ${camion.camion.placa} Tipo: - ${camion.camion.tipo}`}
                    </Typography>
                    </Grid>
                    {
                      camion.camion.estado === 0 &&
                      <Grid item xs = {1} sm = {1} align = "right" marginTop = "0rem">
                        <ArrowForwardIcon color = "primary" sx = {{paddingLeft: "0rem", 'vertical-align':'-1rem'}} />
                      </Grid>
                    }
                    <Grid item xs = {2} sm = {2} align = "left" marginTop = "-0.5rem"></Grid>
                    <Grid item xs = {5} sm = {5} align = "left" marginTop = "-0.5rem">
                    <Typography variant = "b2" color = "secondary_white.darker" > 
                        {` almacen - ${camion.camion.almacen.ciudad}`}
                    </Typography>
                    </Grid>
                    <Grid item xs = {4} sm = {4} align = "left" marginTop = "-0.5rem">
                    <Typography variant = "b2" color = "secondary_white.darker" > 
                        {` Estado:`}
                    </Typography>
                    {renderSwitch(camion.camion.estado)}
                    </Grid>
                  </Grid> 
                </Button>
              </Grid>
              );
              })
              :
              <Grid item xs = {12} sm = {12} align = "center" marginTop = "16rem">
                <CircularProgress />
              </Grid>
            }
            </Grid>
          </Box>
      </Grid>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const Home = () => {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //USO DE PARÁMETROS
  //const data = useRef(datos);

  const [historico, setHistorico] = useState([]); //Este actualizará la pantalla de pedidos / plan_transporte.
  const [histCamiones, setHistCamiones] = useState([]); //Este actualizará la pantalla de camiones / movimientos_mantenimientos.
  const [openListaPed, setOpenListaPed] = useState(false);
  const [openPed, setOpenPed] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openCamion,setOpenCamion] = useState(false);
  const [pedCamion,setPedCamion] = useState(null);
  const [pedDetail, setPedDetail] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [data, setData] = useState({cant: '', blq: '', ruta: '', mant:''});

  useEffect(() => {
    for(let pedido of pedidos){
      if(!historico.some(ped =>  ped.pedido.id_pedido === pedido.id_pedido)){
        if(pedido.id_padre === 0){
          historico.push(
          {
            'pedido': {...pedido, cantidad: 0},
            'plan_transporte': [],
          });  //AGREGAMOS LOS QUE NO ESTÁN
        }
      }
    }
  }, [pedidos])
  
  console.log(historico);



  return(
    <>
        <div>
        <Grid container padding= "2rem" alignItems = "center">
          <Grid item xs = {12} sm = {12} align = "left" >
            < Typography variant="h4" mb={2} color = "primary.contrastText">
                Mapa de las Entregas en Tiempo Real
            </Typography>
          </Grid>

          <Grid item xs = {7.5} sm = {7.5} align = "center" sx = {{marginTop:"-1.5rem"}}>
            {/* MAPA DE LA SIMULACION */}
            <Diario historico={historico} setHistorico = {setHistorico} histCamiones = {histCamiones} setHistCamiones = {setHistCamiones}/>
          </Grid>
          
          <Grid item xs = {4.5} sm = {4.5} align = "left" >
            {/* RESUMEN Y DETALLES */}
            <Grid container alignItems = "center">
              <Grid item xs = {12} sm = {12} align = "left" >
                <LegendMapa/>
              </Grid>
              {/* <Grid item xs = {8} sm = {8} align = "left" >
                <ResumeMapa data = {data}/>
              </Grid> */}
              <Grid item xs = {12} sm = {12} align = "left" >
                <Box sx={{  bgcolor: 'secondary_white.main',
                        m: 1,
                        margin: '0rem 0rem 1rem 0rem',
                        backgroundColor: 'neutral',
                        border: 1.5,
                        width: 'auto',
                        height: '6rem',borderColor: 'primary.contrastText', borderRadius: '16px ' }}>
                    <Grid container alignItems = "center">
                      {/* <Grid item xs = {12} sm = {12} align = "left" marginTop = "0.3rem">
                        <Button variant = "contained" color = "primary" size = "small" type = "submit" fullWidth onClick = {handleMandarPedidos}>
                          <Grid container alignItems = "center">
                            <Grid item xs = {4} sm = {4} align = "left" marginTop = "0rem">
                              <BallotIcon color = "secondary_white" sx = {{paddingLeft: "0rem", 'vertical-align':'-0.7rem'}} />
                            </Grid>
                            <Grid item xs = {8} sm = {8} align = "left" marginTop = "0rem">
                            <Typography variant = "button_min" color = "secondary_white.main" > 
                                Lanzar Pedidos 
                            </Typography>
                            </Grid>
                          </Grid> 
                        </Button>
                      </Grid> */}
                      <Grid item xs = {12} sm = {12} align = "left" marginTop = "0.5rem">
                        <Button variant = "contained" color = "secondary_white" size = "small" type = "submit" fullWidth onClick = {() => setOpenListaPed(true)}>
                          <Grid container alignItems = "center">
                            <Grid item xs = {4} sm = {4} align = "left" marginTop = "0rem">
                              <BallotIcon color = "primary" sx = {{paddingLeft: "0rem", 'vertical-align':'-0.7rem'}} />
                            </Grid>
                            <Grid item xs = {8} sm = {8} align = "left" marginTop = "0rem">
                            <Typography variant = "button_min" color = "primary" > 
                                Agregar Lista de Pedidos 
                            </Typography>
                            </Grid>
                          </Grid> 
                        </Button>
                      </Grid>
                      <Grid item xs = {12} sm = {12} align = "left" marginTop = "0.5rem">
                        <Button variant = "contained" color = "secondary_white" size = "small" type = "submit" fullWidth onClick = {() => setOpenPed(true)}> 
                          <Grid container alignItems = "center">
                            <Grid item xs = {4} sm = {4} align = "left" marginTop = "0rem">
                              <AddShoppingCartIcon color = "primary" sx = {{paddingLeft: "0rem", 'vertical-align':'-0.7rem'}} />
                            </Grid>
                            <Grid item xs = {8} sm = {8} align = "left" marginTop = "0rem">
                            <Typography variant = "button_min" color = "primary" > 
                                Agregar Pedidos 
                            </Typography>
                            </Grid>
                          </Grid>
                        </Button>
                      </Grid>
                    </Grid>
                </Box>
              </Grid>
              <Grid item xs = {12} sm = {12} align = "left" >
                <Box sx={{ width: '100%' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="#FFA000"
                  indicatorColor="primary"
                  aria-label="secondary tabs example"
                  >
                  <Tab label="Pedidos" {...a11yProps(0)} />
                  <Tab label="Camiones" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0} historico = {historico} setPedDetail = {setPedDetail} setOpenDetail = {setOpenDetail}>
                  Item One
                </TabPanel>
                <TabPanel value={value} index={1} histCamiones = {histCamiones} setPedCamion = {setPedCamion} setOpenCamion = {setOpenCamion}>
                  Item Two
                </TabPanel>
                </Box>
              </Grid>
            </Grid>          
          </Grid>
        </Grid>
      </div>
      <div>
        <Popup
          openPopup={openListaPed}
          setOpenPopup={setOpenListaPed}
          title="AGREGAR LISTA DE PEDIDOS"
          size="sm"
          >
          <ModalListaPed setOpenPopup = {setOpenListaPed} setPedidos = {setPedidos}/>
          </Popup>
          <Popup
          openPopup={openPed}
          setOpenPopup={setOpenPed}
          title="AGREGAR PEDIDOS"
          size="sm"
          >
          <ModalPed setOpenPopup = {setOpenPed} setPedidos = {setPedidos}/>
        </Popup>
          <Popup
          openPopup={openDetail}
          setOpenPopup={setOpenDetail}
          title={`DETALE DEL PEDIDO #${(!pedDetail ? '-': pedDetail.pedido.id_pedido)}`}
          size="md"
          >
          <ModalDetalle setOpenDetail = {setOpenDetail} pedDetail = {pedDetail}/>
        </Popup>
          <Popup
          openPopup={openCamion}
          setOpenPopup={setOpenCamion}
          title={`DETALE DEL CAMION #${(!pedCamion ? '-': pedCamion.camion.id)}`}
          size="md"
          >
          <ModalCamion setOpenCamion = {setOpenCamion} pedCamion = {pedCamion}/>
        </Popup>
      </div>
      
    </>
  );
}
export default Home;