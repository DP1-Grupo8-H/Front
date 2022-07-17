import axios from 'axios';


const url = 'http://inf226g8.inf.pucp.edu.pe:8000';
//const url = 'http://localhost:8000';

const getCamiones = async () => {
  try{
    const request = await axios.get(`${url}/camion/listar/`);

    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

const getCamion = async (id) => {
  try{
    const request = await axios.get(`${url}/camion/listar/${id}`);

    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

const insertCamion = async (object) => {
  try{
    const request = await axios.post(`${url}/camion/insertar/`, object);

    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

export default { getCamiones, getCamion, insertCamion }