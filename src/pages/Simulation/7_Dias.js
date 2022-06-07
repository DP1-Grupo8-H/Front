import React, {useState, useEffect} from "react";
import Prueba from './Prueba';
import Popup from '../../components/utils/Popup';
import ModalSimulation from './ModalSimulation'

import './App.css';
const Seve_Days = () => {
  const [openPopup, setOpenPopup] = useState(true);
  const [data, setData] = useState([]);

  console.log(data);
  return(
    <>
      {!openPopup ?       
      <div className="App">
        <header className="App-header">
          <Prueba/>
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