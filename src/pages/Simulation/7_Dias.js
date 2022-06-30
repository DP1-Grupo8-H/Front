import React, {useState, useEffect} from "react";
import Prueba from './Prueba';
import Popup from '../../components/utils/Popup';
import ModalSimulation from './ModalSimulation'

import './App.css';
const Seve_Days = () => {
  const [openPopup, setOpenPopup] = useState(true);
  const [data, setData] = useState([]);
<<<<<<< Updated upstream
=======

  const[fechaActual,setFechaActual] = useState([]);
  //Return algoritmo -> rutas y pedidos faltantes.
  console.log(data);
>>>>>>> Stashed changes

  console.log(data);
  return(
    <>
      {!openPopup ?       
      <div className="App">
        <header className="App-header">
<<<<<<< Updated upstream
          <Prueba/>
=======
          {/*<Legend />*/}
          <MapaSimulacion datos = {data} fechaActual={fechaActual}/>

>>>>>>> Stashed changes
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
          <ModalSimulation setOpenPopup = {setOpenPopup} setData = {setData} setFechaActual={setFechaActual}/>
        </Popup>
      </div>
    </>
  )
}


export default Seve_Days;