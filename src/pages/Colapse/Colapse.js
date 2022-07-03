import React, {useState, useEffect} from "react";
import MapaSimulacion from './Prueba';
import Popup from '../../components/utils/Popup';
import ModalSimulation from './Modals/ModalSimulation';
import ModalResume from './Modals/ModalResume';

import './App.css';
import Legend from "../../components/Legend/Legend";
import { Box, Grid, Typography} from "@mui/material";

const Colapse = () => {

  const [openPopup, setOpenPopup] = useState(true);
  const [openReusme, setOpenResume] = useState(false);
  //Data --> Pedidos pre-cargados || puede incluir en este la traída de ciudades, tramos y camiones.
  const [data, setData] = useState([]);
  const [historico, setHistorico] = useState([]);

  const[fechaActual,setFechaActual] = useState([]);
  const[fechaFin, setFechaFin] = useState([]);
  //Return algoritmo -> rutas y pedidos faltantes.
  console.log(data);

  return(
    <>
      {(!openPopup && data.length > 0) ? 
      <div className="App">
        <header className="App-header">
          {/*<Legend />*/}
          <MapaSimulacion datos = {data} fechaActual={fechaActual} setOpenResume ={setOpenResume} setHistorico ={setHistorico} setFechaFin={setFechaFin}/>

        </header>
      </div>
      :
      <Box
            maxWidth = 'stretch'
            maxHeight = 'stretch'
            sx={{
              backgroundColor: 'secondary_white.main',
            }}
      >
        <Box sx={{  bgcolor: 'secondary_white.main',
                m: 1,
                margin: '0rem 0rem -1rem 0rem',
                backgroundColor: 'neutral.main',
                padding: '1rem',
                border: 1.5,
                width: 'auto',
                height: 'auto',borderColor: 'primary.main', borderRadius: '0px 0px 16px 16px ' }}>
          <Grid item xs = {12} sm = {12} align = "center">
            <Typography variant="h3" color="primary" component = "p" >Para iniciar la simulación, debe cargar el archivo correspondiente</Typography>
          </Grid>
        </Box>
      </Box>
      }
      <div>
        <Popup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          title="Inicio de la Simulación hasta el Colapso"
          >
          <ModalSimulation setOpenPopup = {setOpenPopup} setData = {setData} setFechaActual={setFechaActual}/>
        </Popup>
        <Popup
          openPopup={openReusme}
          setOpenPopup={setOpenResume}
          title="Finalización de la Simulación"
          >
          <ModalResume setOpenResume = {setOpenResume} historico = {historico} fechaActual={fechaActual} fechaFin = {fechaFin}/>
        </Popup>
      </div>
    </>
  )
}


export default Colapse;