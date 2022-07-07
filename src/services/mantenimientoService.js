import axios from 'axios';


const url = 'http://inf226g8.inf.pucp.edu.pe:8000';
//const url = 'http://inf226g8.inf.pucp.edu.pe:8000';

const getMantenimientos = async () => {
  try{
    const request = await axios.get(`${url}/mantenimiento/listar/`);

    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

const getActualMantenimientos = async (date) => {
  try{
    const request = await axios.get(`${url}/mantenimiento/listarActual/${date}`);

    return request.data;  
  }catch(exception){
    console.error(exception);
  }
}

export default { getMantenimientos, getActualMantenimientos }