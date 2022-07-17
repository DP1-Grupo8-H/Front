import React, {useState, useEffect} from "react";
import MapaSimulacion from './Prueba';
import Popup from '../../components/utils/Popup';
import ModalSimulation from './Modals/ModalSimulation';
import ModalResume from './Modals/ModalResume';

import './App.css';
import Legend from "../../components/Legend/Legend";
import { Box, Grid, Typography, Button, CircularProgress} from "@mui/material";

import BallotIcon from '@mui/icons-material/Ballot';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ModalCamion from "./Modals/ModalCamion";

import camionService from '../../services/camionService';

const Colapse = () => {
  const [openPopup, setOpenPopup] = useState(true);
  const [openReusme, setOpenResume] = useState(false);
  //Data --> Pedidos pre-cargados || puede incluir en este la traída de ciudades, tramos y camiones.
  const [data, setData] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [histCamiones, setHistCamiones] = useState([])
  //const [processPedidos, setProcessPedidos] = useState([]);
  useEffect(() => {
    const auxhistCamiones = [];
    camionService.getCamiones()
    .then(camiones => {
      for(let camion of camiones){
        auxhistCamiones.push(
        {
          'camion': {...camion, estado:1 },
          'plan_transporte': [],
        });  //AGREGAMOS LOS QUE NO ESTÁN
      }
    })
    setHistCamiones(auxhistCamiones);
  }, [])
  console.log(histCamiones);
  
  //const [processPedidos, setProcessPedidos] = useState([]);

  const[fechaActual,setFechaActual] = useState([]);
  const[fechaFin, setFechaFin] = useState([]);
  const[minutosFin, setMinutosFin] = useState([]);
  const [segundosFin, setSegundosFin] = useState([]); 

  const [openCamion,setOpenCamion] = useState(false);
  const [pedCamion,setPedCamion] = useState(null);
  //Return algoritmo -> rutas y pedidos faltantes.
  
  //const [historicoProcess, setHistoricoProcess] = useState({cant: '', cur: '', paq: '', paqcur: ''});
  // useEffect(()=>{
  //   const auxHist = retrievePaq(historico, processPedidos);
  //   setHistoricoProcess(auxHist);
  // }, [historico]);
  //console.log("HISTORICO PROCESS - ", historicoProcess);
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


  const handleClickCamion = (camion) => {
    if(camion.camion.estado === 0){
      setPedCamion(camion);
      setOpenCamion(true);
    }
  }

  const classedMapaSimulacion = React.useMemo(() => {
    console.log("UNNNN");
    return(
      <MapaSimulacion datos = {data} fechaActual={fechaActual} setOpenResume ={setOpenResume} setHistorico ={setHistorico} setFechaFin={setFechaFin} setMinutosFin={setMinutosFin} setSegundosFin = {setSegundosFin} histCamiones = {histCamiones} setHistCamiones = {setHistCamiones}/>
    );
  },[data, fechaActual])

  console.log(openPopup, data.length);
  return(
    <>
      {(!openPopup && data.length > 0 && !openReusme) ? 
      <div className="App">
        <Grid container padding= "2rem 0rem 2rem 2rem" alignItems = "center">
          <Grid item xs = {12} sm = {12} align = "left" >
            < Typography variant="h4" mb={2} color = "primary.contrastText">
                Mapa de entregas para Simulación hasta el Colapso Logístico
            </Typography>
          </Grid>
          <Grid item xs = {8} sm = {8} align = "left" margin = "0rem -4rem 0rem 0rem" >
              {/* MAPA DE LA SIMULACION */}
              {classedMapaSimulacion}
          </Grid>
          <Grid item xs = {4} sm = {4} align = "left" >
            {/* RESUMEN Y DETALLES */}
            <Grid container alignItems = "center">
              <Grid item xs = {12} sm = {12} align = "left" >
                <Legend/>
              </Grid>
              {/* <Grid item xs = {8} sm = {8} align = "left" >
                <ResumeMapa data = {data}/>
              </Grid> */}
              <Grid item xs = {12} sm = {12} align = "center" >
                < Typography variant="h5" mb={2} color = "primary.main">
                    Lista de Camiones
                </Typography>
              </Grid>
              <Grid item xs = {12} sm = {12} align = "left" >
                <Box sx={{ width: '100%' }}>
                  <Grid item xs = {12} sm = {12} align = "left" >
                    <Box sx={{  bgcolor: 'secondary_white.main',
                            m: 1,
                            margin: '0rem 0rem 1rem 0rem',
                            backgroundColor: 'neutral',
                            border: 1.5,
                            width: 'auto',
                            overflowY: "scroll",
                            scrollbarColor: "#FFF6E7 #FFFFFF",
                            height: '36rem',borderColor: '#AFAFAF', borderRadius: '6px ' }}>
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
                </Box>
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
          noClose={true}
          title="Inicio de la Simulación al Colapso"
          >
          <ModalSimulation setOpenPopup = {setOpenPopup} setData = {setData} setFechaActual={setFechaActual} setMinutosFin={setMinutosFin} setSegundosFin = {setSegundosFin}/>
        </Popup>
        <Popup
          openPopup={openReusme}
          setOpenPopup={setOpenResume}
          noClose={true}
          title="Finalización de la Simulación"
          >
          <ModalResume setOpenResume = {setOpenResume} historico = {historico} fechaActual={fechaActual} fechaFin = {fechaFin} minutosFin={minutosFin} segundosFin={segundosFin}/>
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
  )

  //Return algoritmo -> rutas y pedidos faltantes.
}


export default Colapse;