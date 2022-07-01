import React, {useState, useEffect} from "react";
import MapaSimulacion from './Prueba';
import Popup from '../../components/utils/Popup';
import ModalSimulation from './Modals/ModalSimulation';
import ModalResume from './Modals/ModalResume';

import './App.css';
import Legend from "../../components/Legend/Legend";
const SevenDays = () => {
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
      {(!openPopup && data.length >= 0) ? 
      <div className="App">
        <header className="App-header">
          {/*<Legend />*/}
          <MapaSimulacion datos = {data} fechaActual={fechaActual} setOpenResume ={setOpenResume} setHistorico ={setHistorico} setFechaFin={setFechaFin}/>

        </header>
      </div>
      :
      <div></div>
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