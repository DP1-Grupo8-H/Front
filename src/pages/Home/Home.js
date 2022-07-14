import React, {useState, useEffect} from "react";
import Popup from '../../components/utils/Popup';
import { Box, Typography, Button, Grid, TextField, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, useMap,Marker, Polyline,Tooltip} from 'react-leaflet';
import ReactLeafletDriftMarker  from "react-leaflet-drift-marker";
import './App.css';
import Diario from "./Diario.js";
import LegendMapa from "../../components/Legend/Legend_Mapa";
import ResumeMapa from "../../components/Resume/Resume_Mapa";
import ModalListaPed from './Modals/ModalListaPed.js'
import ModalPed from './Modals/ModalPed.js'
import { Component } from 'react';
import BallotIcon from '@mui/icons-material/Ballot';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import LZString from 'lz-string';
import ModalDetalle from "./Modals/ModalDetalle";

const Home = () => {

  //USO DE PARÁMETROS
  //const data = useRef(datos);

  const [historico, setHistorico] = useState([]); //Este actualizará la pantalla de pedidos / plan_transporte.
  const [openListaPed, setOpenListaPed] = useState(false);
  const [openPed, setOpenPed] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [pedDetail, setPedDetail] = useState(null);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    for(let pedido of pedidos){
      if(!historico.some(ped =>  ped.pedido.id_pedido === pedido.id_pedido)){
        if(pedido.id_padre === 0){
          historico.push(
          {
            'pedido': pedido,
            'plan_transporte': [],
          });  //AGREGAMOS LOS QUE NO ESTÁN
        }
      }
    }
  }, [pedidos])
  
  console.log(historico);
  const handleDetail = (plan) => {
    setPedDetail(plan);
    setOpenDetail(true);
  }

  const handleMandarPedidos = e => {
    /* CODIGO DE DANIEL PARA MANDAR PEDIDOS*/
  }

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
            <Diario historico={historico} setHistorico = {setHistorico}/>
          </Grid>
          
          <Grid item xs = {4.5} sm = {4.5} align = "left" >
            {/* RESUMEN Y DETALLES */}
            <Grid container alignItems = "center">
              <Grid item xs = {12} sm = {12} align = "left" >
                <LegendMapa/>
              </Grid>
              <Grid item xs = {8} sm = {8} align = "left" >
                <ResumeMapa/>
              </Grid>
              <Grid item xs = {4} sm = {4} align = "left" >
                <Box sx={{  bgcolor: 'secondary_white.main',
                        m: 1,
                        margin: '0rem 0rem 1rem 1rem',
                        backgroundColor: 'neutral',
                        border: 1.5,
                        width: 'auto',
                        height: '14rem',borderColor: 'primary.contrastText', borderRadius: '16px ' }}>
                    <Grid container alignItems = "center">
                      <Grid item xs = {12} sm = {12} align = "left" marginTop = "0.3rem">
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
                      </Grid>
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
                <Box sx={{  bgcolor: 'secondary_white.main',
                        m: 1,
                        margin: '0rem 0rem 1rem 0rem',
                        backgroundColor: 'neutral',
                        border: 1.5,
                        width: 'auto',
                        overflowY: "scroll",
                        scrollbarColor: "#FFF6E7 #FFFFFF",
                        height: '26rem',borderColor: '#AFAFAF', borderRadius: '6px ' }}>
                  <Grid container alignItems = "center">
                  {historico.map((plan) => {
                    return(
                    <Grid item xs = {12} sm = {12} align = "left" marginTop = "0.25rem" marginBottom = "0.25rem">
                      <Button variant = "contained" color = "neutral" size = "small" sx={{height: '3rem'}} type = "submit" fullWidth onClick = {() => handleDetail(plan)}>
                        <Grid container alignItems = "center">
                          <Grid item xs = {8} sm = {8} align = "left" marginTop = "0rem">
                          <Typography variant = "button_min" color = "neutral" > 
                              {`PLAN DE TRANSPORTE | PEDIDO #${plan.pedido.id_pedido}`}
                          </Typography>
                          </Grid>
                          <Grid item xs = {4} sm = {4} align = "right" marginTop = "0rem">
                            <ArrowForwardIcon color = "neutral.contrastText" sx = {{paddingLeft: "0rem", 'vertical-align':'-0.5rem'}} />
                          </Grid>
                        </Grid> 
                      </Button>
                    </Grid>
                    );
                    })
                  }
                  </Grid>
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
      </div>
      
    </>
  );
}
export default Home;