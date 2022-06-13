import React, {useState, useEffect} from "react";
import Prueba from './Prueba';
import Popup from '../../components/utils/Popup';
import ModalSimulation from './ModalSimulation'

import './App.css';
const Seve_Days = () => {
  const [openPopup, setOpenPopup] = useState(true);
  //Data --> Pedidos pre-cargados || puede incluir en este la traída de ciudades, tramos y camiones.
  const [data, setData] = useState([]);
  //Return algoritmo -> rutas y pedidos faltantes.

  return(
    <>
      {!openPopup ?       
      <div className="App">
        <header className="App-header">
          <Prueba data = {data}/>
        </header>
      </div>
      :
      <div className="App">
      </div>
      }
      <div>
        <Popup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          title="Inicio de la Simulación a 7 Dias"
          >
          <ModalSimulation setOpenPopup = {setOpenPopup} setData = {setData}/>
        </Popup>
      </div>
    </>
  )
}


export default Seve_Days;