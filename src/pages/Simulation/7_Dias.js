import React, {useState, useEffect} from "react";
import MapaSimulacion from './Prueba';
import Popup from '../../components/utils/Popup';
import ModalSimulation from './Modals/ModalSimulation';
import ModalResume from './Modals/ModalResume';

import { Box, Grid, Typography} from "@mui/material";

import './App.css';
import Legend from "../../components/Legend/Legend";
import Resume from "../../components/Resume/Resume";

const convertMath = (number) => {
  if(Math.trunc(number/1000) > 0){
    if(Math.trunc(number/1000000) > 0){
      number = (Math.round(number/1000000)).toFixed(2).toString().concat('M');
    }
    else{
      number = (Math.round(number/1000)).toFixed(2).toString().concat('K');
    }
  }
  else{
    number = number.toString().concat('');
  }
}

const retrievePaq = (historico, processPedidos) => {
  let data = {cant : 0, cur : 0, paq : 0, paqcur : 0};
  for(let ped of historico){
    if(ped.plan_transporte.length > 0)  data.cant++;
    for(let plan of ped.plan_transporte){
      data.paq+=plan.cantidad;
    }
  }
  data.cant = convertMath(data.cant);
  data.cur = convertMath(data.cur);
  data.paq = convertMath(data.paq);
  data.paqcur = convertMath(data.paqcur);

  return data;
}


const SevenDays = () => {

  const [openPopup, setOpenPopup] = useState(true);
  const [openReusme, setOpenResume] = useState(false);
  //Data --> Pedidos pre-cargados || puede incluir en este la traída de ciudades, tramos y camiones.
  const [data, setData] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [processPedidos, setProcessPedidos] = useState([]);

  const[fechaActual,setFechaActual] = useState([]);
  const[fechaFin, setFechaFin] = useState([]);
  //Return algoritmo -> rutas y pedidos faltantes.
  
  const [historicoProcess, setHistoricoProcess] = useState({cant: '', cur: '', paq: '', paqcur: ''});
  // useEffect(()=>{
  //   const auxHist = retrievePaq(historico, processPedidos);
  //   setHistoricoProcess(auxHist);
  // }, [historico]);
  //console.log("HISTORICO PROCESS - ", historicoProcess);
  return(
    <>
      {(!openPopup && data.length > 0) ? 
      <div className="App">
        <Grid container padding= "2rem" alignItems = "center">
          <Grid item xs = {12} sm = {12} align = "left" >
            < Typography variant="h4" mb={2} color = "primary.contrastText">
                Mapa de entregas para Simulación 7 días
            </Typography>
          </Grid>
          <Grid item xs = {12} sm = {12} align = "center" sx = {{backgroundColor: '#282c34'}}>
              {/* MAPA DE LA SIMULACION */}
              <MapaSimulacion datos = {data} fechaActual={fechaActual} setOpenResume ={setOpenResume} setHistorico ={setHistorico} setProcessPedidos={setProcessPedidos} setFechaFin={setFechaFin}/>
          </Grid>
          <Grid item xs = {12} sm = {12} align = "left" >
            {/* RESUMEN Y DETALLES */}
            <Grid container >
              <Grid item xs = {4} sm = {4} align = "left" marginTop = "1rem" >
                <Grid container >
                  <Grid item xs = {12} sm = {12} align = "left" >
                    {/* <Legend/> */}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs = {0.5} sm = {0.5} align = "left" ></Grid>
              <Grid item xs = {7.5} sm = {7.5} align = "left" marginTop = "1rem">
                <Grid container >
                  <Grid item xs = {12} sm = {12} align = "left" >
                    {/* <Resume data = {historicoProcess}/> */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
          title="Inicio de la Simulación a 7 Dias"
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


export default SevenDays;