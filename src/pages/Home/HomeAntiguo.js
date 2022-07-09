import React, {useState, useEffect} from "react";

import Popup from '../../components/utils/Popup';
import { Box, Typography, Button, Grid, TextField, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, useMap,Marker, Polyline,Tooltip} from 'react-leaflet';
import './App.css';
import LegendMapa from "../../components/Legend/Legend_Mapa";
import ResumeMapa from "../../components/Resume/Resume_Mapa";
import ModalListaPed from './Modals/ModalListaPed.js'
import ModalPed from './Modals/ModalPed.js'

import BallotIcon from '@mui/icons-material/Ballot';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const position1 = [-9.880358501459673, -74.46566630628085];

const Home = () => {
  //Return algoritmo -> rutas y pedidos faltantes.
  const [openListaPed, setOpenListaPed] = useState(false);
  const [openPed, setOpenPed] = useState(false);

  const [pedidos, setPedidos] = useState([]);

  return(
      <div>
      <Grid container padding= "2rem" alignItems = "center">
        <Grid item xs = {12} sm = {12} align = "left" >
          < Typography variant="h4" mb={2} color = "primary.contrastText">
              Mapa de las Entregas en Tiempo Real
          </Typography>
        </Grid>
        <Grid item xs = {7.5} sm = {7.5} align = "left" >
          {/* MAPA DE LA SIMULACION */}
    <MapContainer center={position1} zoom={6} scrollWheelZoom={true} id="idMapita">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <div style={{position:'relative',zIndex:9999,float:'right'}}>
        <p style={{color:"black",fontSize:"24px"}}>
          {this.state.tiempo}
          <p style={{color:"black",fontSize:"20px"}}>
            Tiempo de ejecución: {this.state.minutos}m : {this.state.segundos}s
          </p>
        </p>

      </div> */}

      {/* <div style={{position:'absolute',zIndex:9999,float:'left',bottom:0,width:"500px"}}>
         <Legend/>
      </div>
      {(
        this.state.ciudades?.map((ciudad)=>(
            ciudad.tipo==1 ? (
            <Marker position={[ciudad.latitud,ciudad.longitud]} icon={myOficina}>
              <Tooltip>
                {ciudad.ciudad}
              </Tooltip>
              </Marker>):
            (<Marker position={[ciudad.latitud,ciudad.longitud]} icon={myAlmacen} >
              <Tooltip>
                {ciudad.ciudad}
              </Tooltip>
              </Marker>)
        ))
      )
      }

    {(
        this.state.tramos ?.map((tramo)=>(
          tramo.bloqueado == 1 && this.state.mostrarTramos == true ? (
          <Polyline pathOptions={limeOptions} positions={[[tramo.ciudad_origen.latitud,tramo.ciudad_origen.longitud]
            ,[tramo.ciudad_destino.latitud,tramo.ciudad_destino.longitud]]}/> ):(<></>)      
        ))
      )
      }

    {
      (
        this.state.camiones?.map((camion)=>(
          camion.estado == 2 ? (
          <ReactLeafletDriftMarker  icon={IconMantenimiento}
              position={[camion.lat,camion.log]}
              duration={camion.tiempo}
              keepAtCenter={false}>
              <Tooltip>
                {"Id: " + camion.id}
                <br></br>
                {"Placa: " + camion.placa}
              </Tooltip>
              </ReactLeafletDriftMarker>):(
            <ReactLeafletDriftMarker  icon={myIcon}
            position={[camion.lat,camion.log]}
            duration={camion.tiempo}
            keepAtCenter={false}>
            <Tooltip>
              {"Id: " + camion.id}
              <br></br>
              {"Placa: " + camion.placa}
            </Tooltip>
            </ReactLeafletDriftMarker>
              ) 
          )
        )
      )
      } */}

    </MapContainer>
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
                    <Grid item xs = {12} sm = {12} align = "left" marginTop = "2rem">
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
                {pedidos.map((ped) => {
                  return(
                  <Grid item xs = {12} sm = {12} align = "left" marginTop = "0.25rem" marginBottom = "0.25rem">
                    <Button variant = "contained" color = "neutral" size = "small" sx={{height: '3rem'}} type = "submit" fullWidth onClick = {() => setOpenPed(true)}>
                      <Grid container alignItems = "center">
                        <Grid item xs = {8} sm = {8} align = "left" marginTop = "0rem">
                        <Typography variant = "button_min" color = "neutral" > 
                            {`PLAN DE TRANSPORTE | PEDIDO #${ped.id_pedido}`}
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
      </div>
    </div>
  )
}


export default Home;